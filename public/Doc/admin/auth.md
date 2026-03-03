# Admin Authentication APIs

Authentication endpoints exclusively for Administrator accounts. Every admin request requires an admin-level user.

## 1. Admin Login
Logs an admin in and issues an authentication token. Non-admin users will face a 403 Forbidden.

- **Method**: `POST`
- **URL**: `/api/admin/login`
- **Auth Required**: No

### Request Body
```json
{
    "email": "admin@example.com",
    "password": "adminpassword"
}
```

### Response (200 OK)
```json
{
    "message": "Admin login successful.",
    "token": "x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4",
    "user": {
        "id": 1,
        "email": "admin@example.com",
        "username": "admin",
        "first_name": "Super",
        "last_name": "Admin",
        "full_name": "Super Admin",
        "profile": {
            "is_admin": true,
            "role": {
                "id": 1,
                "name": "Admin",
                "description": "Full administrative access",
                "user_count": 1,
                "permissions": [
                    {
                        "id": 1,
                        "codename": "manage_users",
                        "name": "Manage Users",
                        "description": "Create, update, deactivate users",
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
}
```

---

## 2. Admin Logout
Invalidates the current admin token.

- **Method**: `POST`
- **URL**: `/api/admin/logout`
- **Auth Required**: Yes (`Authorization: Token <admin_token>`)

### Request Body
None

### Response (204 No Content)
Empty response body.

---

## 3. Register New Admin
Creates a new administrator account. Only an existing authenticated admin can perform this action.

- **Method**: `POST`
- **URL**: `/api/admin/register`
- **Auth Required**: Yes (`Authorization: Token <admin_token>`)

### Request Body
```json
{
    "first_name": "New",
    "last_name": "Admin",
    "email": "newadmin@example.com",
    "password": "securepassword",
    "confirm_password": "securepassword"
}
```

### Response (201 Created)
```json
{
    "message": "Admin created successfully.",
    "user": {
        "id": 2,
        "email": "newadmin@example.com",
        "username": "newadmin",
        "first_name": "New",
        "last_name": "Admin",
        "full_name": "New Admin",
        "profile": {
            "is_admin": true,
            "role": {
                "id": 1,
                "name": "Super Admin",
                "description": "Full access to all features and APIs",
                "permissions": [],
                "created_at": "2026-03-02T10:00:00Z",
                "updated_at": "2026-03-02T10:00:00Z"
            },
            "created_at": "2026-03-02T10:00:00Z",
            "updated_at": "2026-03-02T10:00:00Z"
        },
        "is_active": true,
        "date_joined": "2026-03-02T10:15:00Z"
    }
}
```

---

## 4. Create User (Admin adds a regular user)
Creates a standard user account with an optional role. Only admin can do this — users cannot self-register.

- **Method**: `POST`
- **URL**: `/api/admin/users`
- **Auth Required**: Yes (`Authorization: Token <admin_token>`)

### Request Body
```json
{
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepassword",
    "confirm_password": "securepassword",
    "role_id": 2
}
```

> `role_id` is optional. If omitted, user is created with no role.

### Response (201 Created)
```json
{
    "message": "User created.",
    "user": {
        "id": 5,
        "email": "john@example.com",
        "username": "john",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "profile": {
            "is_admin": false,
            "role": {
                "id": 2,
                "name": "SEO Manager",
                "description": "SEO-focused role",
                "permissions": []
            }
        },
        "is_active": true,
        "date_joined": "2026-03-02T11:00:00Z"
    }
}
```

### Error — Email already exists (400 Bad Request)
```json
{
    "email": ["A user with this email already exists."]
}
```

### Error — Passwords don't match (400 Bad Request)
```json
{
    "confirm_password": ["Passwords do not match."]
}
```
