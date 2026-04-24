import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const ProductDetails = ({ product, onBack }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        material: product?.category || "gold",
        name: "",
        purity: "24K",
        stock: "",
        price: "",
        value: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        console.log("Product added:", formData);
        alert("Product added successfully!");

        setFormData({
            code: "",
            material: product?.category || "gold",
            name: "",
            purity: "24K",
            stock: "",
            price: "",
            value: "",
        });
        setShowAddForm(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full ml-[290px]">
                <Header />
                <div className="p-6 bg-gray-50 min-h-screen">
                    {/* Header with Back Button */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Product Details</h2>
                        <button
                            onClick={onBack}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                            ← Back to List
                        </button>
                    </div>

                    {/* Product Details Card */}
                    <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Product Name</p>
                                <p className="text-xl font-bold text-gray-900">{product?.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Product Code</p>
                                <p className="text-xl font-bold text-amber-600">{product?.code || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Purity</p>
                                <p className="text-xl font-bold text-gray-900">{product?.purity}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Material</p>
                                <p className="text-xl font-bold text-gray-900 capitalize">{product?.category}</p>
                            </div>
                        </div>

                        <hr className="my-6" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Stock Quantity</p>
                                <p className="text-2xl font-bold text-gray-900">{product?.stock} kg</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Price per gram</p>
                                <p className="text-2xl font-bold text-amber-600">₹{product?.price?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Total Value</p>
                                <p className="text-2xl font-bold text-green-600">₹{product?.value?.toLocaleString("en-IN")}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Stock Status</p>
                                <p className={`text-xl font-bold px-3 py-1 rounded-full inline-block ${product?.stock > 10
                                        ? "bg-green-100 text-green-700"
                                        : product?.stock > 0
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                    }`}>
                                    {product?.stock > 10 ? "In Stock" : product?.stock > 0 ? "Low Stock" : "Out of Stock"}
                                </p>
                            </div>
                        </div>
                    </div>

                  
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
