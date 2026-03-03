# User – Checklist APIs

Base URL: `/api/user`  
Authentication: `Authorization: Token <user_token>`

---

## Endpoints Overview

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/user/sites/<id>/checklist` | View checklist for a site (with my response) |
| POST | `/user/checklist/<id>/respond` | Submit or update Yes/No response |

---

## View Site Checklist

Returns all **active** checklist items for a site. Each item includes `my_response` — the logged-in user's current answer (`null` if not yet answered).

- **Method**: `GET`
- **URL**: `/api/user/sites/1/checklist`

### Request Body
None

### Response (200 OK)
```json
[
    {
        "id": 1,
        "site": 1,
        "question": "Is the site live and accessible?",
        "is_active": true,
        "my_response": true,
        "created_at": "2026-03-01T08:00:00Z"
    },
    {
        "id": 2,
        "site": 1,
        "question": "Is SSL certificate valid?",
        "is_active": true,
        "my_response": null,
        "created_at": "2026-03-01T08:05:00Z"
    },
    {
        "id": 3,
        "site": 1,
        "question": "Are there any broken links?",
        "is_active": true,
        "my_response": false,
        "created_at": "2026-03-01T08:10:00Z"
    }
]
```

> - `my_response: true` → You answered **Yes**
> - `my_response: false` → You answered **No**
> - `my_response: null` → You **have not answered yet**

---

## Respond to a Checklist Item

Submit a Yes or No answer to a specific checklist item. If you already answered, this updates your previous answer.

- **Method**: `POST`
- **URL**: `/api/user/checklist/1/respond`

### Request Body
```json
{
    "response": true
}
```

> `true` = **Yes**, `false` = **No**

### Response (200 OK) — First time answering
```json
{
    "item_id": 1,
    "question": "Is the site live and accessible?",
    "response": true,
    "answered": "created"
}
```

### Response (200 OK) — Updating existing answer
```json
{
    "item_id": 1,
    "question": "Is the site live and accessible?",
    "response": false,
    "answered": "updated"
}
```

### Error Response (404 Not Found)
```json
{
    "detail": "Checklist item not found or inactive."
}
```
