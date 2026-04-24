import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useData } from "../../Contexts/DataContext";

const LOW_STOCK_THRESHOLD = 5;

const StatusBadge = ({ stock }) => {
  if (stock === 0)
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
        Out of Stock
      </span>
    );
  if (stock < LOW_STOCK_THRESHOLD)
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
        Low Stock
      </span>
    );
  return (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
      In Stock
    </span>
  );
};

const Inventory = () => {
  const { allProducts } = useData();
  const [activeTab, setActiveTab] = useState("gold");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const goldInventory = allProducts.filter((p) => p.category === "gold");
  const silverInventory = allProducts.filter((p) => p.category === "silver");
  const currentInventory = activeTab === "gold" ? goldInventory : silverInventory;

  // Summary stats
  const totalItems = currentInventory.length;
  const totalStock = currentInventory.reduce((sum, p) => sum + Number(p.stock || 0), 0);
  const totalValue = currentInventory.reduce((sum, p) => sum + Number(p.value || 0), 0);
  const lowStockCount = currentInventory.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) < LOW_STOCK_THRESHOLD
  ).length;
  const outOfStockCount = currentInventory.filter((p) => Number(p.stock) === 0).length;

  // Filter + Search
  const filteredInventory = currentInventory.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.purity?.toLowerCase().includes(search.toLowerCase());

    const stock = Number(item.stock);
    if (filterStatus === "in_stock") return matchesSearch && stock >= LOW_STOCK_THRESHOLD;
    if (filterStatus === "low_stock") return matchesSearch && stock > 0 && stock < LOW_STOCK_THRESHOLD;
    if (filterStatus === "out_of_stock") return matchesSearch && stock === 0;
    return matchesSearch;
  });

  const tabClass = (tab) =>
    `flex-1 px-6 py-4 font-medium text-sm border-b-2 transition ${activeTab === tab
      ? "border-amber-500 text-amber-600"
      : "border-transparent text-gray-500 hover:text-gray-700"
    }`;

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full ml-[290px]">
        <Header />
        <div className="p-6 bg-gray-50 min-h-screen">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Inventory</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Stock (kg)</p>
              <p className="text-2xl font-bold text-gray-800">{totalStock.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{totalValue.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Alerts</p>
              <div className="flex items-center gap-2 mt-1">
                {lowStockCount > 0 && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {lowStockCount} Low
                  </span>
                )}
                {outOfStockCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                    {outOfStockCount} Out
                  </span>
                )}
                {lowStockCount === 0 && outOfStockCount === 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    All Good
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs + Table */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button onClick={() => { setActiveTab("gold"); setSearch(""); setFilterStatus("all"); }} className={tabClass("gold")}>
                  Gold Inventory
                </button>
                <button onClick={() => { setActiveTab("silver"); setSearch(""); setFilterStatus("all"); }} className={tabClass("silver")}>
                  Silver Inventory
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search by name or purity..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm text-gray-400">{index + 1}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.purity}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{item.stock}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            ₹{Number(item.value).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge stock={Number(item.stock)} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                          No items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer count */}
              <p className="text-xs text-gray-400 mt-4">
                Showing {filteredInventory.length} of {currentInventory.length} items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;