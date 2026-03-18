import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const OrderDetails = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[290px] overflow-x-hidden">
        <Header />
        <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4"></div>

            <div className="flex justify-between mb-4">
              <div>
                <p className="text-sm">STATUS</p>
                <span className="bg-orange-500 text-white px-2 py-1 rounded">
                  SHIPPED
                </span>
              </div>
              <div>
                <p className="text-sm">CREATED AT</p>
                <p className="font-semibold">May 30, 2019 at 2:52 PM</p>
              </div>
              <div>
                <p className="text-sm">ORDER NUMBER</p>
                <p className="font-semibold">ORD190079</p>
              </div>
              <div>
                <p className="text-sm">TOTAL WEIGHT</p>
                <p className="font-semibold">1794.00 Gms</p>
              </div>
            </div>

            <div className=" p-4 ">
              <div className="flex">
                Order Details
                <p className="">Order Details</p>
              </div>

              <table className="w-full mt-2">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Items Summary</th>
                    <th className="p-2">Size</th>
                    <th className="p-2">QTY</th>
                    <th className="p-2">Weight</th>
                    <th className="p-2">Total Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-">
                    <td className="p-2">Choker</td>
                    <td className="p-2">17 Inch</td>
                    <td className="p-2">x5</td>
                    <td className="p-2">198.00</td>
                    <td className="p-2">990.00</td>
                  </tr>
                  <tr className="border-">
                    <td className="p-2">Choker</td>
                    <td className="p-2">21 Inch</td>
                    <td className="p-2">x2</td>
                    <td className="p-2">198.00</td>
                    <td className="p-2">594.00</td>
                  </tr>
                  <tr>
                    <td className="p-2">Arjato</td>
                    <td className="p-2">21 Inch</td>
                    <td className="p-2">x5</td>
                    <td className="p-2">42.00</td>
                    <td className="p-2">210.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Workers</h3>
              <ul className="bg-gray-100 p-4 rounded-lg">
                <li className="p-2 border-b">Madhu</li>
                <li className="p-2 border-b">Kumar</li>
                <li className="p-2">Vami</li>
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold">Branch</h3>
              <ul className="bg-gray-100 p-4 rounded-lg">
                <li className="p-2 border-b">Mumbai - Bhoormal</li>
                <li className="p-2 border-b">Nellore - Ankit</li>
                <li className="p-2">Kochi - Akshay</li>
              </ul>
            </div>

            <div className="mt-4 flex justify-between">
              <div className="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer">
                Download Invoice
              </div>
              <div className="bg-gray-200 p-4 rounded-lg">
                <h3 className="font-semibold">Shipped To</h3>
                <p>Elaine Hernandez</p>
                <p>P. Panamayan, TX</p>
                <p>Willoway Wild Sorrey</p>
                <p>P: (123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
