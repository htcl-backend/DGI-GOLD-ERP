# API URLs & JSON Data Quick Reference

## Base Configuration
```
API_URL: http://161.248.62.37:7527/api/v1
Timeout: 30000ms (30 seconds)
Auth: Bearer JWT Token in Authorization header
```

---

## 🔐 AUTHENTICATION

### 1. Login
**URL:** `POST /auth/login`
```json
{
  "email": "vendor@dgi.com",
  "password": "vendor123"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "v-001",
    "email": "vendor@dgi.com",
    "name": "Vendor User",
    "role": "VENDOR",
    "phone": "+91-9876543210",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Get Profile
**URL:** `GET /auth/profile`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "v-001",
    "name": "Vendor User",
    "email": "vendor@dgi.com",
    "phone": "+91-9876543210",
    "role": "VENDOR",
    "businessName": "Vendor Business",
    "gstin": "27AABCU9603R1ZX",
    "kycStatus": "verified"
  }
}
```

---

## 📊 METALS & PRICES

### 1. Live Metal Prices
**URL:** `GET /metals/price/live`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "gold": {
      "24K": 65200,
      "22K": 62000,
      "18K": 54000,
      "unit": "₹/gram"
    },
    "silver": {
      "999": 88000,
      "unit": "₹/gram"
    }
  }
}
```

### 2. Get Spot Price
**URL:** `GET /metals/price/spot?metal=gold`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "metal": "gold",
    "purity": "24K",
    "spotPrice": 65200,
    "currency": "INR"
  }
}
```

### 3. Get Price History
**URL:** `GET /metals/price/history?metal=gold&fromDate=2024-01-20&toDate=2024-01-25&interval=1d`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "metal": "gold",
    "prices": [
      {"date": "2024-01-20", "open": 64800, "high": 65500, "low": 64500, "close": 65000},
      {"date": "2024-01-21", "open": 65000, "high": 65800, "low": 64900, "close": 65200}
    ]
  }
}
```

---

## 📦 PRODUCTS

### 1. Get All Products
**URL:** `GET /products`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod-1",
        "name": "24K Gold Coin",
        "category": "gold",
        "purity": "24K",
        "weight": 10,
        "unit": "grams",
        "price": 65200,
        "stock": 50,
        "vendorId": "v-001"
      },
      {
        "id": "prod-2",
        "name": "22K Gold Chain",
        "category": "gold",
        "purity": "22K",
        "weight": 25,
        "price": 162500,
        "stock": 30,
        "vendorId": "v-001"
      }
    ],
    "total": 2
  }
}
```

---

## 🛒 ORDERS

### 1. Get All Orders
**URL:** `GET /orders`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord-1",
        "orderId": "ORD-2024-001",
        "customerId": "cust-1",
        "customerName": "Rajesh Kumar",
        "productName": "24K Gold Coin",
        "quantity": 2,
        "totalPrice": 130400,
        "status": "Delivered",
        "orderDate": "2024-01-15T10:30:00Z",
        "deliveryDate": "2024-01-18T10:30:00Z",
        "trackingNumber": "TRK123456789"
      }
    ]
  }
}
```

### 2. Create Buy Order
**URL:** `POST /orders/buy`
**Authorization:** Bearer JWT_TOKEN
**Request:**
```json
{
  "productId": "prod-1",
  "quantity": 2,
  "paymentMethod": "wallet",
  "deliveryAddress": "123 Main St, Mumbai, MH 400001"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ord-new-1",
    "orderId": "ORD-2024-NEW",
    "productName": "24K Gold Coin",
    "quantity": 2,
    "totalPrice": 130400,
    "status": "Pending"
  }
}
```

### 3. Create Sell Order
**URL:** `POST /orders/sell`
**Authorization:** Bearer JWT_TOKEN
**Request:**
```json
{
  "metal": "gold",
  "purity": "24K",
  "weight": 50,
  "quantity": 1
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "sell-ord-1",
    "orderId": "SELL-2024-001",
    "metal": "gold",
    "purity": "24K",
    "weight": 50,
    "estimatedPrice": 3260000,
    "status": "Pending"
  }
}
```

### 4. Cancel Order
**URL:** `POST /orders/{orderId}/cancel`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ord-1",
    "status": "Cancelled",
    "refundAmount": 130400,
    "refundStatus": "Initiated"
  }
}
```

### 5. Orders Summary (Dashboard)
**URL:** `GET /orders/reports/summary`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": 15,
    "totalRevenue": 1250000,
    "totalCustomers": 8,
    "ordersByStatus": {
      "Pending": 2,
      "Processing": 3,
      "Shipped": 4,
      "Delivered": 6,
      "Cancelled": 0
    },
    "thisMonth": {
      "totalOrders": 4,
      "revenue": 450000
    }
  }
}
```

---

## 💰 HOLDINGS & ASSETS

### 1. Get All Holdings
**URL:** `GET /holdings`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "holdings": [
      {
        "id": "hold-1",
        "metal": "gold",
        "purity": "24K",
        "quantity": 50,
        "unit": "grams",
        "purchasePrice": 65200,
        "currentPrice": 65500,
        "totalValue": 3275000,
        "gain": 15000,
        "gainPercent": 0.46
      },
      {
        "id": "hold-2",
        "metal": "silver",
        "purity": "999",
        "quantity": 200,
        "unit": "grams",
        "purchasePrice": 86000,
        "currentPrice": 88000,
        "totalValue": 1760000,
        "gain": 400000,
        "gainPercent": 2.33
      }
    ]
  }
}
```

