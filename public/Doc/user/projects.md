# User Project APIs

Read-only endpoints to allow standard users to view available projects.

> **Note**: All endpoints require User Authentication (`Authorization: Token <user_token>`) and strictly use URLs without trailing slashes.

## 1. List All Projects

### List Projects
Returns a list of all projects ordered by creation date descending.

- **Method**: `GET`
- **URL**: `/api/user/projects`

#### Request Body
None

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "name": "Health Tracking App",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    },
    {
        "id": 2,
        "name": "Diet Monitoring System",
        "created_at": "2026-03-02T09:00:00Z",
        "updated_at": "2026-03-02T09:00:00Z"
    }
]
```

---

## 2. Get Project Detail

### View Exact Project
Retrieves details of a specific project by ID.

- **Method**: `GET`
- **URL**: `/api/user/projects/1`

#### Request Body
None

#### Response (200 OK)
```json
{
    "id": 1,
    "name": "Health Tracking App",
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T10:00:00Z"
}
```

---

### Get Project Sites
Returns a list of all sites grouped under this specific project.

- **Method**: `GET`
- **URL**: `/api/user/projects/1/sites`

#### Request Body
None

#### Response (200 OK)
```json
[
    {
        "id": 2,
        "project": 1,
        "name": "Live Patient Portal",
        "link": "https://portal.sbhealth.com",
        "launch_date": "2026-04-01",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    }
]
```
