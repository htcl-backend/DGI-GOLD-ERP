import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useData } from "../../Contexts/DataContext";

const Inventory = () => {
  const { allProducts } = useData();
  const [activeTab, setActiveTab] = useState("gold");

  const goldInventory = allProducts.filter(p => p.category === 'gold');
  const silverInventory = allProducts.filter(p => p.category === 'silver');

  const currentInventory = activeTab === "gold" ? goldInventory : silverInventory;

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <div className="w-full ml-[290px]">
          <Header />
          <div className="p-6 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Inventory</h2>

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
                    Gold Inventory
                  </button>
                  <button
                    onClick={() => setActiveTab("silver")}
                    className={`flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === "silver"
                      ? "border-amber-500 text-amber-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    Silver Inventory
                  </button>
                </nav>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock (kg)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentInventory.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.purity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.value}
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
    </div>
  );
};

export default Inventory;
