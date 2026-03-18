# DGI ERP System API Documentation

This document outlines the RESTful API endpoints for the DGI ERP system. It covers existing APIs, proposed new APIs for enhanced functionality, and details on their usage, data structures, and security considerations.

## 1. Introduction

The DGI ERP system relies on a set of APIs to manage various aspects of the gold jewelry business, including authentication, dashboard analytics, product and inventory management, order processing, and reporting. This documentation serves as a guide for understanding and interacting with these APIs.

**Base URL:** `/api` (e.g., `http://localhost:3000/api`)

## 2. Authentication & Authorization APIs

These APIs handle user registration, login, session management, and access control.

### `POST /api/register`
*   **Description:** Registers a new user account.
*   **Request Body:**
    ```json
    {
      "username": "John Doe",
      "email": "john.doe@example.com",
      "phone": "1234567890",
      "password": "securepassword123",
      "role": "user", // or "admin", "manager", "staff"
      "designation": "Sales Associate",
      "department": "Sales",
      "address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "zipCode": "400001"
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "message": "User registered successfully. OTP sent for verification.",
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": { "_id": "...", "username": "John Doe", "email": "..." }
    }
    ```
*   **Security:** Requires OTP verification (if implemented on backend) to complete registration. Issues a JWT upon successful registration.

### `POST /api/login`
*   **Description:** Authenticates a user and issues a JWT for subsequent API calls.
*   **Request Body:**
    ```json
    {
      "email": "john.doe@example.com",
      "password": "securepassword123"
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": { "_id": "...", "username": "John Doe", "email": "...", "role": "user" }
    }
    ```
*   **Security:** Issues a JWT upon successful authentication. This token must be included in the `Authorization: Bearer <token>` header for all protected routes.

