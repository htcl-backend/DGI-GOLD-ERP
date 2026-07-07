import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../screens/service/apiService';

const DataContext = createContext();

// Dummy data for offline development
const dummyProducts = [
    {
        id: 'prod-1',
        name: '24K Gold Coin',
        category: 'gold',
        purity: '2K',
        weight: 10,
        price: 200,
        description: 'Pure 24K gold coin',
        image: '/assets/images/products/gold-coin.jpg',
        stock: 50,
        vendorId: 'v-001'
    },
    {
        id: 'prod-2',
        name: '22K Gold Chain',
        category: 'gold',
        purity: '22K',
        weight: 25,
        price: 162500,
        description: 'Elegant 22K gold chain',
        image: '/assets/images/products/gold-chain.jpg',
        stock: 30,
        vendorId: 'v-001'
    },
    {
        id: 'prod-3',
        name: 'Silver Bar 1kg',
        category: 'silver',
        purity: '999',
        weight: 1000,
        price: 88000,
        description: 'Pure silver bar',
        image: '/assets/images/products/silver-bar.jpg',
        stock: 100,
        vendorId: 'v-001'
    }
];

const dummyOrders = [
    {
        id: 'ord-1',
        customerId: 'cust-1',
        customerName: 'Rajesh Kumar',
        vendorId: 'v-001',
        productId: 'prod-1',
        quantity: 2,
        totalPrice: 130400,
        totalAmount: 130400,
        status: 'Delivered',
        type: 'buy',
        orderDate: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        deliveryAddress: '123 Main St, Mumbai, MH 400001'
    },
    {
        id: 'ord-2',
        customerId: 'cust-2',
        customerName: 'Priya Sharma',
        vendorId: 'v-001',
        productId: 'prod-2',
        quantity: 1,
        totalPrice: 162500,
        totalAmount: 162500,
        status: 'Processing',
        type: 'buy',
        orderDate: '2024-01-20T14:45:00Z',
        createdAt: '2024-01-20T14:45:00Z',
        deliveryAddress: '456 Park Ave, Delhi, DL 110001'
    },
    {
        id: 'ord-3',
        customerId: 'cust-3',
        customerName: 'Amit Singh',
        vendorId: 'v-001',
        productId: 'prod-3',
        quantity: 5,
        totalPrice: 440000,
        totalAmount: 440000,
        status: 'Shipped',
        type: 'sell',
        orderDate: '2024-01-25T09:15:00Z',
        createdAt: '2024-01-25T09:15:00Z',
        deliveryAddress: '789 Market Rd, Bangalore, KA 560001'
    }
];

const dummyMetalPrices = {
    gold: {
        '24K': 65200,

    },
    silver: 88000,
    Updates: new Date().toISOString()
};

const dummyCustomers = [
    {
        id: 'cust-1',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91-9876543210',
        vendorId: 'v-001',
        totalOrders: 5,
        totalSpent: 450000,
        kycStatus: 'verified',
        lastOrder: '2024-01-15'
    },
    {
        id: 'cust-2',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91-9876543211',
        vendorId: 'v-001',
        totalOrders: 3,
        totalSpent: 280000,
        kycStatus: 'pending',
        lastOrder: '2024-01-20'
    },
    {
        id: 'cust-3',
        name: 'Amit Singh',
        email: 'amit@example.com',
        phone: '+91-9876543212',
        vendorId: 'v-001',
        totalOrders: 8,
        totalSpent: 720000,
        kycStatus: 'verified',
        lastOrder: '2024-01-25'
    }
];

