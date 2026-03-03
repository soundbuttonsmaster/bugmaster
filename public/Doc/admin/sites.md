# Admin Site Management APIs

Endpoints to manage application sites, which are bound to specific projects.

> **Note**: All endpoints require Admin Authentication (`Authorization: Token <admin_token>`) and strictly use URLs without trailing slashes.

## 1. List / Create Sites

### List Sites
Returns a full dump of all sites ordered by creation date descending.

- **Method**: `GET`
- **URL**: `/api/admin/sites`

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

### Create Site
Creates a new site linked to an existing project.

- **Method**: `POST`
- **URL**: `/api/admin/sites`

#### Request Body
```json
{
    "project": 1,
    "name": "Internal Testing Site",
    "link": "https://test.sbhealth.com",
    "launch_date": "2026-03-15"
}
```

#### Response (201 Created)
```json
{
    "id": 2,
    "project": 1,
    "name": "Internal Testing Site",
    "link": "https://test.sbhealth.com",
    "launch_date": "2026-03-15",
    "created_at": "2026-03-02T10:30:00Z",
    "updated_at": "2026-03-02T10:30:00Z"
}
```

---

## 2. Get / Update / Delete Site Detail

### Get Site Details
- **Method**: `GET`
- **URL**: `/api/admin/sites/2`

#### Response (200 OK)
```json
{
    "id": 2,
    "project": 1,
    "name": "Internal Testing Site",
    "link": "https://test.sbhealth.com",
    "launch_date": "2026-03-15",
    "created_at": "2026-03-02T10:30:00Z",
    "updated_at": "2026-03-02T10:30:00Z"
}
```

---

### Update Site via POST
Updates an existing site's details via POST endpoint. 

- **Method**: `POST`
- **URL**: `/api/admin/sites/2`

#### Request Body
```json
{
    "name": "Staging Site",
    "link": "https://staging.sbhealth.com"
}
```

#### Response (200 OK)
```json
{
    "id": 2,
    "project": 1,
    "name": "Staging Site",
    "link": "https://staging.sbhealth.com",
    "launch_date": "2026-03-15",
    "created_at": "2026-03-02T10:30:00Z",
    "updated_at": "2026-03-02T11:00:00Z"
}
```

---

### Delete Site
Permanently deletes a site.

- **Method**: `DELETE`
- **URL**: `/api/admin/sites/2`

#### Request Body
None

#### Response (204 No Content)
Empty response body.
