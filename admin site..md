# User Site APIs

Read-only endpoints to allow standard users to view available sites, including their personal checklist completion percentage.

> **Note**: All endpoints require User Authentication (`Authorization: Token <user_token>`) and strictly use URLs without trailing slashes.

## Response Fields

All site GET responses now include a computed field:

| Field | Type | Description |
|-------|------|-------------|
| `checklist_completion` | `float \| null` | **Your personal** completion % — ratio of active items you answered Yes to. `null` if site has no checklist items |

> **Formula** (user): `(your YES answers) ÷ (total active checklist items) × 100`
>
> Example: 9 Yes out of 10 items → `90.0`

---

## 1. List All Sites

- **Method**: `GET`
- **URL**: `/api/user/sites`

### Response (200 OK)
```json
[
    {
        "id": 1,
        "project": 1,
        "name": "Live Patient Portal",
        "link": "https://portal.sbhealth.com",
        "launch_date": "2026-04-01",
        "checklist_completion": 90.0,
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    },
    {
        "id": 2,
        "project": 1,
        "name": "Staging Site",
        "link": "https://staging.sbhealth.com",
        "launch_date": "2026-04-15",
        "checklist_completion": null,
        "created_at": "2026-03-02T10:30:00Z",
        "updated_at": "2026-03-02T10:30:00Z"
    }
]
```

> `checklist_completion` is `null` when a site has no active checklist items yet.

---

## 2. Get Site Detail

- **Method**: `GET`
- **URL**: `/api/user/sites/1`

### Response (200 OK)
```json
{
    "id": 1,
    "project": 1,
    "name": "Live Patient Portal",
    "link": "https://portal.sbhealth.com",
    "launch_date": "2026-04-01",
    "checklist_completion": 90.0,
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T10:00:00Z"
}
```
