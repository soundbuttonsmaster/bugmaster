# Admin Project Management APIs

Endpoints to manage application projects. 

> **Note**: All endpoints require Admin Authentication (`Authorization: Token <admin_token>`) and strictly use URLs without trailing slashes.

## 1. List / Create Projects

### List Projects
Returns a list of all projects ordered by creation date descending.

- **Method**: `GET`
- **URL**: `/api/admin/projects`

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

### Create Project
Creates a completely new project by assigning it a unique name.

- **Method**: `POST`
- **URL**: `/api/admin/projects`

#### Request Body
```json
{
    "name": "Patient Portal v2"
}
```

#### Response (201 Created)
Returns the created project object.
```json
{
    "id": 3,
    "name": "Patient Portal v2",
    "created_at": "2026-03-02T10:30:00Z",
    "updated_at": "2026-03-02T10:30:00Z"
}
```

---

## 2. Get / Update / Delete Project

### Get Project Detail
- **Method**: `GET`
- **URL**: `/api/admin/projects/3`

#### Response (200 OK)
```json
{
    "id": 3,
    "name": "Patient Portal v2",
    "created_at": "2026-03-02T10:30:00Z",
    "updated_at": "2026-03-02T10:30:00Z"
}
```

---

### Get Project Sites
Returns a list of sites belonging only to the specified project.

- **Method**: `GET`
- **URL**: `/api/admin/projects/3/sites`

#### Request Body
None

#### Response (200 OK)
```json
[
    {
        "id": 2,
        "project": 3,
        "name": "Live Patient Portal",
        "link": "https://portal.sbhealth.com",
        "launch_date": "2026-04-01",
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    }
]
```

---

### Update Project
Updates an existing project's name via POST endpoint.

- **Method**: `POST`
- **URL**: `/api/admin/projects/3`

#### Request Body
```json
{
    "name": "Patient Portal (Enterprise)"
}
```

#### Response (200 OK)
Returns the updated project object.
```json
{
    "id": 3,
    "name": "Patient Portal (Enterprise)",
    "created_at": "2026-03-02T10:30:00Z",
    "updated_at": "2026-03-02T10:45:00Z"
}
```

---

### Delete Project
Permanently deletes a project via DELETE method.

- **Method**: `DELETE`
- **URL**: `/api/admin/projects/3`

#### Request Body
None

#### Response (204 No Content)
Empty response body.
