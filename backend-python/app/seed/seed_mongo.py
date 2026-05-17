import asyncio
from datetime import timedelta

from app.core.database import db
from app.models.enums import ClubRole, GlobalRole, MembershipStatus
from app.services.mongo_user_service import create_user, get_user_by_email
from app.services.mongo_utils import new_id, utcnow


async def ensure_user(email: str, full_name: str, password: str, role: GlobalRole):
    created = await create_user(email, full_name, password, None, role)
    if created:
        print(f"Created {email}")
        return created

    existing = await get_user_by_email(email)
    now = utcnow()
    await db.users.update_one(
        {"_id": existing["id"]},
        {"$set": {"createdAt": existing.get("createdAt", now), "updatedAt": existing.get("updatedAt", now)}},
    )
    print(f"Skipped (exists): {email}")
    return existing


async def ensure_club(club: dict, manager_id: str):
    now = utcnow()
    existing = await db.clubs.find_one({"slug": club["slug"]})
    if existing:
        await db.clubs.update_one(
            {"_id": existing["_id"]},
            {"$set": {**club, "createdById": manager_id, "isActive": True, "updatedAt": now}},
        )
        print(f"Updated club {club['slug']}")
        return existing["_id"]

    club_id = new_id()
    await db.clubs.insert_one({
        "_id": club_id,
        **club,
        "createdById": manager_id,
        "isActive": True,
        "createdAt": now,
        "updatedAt": now,
    })
    print(f"Created club {club['slug']}")
    return club_id


async def ensure_manager_membership(user_id: str, club_id: str):
    existing = await db.memberships.find_one({"userId": user_id, "clubId": club_id})
    if existing:
        return

    now = utcnow()
    await db.memberships.insert_one({
        "_id": new_id(),
        "userId": user_id,
        "clubId": club_id,
        "roleInClub": ClubRole.MANAGER.value,
        "status": MembershipStatus.ACTIVE.value,
        "joinedAt": now,
        "createdAt": now,
        "updatedAt": now,
    })


async def ensure_activity(collection_name: str, unique: dict, data: dict):
    existing = await db[collection_name].find_one(unique)
    if existing:
        await db[collection_name].update_one({"_id": existing["_id"]}, {"$set": {**data, "updatedAt": utcnow()}})
        return

    now = utcnow()
    await db[collection_name].insert_one({
        "_id": new_id(),
        **unique,
        **data,
        "createdAt": now,
        "updatedAt": now,
    })


async def seed():
    admin = await ensure_user("admin@clubhub.tn", "Admin Principal", "Admin123!", GlobalRole.ADMIN)
    manager = await ensure_user("manager@clubhub.tn", "Manager Club", "Manager123!", GlobalRole.CLUB_MANAGER)
    student = await ensure_user("student@clubhub.tn", "Etudiant ISET", "Student123!", GlobalRole.STUDENT)

    clubs = [
        {
            "name": "Club Robotique ISET",
            "slug": "club-robotique-iset",
            "description": "Le club de robotique de l'ISET Rades concoit et programme des robots pour des competitions et ateliers.",
            "category": "Technologie",
            "logo": None,
            "coverImage": None,
        },
        {
            "name": "Club Culturel ISET",
            "slug": "club-culturel-iset",
            "description": "Art, musique, theatre et debats : un espace d'expression artistique pour les etudiants.",
            "category": "Culture",
            "logo": None,
            "coverImage": None,
        },
        {
            "name": "Club Sportif ISET",
            "slug": "club-sportif-iset",
            "description": "Football, basketball, handball et tournois inter-universitaires sur le campus.",
            "category": "Sport",
            "logo": None,
            "coverImage": None,
        },
    ]

    club_ids = []
    for club in clubs:
        club_id = await ensure_club(club, manager["id"])
        club_ids.append(club_id)
        await ensure_manager_membership(manager["id"], club_id)

    robotique_id = club_ids[0]
    await ensure_manager_membership(student["id"], robotique_id)

    now = utcnow()
    await ensure_activity(
        "announcements",
        {"clubId": robotique_id, "title": "Atelier Arduino pour debutants"},
        {
            "content": "Nouvelle session de formation Arduino ouverte aux membres du club.",
            "visibility": "PUBLIC",
            "authorId": manager["id"],
            "publishedAt": now,
        },
    )
    await ensure_activity(
        "events",
        {"clubId": robotique_id, "title": "Competition Nationale de Robotique"},
        {
            "description": "Participation a la competition nationale de robotique.",
            "location": "Cite des Sciences, Tunis",
            "startDate": now + timedelta(days=15),
            "endDate": now + timedelta(days=15, hours=4),
            "isOnline": False,
            "meetingLink": None,
            "createdById": manager["id"],
        },
    )
    await ensure_activity(
        "meetings",
        {"clubId": robotique_id, "title": "Reunion preparation competition"},
        {
            "description": "Discussion sur la strategie et repartition des taches.",
            "provider": "jitsi",
            "meetingUrl": "https://meet.jit.si/clubhub-robotique-demo",
            "startTime": now + timedelta(days=3),
            "endTime": now + timedelta(days=3, hours=1),
            "createdById": manager["id"],
        },
    )

    await db.users.create_index("email", unique=True)
    await db.clubs.create_index("slug", unique=True)
    await db.joinRequests.create_index([("userId", 1), ("clubId", 1), ("status", 1)])
    await db.memberships.create_index([("userId", 1), ("clubId", 1)])

    print("Mongo seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
