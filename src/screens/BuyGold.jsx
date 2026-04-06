import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BuyGold = () => {
    const { products, metalPrices, loading } = useData();
    const { user } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        // <div className="p-6">

        <div className="flex ">
            <Sidebar />
            <div className="w-full ml-[290px]">
                <Header />
                <div className="p-6 bg-gray-50 min-h-screen">


                    <h1 className="text-3xl font-bold mb-6">Buy Gold</h1>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-2">{product.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-amber-600">₹{product.price}</span>
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded">Stock: {product.stock}</span>
                                    </div>
                                    <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded">
                                        Buy Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Current Metal Prices</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded">
                                <p className="text-gray-600">24K Gold</p>
                                <p className="text-2xl font-bold text-amber-600">₹{metalPrices.gold?.['24K']}</p>
                            </div>
                            <div className="p-4 border rounded">
                                <p className="text-gray-600">22K Gold</p>
                                <p className="text-2xl font-bold text-amber-600">₹{metalPrices.gold?.['22K']}</p>
                            </div>
                            <div className="p-4 border rounded">
                                <p className="text-gray-600">Silver</p>
                                <p className="text-2xl font-bold">₹{metalPrices.silver}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyGold;