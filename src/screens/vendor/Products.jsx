import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useAuth } from '../../Contexts/AuthContext';
import { FaBox, FaPlus, FaEdit, FaTrash, FaEye, FaEyeOff } from 'react-icons/fa';

const VendorProducts = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('list');
    const [showProductModal, setShowProductModal] = useState(false);
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Gold 24K',
            category: 'Gold',
            purity: '24K',
            price: 6520,
            stock: 45,
            minStock: 10,
            description: 'Premium 24 Karat Gold',
            status: 'active',
        },
        {
            id: 2,
            name: 'Gold 22K',
            category: 'Gold',
            purity: '22K',
            price: 6200,
            stock: 62,
            minStock: 15,
            description: 'Standard 22 Karat Gold',
            status: 'active',
        },
        {
            id: 3,
            name: 'Silver 999',
            category: 'Silver',
            purity: '999',
            price: 78,
            stock: 5,
            minStock: 20,
            description: 'Pure Silver 999',
            status: 'low_stock',
        },
    ]);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Gold',
        purity: '',
        price: '',
        stock: '',
        minStock: '',
        description: '',
    });

    const [editingProduct, setEditingProduct] = useState(null);

    const categories = ['Gold', 'Silver', 'Platinum', 'Copper', 'Ornaments'];
    const purities = {
        Gold: ['24K', '22K', '18K', '14K', '10K'],
        Silver: ['999', '950', '925', '900'],
        Platinum: ['950', '900'],
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            alert('Please fill all required fields');
            return;
        }

        const product = {
            id: products.length + 1,
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock),
            minStock: parseInt(newProduct.minStock) || 10,
            status: parseInt(newProduct.stock) < parseInt(newProduct.minStock) ? 'low_stock' : 'active',
        };

        setProducts([...products, product]);
        setNewProduct({
            name: '',
            category: 'Gold',
            purity: '',
            price: '',
            stock: '',
            minStock: '',
            description: '',
        });
        setShowProductModal(false);
        alert('Product added successfully!');
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const updateProductStock = (id, newStock) => {
        setProducts(
            products.map(p =>
                p.id === id
                    ? {
                        ...p,
                        stock: newStock,
                        status: newStock < p.minStock ? 'low_stock' : 'active',
                    }
                    : p
            )
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'text-green-700 bg-green-100';
            case 'low_stock':
                return 'text-red-700 bg-red-100';
            case 'inactive':
                return 'text-gray-700 bg-gray-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'low_stock':
                return 'Low Stock';
            case 'inactive':
                return 'Inactive';
            default:
                return status;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaBox className="text-blue-600" /> Product Management
                                </h1>
                                <p className="text-gray-600 mt-2">Manage your commodity inventory and pricing</p>
                            </div>
                            <button
                                onClick={() => setShowProductModal(true)}
                                className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
                            >
                                <FaPlus /> Add Product
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <StatCard
                                title="Total Products"
                                value={products.length.toString()}
                                icon="📦"
                                color="bg-blue-50"
                            />
                            <StatCard
                                title="Active"
                                value={products.filter(p => p.status === 'active').length.toString()}
                                icon="✅"
                                color="bg-green-50"
                            />
                            <StatCard
                                title="Low Stock"
                                value={products.filter(p => p.status === 'low_stock').length.toString()}
                                icon="⚠️"
                                color="bg-red-50"
                            />
                            <StatCard
                                title="Total Value"
                                value={`₹${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString('en-IN')}`}
                                icon="💰"
                                color="bg-purple-50"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-lg card-shadow mb-8">
                            <div className="border-b border-gray-200 flex">
                                {['list', 'categories', 'reports'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 font-medium text-center transition ${activeTab === tab
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            <div className="p-6">
                                {activeTab === 'list' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {products.map((product) => (
                                                    <tr key={product.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{product.name}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-600">{product.category}</td>
                                                        <td className="px-4 py-2 text-sm text-gray-900 font-medium">₹{product.price}</td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="number"
                                                                    value={product.stock}
                                                                    onChange={(e) => updateProductStock(product.id, parseInt(e.target.value))}
                                                                    className="w-16 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    min="0"
                                                                />
                                                                <span className="text-xs text-gray-500">(min: {product.minStock})</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                                                                {getStatusText(product.status)}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-sm">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => alert(`Edit ${product.name}`)}
                                                                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition"
                                                                >
                                                                    <FaEdit size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteProduct(product.id)}
                                                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'categories' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categories.map((cat) => {
                                            const catProducts = products.filter(p => p.category === cat);
                                            const totalValue = catProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
                                            return (
                                                <div key={cat} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                                    <h4 className="font-semibold text-gray-800 mb-3">{cat}</h4>
                                                    <div className="space-y-2 text-sm text-gray-600">
                                                        <p>Products: <span className="font-medium text-gray-900">{catProducts.length}</span></p>
                                                        <p>Total Stock: <span className="font-medium text-gray-900">
                                                            {catProducts.reduce((sum, p) => sum + p.stock, 0)} units
                                                        </span></p>
                                                        <p>Total Value: <span className="font-medium text-gray-900">
                                                            ₹{totalValue.toLocaleString('en-IN')}
                                                        </span></p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {activeTab === 'reports' && (
                                    <div className="space-y-6">
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-yellow-900 mb-3">Low Stock Alert</h4>
                                            <ul className="space-y-2">
                                                {products
                                                    .filter(p => p.stock < p.minStock)
                                                    .map(p => (
                                                        <li key={p.id} className="text-sm text-yellow-800">
                                                            {p.name}: {p.stock}/{p.minStock} units (Need {p.minStock - p.stock} more)
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-blue-900 mb-3">Inventory Report</h4>
                                            <div className="text-sm text-blue-800">
                                                <p>Total Products: {products.length}</p>
                                                <p>Total Stock Value: ₹{products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString('en-IN')}</p>
                                                <p>Average Stock Level: {(products.reduce((sum, p) => sum + p.stock, 0) / products.length).toFixed(1)} units</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Product Modal */}
            {showProductModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Product</h3>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g., Gold 24K"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, purity: '' })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Purity</label>
                                    <select
                                        value={newProduct.purity}
                                        onChange={(e) => setNewProduct({ ...newProduct, purity: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Purity</option>
                                        {purities[newProduct.category]?.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock (units) *</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        placeholder="0"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
                                    <input
                                        type="number"
                                        value={newProduct.minStock}
                                        onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })}
                                        placeholder="10"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="Product description"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowProductModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddProduct}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`${color} rounded-lg p-6 border border-gray-200`}>
        <div className="flex justify-between items-center">
            <div>
                <p className="text-gray-600 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
            </div>
            <span className="text-3xl">{icon}</span>
        </div>
    </div>
);

export default VendorProducts;
