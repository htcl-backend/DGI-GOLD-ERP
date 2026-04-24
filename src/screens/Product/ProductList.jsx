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
    gst: "5"
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('🔄 Fetching products from API...');
       const result = await apiService.request('/products?page=1&limit=10&status=ACTIVE', 'GET');

      console.log('📦 Full API Response:', JSON.stringify(result, null, 2));

      if (result && result.success && result.data) {
        // API returns deeply nested: result.data.data = {success, message, data: {...}}
        console.log('📊 result.data keys:', Object.keys(result.data || {}));
        console.log('📊 result.data.data keys:', Object.keys(result.data.data || {}));

        // Navigate the nested structure to get products
        // result.data.data.data.data = actual products array
        const paginationWrapper = result.data.data?.data || result.data.data;
        const products = Array.isArray(paginationWrapper) ? paginationWrapper : paginationWrapper?.data;

        console.log('📋 products extracted:', Array.isArray(products), 'Length:', products?.length);

        if (!Array.isArray(products)) {
          console.error('❌ Products is not an array. Received:', products, 'Type:', typeof products);
          console.error('❌ Full result.data.data:', JSON.stringify(result.data.data, null, 2));
          setGoldProducts([]);
          setSilverProducts([]);
          return;
        }

        console.log('✅ API Response received - Total products:', products.length);

        // Separate gold and silver products based on metalType
        const goldData = products.filter(p => p.metalType === 'GOLD').map((p) => ({
          id: p.id,
          code: p.sku,
          name: p.name,
          purity: p.purity,
          stock: p.stockQuantity,
          price: p.sellingPrice,
          value: p.sellingPrice * p.stockQuantity,
          category: 'gold',
          description: p.description,
          weight: p.weight,
          metalType: p.metalType,
          basePrice: p.basePrice,
          markup: p.markup,
          status: p.status,
          gstPercent: p.gstPercent,
          makingCharges: p.makingChargesINR
        }));

        const silverData = products.filter(p => p.metalType === 'SILVER').map((p) => ({
          id: p.id,
          code: p.sku,
          name: p.name,
          purity: p.purity,
          stock: p.stockQuantity,
          price: p.sellingPrice,
          value: p.sellingPrice * p.stockQuantity,
          category: 'silver',
          description: p.description,
          weight: p.weight,
          metalType: p.metalType,
          basePrice: p.basePrice,
          markup: p.markup,
          status: p.status,
          gstPercent: p.gstPercent,
          makingCharges: p.makingChargesINR
        }));

        setGoldProducts(goldData);
        setSilverProducts(silverData);
        console.log('✅ Products loaded - Gold:', goldData.length, 'Silver:', silverData.length);
      } else {
        console.error('❌ Invalid API response structure:', result);
        setGoldProducts([]);
        setSilverProducts([]);
      }
    } catch (error) {
      console.error('🔴 API Error fetching products:', error.message);
      setGoldProducts([]);
      setSilverProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Add Product via API
  const handleAddProduct = (e) => {
    e.preventDefault();

    // Log formData to debug field values
    console.log('📝 FormData:', {
      name: formData.name,
      description: formData.description,
      material: formData.material,
      purity: formData.purity,
      stock: formData.stock,
      weight: formData.weight,
      price: formData.price,
      code: formData.code,
      markup: formData.markup,
      makingCharges: formData.makingCharges,
      gst: formData.gst
    });

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
      sku: formData.code?.trim() || `SKU-${Date.now()}`,
      status: "ACTIVE",
      category: "BAR",
      shippable: true,
      standardShippingDays: 2
    };

    console.log('📤 Full Payload Object:', newProductPayload);
    console.log('📤 Full Payload JSON:', JSON.stringify(newProductPayload, null, 2));

    // Check for any undefined or NaN values
    Object.entries(newProductPayload).forEach(([key, value]) => {
      if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
        console.error(`⚠️ PROBLEM - ${key} is:`, value);
      }
    });

    // Call API to create product
    apiService.request('/products', 'POST', newProductPayload)
      .then((response) => {
        console.log('📍 API Response:', response);
        if (response.success) {
          console.log('✅ Product created successfully:', response.data);
          alert('✅ Product added successfully!');

          // Refresh the product list
          fetchProducts();

          // Reset form
          setFormData({
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
            gst: "5"
          });

          setShowAddForm(false);
        } else {
          const errorMsg = response.error || response.message || 'Failed to add product';
          console.error('❌ API Error:', errorMsg);
          alert('❌ Error: ' + errorMsg);
        }
      })
      .catch((error) => {
        console.error('❌ Exception adding product:', error);
        alert('❌ Error adding product: ' + error.message);
      });
  };

  // If a product is selected, show ProductDetails
  if (selectedProduct) {
    return <ProductDetails product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  if (loading) {
    return (
      <div>
        <Sidebar />
        <div className="w-full ml-[290px]">
          <Header />
          <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
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
        <div className="w-full ml-[290px]">
          <Header />
          <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Product List</h2>

            {/* Tabs */}
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

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  {activeTab === "gold" ? "Gold" : "Silver"} Products
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price (₹)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Value (₹)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.length > 0 ? (
                      currentProducts.map((product) => (
                        <tr
                          key={product.id}
                          className="hover:bg-gray-50 cursor-pointer transition"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-amber-600">
                            {product.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.purity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.price?.toLocaleString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.value?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                          No {activeTab} products found. Click "+ Add Product" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add New Product Section */}
            <div className="bg-white rounded-lg shadow-md mt-6">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">Add New Product</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className={`px-4 py-2 rounded-lg transition ${showAddForm
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-amber-500 text-white hover:bg-amber-600"
                    }`}
                >
                  {showAddForm ? "Cancel" : "+ Add Product"}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddProduct} className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Code (SKU)
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="e.g., GOLD-24K-10G-001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Material
                      </label>
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      >
                        <option value="gold">Gold</option>
                        <option value="silver">Silver</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., 22K Gold Bar - 100g"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Product description..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        rows="2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purity
                      </label>
                      <select
                        name="purity"
                        value={formData.purity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
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
                        Weight (grams)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g., 100"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity (units)
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="e.g., 50"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price (₹)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g., 65000"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Markup (%)
                      </label>
                      <input
                        type="number"
                        name="markup"
                        value={formData.markup}
                        onChange={handleInputChange}
                        placeholder="e.g., 10"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Making Charges (₹)
                      </label>
                      <input
                        type="number"
                        name="makingCharges"
                        value={formData.makingCharges}
                        onChange={handleInputChange}
                        placeholder="e.g., 100"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GST Percent (%)
                      </label>
                      <input
                        type="number"
                        name="gst"
                        value={formData.gst}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-amber-500 text-white py-2 px-4 rounded-lg hover:bg-amber-600 transition font-medium"
                      >
                        Add Product
                      </button>
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
