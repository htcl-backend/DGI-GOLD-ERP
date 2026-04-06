# DGI ERP System Documentation

## 📋 Table of Contents
- [Tab 1 - Login Flow](#tab-1---login-flow)
- [Tab 2 - Role Details](#tab-2---role-details)
- [Tab 3 - Complete File Tree](#tab-3---complete-file-tree)
- [Tab 6 - Context Usage](#tab-6---context-usage)

---

## Tab 1 — Login Flow

### Step-by-Step Authentication Process

```
1. User enters email + password in SignIn.jsx
   ↓
2. handleSignInClick() calls apiFetch("/login", { email, password })
   ↓
3. POST request to: http://161.248.62.37:7527/api/v1/auth/login
   ↓
4. Backend validates credentials and returns:
   {
     "token": "jwt_token_here",
     "user": {
       "id": "user_id",
       "name": "User Name",
       "email": "user@example.com",
       "role": "superadmin" | "vendor",
       "kycStatus": "pending|approved|rejected",
       "businessName": "...",
       "gstin": "..."
     }
   }
   ↓
5. AuthContext.login() called with (userData, token)
   ↓
6. Token saved to localStorage:
   - localStorage.setItem("token", token)
   - localStorage.setItem("user", JSON.stringify(user))
   ↓
7. AuthContext state updated:
   - setUser(userData)
   - isSuperAdmin = user.role === "superadmin"
   - isVendor = user.role === "vendor"
   ↓
8. Role-based redirect:
   if (user.role === "superadmin") → navigate("/superadmin/dashboard")
   if (user.role === "vendor") → navigate("/vendor/dashboard")
   ↓
9. ProtectedRoute checks on every navigation:
   - If no token → redirect to "/signin"
   - If wrong role for route → redirect to own dashboard
   - If inactive 5+ min → LockScreen shown
   ↓
10. Layout loads based on role:
    - SuperAdmin → SuperAdminLayout (platform-wide sidebar)
    - Vendor → VendorLayout (vendor-specific sidebar)
```

### Session Management
- **Token Storage**: JWT stored in localStorage as "token"
- **User Data**: Full user object stored as JSON in localStorage "user"
- **Auto-restore**: On app refresh, AuthContext checks localStorage and restores session
- **Logout**: Clears both token and user from localStorage, redirects to "/signin"

---

## Tab 2 — Role Details

### 👑 Super Admin (Platform Owner)
**Can see and do everything across all vendors**

#### Actions & Permissions:
| Action | Screen | Data Scope | Description |
|--------|--------|------------|-------------|
| **View Platform Overview** | SA Dashboard | ALL vendors combined | Revenue, orders, customers, active orders across entire platform |
| **Add New Vendor** | Vendors page | Creates new vendor record | Register new jewelry vendors on platform |
| **Edit Vendor Details** | Vendors page | Any vendor | Update vendor info, contact, business details |
| **Delete Vendor** | Vendors page | Any vendor | Remove vendors from platform |
| **Approve KYC** | KYC Approvals | All pending KYC | Review vendor documents, approve/reject with notes |
| **Reject KYC** | KYC Approvals | All pending KYC | Reject applications with reason notes |
| **View All Orders** | All Orders | Every vendor's orders | Cross-vendor order visibility |
| **Change Order Status** | All Orders | Any order | Update order status for any vendor |
| **View All Customers** | All Customers | Every vendor's customers | Platform-wide customer analytics |
| **View Revenue Reports** | Reports | Platform-wide charts | Total revenue, vendor comparison, gold trends |
| **View Vendor Comparison** | Reports | Per-vendor breakdown | Performance metrics, revenue comparison |
| **Receive System Alerts** | Notifications | All + system alerts | Platform issues, vendor status changes |
| **Update Own Profile** | Settings | Own record only | Personal account settings |

### 🏪 Vendor (Jewelry Store Owner)
**Can only see and manage their own data**

#### Actions & Permissions:
| Action | Screen | Data Scope | Description |
|--------|--------|------------|-------------|
| **View Own Dashboard** | VN Dashboard | Own metrics only | Personal revenue, orders, customers, gold rates |
| **Create New Order** | Orders | Own customers only | Place orders for own customers |
| **Update Order Status** | Orders | Own orders only | Change status of own orders |
| **Delete Own Order** | Orders | Own orders only | Remove own orders |
| **Add Customer** | Customers | Saved with own vendorId | Create customer records (auto-tagged with vendorId) |
| **Edit Customer Details** | Customers | Own customers only | Update own customer information |
| **Add Product** | Products | Own products only | Add gold/silver items to inventory |
| **Adjust Stock Levels** | Inventory | Own products only | Update stock quantities |
| **Record Gold Purchase** | Buy Gold | Own transactions | Log gold/silver purchases |
| **Record Gold Sale** | Sell Gold | Own transactions | Log gold/silver sales |
| **Track Deliveries** | Deliveries | Own orders only | Monitor delivery status |
| **View Own KYC Status** | My KYC | Own KYC only | Check personal verification status |
| **View Notifications** | Notifications | Own + global only | Personal alerts + system announcements |
| **Update Own Profile** | Settings | Own record only | Personal account settings |

### 🚫 What Vendors CANNOT See (Completely Hidden)
| Feature | Why Hidden | Security Reason |
|---------|------------|-----------------|
| **Vendors List** | Only SA can manage vendors | Vendors cannot create/modify other vendors |
| **KYC Approval Panel** | Vendors submit KYC, SA approves | No cross-vendor document access |
| **All Orders (Cross-vendor)** | Vendor sees only own orders | Business confidentiality |
| **All Customers (Cross-vendor)** | Customer list is per-vendor | Customer data privacy |
| **Platform Revenue Reports** | Total revenue, comparisons | Competitive business intelligence |
| **Other Vendor Data** | Every query filtered by vendorId | Data isolation and security |
| **Vendor Management** | Add/Edit/Delete other vendors | Platform administration only |
| **System Analytics** | Platform-wide metrics | SA-only business insights |

### 🔒 Data Filtering Logic
```javascript
// Every vendor data query automatically filtered:
const myOrders = orders.filter(order => order.vendorId === user.id);
const myCustomers = customers.filter(customer => customer.vendorId === user.id);
const myProducts = products.filter(product => product.vendorId === user.id);

// SuperAdmin sees everything:
const allOrders = orders; // no filter needed
const allCustomers = customers; // no filter needed
```

---

## Tab 3 — Complete File Tree

```
dgi-erp/
├── .env                           # Environment variables (API URLs, Firebase keys)
├── .gitignore                     # Git ignore rules (node_modules, dist, .env)
├── API_Documentation.md           # API endpoint documentation
├── DGI_ERP_Manager_Demo.md        # Demo data and setup instructions
├── eslint.config.js               # ESLint configuration for code quality
├── index.html                     # Main HTML template (entry point)
├── package.json                   # NPM dependencies and scripts
├── package-lock.json              # Locked dependency versions
├── README.md                      # Project documentation and setup guide
├── vite.config.js                 # Vite build configuration
│
├── public/                        # Static assets served directly
│
├── src/                           # Main application source code
│   ├── .env                       # Local environment overrides
│   ├── api.js                     # Centralized API helper (apiFetch function)
│   ├── App.css                    # Global app styles
│   ├── App.jsx                    # Main app component with ALL routes
│   ├── index.css                  # Global CSS (Tailwind imports)
│   ├── main.jsx                   # React app entry point (renders App)
│   │
│   ├── assets/                    # Static assets (images, icons, logos)
│   │   ├── react.svg              # React logo
│   │   ├── images/                # UI images and backgrounds
│   │   │   ├── app-logo.jpg       # Application logo
│   │   │   ├── background/        # Background images for themes
│   │   │   ├── profiles/          # Profile avatar images
│   │   │   └── users/             # User profile pictures
│   │   └── img/                   # Additional images (logos, favicons)
│   │
│   ├── components/                # Reusable UI components
│   │   ├── Header.jsx             # Top navigation bar with notifications
│   │   ├── OverviewCard.jsx       # Stat card with icon, value, change %
│   │   ├── OverviewTable.jsx      # Data table with Import/Export buttons
│   │   ├── Pagination.jsx         # Page navigation controls
│   │   ├── ReportDetails.jsx      # Overview section with stat cards
│   │   ├── RoleProtectedRoute.jsx # Route protection based on user role
│   │   ├── SearchBar.jsx          # Search input component
│   │   ├── Sidebar.jsx            # Navigation sidebar (legacy)
│   │   ├── SidebarNew.jsx         # Updated sidebar with role-based nav
│   │   │
│   │   ├── Auth/                  # Authentication components
│   │   │   ├── ForgotPassword.jsx # Password reset flow
│   │   │   ├── SignIn.jsx         # Login form with role detection
│   │   │   ├── SignUp.jsx         # User registration
│   │   │
│   │   ├── Layout/                # Layout components for different roles
│   │   │   ├── SuperAdminLayout.jsx # SA sidebar navigation items
│   │   │   └── VendorLayout.jsx   # Vendor sidebar navigation items
│   │   │
│   │   └── orders/                # Order-related components
│   │       └── OrdersDetails.jsx  # Order details modal/table
│   │
│   ├── Contexts/                  # React Context providers
│   │   ├── AuthContext.jsx        # User auth state (login, logout, role)
│   │   ├── DataContext.jsx        # Role-filtered data (orders, customers)
│   │   └── HeaderContext.jsx      # UI state (selected page, theme)
│   │
│   └── screens/                   # Page/screen components
│       ├── Accounts.jsx           # Financial accounts management
│       ├── BuyGold.jsx            # Gold purchase recording
│       ├── Customer.jsx           # Customer management (CRUD)
│       ├── Dashboard.jsx          # Original dashboard (legacy)
│       ├── Delivered.jsx          # Delivery tracking
│       ├── DeliveryManagement.jsx # Delivery operations
│       ├── GoldPriceDashboard.jsx # Live gold price widget
│       ├── Kyc.jsx                # KYC status viewing
│       ├── LockScreen.jsx         # Auto-lock after inactivity
│       ├── Notifications.jsx      # Notification center
│       ├── Orders.jsx             # Order management
│       ├── OrdersDetails.jsx      # Order details view
│       ├── Profile.jsx            # User profile settings
│       ├── PurchaseManagement.jsx # Purchase order management
│       ├── Reports.jsx            # General reports
│       ├── Sales.jsx              # Sales management
│       ├── Settings.jsx           # Application settings
│       ├── Transactions.jsx       # Transaction history
│       ├── Vendors.jsx            # Vendor management (SA only)
│       │
│       ├── Product/               # Product management screens
│       │   ├── AddProduct.jsx     # Add new products
│       │   ├── BuyGold.jsx        # Gold purchase (duplicate?)
│       │   ├── Inventory.jsx      # Stock management
│       │   ├── ProductList.jsx    # Product catalog
│       │   └── SellGold.jsx       # Gold sales recording
│       │
│       ├── superadmin/            # SuperAdmin-only screens
│       │   ├── AllCustomers.jsx   # All customers across vendors
│       │   ├── AllOrders.jsx      # All orders across vendors
│       │   ├── Dashboard.jsx      # Platform overview dashboard
│       │   ├── KycApprovals.jsx   # KYC approval workflow
│       │   ├── Reports.jsx        # Platform analytics
│       │   └── Vendors.jsx        # Vendor CRUD operations
│       │
│       └── vendor/                # Vendor-only screens
│           └── Dashboard.jsx      # Vendor-specific dashboard
│
└── dist/                          # Built production files (generated)
```

---

## Tab 6 — Context Usage

### 🔐 useAuth() - Authentication & User Management

#### What You Get:
```javascript
const {
  user,           // object: Full user data (id, role, name, email, kycStatus, etc.)
  isSuperAdmin,   // boolean: user.role === "superadmin"
  isVendor,       // boolean: user.role === "vendor"
  token,          // string: JWT token for API calls
  isLocked,       // boolean: True after 5 min inactivity
  login,          // function: (userData, token) => saves to localStorage + state
  logout,         // function: () => clears token + user, redirects to /signin
  loading         // boolean: True while checking stored auth on app load
} = useAuth();
```

#### Code Pattern - Copy into ANY screen component:
```javascript
// At the top of ANY screen component:
import { useAuth } from '../../contexts/AuthContext';

const MyComponent = () => {
  const { user, isSuperAdmin, isVendor } = useAuth();

  // Role-based conditional rendering:
  {isSuperAdmin && <SuperAdminOnlyComponent />}
  {isVendor && <VendorOnlyComponent />}

  // Access user data:
  const userName = user?.name;
  const userRole = user?.role;
  const kycStatus = user?.kycStatus;

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      {userRole === 'superadmin' && <AdminPanel />}
    </div>
  );
};
```

### 📊 useData() - Role-Filtered Data Access

#### What You Get:
```javascript
const {
  // Raw data arrays (SuperAdmin sees all, Vendor sees filtered):
  orders,         // array: All orders (SA) or vendor's orders (Vendor)
  customers,      // array: All customers (SA) or vendor's customers (Vendor)
  products,       // array: All products (SA) or vendor's products (Vendor)
  vendors,        // array: All vendors (SA only)
  notifications,  // array: Filtered notifications
  goldRate,       // object: { "24K": 7050, "22K": 6460, "18K": 5290, silver: 87 }

  // Helper functions (automatically filter by vendorId):
  getVendorOrders,      // (vendorId) => filtered orders array
  getVendorCustomers,   // (vendorId) => filtered customers array
  getVendorProducts,    // (vendorId) => filtered products array
  getVendorTransactions,// (vendorId) => filtered transactions array

  // CRUD operations (automatically add vendorId for vendors):
  addOrder,       // (orderData) => creates order with vendorId
  updateOrder,    // (id, orderData) => updates order
  deleteOrder,    // (id) => deletes order
  addCustomer,    // (customerData) => creates customer with vendorId
  updateCustomer, // (id, customerData) => updates customer
  deleteCustomer, // (id) => deletes customer
  addProduct,     // (productData) => creates product with vendorId
  updateProduct,  // (id, productData) => updates product
  deleteProduct,  // (id) => deletes product
  addTransaction, // (transactionData) => creates transaction with vendorId

  // SuperAdmin-only operations:
  addVendor,      // (vendorData) => creates new vendor
  updateVendor,   // (id, vendorData) => updates vendor
  deleteVendor,   // (id) => deletes vendor
  updateKycStatus,// (vendorId, status, notes) => updates KYC status

  loading         // boolean: True while fetching data
} = useData();
```

#### Code Pattern - Copy into ANY screen component:
```javascript
// At the top of ANY screen component:
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const MyComponent = () => {
  const { user, isSuperAdmin, isVendor } = useAuth();
  const { orders, customers, getVendorOrders, addOrder } = useData();

  // SuperAdmin: Use data directly (no filtering needed)
  const allOrders = orders;
  const allCustomers = customers;

  // Vendor: Get only own data
  const myOrders = getVendorOrders(user.id);
  const myCustomers = getVendorCustomers(user.id);

  // When vendor creates data, vendorId is added automatically:
  const handleCreateOrder = async (orderData) => {
    await addOrder({
      ...orderData,
      vendorId: user.id  // This gets added automatically by context
    });
  };

  // When vendor creates customer, vendorId is added automatically:
  const handleCreateCustomer = async (customerData) => {
    await addCustomer({
      ...customerData,
      vendorId: user.id  // This gets added automatically by context
    });
  };

  return (
    <div>
      {isSuperAdmin && (
        <div>
          <h2>All Orders: {allOrders.length}</h2>
          <h2>All Customers: {allCustomers.length}</h2>
        </div>
      )}

      {isVendor && (
        <div>
          <h2>My Orders: {myOrders.length}</h2>
          <h2>My Customers: {myCustomers.length}</h2>
        </div>
      )}
    </div>
  );
};
```

### 🔄 Combined Usage Pattern:
```javascript
// Standard pattern for ALL screen components:
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

const MyScreen = () => {
  const { user, isSuperAdmin, isVendor } = useAuth();
  const {
    orders, customers, products,
    getVendorOrders, getVendorCustomers,
    addOrder, updateOrder, deleteOrder
  } = useData();

  // Data access based on role:
  const displayOrders = isSuperAdmin ? orders : getVendorOrders(user.id);
  const displayCustomers = isSuperAdmin ? customers : getVendorCustomers(user.id);

  return (
    <div>
      <h1>{isSuperAdmin ? 'Platform' : 'My'} Dashboard</h1>

      {/* Role-specific content */}
      {isSuperAdmin && <SuperAdminFeatures />}
      {isVendor && <VendorFeatures />}

      {/* Shared content with role-filtered data */}
      <OrdersList orders={displayOrders} />
      <CustomersList customers={displayCustomers} />
    </div>
  );
};
```

---

## 📝 Additional Notes

### API Base URL
All API calls use: `http://161.248.62.37:7527/api/v1/auth`
- Set in `.env` as `VITE_API_URL=http://161.248.62.37:7527/api/v1/auth`
- `apiFetch("/login")` becomes `http://161.248.62.37:7527/api/v1/auth/login`

### Route Protection
- `/superadmin/*` routes require `role === "superadmin"`
- `/vendor/*` routes require `role === "vendor"`
- Wrong role access → automatic redirect to appropriate dashboard

### Data Security
- All vendor data queries automatically filtered by `vendorId === user.id`
- SuperAdmin sees unfiltered data
- No cross-vendor data leakage possible

### Session Management
- 5-minute inactivity timeout → LockScreen
- Session persists across browser refreshes
- Secure logout clears all stored data</content>
<parameter name="filePath">d:\project\Erp\DgiGold\frontend\DGI-GOLD-ERP\DGI_ERP_Complete_Documentation.md