const dummyVendors = [
    {
        id: 'v-001',
        name: 'Ramesh Jewellers',
        email: 'vendor@dgi.com',
        businessName: 'Ramesh Jewellers Pvt Ltd',
        gstin: '27AABCU9603R1ZX',
        kycStatus: 'verified',
        totalRevenue: 1250000,
        totalOrders: 15,
        bankDetails: {
            accountName: 'Ramesh Jewellers Pvt Ltd',
            ifsc: '12345678901'
        },
        documents: ['PAN', 'GST', 'BANK'],
        createdAt: '2024-01-01T10:00:00Z',
        rejectionReason: null
    },
    {
        id: 'v-002',
        name: 'Gold Traders Inc',
        email: 'traders@dgi.com',
        businessName: 'Gold Traders Inc',
        gstin: '27CCCCT5678R1ZX',
        kycStatus: 'pending',
        totalRevenue: 450000,
        totalOrders: 8,
        bankDetails: {
            accountName: 'Gold Traders Inc',
            ifsc: '98765432101'
        },
        documents: ['PAN', 'GST'],
        createdAt: '2024-01-10T14:30:00Z',
        rejectionReason: null
    }
];

const dummyNotifications = {
    vendor: [
        {
            id: 'notif-v-1',
            title: 'New Order Received',
            message: 'You have received a new order for 24K Gold Coin from Rajesh Kumar',
            type: 'order',
            read: false,
            createdAt: '2024-01-25T10:00:00Z',
            role: 'vendor'
        },
        {
            id: 'notif-v-2',
            title: 'Payment Confirmed',
            message: 'Payment of ₹1,62,500 has been confirmed for order #ORD-2024-005',
            type: 'payment',
            read: true,
            createdAt: '2024-01-24T15:30:00Z',
            role: 'vendor'
        },
        {
            id: 'notif-v-3',
            title: 'Low Stock Alert',
            message: 'Silver Bar 1kg is running low on stock. Current: 15 units',
            type: 'stock',
            read: false,
            createdAt: '2024-01-23T12:00:00Z',
            role: 'vendor'
        },
        {
            id: 'notif-v-4',
            title: 'Shipment Dispatched',
            message: 'Order #ORD-2024-003 has been shipped. Tracking: TRK123456789',
            type: 'delivery',
            read: false,
            createdAt: '2024-01-22T08:45:00Z',
            role: 'vendor'
        }
    ],
    admin: [
        {
            id: 'notif-a-1',
            title: 'New KYC Submission',
            message: 'Vendor "Gold Traders Inc" has submitted KYC documents for verification',
            type: 'kyc',
            read: false,
            createdAt: '2024-01-25T11:20:00Z',
            role: 'admin'
        },
        {
            id: 'notif-a-2',
            title: 'System Alert',
            message: 'Database backup completed successfully at 01:00 AM',
            type: 'system',
            read: true,
            createdAt: '2024-01-25T01:00:00Z',
            role: 'admin'
        },
        {
            id: 'notif-a-3',
            title: 'Vendor Dashboard Report',
            message: 'Monthly revenue report for all vendors is ready for review',
            type: 'system',
            read: false,
            createdAt: '2024-01-24T18:30:00Z',
            role: 'admin'
        },
        {
            id: 'notif-a-4',
            title: 'Payment Issue Flagged',
            message: 'Payment failure detected for order #ORD-2024-010. Action required.',
            type: 'payment',
            read: false,
            createdAt: '2024-01-23T16:15:00Z',
            role: 'admin'
        }
    ]
};

