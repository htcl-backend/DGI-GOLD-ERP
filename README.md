# DGI ERP System

A comprehensive Enterprise Resource Planning (ERP) system built with React, Vite, and Tailwind CSS for managing gold jewelry business operations.

## 🚀 Features

### Core Modules
- **Dashboard** - Real-time business insights with key metrics and charts
- **Orders Management** - Complete order lifecycle management
- **Customer Management** - Customer database with detailed profiles
- **Gold Trading** - Buy/Sell gold with detailed transaction tracking
- **Product Management** - Inventory, products, and stock management
- **Delivery Tracking** - Order delivery status and logistics
- **User Management** - User profiles and permissions
- **Notifications** - Real-time notifications system
- **Settings** - System configuration and profile management

### Dashboard Analytics
- **Cash Balance** - Current financial position
- **Total Revenue** - Revenue metrics and trends
- **Total Stock** - Inventory value and stock levels
- **Active Orders** - Current order status overview
- **Sales Orders by Status** - Pie chart visualization
- **Top Materials by Stock Value** - Bar chart analysis
- **Recent Orders** - Latest order activity

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM 7** - Client-side routing
- **React Icons** - Icon library
- **Context API** - State management

### Development Tools
- **ESLint** - Code linting
- **Vite Plugin React** - React integration
- **TypeScript Types** - Type definitions

## 📁 Project Structure

```
DGI/
├── frontend/
│   ├── public/
│   │   └── favicon files
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   ├── background/
│   │   │   │   ├── profiles/
│   │   │   │   ├── users/
│   │   │   │   └── logo.png
│   │   │   └── img/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── SignIn.jsx
│   │   │   │   ├── SignUp.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── orders/
│   │   │   │   └── OrdersDetails.jsx 
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── OverviewCard.jsx
│   │   │   ├── OverviewTable.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── ReportDetails.jsx
│   │   ├── Contexts/
│   │   │   └── HeaderContext.jsx
│   │   ├── screens/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrdersDetails.jsx
│   │   │   ├── Customer.jsx
│   │   │   ├── Delivered.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── UserStock.jsx
│   │   │   └── Product/
│   │   │       ├── AddProduct.jsx
│   │   │       ├── Inventory.jsx
│   │   │       ├── ProductList.jsx
│   │   │       ├── BuyGold.jsx
│   │   │       └── SellGold.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
└── backend/ (planned)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DGI/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📊 Dashboard Features

### Key Metrics Cards
- **Cash Balance** - Current financial position
- **Total Revenue** - Revenue tracking
- **Total Stock** - Inventory valuation
- **Active Orders** - Order management overview

### Charts & Visualizations
- **Sales Orders by Status** - Pie chart showing order status distribution
- **Top Materials by Stock Value** - Bar chart of material values
- **Recent Orders Table** - Latest order activities

### Data Tables
- Order Number, Customer, Material, Value, Status
- Real-time updates and filtering

## 🔐 Authentication

### User Roles
- **Admin** - Full system access
- **Manager** - Order and customer management
- **Staff** - Limited operational access

### Security Features
- Secure login/logout
- Password reset functionality
- Session management

## 📦 Modules Overview

### 1. Orders Management
- Create and manage customer orders
- Order status tracking (New, In Progress, Delivered, etc.)
- Order details and history
- Export functionality

### 2. Customer Management
- Customer database with complete profiles
- Contact information and GST details
- Order history per customer
- Customer analytics

### 3. Gold Trading
- **Buy Gold** - Purchase transactions with weight, purity, pricing
- **Sell Gold** - Sales transactions with delivery tracking
- Transaction history and reporting
- Price calculations and totals

### 4. Product Management
- Product catalog management
- Inventory tracking
- Stock level monitoring
- Product categories

### 5. Delivery Tracking
- Order delivery status
- Logistics management
- Delivery history
- Customer notifications

### 6. Notifications
- Real-time system notifications
- Order status updates
- Delivery alerts
- System maintenance notices

### 7. Settings
- User profile management
- System preferences
- Password updates
- Account settings

### 8. User Stock Management
- Personal stock allocation
- Stock value tracking
- Performance metrics
- Individual dashboards

## 🎨 UI/UX Design

### Design System
- **Colors**: Gold/Amber theme (#CC7B25, #EDCDA4)
- **Typography**: Lato font family
- **Components**: Reusable UI components
- **Responsive**: Mobile-first design

### Key UI Elements
- Fixed sidebar navigation
- Responsive dashboard cards
- Interactive charts and graphs
- Professional data tables
- Consistent button styles

## 🔧 Configuration

### Environment Variables
Create `.env` file in root directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=DGI ERP
```

### Tailwind Configuration
Custom CSS classes in `src/index.css`:
- `.sidebar-shadow` - Sidebar shadow effects
- `.header-shadow` - Header shadow effects
- `.card-shadow` - Card shadow effects

## 📈 API Integration (Planned)

### Backend Requirements
- RESTful API endpoints
- JWT authentication
- Database integration (MongoDB/PostgreSQL)
- Real-time notifications (WebSocket)

### Key API Endpoints
```
GET    /api/dashboard/metrics
GET    /api/orders
POST   /api/orders
GET    /api/customers
POST   /api/customers
GET    /api/gold-transactions
POST   /api/gold-transactions
GET    /api/notifications
PUT    /api/user/profile
```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- Component testing
- Integration testing
- E2E testing (planned)

## 🚀 Deployment

### Build Commands
```bash
npm run build
npm run preview
```

### Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated
- [ ] Assets optimized
- [ ] SSL certificates
- [ ] Domain configuration

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- Email: support@DGI.com
- Documentation: [Internal Wiki]
- Issues: [GitHub Issues]

## 🔄 Version History

### v1.0.0 (Current)
- Initial ERP system implementation
- Core modules: Dashboard, Orders, Customers, Gold Trading
- Basic UI/UX with Tailwind CSS
- Responsive design
- Authentication system

### Planned Features
- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced reporting
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics

---

**Built with ❤️ for DGI Gold Business**
