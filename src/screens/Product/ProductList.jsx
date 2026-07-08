import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import ProductDetails from "./ProductDetails";
import apiService from "../service/apiService";

const ProductList = () => {
    const [activeTab, setActiveTab] = useState("gold");
    const [goldProducts, setGoldProducts] = useState([]);
    const [silverProducts, setSilverProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updatingIds, setUpdatingIds] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        material: "gold",
        name: "",
        purity: "999",
        stock: "",
        weight: "",
        price: "",
        description: "",
        markup: "",
        makingCharges: "",
        gst: "5",
        status: "DRAFT",
    });

    // Inline SVG placeholder — never 404s, never depends on an external service.
    const placeholderImage =
        "data:image/svg+xml;utf8," +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                <rect width="80" height="80" fill="#e5e7eb"/>
                <text x="50%" y="50%" font-family="sans-serif" font-size="10" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">No Image</text>
            </svg>`
        );

    // FIX: Vite does not expose process.env in the browser — it uses import.meta.env
    // with VITE_ prefixed vars instead. If your .env file has REACT_APP_API_BASE_URL,
    // rename it to VITE_API_BASE_URL (and restart the dev server after editing .env).
    const MEDIA_BASE_URL =
        import.meta.env.VITE_MEDIA_BASE_URL ||
        import.meta.env.VITE_API_BASE_URL ||
        "https://api.dgi.gold";

    const resolveImageUrl = (url) => {
        if (!url || typeof url !== "string") return null;
        const trimmed = url.trim();
        if (!trimmed) return null;
        if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("data:")) {
            return trimmed;
        }
        const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
        return `${MEDIA_BASE_URL}${path}`;
    };

    const extractImageUrl = (image) => {
        if (!image) return null;
        if (typeof image === "string") return resolveImageUrl(image);
        return resolveImageUrl(
            image?.url ||
            image?.src ||
            image?.fileUrl ||
            image?.thumbnail ||
            image?.thumbnailUrl ||
            image?.path ||
            image?.image ||
            image?.secure_url ||
            image?.location ||
            image?.Location ||
            image?.key ||
            image?.file?.url ||
            image?.data?.url ||
            image?.attributes?.url ||
            null
        );
    };

    const getProductImageUrls = (product) => {
        if (!product) return [];

        const candidates = [];

        if (Array.isArray(product.imageUrls) && product.imageUrls.length) {
            candidates.push(...product.imageUrls.map(extractImageUrl));
        }

        if (Array.isArray(product.images) && product.images.length) {
            candidates.push(...product.images.map(extractImageUrl));
        }

        if (Array.isArray(product.media) && product.media.length) {
            candidates.push(...product.media.map(extractImageUrl));
        }

        if (product.imageUrl || product.image || product.thumbnailUrl || product.coverImage || product.picture || product.productImage) {
            candidates.push(extractImageUrl(product.imageUrl || product.image || product.thumbnailUrl || product.coverImage || product.picture || product.productImage));
        }

        return candidates.filter((url) => typeof url === "string" && url.trim().length > 0);
    };

    const getProductImageUrl = (product) => getProductImageUrls(product)[0] || placeholderImage;

    const handleImageError = (e, product) => {
        console.warn("🖼️ Image failed to load for product:", product?.code || product?.id, "→ URL was:", e.target.src);
        if (e.target.src !== placeholderImage) {
            e.target.src = placeholderImage;
        }
    };

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleImageSelection = (event) => {
        const files = Array.from(event.target.files || []);
        const previews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setSelectedFiles((current) => {
            current.forEach((item) => URL.revokeObjectURL(item.preview));
            return previews;
        });
    };

    React.useEffect(() => {
        return () => {
            selectedFiles.forEach((item) => URL.revokeObjectURL(item.preview));
        };
    }, [selectedFiles]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const result = await apiService.request("/products?page=1&limit=10&status=ACTIVE", "GET");

            if (result && result.success && result.data) {
                const paginationWrapper = result.data.data?.data || result.data.data;
                const products = Array.isArray(paginationWrapper) ? paginationWrapper : paginationWrapper?.data || [];

                if (!Array.isArray(products)) {
                    setGoldProducts([]);
                    setSilverProducts([]);
                    return;
                }

                if (products[0]) {
                    console.log("🔍 Sample product raw image fields:", {
                        images: products[0].images,
                        imageUrls: products[0].imageUrls,
                        media: products[0].media,
                        imageUrl: products[0].imageUrl,
                        image: products[0].image,
                    });
                }

                const goldData = products
                    .filter((p) => p.metalType === "GOLD")
                    .map((p) => {
                        const imageUrls = getProductImageUrls(p);
                        return {
                            id: p.id,
                            code: p.sku,
                            name: p.name,
                            purity: p.purity,
                            stock: p.stockQuantity,
                            price: p.sellingPrice,
                            value: p.sellingPrice * p.stockQuantity,
                            category: "gold",
                            description: p.description,
                            weight: p.weight,
                            metalType: p.metalType,
                            basePrice: p.basePrice,
                            markup: p.markup,
                            publishStatus: p.publishStatus || (p.status === 'ACTIVE' ? 'PUBLISHED' : 'UNPUBLISHED'),
                            status: p.status || (p.publishStatus ? (p.publishStatus === 'PUBLISHED' ? 'ACTIVE' : 'DRAFT') : 'ACTIVE'),
                            gstPercent: p.gstPercent,
                            makingCharges: p.makingChargesINR,
                            imageUrls,
                            imageUrl: imageUrls[0] || "",
                        };
                    });

                const silverData = products
                    .filter((p) => p.metalType === "SILVER")
                    .map((p) => {
                        const imageUrls = getProductImageUrls(p);
                        return {
                            id: p.id,
                            code: p.sku,
                            name: p.name,
                            purity: p.purity,
                            stock: p.stockQuantity,
                            price: p.sellingPrice,
                            value: p.sellingPrice * p.stockQuantity,
                            category: "silver",
                            description: p.description,
                            weight: p.weight,
                            metalType: p.metalType,
                            basePrice: p.basePrice,
                            markup: p.markup,
                            publishStatus: p.publishStatus || (p.status === 'ACTIVE' ? 'PUBLISHED' : 'UNPUBLISHED'),
                            status: p.status || (p.publishStatus ? (p.publishStatus === 'PUBLISHED' ? 'ACTIVE' : 'DRAFT') : 'ACTIVE'),
                            gstPercent: p.gstPercent,
                            makingCharges: p.makingChargesINR,
                            imageUrls,
                            imageUrl: imageUrls[0] || "",
                        };
                    });

                setGoldProducts(goldData);
                setSilverProducts(silverData);
            } else {
                setGoldProducts([]);
                setSilverProducts([]);
            }
        } catch (error) {
            console.error('API Error fetching products:', error);
            setGoldProducts([]);
            setSilverProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const uploadProductMedia = async (productId, selectedFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) {
            console.log('ℹ️ No files to upload');
            return { success: true, message: 'No files selected' };
        }

        console.log(`📸 Uploading ${selectedFiles.length} image file(s)...`);

        try {
            const mediaForm = new FormData();

            selectedFiles.forEach((item, index) => {
                if (item?.file) {
                    mediaForm.append('media', item.file);

                    console.log(`📎 Added image ${index + 1}:`, {
                        name: item.file.name,
                        size: `${(item.file.size / 1024).toFixed(2)} KB`,
                        type: item.file.type
                    });
                }
            });

            console.log('🚀 Sending to endpoint: POST /products/' + productId + '/media');

            try {
                const uploadResponse = await apiService.products.uploadMedia(productId, mediaForm);

                console.log('✅ Media upload response:', uploadResponse);

                if (uploadResponse?.success || uploadResponse?.status === 200) {
                    console.log('✅ Media uploaded successfully');
                    return { success: true, data: uploadResponse };
                } else {
                    const errorMsg = uploadResponse?.error || uploadResponse?.message || 'Unknown error';
                    console.warn('⚠️ Media upload failed:', errorMsg);
                    return { success: false, error: errorMsg };
                }
            } catch (apiError) {
                console.warn('⚠️ apiService.uploadMedia failed, trying direct fetch...');

                const token = localStorage.getItem('authToken');
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL || 'https://api.dgi.gold/api/v1'}/products/${productId}/media`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: mediaForm
                    }
                );

                console.log('📡 Direct fetch status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Direct fetch error:', response.status, errorText);
                    return { success: false, error: `HTTP ${response.status}: ${errorText}` };
                }

                const result = await response.json();
                console.log('✅ Direct fetch success:', result);
                return { success: true, data: result };
            }

        } catch (error) {
            console.error('❌ Media upload error:', error.message);
            return { success: false, error: error.message };
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const skuCode = formData.code?.trim()
            ? formData.code.trim()
            : `${formData.material.toUpperCase()}-${formData.purity}-${Date.now()}`;

        const newProductPayload = {
            name: formData.name?.trim() || "Unnamed Product",
            description: formData.description?.trim() || "",
            metalType: formData.material?.toUpperCase() || "GOLD",
            purity: parseInt(formData.purity) || 999,
            weight: parseFloat(formData.weight) || 1,
            unit: "g",
            basePrice: parseFloat(formData.price) || 0,
            stockQuantity: parseInt(formData.stock) || 0,
            minOrderQty: 1,
            maxOrderQty: parseInt(formData.stock) || 1,
            lowStockThreshold: 10,
            shippingWeight: parseFloat(formData.weight) || 1,
            markup: parseFloat(formData.markup) || 0,
            makingCharges: parseFloat(formData.makingCharges) || 0,
            gstPercent: parseFloat(formData.gst) || 5,
            sku: skuCode,
            status: formData.status || "DRAFT",
            category: "BAR",
            shippable: true,
            standardShippingDays: 2,
        };

        try {
            console.log('📝 Creating product with SKU:', skuCode);

            const createResponse = await apiService.products.create(newProductPayload);
            if (!createResponse.success) {
                throw new Error(createResponse.error || 'Failed to add product');
            }

            const createdProduct = createResponse.data?.data || createResponse.data;
            const productId = createdProduct?.id || createdProduct?._id || createdProduct?.productId;

            if (!productId) {
                throw new Error('Product created but response did not return an ID');
            }

            console.log('✅ Product created with ID:', productId);

            if (selectedFiles && selectedFiles.length > 0) {
                const uploadResult = await uploadProductMedia(productId, selectedFiles);

                if (!uploadResult.success) {
                    console.warn('⚠️ Media upload warning:', uploadResult.error);
                    if (uploadResult.error.includes('500') || uploadResult.error.includes('Internal Server Error')) {
                        alert('✅ Product added! ⚠️ Note: Image upload failed with server error (500).\n\nPlease contact your backend team to check the media endpoint at POST /products/{id}/media');
                    } else {
                        alert('✅ Product created! ⚠️ Note: Image upload failed.\n\nYou can add images later from product details.');
                    }
                } else {
                    console.log('✅ Media uploaded successfully');
                    alert('✅ Product and images added successfully!');
                }
            } else {
                alert('✅ Product added successfully!');
            }

            await fetchProducts();

            setFormData({
                code: '',
                material: 'gold',
                name: '',
                purity: '999',
                stock: '',
                weight: '',
                price: '',
                description: '',
                markup: '',
                makingCharges: '',
                gst: '5',
                status: 'DRAFT',
            });
            setSelectedFiles([]);
            setShowAddForm(false);

        } catch (error) {
            console.error('❌ Product creation error:', error);
            const errorMsg = error.message || error.toString();

            if (errorMsg.includes('SKU must be unique')) {
                alert('❌ Error: This SKU already exists!\n\nSolution: Leave the Product Code field empty to auto-generate a unique SKU, or use a different code.');
            } else if (errorMsg.includes('image') || errorMsg.includes('media')) {
                alert('❌ Error: ' + errorMsg + '\n\nTry uploading images separately from product details.');
            } else {
                alert('❌ Error: ' + errorMsg);
            }
        }
    };

    const handleUpdateProductStatus = async (productId, newStatus) => {
        if (updatingIds.includes(productId)) return;

        const prevGold = goldProducts;
        const prevSilver = silverProducts;
        const applyLocalStatus = (arr) => arr.map((p) => {
            if (p.id !== productId) return p;
            const publishStatus = newStatus === 'ACTIVE' ? 'PUBLISHED' : 'UNPUBLISHED';
            return { ...p, status: newStatus, publishStatus };
        });
        setGoldProducts((s) => applyLocalStatus(s));
        setSilverProducts((s) => applyLocalStatus(s));

        try {
            setUpdatingIds((s) => [...s, productId]);
            const mappedStatus = newStatus === 'ACTIVE' ? 'PUBLISHED' : 'UNPUBLISHED';
            const response = await apiService.products.changePublishStatus(productId, { publishStatus: mappedStatus });
            if (response && response.success) {
                await fetchProducts();
            } else {
                const errorMsg = (response && (response.error || response.message)) || "Failed to update status";
                setGoldProducts(prevGold);
                setSilverProducts(prevSilver);
                alert("❌ Error: " + errorMsg);
            }
        } catch (err) {
            setGoldProducts(prevGold);
            setSilverProducts(prevSilver);
            alert("❌ Error updating status: " + (err.message || err));
        } finally {
            setUpdatingIds((s) => s.filter((id) => id !== productId));
        }
    };

    if (selectedProduct) {
        return <ProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
    }

    if (loading) {
        return (
            <div>
                <Sidebar />
                <div className="w-full ml-72 overflow-x-hidden">
                    <div className="sticky top-0 z-30">
                        <Header />
                    </div>
                    <div className="p-6 bg-gray-50 h-[calc(100vh-80px)] flex items-center justify-center">
                        <div className="text-xl">Loading products from API...</div>
                    </div>
                </div>
            </div>
        );
    }

    const currentProducts = activeTab === "gold" ? goldProducts : silverProducts;

    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="w-full ml-0 lg:ml-72 overflow-x-hidden">
                    <div className="sticky top-0 z-30">
                        <Header />
                    </div>
                    <div className="p-6 bg-gray-50 h-[calc(100vh-80px)] overflow-y-auto">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Product List</h2>

                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="flex">
                                    <button
                                        onClick={() => setActiveTab("gold")}
                                        className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === "gold"
                                            ? "border-amber-500 text-amber-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Gold Products ({goldProducts.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("silver")}
                                        className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === "silver"
                                            ? "border-amber-500 text-amber-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        Silver Products ({silverProducts.length})
                                    </button>
                                </nav>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">{activeTab === "gold" ? "Gold" : "Silver"} Products</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Image</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Code</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Name</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Purity</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Stock</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Price</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Value</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Status</th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider truncate">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentProducts.length > 0 ? (
                                            currentProducts.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 max-w-28 text-xs sm:text-sm">
                                                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                            <img
                                                                src={getProductImageUrl(product)}
                                                                alt={product.name || product.code}
                                                                className="h-full w-full object-cover"
                                                                onError={(e) => handleImageError(e, product)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-xs text-xs sm:text-sm font-medium text-amber-600 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.code}</td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-md text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.name}</td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-24 text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.purity}</td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-24 text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.stock}</td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-28 text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.price?.toLocaleString("en-IN")}</td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-32 text-xs sm:text-sm text-gray-900 cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.value?.toLocaleString("en-IN")}</td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-24 text-xs"><span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${product.publishStatus === "UNPUBLISHED" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>{product.publishStatus === "UNPUBLISHED" ? "Draft" : "Published"}</span></td>
                                                    <td className="px-3 sm:px-6 py-2 sm:py-4 truncate max-w-28 text-xs">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const isPublished = product.publishStatus === "PUBLISHED";
                                                                const newStatus = isPublished ? "DRAFT" : "ACTIVE";
                                                                handleUpdateProductStatus(product.id, newStatus);
                                                            }}
                                                            disabled={updatingIds.includes(product.id)}
                                                            className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold transition ${product.publishStatus === "UNPUBLISHED" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600"} ${updatingIds.includes(product.id) ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                        >
                                                            {updatingIds.includes(product.id) ? (product.publishStatus === "UNPUBLISHED" ? "Publishing..." : "Unpublishing...") : (product.publishStatus === "UNPUBLISHED" ? "Publish" : "Unpublish")}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={9} className="px-6 py-10 text-center text-sm text-gray-400">No {activeTab} products found. Click "+ Add Product" to create one.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md mt-6">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-gray-800">Add New Product</h3>
                                <button onClick={() => 
                                        { setShowAddForm(!showAddForm); if (showAddForm) setSelectedFiles([]); }} 
                                        className={`px-4 py-2 rounded-lg transition 
                                                    ${showAddForm ? "bg-gray-500 text-white hover:bg-red-600" 
                                                                    : "bg-amber-500 text-white hover:bg-green-600"}`}
                                                                    >{showAddForm ? "Cancel" : "+ Add Product"}</button>
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddProduct} className="p-6 max-h-[70vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Code (SKU) <span className="text-gray-400 text-xs">(optional - auto-generate if empty)</span></label>
                                            <input type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="Leave empty to auto-generate unique SKU" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Material
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <select name="material" value={formData.material} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required>
                                                <option value="gold">Gold</option>
                                                <option value="silver">Silver</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Name
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g., 22K Gold Bar - 100g" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Product description..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" rows="2" />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-md font-medium text-gray-700 mb-1">
                                                Product Images
                                                <span className="px-1 text-red-500">*</span>
                                            </label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                multiple 
                                                onChange={handleImageSelection} 
                                                className="hidden"
                                                id="file-input"
                                                />
                                                <label htmlFor="file-input"
                                                        className="flex items-center gap-3 w-full px-3 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover-border-amber-400 hover:bg-amber-50/50 transition "
                                                        >
                                                        <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-md border border-gray-300 whitespace-nowrap">
                                                            Choose Files
                                                        </span>
                                                        <span className="text-xs sm:text-sm text-gray-500 truncate">
                                                            {selectedFiles.length > 0
                                                                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""} selected`
                                                                : "No file chosen"}
                                                        </span>
                                                        </label>

                                            <p className="text-xs text-gray-500 mt-1">💡 Supported formats: JPG, PNG, GIF. Max file size: check your server limits.</p>
                                            {selectedFiles.length > 0 && (
                                                <div className="mt-3 grid grid-cols-3 gap-3">
                                                    {selectedFiles.map((fileWrapper, index) => (
                                                        <div key={fileWrapper.preview} className="h-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                                                            <img src={fileWrapper.preview} alt={`Selected ${index + 1}`} className="h-full w-full object-cover" />
                                                            <p className="text-xs text-gray-600 truncate">{fileWrapper.file.name}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Purity
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <select name="purity" value={formData.purity} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                                                {formData.material === "gold" ? (
                                                    <>
                                                        <option value="999">999 (99.9%)</option>
                                                        <option value="916">916 (91.6% - 22K)</option>
                                                        <option value="875">875 (87.5% - 21K)</option>
                                                        <option value="750">750 (75% - 18K)</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="999">999 (99.9%)</option>
                                                        <option value="925">925 (92.5%)</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Weight (in gram/s)
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g., 100" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stock Quantity (units)
                                                <span className="text-red-500">*</span>
                                                </label>
                                            <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="e.g., 50" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Base Price (₹)
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., 65000" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Markup (%)
                                                <span className="px-1 text-red-500">*</span>
                                            </label>
                                            <input type="number" name="markup" value={formData.markup} onChange={handleInputChange} placeholder="e.g., 10" step="0.1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required/>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Making Charges (₹)
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <input type="number" name="makingCharges" value={formData.makingCharges} onChange={handleInputChange} placeholder="e.g., 100" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required/>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                GST Percent (%)
                                                <span className="px-1 text-red-500">*</span>
                                                </label>
                                            <input type="number" name="gst" value={formData.gst} onChange={handleInputChange} placeholder="e.g., 5" step="0.1" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required/>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Publication Status</label>
                                            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
                                                <option value="DRAFT">Draft (Not Visible)</option>
                                                <option value="ACTIVE">Publish (Visible)</option>
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">Draft products are hidden from frontend. Publish to make visible.</p>
                                        </div>

                                        <div className="col-span-2">
                                            <button type="submit" className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition font-medium">Add Product</button>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;