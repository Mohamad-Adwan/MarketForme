import React, { useState, useEffect } from 'react';
import { User } from '@/types';  // Adjust based on your types
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { authApi } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Pencil, 
  RefreshCw,
  User as UserIcon,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UsersManagementPage: React.FC = () => {
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
  const [usersError, setUsersError] = useState<unknown>(null);
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [editingUserRole, setEditingUserRole] = useState<{id: string, role: string} | null>(null);
  const { user, logout } = useAuth();

  // Function to fetch users from an API or mock data
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      // Replace with your API call to fetch users
      const response = await authApi.getAllUsers(user.id);
     setDisplayUsers(response.users);
     
    } catch (error) {
      setUsersError(error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    if (!useMockData) {
      fetchUsers();
    } else {
      // setDisplayUsers([
      //   { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', joinDate: '2021-01-01', ordersCount: 5 },
      //   { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', joinDate: '2021-02-15', ordersCount: 3 }
      // ]);
    }
  }, [useMockData]);

  const refetchUsers = () => {
    if (useMockData) {
      setUseMockData(false);
    } else {
      fetchUsers();
    }
  };

  
  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      // Assuming authApi.updateUserRole takes (adminId, userId, newRole)
      const token = localStorage.getItem('authToken');
    
      await authApi.updateUserRole(token, userId, role);
      
      console.log(`Successfully updated user ${userId} to role ${role}`);
      fetchUsers();
      // Optionally refresh user list or show a success toast
    } catch (error) {
      console.error(`Error updating user role:`, error);
    }
  };
  

  const handleDeleteUser = async (userId: string) => {
    // Handle the delete user logic here
    //console.log(`Deleting user ${userId}`);

    const token = localStorage.getItem('authToken');

    await authApi.deleteUser(token, userId);

    console.log(`Deleting user ${userId}`);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <div className="flex gap-2">
          {!useMockData && (
            <Button variant="outline" onClick={refetchUsers} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
          {usersError && !useMockData && (
            <Button onClick={() => setUseMockData(true)}>
              View Sample Users
            </Button>
          )}
          {useMockData && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Using Sample Data</Badge>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>verificationCode</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUsers && !useMockData ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : displayUsers.length > 0 ? (
                displayUsers.map((user) => (
                  <TableRow key={user.id}>
                    
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <UserIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone?user.phone:"Not Added"}</TableCell>
                    <TableCell>{user.verificationCode?user.verificationCode:"Not Requested"}</TableCell>
                    <TableCell>
                      {editingUserRole && editingUserRole.id === user.id ? (
                        <Select
                          value={editingUserRole.role}
                          onValueChange={(value) => {
                            setEditingUserRole({ ...editingUserRole, role: value });
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{new Date(user.joinDate || '').toLocaleDateString()}</TableCell>
                    <TableCell>{user.ordersCount || 0}</TableCell>
                    <TableCell>
                      {editingUserRole && editingUserRole.id === user.id ? (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingUserRole(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateUserRole(user.id, editingUserRole.role)}
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingUserRole({ id: user.id, role: user.role })}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Role
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-white hover:bg-red-500"
                                disabled={user.role === 'admin'} // Prevent deleting admin users
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                  Confirm Deletion
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete user {user.name}? This will also delete all their orders and cart items. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagementPage;
