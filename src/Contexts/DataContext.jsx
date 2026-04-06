import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

// Dummy data for offline development
const dummyProducts = [
    {
        id: 'prod-1',
        name: '24K Gold Coin',
        category: 'gold',
        purity: '24K',
        weight: 10,
        price: 65200,
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
        vendorId: 'v-001',
        productId: 'prod-1',
        quantity: 2,
        totalPrice: 130400,
        status: 'Delivered',
        orderDate: '2024-01-15T10:30:00Z',
        deliveryAddress: '123 Main St, Mumbai, MH 400001'
    },
    {
        id: 'ord-2',
        customerId: 'cust-2',
        vendorId: 'v-001',
        productId: 'prod-2',
        quantity: 1,
        totalPrice: 162500,
        status: 'Processing',
        orderDate: '2024-01-20T14:45:00Z',
        deliveryAddress: '456 Park Ave, Delhi, DL 110001'
    },
    {
        id: 'ord-3',
        customerId: 'cust-3',
        vendorId: 'v-001',
        productId: 'prod-3',
        quantity: 5,
        totalPrice: 440000,
        status: 'Shipped',
        orderDate: '2024-01-25T09:15:00Z',
        deliveryAddress: '789 Market Rd, Bangalore, KA 560001'
    }
];

const dummyMetalPrices = {
    gold: {
        '24K': 65200,
        '22K': 62000,
        '18K': 54000
    },
    silver: 88000,
    lastUpdated: new Date().toISOString()
};

const dummyCustomers = [
    {
        id: 'cust-1',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91-9876543210',
        totalOrders: 5,
        totalSpent: 450000
    },
    {
        id: 'cust-2',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91-9876543211',
        totalOrders: 3,
        totalSpent: 280000
    },
    {
        id: 'cust-3',
        name: 'Amit Singh',
        email: 'amit@example.com',
        phone: '+91-9876543212',
        totalOrders: 8,
        totalSpent: 720000
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
        totalOrders: 15
    }
];

const dummyNotifications = [
    {
        id: 'notif-1',
        title: 'New Order Received',
        message: 'You have received a new order for 24K Gold Coin',
        type: 'order',
        read: false,
        createdAt: '2024-01-25T10:00:00Z'
    },
    {
        id: 'notif-2',
        title: 'Payment Confirmed',
        message: 'Payment of ₹1,62,500 has been confirmed',
        type: 'payment',
        read: true,
        createdAt: '2024-01-24T15:30:00Z'
    },
    {
        id: 'notif-3',
        title: 'Low Stock Alert',
        message: 'Silver Bar 1kg is running low on stock',
        type: 'alert',
        read: false,
        createdAt: '2024-01-23T12:00:00Z'
    }
];

export const DataProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState(dummyVendors);
    const [holdings, setHoldings] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [metalPrices, setMetalPrices] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Orders - using dummy data
    const fetchOrders = useCallback(async () => {
        try {
            setError(null);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setOrders(dummyOrders);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    // Fetch Products - using dummy data
    const fetchProducts = useCallback(async () => {
        try {
            setError(null);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            setProducts(dummyProducts);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    // Fetch Holdings - using dummy data
    const fetchHoldings = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setError(null);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 400));
            setHoldings([
                {
                    id: 'hold-1',
                    metal: 'gold',
                    quantity: 50,
                    purity: '24K',
                    value: 3260000
                },
                {
                    id: 'hold-2',
                    metal: 'silver',
                    quantity: 200,
                    purity: '999',
                    value: 1760000
                }
            ]);
        } catch (err) {
            setError(err.message);
        }
    }, [isAuthenticated]);

    // Fetch Addresses - using dummy data
    const fetchAddresses = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setError(null);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            setAddresses([
                {
                    id: 'addr-1',
                    type: 'home',
                    name: 'Home Address',
                    street: '123 Main Street',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    zipCode: '400001',
                    country: 'India'
                }
            ]);
        } catch (err) {
            setError(err.message);
        }
    }, [isAuthenticated]);

    // Fetch Shipments - using dummy data
    const fetchShipments = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            setError(null);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 400));
            setShipments([
                {
                    id: 'ship-1',
                    orderId: 'ord-1',
                    trackingNumber: 'TRK123456789',
                    status: 'Delivered',
                    carrier: 'DTDC',
                    estimatedDelivery: '2024-01-18T10:00:00Z'
                }
            ]);
        } catch (err) {
            setError(err.message);
        }
    }, [isAuthenticated]);

    // Fetch Metal Prices - using dummy data
    const fetchMetalPrices = useCallback(async () => {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 200));
            setMetalPrices(dummyMetalPrices);
        } catch (err) {
            console.error('Metal prices error:', err);
        }
    }, []);

    // Load all data on mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchProducts(),
                    fetchMetalPrices(),
                ]);
                if (isAuthenticated) {
                    await Promise.all([
                        fetchOrders(),
                        fetchHoldings(),
                        fetchAddresses(),
                        fetchShipments(),
                    ]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isAuthenticated, fetchProducts, fetchOrders, fetchHoldings, fetchAddresses, fetchShipments, fetchMetalPrices]);

    // Refresh data when authentication changes
    useEffect(() => {
        if (isAuthenticated) {
            fetchHoldings();
            fetchAddresses();
            fetchShipments();
        }
    }, [isAuthenticated, fetchHoldings, fetchAddresses, fetchShipments]);

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
        notifications: dummyNotifications,

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
        }
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