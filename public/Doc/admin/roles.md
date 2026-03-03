# Admin Roles Management APIs

Endpoints to manage application roles and configure user-defined permissions mapped directly into roles.

> **Note**: All endpoints require Admin Authentication (`Authorization: Token <admin_token>`) and strictly use URLs without trailing slashes.

## 1. List / Create Roles

### List Roles
Returns a full dump of all roles and their currently bound permissions.

- **Method**: `GET`
- **URL**: `/api/admin/roles`

#### Response (200 OK)
```json
[
    {
        "id": 1,
        "name": "Editor",
        "description": "Can manage and publish content",
        "user_count": 5,
        "permissions": [
            {
                "id": 10,
                "codename": "manage_content",
                "name": "Manage Content",
                "description": "Create, edit, delete all content",
                "created_at": "2026-03-02T10:00:00Z"
            }
        ],
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    }
]
```

---

### Create Role
Creates a brand new role and allows passing `permission_ids` array to bind permission keys directly during creation via POST.

- **Method**: `POST`
- **URL**: `/api/admin/roles`

#### Request Body
```json
{
    "name": "Moderator",
    "description": "Approves pending content",
    "permission_ids": [10, 11]
}
```

#### Response (201 Created)
```json
{
    "id": 2,
    "name": "Moderator",
    "description": "Approves pending content",
    "user_count": 0,
    "permissions": [
        {
            "id": 10,
            "codename": "manage_content",
            "name": "Manage Content",
            "description": "Create, edit, delete all content",
            "created_at": "2026-03-02T10:00:00Z"
        },
        {
            "id": 11,
            "codename": "approve_content",
            "name": "Approve Content",
            "description": "Approve drafted posts",
            "created_at": "2026-03-02T10:00:00Z"
        }
    ],
    "created_at": "2026-03-02T10:05:00Z",
    "updated_at": "2026-03-02T10:05:00Z"
}
```

---

## 2. Get / Update / Delete Role Detail

### Get Role Details
- **Method**: `GET`
- **URL**: `/api/admin/roles/2`

#### Response (200 OK)
```json
{
    "id": 2,
    "name": "Moderator",
    "description": "Approves pending content",
    "user_count": 0,
    "permissions": [],
    "created_at": "2026-03-02T10:05:00Z",
    "updated_at": "2026-03-02T10:05:00Z"
}
```

---

### Update Role via POST
Updates role details and/or sets new permissions via POST. Replacing `permission_ids` list will completely overwrite the role's current permissions.

- **Method**: `POST`
- **URL**: `/api/admin/roles/2`

#### Request Body
```json
{
    "name": "Head Moderator",
    "permission_ids": [10, 11, 12]
}
```

#### Response (200 OK)
Returns the fully updated role.
```json
{
    "id": 2,
    "name": "Head Moderator",
    "description": "Approves pending content",
    "user_count": 0,
    "permissions": [
        {
            "id": 10,
            "codename": "manage_content",
            "name": "Manage Content",
            "description": "Create, edit, delete all content",
            "created_at": "2026-03-02T10:00:00Z"
        },
        {
            "id": 11,
            "codename": "approve_content",
            "name": "Approve Content",
            "description": "Approve drafted posts",
            "created_at": "2026-03-02T10:00:00Z"
        },
        {
            "id": 12,
            "codename": "delete_users",
            "name": "Delete Users",
            "description": "Delete existing users",
            "created_at": "2026-03-02T10:00:00Z"
        }
    ],
    "created_at": "2026-03-02T10:05:00Z",
    "updated_at": "2026-03-02T10:06:00Z"
}
```

---

### Delete Role
Permanently deletes a role. Any users tied to this role default back to no role (`null`).

- **Method**: `DELETE`
- **URL**: `/api/admin/roles/2`

#### Request Body
None

#### Response (204 No Content)
Empty response body.
