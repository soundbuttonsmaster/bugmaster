# User – Bug Report APIs

Base URL: `/api/user`  
Authentication: `Authorization: Token <user_token>`

---

## Endpoints Overview

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/user/sites/<id>/report-bug` | Submit a bug report for a site |
| GET | `/user/my-bug-reports` | List all my submitted bug reports |
| GET | `/user/my-bug-reports/<id>` | View a specific bug report I submitted |

---

## Submit a Bug Report

Submit a bug report for a specific site. An email notification is automatically sent to the admin with all details and any attached file.

- **Method**: `POST`
- **URL**: `/api/user/sites/1/report-bug`
- **Content-Type**: `multipart/form-data` (required when attaching a file)

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Short bug title |
| `description` | string | ✅ | Detailed description |
| `link` | string (URL) | ❌ | Page URL where bug occurs |
| `attachment` | file | ❌ | Screenshot or any file |

### Example (form-data)
```
title        = Login button not working on Safari
description  = Tapping the login button on iPhone 14 (Safari) does nothing. Reproduced 3 times.
link         = https://portal.sbhealth.com/login
attachment   = screenshot.png
```

### Response (201 Created)
```json
{
    "message": "Bug report submitted successfully.",
    "report": {
        "id": 1,
        "site": 1,
        "site_name": "Patient Portal",
        "reporter_email": "john@example.com",
        "reporter_name": "John Doe",
        "title": "Login button not working on Safari",
        "description": "Tapping the login button on iPhone 14 (Safari) does nothing. Reproduced 3 times.",
        "link": "https://portal.sbhealth.com/login",
        "attachment": "/media/bug_reports/screenshot.png",
        "status": "pending",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    }
}
```

---

## List My Bug Reports

Returns all bug reports submitted by the currently logged-in user.  
Optional filter: `?site=<id>` to see reports for a specific site only.

- **Method**: `GET`
- **URL**: `/api/user/my-bug-reports`
- **Optional filter**: `/api/user/my-bug-reports?site=1`

### Request Body
None

### Response (200 OK)
```json
[
    {
        "id": 1,
        "site": 1,
        "site_name": "Patient Portal",
        "reporter_email": "john@example.com",
        "reporter_name": "John Doe",
        "title": "Login button not working on Safari",
        "description": "Tapping the login button on Safari does nothing.",
        "link": "https://portal.sbhealth.com/login",
        "attachment": "/media/bug_reports/screenshot.png",
        "status": "processing",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T11:30:00Z"
    }
]
```

---

## View a Single Bug Report

View a specific bug report. Only returns your own reports — cannot view other users' reports.

- **Method**: `GET`
- **URL**: `/api/user/my-bug-reports/1`

### Request Body
None

### Response (200 OK)
```json
{
    "id": 1,
    "site": 1,
    "site_name": "Patient Portal",
    "reporter_email": "john@example.com",
    "reporter_name": "John Doe",
    "title": "Login button not working on Safari",
    "description": "Tapping the login button on Safari does nothing.",
    "link": "https://portal.sbhealth.com/login",
    "attachment": "/media/bug_reports/screenshot.png",
    "status": "resolved",
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T14:00:00Z"
}
```

### Error Response (404 Not Found)
```json
{
    "detail": "Bug report not found."
}
```
