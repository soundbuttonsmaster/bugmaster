# Admin – Checklist APIs

Base URL: `/api/admin`  
Authentication: `Authorization: Token <admin_token>`

---

## Endpoints Overview

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/sites/<id>/checklist` | List all checklist items for a site |
| POST | `/admin/sites/<id>/checklist` | Add a checklist item to a site |
| POST | `/admin/sites/<id>/checklist/import` | Bulk import checklist items from a CSV file |
| GET | `/admin/checklist/<id>` | Get a single checklist item |
| POST | `/admin/checklist/<id>` | Update a checklist item |
| DELETE | `/admin/checklist/<id>` | Delete a checklist item |

---

## List Checklist Items for a Site

- **Method**: `GET`
- **URL**: `/api/admin/sites/1/checklist`

### Request Body
None

### Response (200 OK)
```json
[
    {
        "id": 1,
        "site": 1,
        "question": "Is the site live and accessible?",
        "is_active": true,
        "last_responded_by": "Hemang Patel",
        "last_responded_at": "2026-03-02T10:55:00Z",
        "created_at": "2026-03-01T08:00:00Z",
        "updated_at": "2026-03-01T08:00:00Z"
    },
    {
        "id": 2,
        "site": 1,
        "question": "Is SSL certificate valid?",
        "is_active": true,
        "last_responded_by": null,
        "last_responded_at": null,
        "created_at": "2026-03-01T08:05:00Z",
        "updated_at": "2026-03-01T08:05:00Z"
    }
]
```

> `last_responded_by` and `last_responded_at` are `null` if no user has responded yet.

---

## Add Checklist Item to a Site

- **Method**: `POST`
- **URL**: `/api/admin/sites/1/checklist`

### Request Body
```json
{
    "question": "Are there any broken links?"
}
```

### Response (201 Created)
```json
{
    "id": 3,
    "site": 1,
    "question": "Are there any broken links?",
    "is_active": true,
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

### Request Body
None

### Response (200 OK)
```json
{
    "id": 1,
    "site": 1,
    "question": "Is the site live and accessible?",
    "is_active": true,
    "last_responded_by": "Hemang Patel",
    "last_responded_at": "2026-03-02T10:55:00Z",
    "created_at": "2026-03-01T08:00:00Z",
    "updated_at": "2026-03-01T08:00:00Z"
}
```

---

## Update a Checklist Item

Update the question text or toggle active/inactive status.

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
```json
{
    "id": 1,
    "site": 1,
    "question": "Is the site accessible on mobile?",
    "is_active": false,
    "last_responded_by": "Hemang Patel",
    "last_responded_at": "2026-03-02T10:55:00Z",
    "created_at": "2026-03-01T08:00:00Z",
    "updated_at": "2026-03-02T11:00:00Z"
}
```

---

## Delete a Checklist Item

- **Method**: `DELETE`
- **URL**: `/api/admin/checklist/1`

### Request Body
None

### Response (204 No Content)
```json
{
    "message": "Checklist item deleted."
}
```

---

## Bulk Import Checklist Items from CSV

Upload a `.csv` file to create multiple checklist items at once for a specific site.

- **Method**: `POST`
- **URL**: `/api/admin/sites/1/checklist/import`
- **Content-Type**: `multipart/form-data`

### Request

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `.csv` file | ✅ Yes | A CSV file containing checklist questions |

#### CSV Format

Two formats are supported:

**Option 1 – With header row** (column must be named `question`):
```
question
Is the site live and accessible?
Is the SSL certificate valid?
Are there any broken links?
```

**Option 2 – No header row** (first column is treated as the question):
```
Is the site live and accessible?
Is the SSL certificate valid?
Are there any broken links?
```

> If the header is present but the column is not named `question`, the first column will be used as the question field.

### Example Request (curl)

```bash
curl -X POST http://localhost:8000/api/admin/sites/1/checklist/import \
  -H "Authorization: Token <admin_token>" \
  -F "file=@checklist.csv"
```

### Response (201 Created)
```json
{
    "message": "Successfully imported 3 checklist items.",
    "imported_count": 3
}
```

### Error Responses

| Status | Reason | Response |
|--------|--------|----------|
| 400 | No file uploaded | `{"detail": "No file uploaded. Please provide a 'file' parameter."}` |
| 400 | Wrong file type | `{"detail": "File must be a CSV."}` |
| 400 | Cannot parse CSV | `{"detail": "Error parsing CSV: <reason>"}` |
| 400 | Cannot find question column from headers | `{"detail": "Could not determine question column from CSV headers."}` |
| 404 | Site not found | `{"detail": "Site not found."}` |

> **Note:** Empty rows and whitespace-only values are automatically skipped during import.
