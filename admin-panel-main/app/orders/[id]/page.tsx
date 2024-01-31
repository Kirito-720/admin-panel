// Import necessary libraries and components
"use client";
import { Navbar } from "@/components/ui/others/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Interface for the component props
interface OrdersHistory {
  params: {
    id: string;
  };
}

// Interface for order details data
interface OrderDetails {
  _id: string;
  taskName: string;
  taskStatus: string;
  orderDate: string;
  reqUserId: string;
  reqUserStreet: string;
  reqUserCity: string;
  reqUserState: string;
  reqUserEmail: string;
  taskDescription: string;
  // Exclude __v from the interface
}

// Interface for order history data
interface OrderHistoryItem {
  datetime: string;
  comment: string;
  taskStatus: string;
  staffName: string;
}

// Component function
export default function OrdersDetails({ params }: OrdersHistory) {
  // State for order details
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  // State for loading status
  const [loading, setLoading] = useState<boolean>(true);
  // State for new task status
  const [newTaskStatus, setNewTaskStatus] = useState<string>("");
  // State for updating status
  const [updating, setUpdating] = useState<boolean>(false);
  // State for order history
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  // State for comment
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  
  
  

  // Task status options
  const taskStatusOptions = [
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
  ];

  // Effect to fetch order details and history when the component mounts
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://35.154.153.8:3001/api/users/getRepairOrderById?id=${params.id}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log("data is ", data);
          setOrderDetails(data);
        } else {
          const data = await response.json();
          setOrderDetails(data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://35.154.153.8:3001/api/users/viewOrderHistory?id=${params.id}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setOrderHistory(data);
        } else {
          const errorData = await response.json();
          console.error("Error fetching order history:", errorData);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
    fetchOrderHistory();
  }, [params.id]);

  // Function to handle task status change
  const handleTaskStatusChange = async () => {
    try {
      setUpdating(true);
      const response = await fetch(
        `http://35.154.153.8:3001/api/users/updateTasks?id=${params.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskStatus: newTaskStatus, comment }),
        }
      );

      if (response.ok) {
        // Update local state after successful API update
        setOrderDetails((prevOrder) => ({
          ...prevOrder!,
          taskStatus: newTaskStatus,
        }));
      } else {
        const errorData = await response.json();
        console.error("Error updating task status:", errorData);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    } finally {
      setUpdating(false);
    }
  };

  // Return JSX for the component
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="mx-auto mt-10 p-6 max-w-5xl bg-white rounded-md shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Order Details
        </h1>

        {/* Loading indicator */}
        {loading && (
          <div className="text-center text-gray-600">
            <p>Loading...</p>
            <div className="animate-spin text-4xl">&#9696;</div>
          </div>
        )}

        {/* Render order details if available */}
        {!loading && Array.isArray(orderDetails) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              {orderDetails.map((orderDetail, index) => (
                <div key={index}>
                  <p className="text-lg font-semibold text-gray-700">
                    Order ID:
                  </p>
                  <p className="text-gray-600">{orderDetail.orderId}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Task Status:
                  </p>
                  <p className="text-gray-600">{orderDetail.taskStatus}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Order Date:
                  </p>
                  <p className="text-gray-600">{orderDetail.orderDate}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Req Phone number:
                  </p>
                  <p className="text-gray-600">{orderDetail.reqUserPhone}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Req User ID:
                  </p>
                  <p
                    className="text-gray-600"
                    onClick={() =>
                      router.push(`/dashboard/users/${orderDetail.reqUserId}`)
                    }
                    style={{ cursor: "pointer", color: "blue" }}
                  >
                    {orderDetail.reqUserId}
                  </p>{" "}
                  <p className="text-lg font-semibold text-gray-700">
                    Req User Email:
                  </p>
                  <p className="text-gray-600">{orderDetail.reqUserEmail}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Req User Adress:
                  </p>
                  <p className="text-gray-600">{orderDetail.reqUserStreet}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Task Description:
                  </p>
                  <p className="text-gray-600">{orderDetail.taskDescription}</p>
                  <h1 className="text-2xl font-bold mt-10">Price Breakdown</h1>
                  <table className="min-w-full border border-gray-300">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Issue
                        </th>
                        <th className="px-6 py-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetail.costBreakDown.map(
                        (cost: any, index: any) => (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              {cost.issueName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {cost.issueCost}
                            </td>
                          </tr>
                        )
                      )}
                      <tr className="bg-gray-100">
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          Total Cost:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                          {/* Calculate and display the total cost */}
                          {orderDetail.costBreakDown.reduce(
                            (total: number, cost: any) =>
                              total + cost.issueCost,
                            0
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Task status update section */}
            <div>
              <div className="mb-4">
                <label
                  htmlFor="taskStatus"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Change Task Status:
                </label>
                <select
                  id="taskStatus"
                  name="taskStatus"
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full"
                >
                  <option value="" disabled>
                    Select a new task status
                  </option>
                  {taskStatusOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comment section */}
              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-lg font-semibold text-gray-700"
                >
                  Comment:
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 w-full h-32 resize-none"
                ></textarea>
              </div>

              {/* Button to trigger task status update */}
              <button
                onClick={handleTaskStatusChange}
                disabled={!newTaskStatus || updating}
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Task Status"}
              </button>
            </div>
          </div>
        )}

        {/* Order history table */}
        {!loading && orderHistory.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Order History:
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr>
                    <th className="px-6 py-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date/Time
                    </th>
                    <th className="px-6 py-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Comment
                    </th>
                    <th className="px-6 py-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Task Status
                    </th>
                    <th className="px-6 py-4 bg-gray-100 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Staff Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((historyItem, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {historyItem.datetime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {historyItem.comment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {historyItem.taskStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {historyItem.staffName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Additional details section */}

        {/* Display error message if order details fetching fails */}
        {!loading && !orderDetails && (
          <p className="text-center text-red-600">
            Failed to fetch order details.
          </p>
        )}
      </div>
    </div>
  );
}
