from datetime import datetime
from app.models.enums import JoinRequestStatus, MembershipStatus


class DashboardService:
    @staticmethod
    async def get_admin_stats(db):
        return {
            "totalClubs": await db.clubs.count_documents({}),
            "totalUsers": await db.users.count_documents({}),
            "totalEvents": await db.events.count_documents({}),
        }

    @staticmethod
    async def get_responsable_stats(db, user_id: str):
        clubs = [club async for club in db.clubs.find({"createdById": user_id})]
        club_ids = [club["_id"] for club in clubs]

        if not club_ids:
            return {"managedClubs": 0, "totalMembers": 0, "pendingRequests": 0, "upcomingEvents": 0}

        return {
            "managedClubs": len(clubs),
            "totalMembers": await db.memberships.count_documents({
                "clubId": {"$in": club_ids},
                "status": MembershipStatus.ACTIVE.value,
            }),
            "pendingRequests": await db.joinRequests.count_documents({
                "clubId": {"$in": club_ids},
                "status": JoinRequestStatus.PENDING.value,
            }),
            "upcomingEvents": await db.events.count_documents({
                "clubId": {"$in": club_ids},
                "startDate": {"$gte": datetime.utcnow()},
            }),
        }

    @staticmethod
    async def get_student_stats(db, user_id: str):
        return {
            "totalRequests": await db.joinRequests.count_documents({"userId": user_id}),
            "activeMemberships": await db.memberships.count_documents({
                "userId": user_id,
                "status": MembershipStatus.ACTIVE.value,
            }),
            "unreadNotifications": await db.notifications.count_documents({
                "userId": user_id,
                "isRead": False,
            }),
        }
