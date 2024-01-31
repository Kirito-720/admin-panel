// Import necessary libraries and components
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/ui/others/Navbar";
import { auth } from "@clerk/nextjs";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkAuthentication } from "../routes";

interface Order {
  _id: string;
  taskName: string;
  taskStatus: string;
  reqUserId: string;
  orderId: string;
  reqUserPhone: string;
}

interface UserData {
  name: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[] | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [userMap, setUserMap] = useState<Map<string, UserData>>(new Map());
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://35.154.153.8:3001/api/users/viewAllTasks"
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setOrders(data.reverse() || []);

          // Fetch user names for each reqUserId
          data.forEach((order: Order) => {
            fetchUserName(order.reqUserId);
          });
        } else {
          throw new Error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to fetch order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserName = async (userId: string) => {
      try {
        const response = await fetch(
          `http://35.154.153.8:8072/endUser/viewUser?id=${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUserMap((prevUserMap) => new Map(prevUserMap).set(userId, data));
        } else {
          throw new Error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserMap((prevUserMap) =>
          new Map(prevUserMap).set(userId, { name: "Error" })
        );
      }
    };

    fetchData();
  }, []); // Empty dependency array since we don't use router inside useEffect

  const getStatusColorClass = (status: Order["taskStatus"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-process":
        return "text-blue-600";
      case "pending":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleFilter = (status: string | null) => {
    setFilterStatus(status === "All" ? null : status);
  };

  const handleUserNameClick = (userId: string) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const allOrderStatusOptions = [
    "All",
    "Audit Done",
    "Canceled",
    "Canceled Reversal",
    "Chargeback",
    "Complete",
    "Delivered",
    "Delivery Boy on the Way",
    "Denied",
    "Deliver to Vendor",
    "Expired",
    "Failed",
    "Not Repaired",
    "Part Not Available",
    "Pending",
    "Processed",
    "Processing",
    "QC Passed",
    "Quality Check",
    "Refunded",
    "Repair Completed",
    "Repair Repeat",
    "Repair Work on Hold",
    "Returned",
    "Reversed",
    "Shipped",
    "Technician on the Way",
    "Unpaid",
    "Voided",
    "Work in Progress",
    // ... (other status options)
  ];

  const orderStatusCounts: { [status: string]: number } = {};
  orders?.forEach((order) => {
    const status = order.taskStatus.toLowerCase().replace(/\s+/g, "-");
    orderStatusCounts[status] = (orderStatusCounts[status] || 0) + 1;
  });

  const filteredOrders = orders
    ? filterStatus !== null || searchTerm
      ? orders.filter(
          (order) =>
            (filterStatus !== null
              ? order.taskStatus.toLowerCase() === filterStatus
              : true) &&
            (searchTerm
              ? order.reqUserId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (userMap.has(order.reqUserId) &&
                  userMap.get(order.reqUserId)?.name.toLowerCase().includes(searchTerm.toLowerCase()))
              : true)
        )
      : orders
    : [];

  return (
    <div>
      <Navbar />
      <div>
        <h1 className="text-center text-2xl font-bold">Orders</h1>
      </div>
      <div className="flex flex-col mt-8">
        <div className="mb-4 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <label htmlFor="orderFilter" className="sr-only">
            Select Order Status
          </label>
          <select
            id="orderFilter"
            value={filterStatus || ""}
            onChange={(e) => handleFilter(e.target.value)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            {allOrderStatusOptions.map((status) => (
              <option
                key={status}
                value={status.toLowerCase().replace(/\s+/g, "-")}
              >
                {`${status} (${orderStatusCounts[status.toLowerCase().replace(/\s+/g, "-")] || 0})`}
              </option>
            ))}
          </select>

          <Input
            type="text"
            placeholder="Search by User Email or Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-200 px-4 py-2 rounded"
          />

          <Button
            onClick={() => {
              setLoading(true);
              router.refresh();
            }}
            className="hover:bg-black hover:text-white bg-white text-black w-full md:w-auto"
          >
            Reload
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full md:w-screen bg-white border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-2 md:px-10 border-b">Order id</th>
                <th className="py-2 px-2 md:px-4 border-b">User Name</th>
                <th className="py-2 px-2 md:px-10  border-b">Phone no.</th>
                <th className="py-2 px-2 md:px-4 border-b">Status</th>
                <th className="py-2 px-2 md:px-4 border-b">Info</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    
                    <td className="py-2 px-2 md:px-10  border-b">#{order.orderId}</td>
                    <td className="py-2 px-2 md:px-4 border-b">
                      {userMap.has(order.reqUserId) ? (
                        <a
                          onClick={() => handleUserNameClick(order.reqUserId)}
                          className="text-blue-600 cursor-pointer"
                        >
                          {userMap.get(order.reqUserId)?.name}
                        </a>
                      ) : (
                        "Loading..."
                      )}
                    </td>
                    <td className="py-2 px-2 md:px-10  mx-10 border-b">{order.reqUserPhone}</td>
                    <td
                      className={`py-2 px-2 md:px-4 border-b ${getStatusColorClass(
                        order.taskStatus
                      )}`}
                    >
                      <p
                        className={`font-bold w-3/4 text-center rounded-full ${getStatusColorClass(
                          order.taskStatus
                        )}`}
                      >
                        {order.taskStatus}
                      </p>
                    </td>
                    <td className="py-2 px-2 md:px-4 border-b">
                      <Info
                        onClick={() => router.push(`/orders/${order.orderId}`)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 px-6 text-center" colSpan={5}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Orders;
