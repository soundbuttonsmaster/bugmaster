# User Authentication APIs

All user-facing authentication endpoints. Users are created by an admin — login only.

## 1. Login User
Authenticates a user and returns an access token.

- **Method**: `POST`
- **URL**: `/api/user/login`
- **Auth Required**: No

### Request Body
```json
{
    "email": "john@example.com",
    "password": "strongpassword123"
}
```

### Response (200 OK)
```json
{
    "message": "Login successful.",
    "token": "z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4",
    "user": {
        "id": 1,
        "email": "john@example.com",
        "username": "john",
        "first_name": "John",
        "last_name": "Doe",
        "full_name": "John Doe",
        "profile": {
            "is_admin": false,
            "role": null,
            "created_at": "2026-03-02T10:00:00Z",
            "updated_at": "2026-03-02T10:00:00Z"
        },
        "is_active": true,
        "date_joined": "2026-03-02T10:00:00Z"
    }
}
```

---

## 2. Logout User
Invalidates the current authentication token.

- **Method**: `POST`
- **URL**: `/api/user/logout`
- **Auth Required**: Yes (`Authorization: Token <your_token>`)

### Request Body
None

### Response (204 No Content)
Empty response body.

---

## 3. Get User Profile
Retrieves the logged-in user's profile, including their role and permissions.

- **Method**: `GET`
- **URL**: `/api/user/profile`
- **Auth Required**: Yes (`Authorization: Token <your_token>`)

### Response (200 OK)
```json
{
    "id": 1,
    "email": "john@example.com",
    "username": "john",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
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

## 4. Update User Profile
Updates the authenticated user's profile details.

- **Method**: `POST`
- **URL**: `/api/user/profile`
- **Auth Required**: Yes (`Authorization: Token <your_token>`)

### Request Body
```json
{
    "first_name": "Johnny",
    "last_name": "Doe",
    "email": "john_new@example.com"
}
```

### Response (200 OK)
```json
{
    "id": 1,
    "email": "john_new@example.com",
    "username": "john",
    "first_name": "Johnny",
    "last_name": "Doe",
    "full_name": "Johnny Doe",
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
