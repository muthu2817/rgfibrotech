'use client'
import { Users, ShoppingCart, DollarSign, Package } from "lucide-react";

const Dashboard = () => {
  return (
    <>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card */}
          <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-xl font-semibold">1,245</p>
            </div>
            <Users className="w-6 h-6 text-blue-600" />
          </div>

          {/* Orders Card */}
          <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">New Orders</p>
              <p className="text-xl font-semibold">183</p>
            </div>
            <ShoppingCart className="w-6 h-6 text-green-600" />
          </div>

          {/* Revenue Card */}
          <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-xl font-semibold">₹2,54,000</p>
            </div>
            <DollarSign className="w-6 h-6 text-yellow-600" />
          </div>

          {/* Products Card */}
          <div className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-xl font-semibold">312</p>
            </div>
            <Package className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
       <div> 
      </div>
    </>

  );
};

export default Dashboard;
