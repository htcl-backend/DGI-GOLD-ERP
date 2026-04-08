# Notifications API & Data Structure

## API Endpoint
```
Base URL: http://161.248.62.37:7527/api/v1
```

### Get User Notifications
```
GET /notifications
Authorization: Bearer {JWT_TOKEN}
```

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-v-1",
      "title": "New Order Received",
      "message": "You have received a new order for 24K Gold Coin from Rajesh Kumar",
      "type": "order",
      "read": false,
      "createdAt": "2024-01-25T10:00:00Z",
      "role": "vendor"
    },
    {
      "id": "notif-v-2",
      "title": "Payment Confirmed",
      "message": "Payment of ₹1,62,500 has been confirmed for order #ORD-2024-005",
      "type": "payment",
      "read": true,
      "createdAt": "2024-01-24T15:30:00Z",
      "role": "vendor"
    }
  ]
}
```

---

## Notification Data Structure

### For Vendor Role

```json
{
  "vendor": [
    {
      "id": "notif-v-1",
      "title": "New Order Received",
      "message": "You have received a new order for 24K Gold Coin from Rajesh Kumar",
      "type": "order",
      "read": false,
      "createdAt": "2024-01-25T10:00:00Z",
      "role": "vendor"
    },
    {
      "id": "notif-v-2",
      "title": "Payment Confirmed",
      "message": "Payment of ₹1,62,500 has been confirmed for order #ORD-2024-005",
      "type": "payment",
      "read": true,
      "createdAt": "2024-01-24T15:30:00Z",
      "role": "vendor"
    },
    {
      "id": "notif-v-3",
      "title": "Low Stock Alert",
      "message": "Silver Bar 1kg is running low on stock. Current: 15 units",
      "type": "stock",
      "read": false,
      "createdAt": "2024-01-23T12:00:00Z",
      "role": "vendor"
    },
    {
      "id": "notif-v-4",
      "title": "Shipment Dispatched",
      "message": "Order #ORD-2024-003 has been shipped. Tracking: TRK123456789",
      "type": "delivery",
      "read": false,
      "createdAt": "2024-01-22T08:45:00Z",
      "role": "vendor"
    }
  ]
}
```

### For Admin/SuperAdmin Role

```json
{
  "admin": [
    {
      "id": "notif-a-1",
      "title": "New KYC Submission",
      "message": "Vendor \"Gold Traders Inc\" has submitted KYC documents for verification",
      "type": "kyc",
      "read": false,
      "createdAt": "2024-01-25T11:20:00Z",
      "role": "admin"
    },
    {
      "id": "notif-a-2",
      "title": "System Alert",
      "message": "Database backup completed successfully at 01:00 AM",
      "type": "system",
      "read": true,
      "createdAt": "2024-01-25T01:00:00Z",
      "role": "admin"
    },
    {
      "id": "notif-a-3",
      "title": "Vendor Dashboard Report",
      "message": "Monthly revenue report for all vendors is ready for review",
      "type": "system",
      "read": false,
      "createdAt": "2024-01-24T18:30:00Z",
      "role": "admin"
    },
    {
      "id": "notif-a-4",
      "title": "Payment Issue Flagged",
      "message": "Payment failure detected for order #ORD-2024-010. Action required.",
      "type": "payment",
      "read": false,
      "createdAt": "2024-01-23T16:15:00Z",
      "role": "admin"
    }
  ]
}
```

---

## Notification Types

| Type | Description | Vendor | Admin |
|------|-------------|--------|-------|
| `order` | New order received, order updates | ✅ | ❌ |
| `payment` | Payment confirmed, payment failures | ✅ | ✅ |
| `delivery` | Shipment dispatched, delivery updates | ✅ | ❌ |
| `stock` | Low stock alerts, inventory updates | ✅ | ❌ |
| `kyc` | KYC document submissions, approvals | ❌ | ✅ |
| `system` | System alerts, maintenance, reports | ❌ | ✅ |

---

## Mark Notification as Read

```
PUT /notifications/{notificationId}/read
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

Response:
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Delete Notification

```
DELETE /notifications/{notificationId}
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "success": true,
  "message": "Notification deleted"
}
```

---

## Mark All as Read

```
PUT /notifications/mark-all-read
Authorization: Bearer {JWT_TOKEN}

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Filter Notifications

```
GET /notifications?type=order&read=false
Authorization: Bearer {JWT_TOKEN}

Query Parameters:
- type: order | payment | delivery | stock | kyc | system | all
- read: true | false | all
- limit: number (default: 20)
- offset: number (default: 0)
```

---

## Implementation Changes Made

### 1. **DataContext.jsx**
   - Updated `dummyNotifications` to have separate data for `vendor` and `admin` roles
   - Added `getNotificationsByRole()` function to filter notifications by user role
   - Updated provider value to return only role-specific notifications

### 2. **Notifications.jsx**
   - Imported `useAuth` to get current user information
   - Updated header to show logged-in user's role and name
   - Notifications now display only for the logged-in user's role

### 3. **How It Works**
   - When a user logs in as Vendor, they see only Vendor notifications (orders, payments, delivery, stock)
   - When a user logs in as SuperAdmin/Admin, they see only Admin notifications (KYC, system, payments, reports)
   - The filtering happens automatically based on `user.role` from AuthContext

---

## Test Demo Accounts

### Vendor Account
- Email: `vendor@dgi.com`
- Password: `vendor123`
- Role: `VENDOR`
- Notifications: Orders, Payments, Delivery, Stock Alerts

### SuperAdmin Account
- Email: `admin@dgi.com`
- Password: `admin123`
- Role: `SUPERADMIN`
- Notifications: KYC, System Alerts, Reports, Payments
