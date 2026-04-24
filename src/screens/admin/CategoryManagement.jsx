import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { FaList, FaPlus, FaEdit, FaTrash, FaSpinner, FaSearch, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiService from '../service/apiService';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        isActive: true,
    });

    // 🔄 Load categories on mount
    useEffect(() => {
        fetchCategories();
    }, [page]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            console.log(`🔄 Fetching categories - Page ${page}...`);

            // ✅ GET /categories?page=1&limit=20
            const result = await apiService.categories.getAll({
                page: page,
                limit: 20,
                sortBy: 'name',
                sortOrder: 'asc'
            });

            console.log('📦 Categories Response:', result);

            if (result.success) {
                const catData = result.data?.data || result.data;
                const catList = Array.isArray(catData) ? catData : catData?.categories || [];
                setCategories(catList);
                setFilteredCategories(catList);
                setTotalPages(catData?.totalPages || 1);
                console.log('✅ Categories loaded:', catList.length);
            } else {
                toast.error('Failed to load categories');
            }
        } catch (error) {
            console.error('🔴 Error fetching categories:', error);
            toast.error('Error loading categories');
        } finally {
            setLoading(false);
        }
    };

    // Filter categories based on search
    useEffect(() => {
        const filtered = categories.filter(cat =>
            cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    // ✅ Create category (POST /categories)
    const handleCreateCategory = async () => {
        if (!formData.name || !formData.slug) {
            toast.error('Name and slug are required');
            return;
        }

        try {
            setActionLoading(true);
            console.log('📤 Creating category:', formData);

            const result = await apiService.categories.create(formData);
            console.log('📍 Create Response:', result);

            if (result.success) {
                toast.success('✅ Category created successfully');
                setFormData({ name: '', slug: '', description: '', isActive: true });
                setShowModal(false);
                fetchCategories();
            } else {
                toast.error(result.error || 'Failed to create category');
            }
        } catch (error) {
            console.error('🔴 Error creating category:', error);
            toast.error('Error creating category');
        } finally {
            setActionLoading(false);
        }
    };

    // ✅ Update category (PUT /categories/{id})
    const handleUpdateCategory = async () => {
        if (!formData.name || !formData.slug) {
            toast.error('Name and slug are required');
            return;
        }

        try {
            setActionLoading(true);
            console.log('📤 Updating category:', editingCategory.id, formData);

            const result = await apiService.categories.update(editingCategory.id, formData);
            console.log('📍 Update Response:', result);

            if (result.success) {
                toast.success('✅ Category updated successfully');
                setFormData({ name: '', slug: '', description: '', isActive: true });
                setShowModal(false);
                setEditingCategory(null);
                fetchCategories();
            } else {
                toast.error(result.error || 'Failed to update category');
            }
        } catch (error) {
            console.error('🔴 Error updating category:', error);
            toast.error('Error updating category');
        } finally {
            setActionLoading(false);
        }
    };

    // ✅ Delete category (DELETE /categories/{id})
    const handleDeleteCategory = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) {
            return;
        }

        try {
            setActionLoading(true);
            console.log('🗑️ Deleting category:', categoryId);

            const result = await apiService.categories.delete(categoryId);
            console.log('📍 Delete Response:', result);

            if (result.success) {
                toast.success('✅ Category deleted successfully');
                fetchCategories();
            } else {
                toast.error(result.error || 'Failed to delete category');
            }
        } catch (error) {
            console.error('🔴 Error deleting category:', error);
            toast.error('Error deleting category');
        } finally {
            setActionLoading(false);
        }
    };

    // ✅ Get active public categories (GET /categories/public/active)
    const handleFetchActiveCategories = async () => {
        try {
            setLoading(true);
            console.log('🔄 Fetching active categories...');

            const result = await apiService.categories.getActivePublic();
            console.log('📦 Active Categories Response:', result);

            if (result.success) {
                const catData = result.data?.data || result.data;
                const catList = Array.isArray(catData) ? catData : catData?.categories || [];
                setCategories(catList);
                setFilteredCategories(catList);
                toast.success('✅ Active categories loaded');
            }
        } catch (error) {
            console.error('🔴 Error fetching active categories:', error);
            toast.error('Error loading active categories');
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', slug: '', description: '', isActive: true });
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name || '',
            slug: category.slug || '',
            description: category.description || '',
            isActive: category.isActive !== false,
        });
        setShowModal(true);
    };

    if (loading && categories.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 ml-[290px]">
                    <Header />
                    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                        <div className="text-center">
                            <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600">Loading categories...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-[290px] overflow-x-hidden">
                <Header />
                <div className="p-4 sm:p-6 lg:p-8 bg-[#f8f4f0] min-h-[calc(100vh-80px)] overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaList className="text-blue-600" /> Product Categories
                                </h1>
                                <p className="text-gray-600 mt-2">Manage product categories and classification</p>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
                            >
                                <FaPlus /> Add Category
                            </button>
                        </div>

                        {/* Search and Filter */}
                        <div className="bg-white rounded-lg card-shadow p-4 mb-6">
                            <div className="flex gap-4">
                                <div className="flex-1 relative">
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    onClick={handleFetchActiveCategories}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Show Active Only
                                </button>
                            </div>
                        </div>

                        {/* Categories Grid */}
                        <div className="bg-white rounded-lg card-shadow overflow-hidden">
                            {filteredCategories.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <FaList className="text-4xl mx-auto mb-4 opacity-30" />
                                    <p>No categories found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {filteredCategories.map((category) => (
                                                    <tr key={category.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <span className="font-medium text-gray-800">{category.name}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
                                                                {category.slug}
                                                            </code>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                            {category.description || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${category.isActive
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {category.isActive ? '✓ Active' : '✗ Inactive'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => openEditModal(category)}
                                                                    disabled={actionLoading}
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition disabled:opacity-50"
                                                                    title="Edit"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCategory(category.id)}
                                                                    disabled={actionLoading}
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                                        <p className="text-sm text-gray-600">
                                            Page {page} of {totalPages}
                                        </p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setPage(Math.max(1, page - 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                                            >
                                                ← Previous
                                            </button>
                                            <button
                                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                                            >
                                                Next →
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {editingCategory ? '✏️ Edit Category' : '➕ Add New Category'}
                        </h3>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            editingCategory ? handleUpdateCategory() : handleCreateCategory();
                        }} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Gold Bullion"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., gold-bullion"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Category description..."
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                    Active Category
                                </label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <FaTimes className="inline mr-2" /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave /> Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