### 2. Holdings Summary
**URL:** `GET /holdings/summary`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "totalValue": 5035000,
    "totalGain": 415000,
    "totalGainPercent": 0.90,
    "goldValue": 3275000,
    "silverValue": 1760000
  }
}
```

### 3. Holdings Ledger (Transaction History)
**URL:** `GET /holdings/ledger`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "trans-1",
        "type": "purchase",
        "metal": "gold",
        "quantity": 25,
        "price": 65200,
        "totalAmount": 1630000,
        "date": "2024-01-10T10:00:00Z",
        "status": "Completed"
      },
      {
        "id": "trans-2",
        "type": "sale",
        "metal": "gold",
        "quantity": 10,
        "price": 65500,
        "totalAmount": 655000,
        "date": "2024-01-20T15:30:00Z",
        "status": "Completed"
      }
    ]
  }
}
```

---

## 🚚 DELIVERY & ADDRESSES

### 1. Get All Addresses
**URL:** `GET /delivery/addresses`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "addr-1",
        "type": "home",
        "name": "Home Address",
        "street": "123 Main Street",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001",
        "country": "India",
        "phone": "+91-9876543210",
        "isDefault": true
      }
    ]
  }
}
```

### 2. Create Address
**URL:** `POST /delivery/addresses`
**Authorization:** Bearer JWT_TOKEN
**Request:**
```json
{
  "type": "home",
  "name": "New Address",
  "street": "789 New Street",
  "city": "Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "country": "India",
  "phone": "+91-9876543212"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "addr-3",
    "type": "home",
    "name": "New Address",
    "street": "789 New Street",
    "city": "Delhi"
  }
}
```

### 3. Get All Shipments
**URL:** `GET /delivery/shipments`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "id": "ship-1",
        "orderId": "ord-1",
        "trackingNumber": "TRK123456789",
        "carrier": "DTDC",
        "status": "Delivered",
        "shippedDate": "2024-01-15T14:00:00Z",
        "deliveredDate": "2024-01-18T10:00:00Z",
        "currentLocation": "Delivery Complete"
      }
    ]
  }
}
```

---

## 💳 PAYMENTS

### Get Payment Status
**URL:** `GET /payments/order/{orderId}/status`
**Authorization:** Bearer JWT_TOKEN
**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ord-1",
    "paymentId": "pay-1",
    "amount": 130400,
    "currency": "INR",
    "status": "Completed",
    "method": "wallet",
    "transactionId": "TXN-2024-001",
    "paidAt": "2024-01-15T10:35:00Z"
  }
}
```

---

## 🔔 NOTIFICATIONS (Role-Specific)

### Get User Notifications
**URL:** `GET /notifications`
**Authorization:** Bearer JWT_TOKEN
**Response (Vendor):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-v-1",
      "title": "New Order Received",
      "message": "You have received a new order for 24K Gold Coin",
      "type": "order",
      "read": false,
      "role": "vendor",
      "createdAt": "2024-01-25T10:00:00Z"
    },
    {
      "id": "notif-v-2",
      "title": "Payment Confirmed",
      "message": "Payment of ₹1,62,500 has been confirmed",
      "type": "payment",
      "read": true,
      "role": "vendor"
    }
  ]
}
```

**Response (Admin):**
```json
{
  "success": true,
  "data": [
    {
      "id": "notif-a-1",
      "title": "New KYC Submission",
      "message": "Vendor has submitted KYC documents",
      "type": "kyc",
      "read": false,
      "role": "admin",
      "createdAt": "2024-01-25T11:20:00Z"
    },
    {
      "id": "notif-a-2",
      "title": "System Alert",
      "message": "Database backup completed successfully",
      "type": "system",
      "read": true,
      "role": "admin"
    }
  ]
}
```

---

## 🧹 ERROR RESPONSES

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input",
  "message": "Required field is missing",
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "JWT token expired or invalid",
  "status": 401
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "Something went wrong on the server",
  "status": 500
}
```

---

## 📋 COMMON HTTP STATUS CODES

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Order created successfully |
| 201 | Created | New resource created |
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Database error |
| 503 | Service Unavailable | API is down |

---

## 🧪 TESTING WITH DEMO ACCOUNTS

### Vendor Login
```
Email: vendor@dgi.com
Password: vendor123
Role: VENDOR
Notifications: Orders, Payments, Deliveries, Stock Alerts
```

### Admin Login
```
Email: admin@dgi.com
Password: admin123
Role: SUPERADMIN
Notifications: KYC, System Alerts, Reports, Payments
```

---

## 🛠️ FRONTEND API SERVICE SETUP

### In apiService.js:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://161.248.62.37:7527/api/v1';

// All API calls include automatic error handling and fallback to demo data
// If backend is down, frontend uses cached/demo data
```

### In .env file:
```
VITE_API_URL=http://161.248.62.37:7527/api/v1
```

---

## 📌 IMPORTANT NOTES

✅ **All endpoints expect JWT token in Authorization header**
```
Authorization: Bearer {JWT_TOKEN}
```

✅ **All POST/PATCH/PUT requests use Content-Type: application/json**

✅ **Timestamps are in ISO 8601 format (UTC)**

✅ **All currency values are in INR (Indian Rupees)**

✅ **If backend times out, frontend falls back to mock data**

✅ **Notifications are automatically filtered by user role**

---

## 🔗 Related Documentation

- See [API_ENDPOINTS.md](API_ENDPOINTS.md) for detailed endpoint documentation
- See [NOTIFICATIONS_API.md](NOTIFICATIONS_API.md) for notifications API
- See [POSTMAN_COLLECTION.json](POSTMAN_COLLECTION.json) for Postman import (if available)
