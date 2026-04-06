import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const ProductList = () => {
  const [activeTab, setActiveTab] = useState("gold");
  const [goldProducts, setGoldProducts] = useState([]);
  const [silverProducts, setSilverProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Static mock data for gold products
      const goldData = [
        {
          name: "Gold Bar 24K",
          purity: "24K",
          stock: 50,
          price: 6500,
          value: 325000
        },
        {
          name: "Gold Coin 22K",
          purity: "22K",
          stock: 100,
          price: 5800,
          value: 580000
        },
        {
          name: "Gold Jewelry Set",
          purity: "18K",
          stock: 25,
          price: 4500,
          value: 112500
        },
        {
          name: "Gold Chain 20K",
          purity: "20K",
          stock: 75,
          price: 5200,
          value: 390000
        },
        {
          name: "Gold Ring 24K",
          purity: "24K",
          stock: 200,
          price: 6800,
          value: 1360000
        }
      ];

      // Static mock data for silver products
      const silverData = [
        {
          name: "Silver Bar 999",
          purity: "999",
          stock: 100,
          price: 85,
          value: 8500
        },
        {
          name: "Silver Coin 925",
          purity: "925",
          stock: 500,
          price: 78,
          value: 39000
        },
        {
          name: "Silver Jewelry Set",
          purity: "925",
          stock: 150,
          price: 92,
          value: 13800
        },
        {
          name: "Silver Chain 925",
          purity: "925",
          stock: 300,
          price: 65,
          value: 19500
        },
        {
          name: "Silver Ring 999",
          purity: "999",
          stock: 400,
          price: 88,
          value: 35200
        }
      ];

      setGoldProducts(goldData);
      setSilverProducts(silverData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProducts = activeTab === "gold" ? goldProducts : silverProducts;

  if (loading) {
    return (
      <div>
        <Sidebar />
        <div className="w-full ml-[290px]">
          <Header />
          <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-xl">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

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
                    Gold Products
                  </button>
                  <button
                    onClick={() => setActiveTab("silver")}
                    className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === "silver"
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Silver Products
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
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProducts.map((product, index) => (
                      <tr key={index} className="hover:bg-gray-50">
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
                          {product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
