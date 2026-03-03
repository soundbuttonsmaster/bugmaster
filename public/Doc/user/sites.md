# User Site APIs

Read-only endpoints to allow standard users to view available sites. Sites are also nested within the Project endpoints.

> **Note**: All endpoints require User Authentication (`Authorization: Token <user_token>`) and strictly use URLs without trailing slashes.

## 1. List All Sites

### List Sites
Returns a list of all sites in the platform ordered by creation date descending.

- **Method**: `GET`
- **URL**: `/api/user/sites`

#### Request Body
None

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "project": 1,
        "name": "Live Patient Portal",
        "link": "https://portal.sbhealth.com",
        "launch_date": "2026-04-01",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    }
]
```

---

## 2. Get Site Detail

### View Exact Site
Retrieves details of a specific site by ID.

- **Method**: `GET`
- **URL**: `/api/user/sites/1`

#### Request Body
None

#### Response (200 OK)
```json
{
    "id": 1,
    "project": 1,
    "name": "Live Patient Portal",
    "link": "https://portal.sbhealth.com",
    "launch_date": "2026-04-01",
    "created_at": "2026-03-02T10:00:00Z",
    "updated_at": "2026-03-02T10:00:00Z"
}
```
