# Admin Permissions Management APIs

Endpoints to manage the fine-grained permissions that can be grouped into roles across the application.

> **Note**: All endpoints require Admin Authentication (`Authorization: Token <admin_token>`) and strictly use URLs without trailing slashes.

## 1. List / Create Permissions

### List Permissions
Returns a list of all available permissions in the system.

- **Method**: `GET`
- **URL**: `/api/admin/permissions`

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "codename": "manage_users",
        "name": "Manage Users",
        "description": "Create, update, deactivate users",
        "created_at": "2026-03-02T10:00:00Z"
    },
    {
        "id": 2,
        "codename": "view_reports",
        "name": "View Reports",
        "description": "Access all reporting data",
        "created_at": "2026-03-02T10:00:00Z"
    }
]
```

---

### Create Permission
Registers a completely new fine-grained permission.

- **Method**: `POST`
- **URL**: `/api/admin/permissions`

#### Request Body
```json
{
    "codename": "delete_reviews",
    "name": "Delete Reviews",
    "description": "Can delete user-submitted reviews safely"
}
```

#### Response (201 Created)
Returns the created permission object.
```json
{
    "id": 3,
    "codename": "delete_reviews",
    "name": "Delete Reviews",
    "description": "Can delete user-submitted reviews safely",
    "created_at": "2026-03-02T10:30:00Z"
}
```

---

## 2. Get / Update / Delete Permission

### Get Permission Detail
- **Method**: `GET`
- **URL**: `/api/admin/permissions/3`

#### Response (200 OK)
```json
{
    "id": 3,
    "codename": "delete_reviews",
    "name": "Delete Reviews",
    "description": "Can delete user-submitted reviews safely",
    "created_at": "2026-03-02T10:30:00Z"
}
```

---

### Update Permission
Updates an existing permission's details via POST endpoint.

- **Method**: `POST`
- **URL**: `/api/admin/permissions/3`

#### Request Body
```json
{
    "name": "Delete Reviews (Admin Only)"
}
```

#### Response (200 OK)
Returns the updated permission object.
```json
{
    "id": 3,
    "codename": "delete_reviews",
    "name": "Delete Reviews (Admin Only)",
    "description": "Can delete user-submitted reviews safely",
    "created_at": "2026-03-02T10:30:00Z"
}
```

---

### Delete Permission
Permanently deletes a permission via DELETE method. Standard Django cascade rules apply (it will be silently stripped from any system roles that hold it).

- **Method**: `DELETE`
- **URL**: `/api/admin/permissions/3`

#### Request Body
None

#### Response (204 No Content)
Empty response body.
