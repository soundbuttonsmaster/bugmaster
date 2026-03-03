# Admin – Checklist APIs

Base URL: `/api/admin`
Authentication: `Authorization: Token <admin_token>`

---

## Endpoints Overview

### Site Checklist Items

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/sites/<id>/checklist` | List all checklist items for a site |
| POST | `/admin/sites/<id>/checklist` | Add a checklist item to a site |
| GET | `/admin/checklist/<id>` | Get a single checklist item |
| POST | `/admin/checklist/<id>` | Update a checklist item |
| DELETE | `/admin/checklist/<id>` | Delete a checklist item |

### Checklist Templates (Global Question Bank)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/checklist-templates` | List all template questions |
| POST | `/admin/checklist-templates` | Create a template question |
| POST | `/admin/checklist-templates/bulk-import` | Push all active templates to **every** site |
| POST | `/admin/checklist-templates/<id>` | Update a template question |
| DELETE | `/admin/checklist-templates/<id>` | Delete a template question |

---

## List Checklist Items for a Site

- **Method**: `GET`
- **URL**: `/api/admin/sites/1/checklist`

### Response (200 OK)
```json
[
    {
        "id": 1,
        "site": 1,
        "question": "Is the site live and accessible?",
        "is_active": true,
        "last_response": "Yes",
        "last_responded_by": "Hemang Patel",
        "last_responded_at": "2026-03-02T10:55:00Z",
        "created_at": "2026-03-01T08:00:00Z",
        "updated_at": "2026-03-01T08:00:00Z"
    }
]
```

> `last_response` is `"Yes"`, `"No"`, or `null` (not yet answered). `last_responded_by` and `last_responded_at` are also `null` if no user has responded.

---

## Add Checklist Item to a Site

- **Method**: `POST`
- **URL**: `/api/admin/sites/1/checklist`

### Request Body
```json
{ "question": "Are there any broken links?" }
```

### Response (201 Created)
```json
{
    "id": 3,
    "site": 1,
    "question": "Are there any broken links?",
    "is_active": true,
    "last_response": null,
    "last_responded_by": null,
    "last_responded_at": null,
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T10:00:00Z"
}
```

---

## Get a Single Checklist Item

- **Method**: `GET`
- **URL**: `/api/admin/checklist/1`

### Response (200 OK)
```json
{
    "id": 1,
    "site": 1,
    "question": "Is the site live and accessible?",
    "is_active": true,
    "last_response": "Yes",
    "last_responded_by": "Hemang Patel",
    "last_responded_at": "2026-03-02T10:55:00Z",
    "created_at": "2026-03-01T08:00:00Z",
    "updated_at": "2026-03-01T08:00:00Z"
}
```

---

## Update a Checklist Item

- **Method**: `POST`
- **URL**: `/api/admin/checklist/1`

### Request Body (all fields optional)
```json
{
    "question": "Is the site accessible on mobile?",
    "is_active": false
}
```

### Response (200 OK)
Returns the updated checklist item object.

---

## Delete a Checklist Item

- **Method**: `DELETE`
- **URL**: `/api/admin/checklist/1`

### Response (200 OK)
```json
{ "message": "Checklist item deleted." }
```

---

## Checklist Templates (Global Question Bank)

> Templates are a **master list of reusable questions**. Once created, push all active templates to every site at once with the **bulk-import** action. Duplicate questions (case-insensitive) are automatically skipped.

---

### List All Templates

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

### Create a Template Question

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

### Update a Template Question

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
Returns the updated template object.

---

### Delete a Template Question

- **Method**: `DELETE`
- **URL**: `/api/admin/checklist-templates/3`

### Response (200 OK)
```json
{ "message": "Template deleted." }
```

---

### Bulk Import — Push All Templates to Every Site

- **Method**: `POST`
- **URL**: `/api/admin/checklist-templates/bulk-import`
- **Request Body**: None (no body required)

Copies every **active** template question into every site's checklist.
Questions already present on a site (case-insensitive) are **skipped**.

### Response (200 OK)
```json
{
    "message": "Bulk import complete.",
    "sites_count": 5,
    "created_count": 40,
    "skipped_count": 10
}
```

### Error Responses

| Status | Reason | Response |
|--------|--------|----------|
| 400 | No active templates | `{"detail": "No active checklist templates found."}` |
| 400 | No sites exist | `{"detail": "No sites exist yet. Create a site first."}` |
