# Admin – Bug Report APIs

Base URL: `/api/admin`  
Authentication: `Authorization: Token <admin_token>`

---

## Endpoints Overview

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/admin/bug-reports` | List all bug reports (filter by `?site=<id>`) |
| GET | `/admin/bug-reports/<id>` | Get a single bug report |
| POST | `/admin/bug-reports/<id>/status` | Update bug report status |

---

## List All Bug Reports

- **Method**: `GET`
- **URL**: `/api/admin/bug-reports`
- **Optional Filter**: `/api/admin/bug-reports?site=2`

### Request Body
None

### Response (200 OK)
```json
[
    {
        "id": 1,
        "site": 2,
        "site_name": "Patient Portal",
        "reporter_email": "john@example.com",
        "reporter_name": "John Doe",
        "title": "Login button not working on Safari",
        "description": "The login button does not respond on iPhone Safari iOS 17.",
        "link": "https://portal.sbhealth.com/login",
        "attachment": "/media/bug_reports/screenshot.png",
        "status": "pending",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    }
]
```

**Status values:** `pending` | `processing` | `resolved`

---

## Get a Single Bug Report

- **Method**: `GET`
- **URL**: `/api/admin/bug-reports/1`

### Request Body
None

### Response (200 OK)
```json
{
    "id": 1,
    "site": 2,
    "site_name": "Patient Portal",
    "reporter_email": "john@example.com",
    "reporter_name": "John Doe",
    "title": "Login button not working on Safari",
    "description": "The login button does not respond on iPhone Safari iOS 17.",
    "link": "https://portal.sbhealth.com/login",
    "attachment": "/media/bug_reports/screenshot.png",
    "status": "pending",
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T10:00:00Z"
}
```

---

## Update Bug Report Status

Change the status of a bug report to track progress.

- **Method**: `POST`
- **URL**: `/api/admin/bug-reports/1/status`

### Request Body
```json
{
    "status": "processing"
}
```

Valid values: `pending`, `processing`, `resolved`

### Response (200 OK)
```json
{
    "id": 1,
    "site": 2,
    "site_name": "Patient Portal",
    "reporter_email": "john@example.com",
    "reporter_name": "John Doe",
    "title": "Login button not working on Safari",
    "description": "The login button does not respond on iPhone Safari iOS 17.",
    "link": "https://portal.sbhealth.com/login",
    "attachment": "/media/bug_reports/screenshot.png",
    "status": "processing",
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T11:30:00Z"
}
```

### Error Response (400 Bad Request)
```json
{
    "status": ["\"invalid_value\" is not a valid choice."]
}
```
