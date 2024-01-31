"use client"
/// Import necessary modules
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/others/Navbar";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Correct import for Next.js 12+
import { useEffect, useState } from "react";


// Define interfaces for user data and repair order data
interface UserData {
  userID: string;
  name: string;
  email: string;
  phoneNumber: string;
  buildingNo: string;
  streetName: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  typeOfUser: string;
  repairOrders: string[];
}

interface RepairOrderData {
  orderId: string;
  taskDescription: string;
  orderDate: string;
}

// Define interface for update props
interface UpdateProps {
  params: {
    id: string;
  };
}

// UserInfo component
const UserInfo: React.FC<UpdateProps> = ({ params }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repairOrderData, setRepairOrderData] = useState<RepairOrderData[]>([]);
  const router = useRouter();

  // Function to fetch user and repair order data
  const fetchUser = async () => {
    try {
      // Fetch user data
      const response = await fetch(
        `http://35.154.153.8:8072/endUser/viewUser?id=${params.id}`
      );
      if (response.ok) {
        const data: UserData = await response.json();
        console.log("User Data:", data);
        setUserData(data);

        // Fetch repair order data for each orderId
        const repairOrdersData = await Promise.all(
          data.repairOrders.map(async (orderId) => {
            try {
              const repairOrderResponse = await fetch(
                `http://35.154.153.8:3001/api/users/getRepairOrderById?id=${orderId}`
              );
              if (repairOrderResponse.ok) {
                const repairOrderData = await repairOrderResponse.json();
                console.log("Repair Order Data:", repairOrderData);
                return repairOrderData;
              } else {
                throw new Error(`Failed to fetch repair order details for orderId: ${orderId}`);
              }
            } catch (error) {
              console.error("Error fetching repair order details:", error);
              return null; // Handle error gracefully, you might want to return a default object or handle it differently
            }
          })
        );
        setRepairOrderData(repairOrdersData);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Effect hook to fetch data when component mounts or when params.id changes
  useEffect(() => {
    fetchUser();
  }, [params.id]);

  // JSX for rendering the component
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="w-3/4 mx-auto bg-white rounded-md overflow-hidden shadow-md my-10 p-6">
        {userData && (
          <>
            <h1 className="text-3xl font-bold text-center text-indigo-600">{userData.name}</h1>
            <p className="text-gray-500 text-center mb-4">{userData.email}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700">Phone Number: {userData.phoneNumber}</p>
                <p className="text-gray-700">Address: {`${userData.buildingNo}, ${userData.streetName}, ${userData.area}, ${userData.city}, ${userData.state}, ${userData.pinCode}`}</p>
              </div>

              <div>
                <p className="text-gray-700">Type of User: {userData.typeOfUser}</p>
                <p className="text-gray-700">UserID: {userData.userID}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">Repair Orders</h2>
              <div className="overflow-x-auto">
                {Array.isArray(repairOrderData) && repairOrderData.length > 0 ? (
                  <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="py-2 px-4 border">Order ID</th>
                        <th className="py-2 px-4 border">Task Description</th>
                        <th className="py-2 px-4 border">Order Date</th>
                        <th className="py-2 px-4 border">Info</th>

                        {/* Add more header columns if needed */}
                      </tr>
                    </thead>
                    <tbody>
                      {repairOrderData.map((orderData, index) => (
                        <tr key={index} className="border">
                          <td className="py-2 px-4 border">
                            <td
                              
                            >
                              {userData.repairOrders[index]}
                            </td>
                          </td>
                          <td className="py-2 px-4 border">{orderData.taskDescription}</td>
                          <td className="py-2 px-4 border">{orderData.orderDate}</td>
                          <td className="py-2 px-4 border"><InfoIcon className="hover:text-blue-300" onClick={() => router.push(`/orders/${userData.repairOrders[index]}`)}/></td>

                          {/* Add more columns if needed */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No repair orders available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
