from app.models.enums import JoinRequestStatus, MembershipStatus, ClubRole
from app.schemas.membership import JoinRequestCreate
from app.core.exceptions import AppException
from app.services.mongo_utils import make_doc, public_doc, to_mongo_data, utcnow
from app.services.notification_service import NotificationService


class MembershipService:
    @staticmethod
    async def request_join(db, data: JoinRequestCreate, user_id: str):
        club = await db.clubs.find_one({"_id": data.clubId, "isActive": True})
        if not club:
            raise AppException(status_code=404, message="Club not found")

        existing_membership = await db.memberships.find_one({
            "userId": user_id,
            "clubId": data.clubId,
            "status": MembershipStatus.ACTIVE.value,
        })
        if existing_membership:
            raise AppException(status_code=400, message="You are already a member of this club")

        existing_request = await db.joinRequests.find_one({
            "userId": user_id,
            "clubId": data.clubId,
            "status": JoinRequestStatus.PENDING.value,
        })
        if existing_request:
            raise AppException(status_code=400, message="You already have a pending request for this club")

        request = make_doc(
            to_mongo_data(data),
            userId=user_id,
            status=JoinRequestStatus.PENDING.value,
            reviewedById=None,
            reviewedAt=None,
        )
        await db.joinRequests.insert_one(request)
        return public_doc(request)

    @staticmethod
    async def get_my_requests(db, user_id: str):
        cursor = db.joinRequests.find({"userId": user_id}).sort("createdAt", -1)
        requests = [public_doc(request) async for request in cursor]
        club_ids = list({request["clubId"] for request in requests})
        clubs = {
            club["_id"]: club
            async for club in db.clubs.find({"_id": {"$in": club_ids}})
        }
        for request in requests:
            request["clubName"] = clubs.get(request["clubId"], {}).get("name")
        return requests

    @staticmethod
    async def get_pending_requests(db, club_id: str):
        cursor = db.joinRequests.find({
            "clubId": club_id,
            "status": JoinRequestStatus.PENDING.value,
        }).sort("createdAt", -1)
        requests = [public_doc(request) async for request in cursor]
        user_ids = list({request["userId"] for request in requests})
        users = {
            user["_id"]: user
            async for user in db.users.find({"_id": {"$in": user_ids}})
        }
        club = await db.clubs.find_one({"_id": club_id})
        for request in requests:
            user = users.get(request["userId"], {})
            request["studentName"] = user.get("fullName")
            request["studentEmail"] = user.get("email")
            request["clubName"] = club.get("name") if club else None
        return requests

    @staticmethod
    async def process_request(db, request_id: str, action: str, reviewer_id: str):
        request = await db.joinRequests.find_one({"_id": request_id})
        if not request:
            raise AppException(status_code=404, message="Join request not found")

        if request.get("status") != JoinRequestStatus.PENDING.value:
            raise AppException(status_code=400, message="Request is already processed")

        reviewed_at = utcnow()
        new_status = JoinRequestStatus.APPROVED.value if action == "accept" else JoinRequestStatus.REJECTED.value
        if action not in {"accept", "reject"}:
            raise AppException(status_code=400, message="Invalid action")

        await db.joinRequests.update_one(
            {"_id": request_id},
            {"$set": {
                "status": new_status,
                "reviewedById": reviewer_id,
                "reviewedAt": reviewed_at,
                "updatedAt": reviewed_at,
            }},
        )

        if action == "accept":
            existing_membership = await db.memberships.find_one({
                "userId": request["userId"],
                "clubId": request["clubId"],
                "status": MembershipStatus.ACTIVE.value,
            })
            if not existing_membership:
                membership = make_doc(
                    {
                        "userId": request["userId"],
                        "clubId": request["clubId"],
                        "roleInClub": ClubRole.MEMBER.value,
                        "status": MembershipStatus.ACTIVE.value,
                        "joinedAt": reviewed_at,
                    }
                )
                await db.memberships.insert_one(membership)

            await NotificationService.create(
                db,
                user_id=request["userId"],
                title="Demande d'adhesion acceptee",
                message="Votre demande d'adhesion a ete acceptee. Bienvenue !",
                type="SUCCESS",
            )
        else:
            await NotificationService.create(
                db,
                user_id=request["userId"],
                title="Demande d'adhesion refusee",
                message="Votre demande d'adhesion n'a malheureusement pas ete retenue.",
                type="INFO",
            )

        updated = await db.joinRequests.find_one({"_id": request_id})
        return public_doc(updated)

    @staticmethod
    async def get_club_members(db, club_id: str):
        cursor = db.memberships.find({
            "clubId": club_id,
            "status": MembershipStatus.ACTIVE.value,
        }).sort("joinedAt", -1)
        memberships = [public_doc(membership) async for membership in cursor]
        user_ids = list({membership["userId"] for membership in memberships})
        users = {
            user["_id"]: user
            async for user in db.users.find({"_id": {"$in": user_ids}})
        }
        for membership in memberships:
            user = users.get(membership["userId"], {})
            membership["userName"] = user.get("fullName")
            membership["userEmail"] = user.get("email")
        return memberships

    @staticmethod
    async def remove_member(db, membership_id: str):
        result = await db.memberships.delete_one({"_id": membership_id})
        if result.deleted_count == 0:
            raise AppException(status_code=404, message="Membership not found")
        return True
