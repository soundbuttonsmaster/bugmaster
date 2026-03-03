# Admin – Checklist Templates API

Base URL: `/api/admin`
Authentication: `Authorization: Token <admin_token>`

> **Purpose:** Checklist Templates are a global question bank. Admins manage template questions here, then use **bulk-import** to push all active questions into every site's checklist at once.

---

## Endpoints Overview

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/checklist-templates` | List all template questions |
| POST | `/admin/checklist-templates` | Create a template question |
| POST | `/admin/checklist-templates/bulk-import` | Push all active templates → every site |
| POST | `/admin/checklist-templates/<id>` | Update a template question |
| DELETE | `/admin/checklist-templates/<id>` | Delete a template question |

---

## List All Templates

- **Method**: `GET`
- **URL**: `/api/admin/checklist-templates`

### Response (200 OK)
```json
[
    {
        "id": 1,
        "question": "Is the site live and accessible?",
        "is_active": true,
        "order": 0,
        "created_at": "2026-03-01T08:00:00Z",
        "updated_at": "2026-03-01T08:00:00Z"
    },
    {
        "id": 2,
        "question": "Is the SSL certificate valid?",
        "is_active": true,
        "order": 1,
        "created_at": "2026-03-01T08:05:00Z",
        "updated_at": "2026-03-01T08:05:00Z"
    }
]
```

---

## Create a Template Question

- **Method**: `POST`
- **URL**: `/api/admin/checklist-templates`

### Request Body
```json
{
    "question": "Are there any broken links?",
    "is_active": true,
    "order": 2
}
```

> `is_active` (default: `true`) and `order` (default: `0`) are optional.

### Response (201 Created)
```json
{
    "id": 3,
    "question": "Are there any broken links?",
    "is_active": true,
    "order": 2,
    "created_at": "2026-03-03T10:00:00Z",
    "updated_at": "2026-03-03T10:00:00Z"
}
```

---

## Update a Template Question

- **Method**: `POST`
- **URL**: `/api/admin/checklist-templates/3`

### Request Body (all fields optional)
```json
{
    "question": "Are all external links working?",
    "is_active": false,
    "order": 5
}
```

### Response (200 OK)
Returns the full updated template object.

---

## Delete a Template Question

- **Method**: `DELETE`
- **URL**: `/api/admin/checklist-templates/3`

### Response (200 OK)
```json
{
    "message": "Template deleted."
}
```

---

## Bulk Import — Push All Templates to Every Site

- **Method**: `POST`
- **URL**: `/api/admin/checklist-templates/bulk-import`
- **Request Body**: None

Copies every **active** template question into every site's checklist.
Duplicate questions (case-insensitive match) are **automatically skipped**.

### Example Request (curl)
```bash
curl -X POST http://localhost:8000/api/admin/checklist-templates/bulk-import \
  -H "Authorization: Token <admin_token>"
```

### Response (200 OK)
```json
{
    "message": "Bulk import complete.",
    "sites_count": 5,
    "created_count": 40,
    "skipped_count": 10
}
```

| Field | Description |
|-------|-------------|
| `sites_count` | Total number of sites processed |
| `created_count` | New checklist items added across all sites |
| `skipped_count` | Items skipped (already existed on that site) |

### Error Responses

| Status | Reason | Response |
|--------|--------|----------|
| 400 | No active templates | `{"detail": "No active checklist templates found."}` |
| 400 | No sites exist | `{"detail": "No sites exist yet. Create a site first."}` |