### `POST /api/logout` (New API)
*   **Description:** Invalidates the user's session/token on the server-side.
*   **Authentication:** Requires valid JWT.
*   **Request Body:** (Optional, could be empty or include token details if needed)
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```
*   **Security:** Essential for proper session management, especially if tokens are stored in a way that allows server-side invalidation (e.g., blacklist).

### `POST /api/auth/unlock` (New API for Lock Screen)
*   **Description:** Re-authenticates the user to unlock the screen after inactivity.
*   **Authentication:** Requires valid JWT (for the session to be active) and password verification.
*   **Request Body:**
    ```json
    {
      "password": "user_password"
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Screen unlocked"
    }
    ```
*   **Security:** Verifies the user's password against the stored credentials to ensure the legitimate user is resuming the session.

### `GET /api/profile` (New API)
*   **Description:** Retrieves the profile information of the currently logged-in user.
*   **Authentication:** Requires valid JWT.
*   **Response:**
    ```json
    {
      "success": true,
      "user": {
        "_id": "user123",
        "username": "Ankit Jain",
        "email": "ankit.jain@example.com",
        "role": "admin",
        "phone": "9876543210",
        "designation": "CEO",
        "department": "Management",
        "address": "123 Gold Tower",
        "city": "Mumbai",
        "state": "Maharashtra",
        "zipCode": "400001"
      }
    }
    ```

### `PUT /api/profile` (New API)
*   **Description:** Updates the profile information of the currently logged-in user.
*   **Authentication:** Requires valid JWT.
*   **Request Body:** (Partial user object with fields to update)
    ```json
    {
      "phone": "9988776655",
      "address": "456 Silver Street"
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "message": "Profile updated successfully",
      "user": { ...updated_user_object }
    }
    ```

### `GET /api/users` (New API - Admin Only)
*   **Description:** Retrieves a list of all users in the system.
*   **Authentication:** Requires valid JWT and `admin` role.
*   **Response:** (Array of user objects)

### `POST /api/users` (New API - Admin Only)
*   **Description:** Creates a new user account (by an admin).
*   **Authentication:** Requires valid JWT and `admin` role.
*   **Request Body:** (Same as `/api/register`)

### `PUT /api/users/:id` (New API - Admin Only)
*   **Description:** Updates a user's profile information (by an admin).
*   **Authentication:** Requires valid JWT and `admin` role.
*   **Request Body:** (Partial user object with fields to update)

### `DELETE /api/users/:id` (New API - Admin Only)
*   **Description:** Deletes a user account (by an admin).
*   **Authentication:** Requires valid JWT and `admin` role.

## 3. Dashboard & Analytics APIs

These APIs provide real-time business insights and operational summaries for the dashboard.

### `GET /api/dashboard/stats`
*   **Description:** Fetches a comprehensive set of statistics for the dashboard.
*   **Authentication:** Requires valid JWT.
*   **Response:**
    ```json
    {
      "activeOrders": 25,
      "totalStock": 150, // kg
      "totalRevenue": 12500000, // INR
      "cashBalance": 2500000, // INR
      "todaysSales": 150000, // INR
      "goldRate": 6750, // INR/gram (live 24K)
      "lowStockAlerts": [
        { "name": "Gold Coin 10g", "currentStock": 8, "threshold": 10 }
      ],
      "monthlySales": [ /* ... chart data ... */ ],
      "orderStatus": [ /* ... chart data ... */ ],
      "topMaterials": [ /* ... chart data ... */ ],
      "recentOrders": [ /* ... table data ... */ ],
      "cashBalanceHistory": [ /* ... modal data ... */ ],
      "revenueHistory": [ /* ... modal data ... */ ],
      "stockHistory": [ /* ... modal data ... */ ],
      "activeOrdersData": [ /* ... modal data ... */ ],
      "orderStatusDetails": [ /* ... modal data ... */ ],
      "materialStockDetails": [ /* ... modal data ... */ ]
    }
    ```
*   **How it works:** Aggregates data from `Orders`, `Products`, and `Transactions` collections. The `goldRate` is fetched live from an external API (`goldapi.io`) and cached/updated periodically.

### `GET /api/gold/history`
*   **Description:** Retrieves historical gold price data for charting.
*   **Authentication:** Requires valid JWT.
*   **Response:**
    ```json
    [
      { "timestamp": 1678886400000, "rate_24k": 6800.50 },
      { "timestamp": 1678886460000, "rate_24k": 6801.25 },
      // ... more data points
    ]
    ```
*   **How it works:** Fetches stored historical gold prices (24K per gram in INR) from the database. This data is typically populated by a background job that calls an external gold price API (e.g., `goldapi.io`) and stores the results.

## 4. Product & Inventory Management APIs

These APIs handle the creation, modification, and tracking of products and their stock levels.

### `GET /api/products` (New/Expanded API)
*   **Description:** Retrieves a list of all products.
*   **Authentication:** Requires valid JWT.
*   **Query Parameters:** `?category=gold&minStock=10` for filtering.
*   **Response:** (Array of product objects)

### `POST /api/products` (New/Expanded API)
*   **Description:** Creates a new product.
*   **Authentication:** Requires valid JWT.
*   **Request Body:**
    ```json
    {
      "name": "Gold Chain 22K",
      "sku": "GC22K-001",
      "material": "gold",
      "purity": "22K",
      "weight": 10, // grams
      "unitPrice": 6500, // INR per gram
      "stock": 50, // units
      "category": "Chains",
      "description": "Handcrafted gold chain"
    }
    ```

### `GET /api/products/:id` (New API)
*   **Description:** Retrieves details for a specific product.
*   **Authentication:** Requires valid JWT.

### `PUT /api/products/:id` (New API)
*   **Description:** Updates an existing product's details.
*   **Authentication:** Requires valid JWT.
*   **Request Body:** (Partial product object with fields to update)

### `DELETE /api/products/:id` (New API)
*   **Description:** Deletes a product.
*   **Authentication:** Requires valid JWT.

### `PUT /api/inventory/:productId/adjust` (New API)
*   **Description:** Adjusts the stock level for a specific product.
*   **Authentication:** Requires valid JWT.
*   **Request Body:**
    ```json
    {
      "quantity": 5, // positive for increase, negative for decrease
      "reason": "Stock take adjustment"
    }
    ```

## 5. Order & Delivery Management APIs

These APIs manage customer orders and track their delivery status.

### `GET /api/orders` (New/Expanded API)
*   **Description:** Retrieves a list of all orders.
*   **Authentication:** Requires valid JWT.
*   **Query Parameters:** `?status=Pending&customer=Raj` for filtering.
*   **Response:** (Array of order objects)

### `POST /api/orders` (New/Expanded API)
*   **Description:** Creates a new order.
*   **Authentication:** Requires valid JWT.
*   **Request Body:**
    ```json
    {
      "customerId": "customer123",
      "items": [
        { "productId": "product456", "quantity": 1, "unitPrice": 65000 }
      ],
      "totalPrice": 65000,
      "status": "Pending",
      "shippingAddress": "123 Main St"
    }
    ```

### `GET /api/orders/:id` (New API)
*   **Description:** Retrieves details for a specific order.
*   **Authentication:** Requires valid JWT.

### `PUT /api/orders/:id` (New API)
*   **Description:** Updates an existing order's details or status.
*   **Authentication:** Requires valid JWT.
*   **Request Body:** (Partial order object with fields to update)

### `DELETE /api/orders/:id` (New API)
*   **Description:** Deletes an order.
*   **Authentication:** Requires valid JWT.

### `GET /api/deliveries`
*   **Description:** Retrieves a list of all delivery records.
*   **Authentication:** Requires valid JWT.
*   **Response:** (Array of delivery objects)

### `PUT /api/deliveries/:id`
*   **Description:** Updates a specific delivery record.
*   **Authentication:** Requires valid JWT.
*   **Request Body:** (Partial delivery object with fields to update)

### `DELETE /api/deliveries/:id`
*   **Description:** Deletes a specific delivery record.
*   **Authentication:** Requires valid JWT.

### `GET /api/deliveries/history?status=<status>`
*   **Description:** Retrieves delivery history filtered by status (e.g., `Delivered`, `In Transit`).
*   **Authentication:** Requires valid JWT.
*   **Response:** (Array of history items)

## 6. Transaction Management APIs

These APIs handle the buying and selling of gold and silver, and manage transaction records.

### `POST /api/transactions`
*   **Description:** Creates a new transaction (buy or sell).
*   **Authentication:** Requires valid JWT.
*   **Request Body:**
    ```json
    {
      "material": "gold",
      "type": "sell",
      "customerName": "Raj Kumar",
      "customerPhone": "9876543210",
      "weight": "10",
      "purity": "24K (99.9%)",
      "price": "6500",
      "totalAmount": "65000",
      "date": "2024-03-17",
      "delivered": false,
      "notes": "First sale transaction"
    }
    ```

### `PUT /api/transactions/:id`
*   **Description:** Updates an existing transaction.
*   **Authentication:** Requires valid JWT.
*   **Request Body:** (Partial transaction object with fields to update)

### `DELETE /api/transactions/:id`
*   **Description:** Deletes a transaction.
*   **Authentication:** Requires valid JWT.

### `GET /api/transactions/:material/:type`
*   **Description:** Retrieves transactions filtered by material (gold/silver) and type (buy/sell).
*   **Authentication:** Requires valid JWT.
*   **Example:** `/api/transactions/gold/buy`
*   **Response:** (Array of transaction objects)

### `GET /api/transactions/:id` (New API)
*   **Description:** Retrieves details for a specific transaction.
*   **Authentication:** Requires valid JWT.

## 7. Reporting APIs

These APIs provide various reports for business analysis.

### `GET /api/reports/gold`
*   **Description:** Retrieves reports related to gold transactions/sales.
*   **Authentication:** Requires valid JWT.
*   **Response:** (Array of report data, e.g., sales by date, total gold sold)

### `GET /api/reports/silver`
*   **Description:** Retrieves reports related to silver transactions/sales.
*   **Authentication:** Requires valid JWT.
*   **Response:** (Array of report data)

### `GET /api/reports/sales` (New API)
*   **Description:** Provides a general sales report, with optional filtering.
*   **Authentication:** Requires valid JWT.
*   **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&material=gold`
*   **Response:** (Aggregated sales data)

