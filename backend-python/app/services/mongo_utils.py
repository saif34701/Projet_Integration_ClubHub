from datetime import datetime
from enum import Enum
from math import ceil
from typing import Any
import uuid


def utcnow() -> datetime:
    return datetime.utcnow()


def new_id() -> str:
    return str(uuid.uuid4())


def enum_value(value: Any) -> Any:
    if isinstance(value, Enum):
        return value.value
    return value


def to_mongo_data(data: Any, *, exclude_unset: bool = False) -> dict:
    if hasattr(data, "model_dump"):
        raw = data.model_dump(exclude_unset=exclude_unset)
    elif isinstance(data, dict):
        raw = data
    else:
        raw = dict(data)

    return {key: enum_value(value) for key, value in raw.items()}


def public_doc(doc: dict | None) -> dict | None:
    if not doc:
        return None

    converted = dict(doc)
    converted["id"] = str(converted.get("_id") or converted.get("id"))
    converted.pop("_id", None)

    now = utcnow()
    converted.setdefault("createdAt", now)
    converted.setdefault("updatedAt", converted["createdAt"])
    return converted


def make_doc(data: dict, **extra: Any) -> dict:
    now = utcnow()
    doc = {
        "_id": new_id(),
        **data,
        **extra,
        "createdAt": now,
        "updatedAt": now,
    }
    return doc


def pagination_meta(page: int, limit: int, total: int) -> dict:
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": ceil(total / limit) if limit > 0 else 1,
    }
