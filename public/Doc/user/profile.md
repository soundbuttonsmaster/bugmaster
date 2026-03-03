# User – Profile APIs

Base URL: `/api/user`  
Authentication: `Authorization: Token <user_token>`

---

## Endpoints Overview

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/user/profile` | View my profile, role, and permissions |
| POST | `/user/profile` | Update my profile details |

---

## Get My Profile

Returns the logged-in user's profile info, assigned role, and all permissions from that role.

- **Method**: `GET`
- **URL**: `/api/user/profile`

### Request Body
None

### Response (200 OK)
```json
{
    "id": 5,
    "username": "john",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "profile": {
        "is_admin": false,
        "role": {
            "id": 2,
            "name": "SEO Manager",
            "description": "SEO-focused role",
            "permissions": [
                {
                    "id": 14,
                    "codename": "view_project",
                    "name": "View Project",
                    "description": "List and view projects"
                },
                {
                    "id": 18,
                    "codename": "view_site",
                    "name": "View Site",
                    "description": "List and view sites"
                }
            ]
        }
    }
}
```

> If the user has no role assigned, `role` will be `null`.

---

## Update My Profile

Update your own first name, last name, or email address.

- **Method**: `POST`
- **URL**: `/api/user/profile`

### Request Body (all fields optional)
```json
{
    "first_name": "Jonathan",
    "last_name": "Smith",
    "email": "jonathan@example.com"
}
```

### Response (200 OK)
```json
{
    "id": 5,
    "username": "john",
    "email": "jonathan@example.com",
    "first_name": "Jonathan",
    "last_name": "Smith",
    "is_active": true,
    "profile": {
        "is_admin": false,
        "role": {
            "id": 2,
            "name": "SEO Manager",
            "description": "SEO-focused role",
            "permissions": [...]
        }
    }
}
```

### Error Response (400 Bad Request)
```json
{
    "email": ["Enter a valid email address."]
}
```
