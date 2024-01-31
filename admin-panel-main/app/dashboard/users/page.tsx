// Import statements...
"use client"
import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/others/Navbar";
import { Info, Mail, UserRound, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface User {
  userID: string;
  name: string;
  email: string;
  phoneNumber: string;
  // Add other properties as needed
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://35.154.153.8:8072/endUser/viewAllUsers'); // Replace with your API endpoint
        const data: User[] = await response.json();

        if (data) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          console.error('Empty response or invalid structure:', data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    };

    // Trigger the search function when searchQuery changes
    handleSearch();
  }, [searchQuery, users]);

  return (
    <div>
      <div>
        <Navbar />
        <div className="flex items-center justify-center mt-2">
          <UsersRound />
          <h1 className="text-center text-2xl font-bold ">Users</h1>
        </div>
        <div className="flex justify-center mt-4">
          <Input
            type="text"
            placeholder="Search users..."
            className="px-4 py-2 w-1/2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div>
        <div className="flex flex-col mt-8">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 bg-gray-50 rounded dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Serial No.
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Phone
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Info
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers && filteredUsers.length > 0 ? (
                      filteredUsers
                        .sort((a, b) => b.userID.localeCompare(a.userID)) // Sort in descending order based on userID
                        .map((user, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                            {filteredUsers.length - index}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Mail className="h-4 w-4 inline-block mr-2" />
                              {user.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.phoneNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Info
                                onClick={() =>
                                  router.push(`/dashboard/users/${user.userID}`)
                                }
                              />
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td className="px-6 py-4 text-center">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