### `GET /api/reports/inventory` (New API)
*   **Description:** Provides an inventory report, detailing current stock, value, and movement.
*   **Authentication:** Requires valid JWT.
*   **Query Parameters:** `?material=gold&category=Chains`
*   **Response:** (Inventory summary)

## 8. System & User Settings APIs

These APIs manage global application settings and user-specific preferences.

### `GET /api/settings` (New API - Admin Only)
*   **Description:** Retrieves global application settings.
*   **Authentication:** Requires valid JWT and `admin` role.
*   **Response:**
    ```json
    {
      "success": true,
      "settings": {
        "defaultGoldPurity": "24K",
        "lowStockThreshold": 10,
        "currency": "INR"
      }
    }
    ```

### `PUT /api/settings` (New API - Admin Only)
*   **Description:** Updates global application settings.
*   **Authentication:** Requires valid JWT and `admin` role.
*   **Request Body:** (Partial settings object with fields to update)

## 9. Security Considerations

### JWT (JSON Web Tokens)
*   **Authentication:** JWTs are issued upon successful login/registration and must be sent with every subsequent API request in the `Authorization: Bearer <token>` header.
*   **Storage:** The frontend currently stores JWTs in `localStorage`. While convenient, this makes the application vulnerable to Cross-Site Scripting (XSS) attacks. A more secure approach would be to use `HttpOnly` cookies.
*   **Expiration:** JWTs should have a short expiration time, and a refresh token mechanism should be implemented for seamless user experience without frequent re-logins.
*   **Encryption vs. Signing:** JWTs are primarily *signed* (JWS) to ensure their integrity and authenticity. They are generally *not encrypted* (JWE) for confidentiality in typical use cases, as encryption adds overhead. The current implementation relies on signing.

### Inactivity Lock Screen
*   The frontend implements an inactivity timer that locks the screen after 5 minutes.
*   Unlocking requires re-entering the user's password, which should be verified via a dedicated backend API endpoint (`/api/auth/unlock`) to ensure the legitimate user is resuming the session.

### Role-Based Access Control (RBAC)
*   The system supports user roles (user, admin, manager, staff).
*   Backend APIs should enforce role-based authorization, ensuring that users can only access resources and perform actions permitted by their assigned role. For example, `/api/users` endpoints should only be accessible to `admin` users.

### Data Validation
*   All API endpoints should implement robust server-side input validation to prevent invalid or malicious data from being processed or stored.

### HTTPS
*   All API communication should occur over HTTPS to encrypt data in transit and protect against eavesdropping and man-in-the-middle attacks.

---

This documentation provides a comprehensive overview of the API landscape for the DGI ERP system. As the system evolves, new APIs will be added, and existing ones may be refined.