export const DataProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState(dummyVendors);
    const [holdings, setHoldings] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [metalPrices, setMetalPrices] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get role-specific notifications
    const getNotificationsByRole = useCallback(() => {
        if (!user) return [];

        const userRole = user.role?.toLowerCase() === 'vendor' ? 'vendor' : 'admin';
        return dummyNotifications[userRole] || [];
    }, [user]);

    const extractArrayFromResponse = (response, visited = new Set()) => {
        if (Array.isArray(response)) return response;
        if (!response || typeof response !== 'object') return [];
        if (visited.has(response)) return [];
        visited.add(response);

        const candidateKeys = ['orders', 'items', 'data', 'results', 'payload', 'rows', 'products', 'customers'];

        for (const key of candidateKeys) {
            const value = response[key];
            if (Array.isArray(value)) return value;
        }

        for (const key of Object.keys(response)) {
            const value = response[key];
            if (Array.isArray(value)) return value;
        }

        for (const key of Object.keys(response)) {
            const nested = response[key];
            if (nested && typeof nested === 'object') {
                const nestedArray = extractArrayFromResponse(nested, visited);
                if (nestedArray.length) return nestedArray;
            }
        }

        return [];
    };

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        if (!isAuthenticated) {
            setOrders([]);
            return;
        }
        try {
            setError(null);
            console.log("🔄 Fetching orders from API...");

            const result = await apiService.vendor.orders.getAll({ page: 1, limit: 100 });
            console.log('🔎 Orders API response:', result);

            if (result.success && result.data) {
                let apiOrders = extractArrayFromResponse(result.data);

                if (Array.isArray(apiOrders)) {
                    setOrders(apiOrders);
                    console.log(`✅ Fetched ${apiOrders.length} orders.`);
                } else {
                    console.warn("⚠️ Orders data from API is not an array or could not be resolved:", result.data);
                    setOrders([]);
                }
            } else {
                throw new Error(result.error || 'Failed to fetch orders');
            }
        } catch (err) {
            setError(err.message);
            console.error("🔴 Error fetching orders:", err);
            setOrders([]);
        }
    }, [isAuthenticated, user]);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
        if (!isAuthenticated) {
            setProducts([]);
            return;
        }
        try {
            setError(null);
            console.log("🔄 Fetching products from API...");

            const result = await apiService.products.getAll({ page: 1, limit: 100, status: 'ACTIVE' });
            console.log('🔎 Products API response:', result);

            if (result.success && result.data) {
                let apiProducts = extractArrayFromResponse(result.data);

                if (Array.isArray(apiProducts)) {
                    setProducts(apiProducts);
                    console.log(`✅ Fetched ${apiProducts.length} products.`);
                } else {
                    console.warn("⚠️ Products data from API is not an array:", apiProducts);
                    setProducts([]);
                }
            } else {
                throw new Error(result.error || 'Failed to fetch products');
            }
        } catch (err) {
            setError(err.message);
            console.error("🔴 Error fetching products:", err);
            setProducts([]);
        }
    }, [isAuthenticated, user]);

    const isVendorUser = user?.role?.toLowerCase()?.includes('vendor');

    // Fetch Holdings
    const fetchHoldings = useCallback(async () => {
        if (!isAuthenticated || isVendorUser) {
            setHoldings([]);
            return;
        }
        try {
            setError(null);
            const result = await apiService.holdings.getAll();
            if (result.success && result.data) {
                const holdingsData = extractArrayFromResponse(result.data);
                setHoldings(Array.isArray(holdingsData) ? holdingsData : []);
            } else {
                throw new Error(result.error || 'Failed to load holdings');
            }
        } catch (err) {
            setError(err.message);
            console.error('🔴 Error fetching holdings:', err);
            setHoldings([]);
        }
    }, [isAuthenticated, isVendorUser]);

    // Fetch Addresses
    const fetchAddresses = useCallback(async () => {
        if (!isAuthenticated || isVendorUser) {
            setAddresses([]);
            return;
        }
        try {
            setError(null);
            const result = await apiService.delivery.addresses.getAll();
            if (result.success && result.data) {
                const addressesData = extractArrayFromResponse(result.data);
                setAddresses(Array.isArray(addressesData) ? addressesData : []);
            } else {
                throw new Error(result.error || 'Failed to load addresses');
            }
        } catch (err) {
            setError(err.message);
            console.error('🔴 Error fetching addresses:', err);
            setAddresses([]);
        }
    }, [isAuthenticated, isVendorUser]);

    // Fetch Shipments
    const fetchShipments = useCallback(async () => {
        if (!isAuthenticated || isVendorUser) {
            setShipments([]);
            return;
        }
        try {
            setError(null);
            const result = await apiService.delivery.shipments.getAll();
            if (result.success && result.data) {
                const shipmentsData = extractArrayFromResponse(result.data);
                setShipments(Array.isArray(shipmentsData) ? shipmentsData : []);
            } else {
                throw new Error(result.error || 'Failed to load shipments');
            }
        } catch (err) {
            setError(err.message);
            console.error('🔴 Error fetching shipments:', err);
            setShipments([]);
        }
    }, [isAuthenticated, isVendorUser]);

    // Fetch Metal Prices
    const fetchMetalPrices = useCallback(async () => {
        try {
            setError(null);
            const result = await apiService.metals.getLivePrice();
            if (result.success && result.data) {
                setMetalPrices(result.data);
            } else {
                throw new Error(result.error || 'Failed to load metal prices');
            }
        } catch (err) {
            setError(err.message);
            console.error('🔴 Error fetching metal prices:', err);
            setMetalPrices({});
        }
    }, []);

    // Load all data on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            const tasks = [
                fetchProducts(),
                fetchOrders(),
                fetchMetalPrices(),
                fetchHoldings(),
            ];

            if (!isVendorUser) {
                tasks.push(fetchAddresses(), fetchShipments());
            }

            await Promise.allSettled(tasks);
            setLoading(false);
        };

        loadData();
    }, [isAuthenticated, user, isVendorUser, fetchProducts, fetchOrders, fetchHoldings, fetchAddresses, fetchShipments, fetchMetalPrices]);

    // Additional helper functions
    const getProductById = (id) => products.find(p => p.id === id);
    const getOrderById = (id) => orders.find(o => o.id === id);
    const getCustomerById = (id) => dummyCustomers.find(c => c.id === id);
    const getVendorById = (id) => dummyVendors.find(v => v.id === id);

    // Refresh functions
    const refreshOrders = () => fetchOrders();
    const refreshProducts = () => fetchProducts();
    const refreshHoldings = () => fetchHoldings();
    const refreshAddresses = () => fetchAddresses();
    const refreshShipments = () => fetchShipments();
    const refreshPrices = () => fetchMetalPrices();

    const updateVendor = (vendorId, updates) => {
        setVendors(prevVendors =>
            prevVendors.map(vendor => {
                if (vendor.id !== vendorId) return vendor;

                const existingDocuments = Array.isArray(vendor.documents) ? vendor.documents : [];
                const newDocuments = Array.isArray(updates.documents) ? updates.documents : [];

                return {
                    ...vendor,
                    ...updates,
                    documents: [...existingDocuments, ...newDocuments]
                };
            })
        );
    };

    const updateKycStatus = (vendorId, status, rejectionReason = '') => {
        setVendors(prevVendors =>
            prevVendors.map(vendor => {
                if (vendor.id !== vendorId) return vendor;
                return {
                    ...vendor,
                    kycStatus: status,
                    rejectionReason: status === 'rejected' ? rejectionReason : vendor.rejectionReason,
                };
            })
        );
    };

    const value = {
        // Data
        orders,
        products,
        allOrders: orders,
        allProducts: products,
        allCustomers: dummyCustomers,
        allVendors: vendors,
        holdings,
        addresses,
        shipments,
        metalPrices,
        customers: dummyCustomers,
        vendors,
        notifications: getNotificationsByRole(),

        // State
        loading,
        error,

        // Actions
        fetchOrders,
        fetchProducts,
        fetchHoldings,
        fetchAddresses,
        fetchShipments,
        fetchMetalPrices,
        updateVendor,
        updateKycStatus,

        // Helpers
        getProductById,
        getOrderById,
        getCustomerById,
        getVendorById,

        // Refresh functions
        refreshOrders,
        refreshProducts,
        refreshHoldings,
        refreshAddresses,
        refreshShipments,
        refreshPrices,

        // Refresh all data
        refreshData: () => {
            fetchProducts();
            fetchOrders();
            fetchHoldings();
            fetchAddresses();
            fetchShipments();
            fetchMetalPrices();
        },

        // Notifications
        getNotificationsByRole
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
};