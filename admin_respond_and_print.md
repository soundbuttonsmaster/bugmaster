## Respond to a Checklist Item (Admin)

Admins can also record their own responses to checklist items.

- **Method**: `POST`
- **URL**: `/api/admin/checklist/1/respond`

### Request Body
```json
{
    "response": true
}
```

### Response (200 OK)
```json
{
    "item_id": 1,
    "question": "Is the site live and accessible?",
    "response": true,
    "answered": "created",
    "by_admin": true
}
```

---

## Print Checklist Report (Instant Print)

Returns a clean, printable HTML report of the site's checklist. This page automatically triggers the browser's print dialog.

- **Method**: `GET`
- **URL**: `/api/admin/sites/1/checklist/print`

### Report Format
- **Site Name**: Displayed as the header.
- **Checklist Questions**: A numbered list of all active questions.
- **Last Response**: Shows "Yes", "No", or "Unanswered" for each item.

---