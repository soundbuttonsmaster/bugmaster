# Admin User Management APIs

Endpoints for administrators to manage all users in the system.

> **Note**: All endpoints require Admin Authentication (`Authorization: Token <admin_token>`) and no trailing slashes on URLs.

## 1. List Users
Returns a paginated list of all users along with their nested role data.

- **Method**: `GET`
- **URL**: `/api/admin/users`

### Response (200 OK)
```json
{
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "email": "user@example.com",
            "username": "user",
            "first_name": "Test",
            "last_name": "User",
            "full_name": "Test User",
            "profile": {
                "is_admin": false,
                "role": {
                    "id": 2,
                    "name": "Editor",
                    "description": "Edits content",
                    "user_count": 1,
                    "permissions": [
                        {
                            "id": 5,
                            "codename": "edit_content",
                            "name": "Edit Content",
                            "description": "Can edit existing content",
                            "created_at": "2026-03-02T10:00:00Z"
                        }
                    ],
                    "created_at": "2026-03-02T10:00:00Z",
                    "updated_at": "2026-03-02T10:00:00Z"
                },
                "created_at": "2026-03-02T10:00:00Z",
                "updated_at": "2026-03-02T10:00:00Z"
            },
            "is_active": true,
            "date_joined": "2026-03-02T10:00:00Z"
        }
    ]
}
```

---

## 2. Get User Details
Fetches complete details of a specific user.

- **Method**: `GET`
- **URL**: `/api/admin/users/1`

### Response (200 OK)
```json
{
    "id": 1,
    "email": "user@example.com",
    "username": "user",
    "first_name": "Test",
    "last_name": "User",
    "full_name": "Test User",
    "profile": {
        "is_admin": false,
        "role": null,
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    },
    "is_active": true,
    "date_joined": "2026-03-02T10:00:00Z"
}
```

---

## 3. Update User
Updates basic user details via POST method. Partial updates are supported.
Fields allowed: `first_name`, `last_name`, `is_active`.

- **Method**: `POST`
- **URL**: `/api/admin/users/1`

### Request Body (JSON)
```json
{
    "first_name": "Updated",
    "is_active": false
}
```

### Response (200 OK)
```json
{
    "id": 1,
    "email": "user@example.com",
    "username": "user",
    "first_name": "Updated",
    "last_name": "User",
    "full_name": "Updated User",
    "profile": {
        "is_admin": false,
        "role": null,
        "created_at": "2026-03-02T10:00:00Z",
        "updated_at": "2026-03-02T10:00:00Z"
    },
    "is_active": false,
    "date_joined": "2026-03-02T10:00:00Z"
}
```

---

## 4. Delete User
Permanently deletes a user from the database via DELETE method.

- **Method**: `DELETE`
- **URL**: `/api/admin/users/1`

### Request Body
None

### Response (204 No Content)
Empty response body.

---

## 5. Assign Role to User
Assigns a specific role ID to a user, replacing any existing role.

- **Method**: `POST`
- **URL**: `/api/admin/users/1/assign-role`

### Request Body
```json
{
    "role_id": 2
}
```

### Response (200 OK)
```json
{
    "message": "Role 'Editor' assigned to user@example.com."
}
```
