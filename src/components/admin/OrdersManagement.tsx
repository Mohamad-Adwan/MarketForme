
import React, { useState, useEffect } from 'react';
import { DateRangeFilter, Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { globalApi, orderApi } from '@/services/apiService';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';

import { format, isAfter, isBefore, isValid, parseISO, set } from 'date-fns';
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
  Trash2,
  AlertTriangle,
  Search,
  X,
  CalendarIcon,
  Package,
  ChevronDown,
  ChevronRight,
  User,
  Settings
} from 'lucide-react';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
import { getStatusColor } from './AdminUtils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type GroupedOrders = {
  [key: string]: {
    count: number;
    totalValue: number;
    orders: Order[];
  }
};
const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<unknown>(null);
  const [useMockData, setUseMockData] = useState(false);
  const [editingOrderStatus, setEditingOrderStatus] = useState<{ id: number, status: string } | null>(null);
  const [EditingitemQuantity, setEditingitemQuantity] = useState<{ id1: number, id2: number } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set()); // Track expanded orders
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<'none' | 'customer'>('none');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
  const [isDeliveryFeeDialogOpen, setIsDeliveryFeeDialogOpen] = useState(false);
  const [isOnoff, setisOnOff] = useState(false);
  const [fees, setFees] = useState({
    westBank: 0,
    jerusalem: 0,
    interior: 0,
  });
  const deliveryFeeSchema = z.object({
    westBank: z.coerce.number().min(0),
    jerusalem: z.coerce.number().min(0),
    interior: z.coerce.number().min(0),
  });
  type DeliveryFeeFormValues = z.infer<typeof deliveryFeeSchema>;
  
  const handlefess = async () => {
    try {
      const response = await globalApi.getdelivery();
      if (response) {
        const updatedFees = {
          westBank: response.westbank,
          jerusalem: response.jerusalem,
          interior: response.occupiedinterior,
        };
        setFees(updatedFees);
      form.reset(updatedFees); 
      } else {
        console.error('No delivery fees found');
      }
    } catch (error) {
      console.error('Error fetching delivery fees:', error);
    }
  };
  const form = useForm<DeliveryFeeFormValues>({
    
    resolver: zodResolver(deliveryFeeSchema),
    defaultValues: {
      westBank: fees.westBank,
      jerusalem: fees.jerusalem,
      interior: fees.interior,
    },
  });
  
  const fetchOrders = async () => {
    const respon = await globalApi.getmakeorder();
    setisOnOff(respon.allowmakeorder);     
    setIsLoadingOrders(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await orderApi.getAllOrders(token);
      setOrders(response);
      setOrdersError(null);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrdersError(error);
    } finally {
      setIsLoadingOrders(false);
    }
  };
  const handleDeleteitem= async (itemId: number,orderId:number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await orderApi.deleteItem(token, itemId,orderId);
      fetchOrders(); // refresh data

    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await orderApi.updateOrderStatus(token, orderId, status);
      setEditingOrderStatus(null);
      fetchOrders(); // refresh data
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await orderApi.deleteOrder(token, orderId);
      fetchOrders(); // refresh data
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  const toggleExpandOrder = (orderId: number) => {
    setExpandedOrders((prevExpandedOrders) => {
      const newExpandedOrders = new Set(prevExpandedOrders);
      if (newExpandedOrders.has(orderId)) {
        newExpandedOrders.delete(orderId); // Close the order if it's already expanded
      } else {
        newExpandedOrders.add(orderId); // Expand the order
      }
      return newExpandedOrders;
    });
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    fetchOrders();
    handlefess();
    
  

  }, []);
  

  const handleedititemQuantity = async (id2: number, id1: number) => {
   const respon = await orderApi.edititemQuantity(id2, id1, Number(inputValue));
   if (respon) {
    toast.success('Item quantity updated successfully');
    setEditingitemQuantity(null);
    fetchOrders();
   }
   else{
     toast.error('Failed to update item quantity');
   }
  }
  const confirmDelete = (orderId: number) => {
    handleDeleteOrder(orderId);
    setDeletingOrderId(null);
  };
  
  // Filter orders based on search query and date range
  const filteredOrders = orders.filter(order => {
    // Search filter - check if any field contains the search query
    const matchesSearch = searchQuery === '' || 
    (order.id2?.toString() || '').includes(searchQuery) ||
    (order.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.total?.toString() || '').includes(searchQuery) 
    //delete this ti not search using itmename
    ||
    (order.items || []).some(item => 
      (item.itemname || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      
    // Date filter
    const orderDate = new Date(order.date);
    const matchesDateFrom = !dateFilter.from || 
      isAfter(orderDate, new Date(dateFilter.from.setHours(0, 0, 0, 0)));
    
      const matchesDateTo = !dateFilter.to ||
       isBefore(orderDate, new Date(dateFilter.to.setHours(23, 59, 59, 999)));
    
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });
  
  // Group orders by customer if groupBy is set to 'customer'
  const groupedOrders: GroupedOrders = filteredOrders.reduce((acc, order) => {
    if (groupBy === 'none') return acc;
    
    const key = order.userName;
    
    if (!acc[key]) {
      acc[key] = {
        count: 0,
        totalValue: 0,
        orders: []
      };
    }
    
    acc[key].count += 1;
    acc[key].totalValue += order.total;
    acc[key].orders.push(order);
    
    return acc;
  }, {} as GroupedOrders);
  
  const toggleGroupExpansion = (key: string) => {
    if (expandedGroups.includes(key)) {
      setExpandedGroups(expandedGroups.filter(group => group !== key));
    } else {
      setExpandedGroups([...expandedGroups, key]);
    }
  };

  const clearDateFilter = () => {
    setDateFilter({});
  };
  
const toggle = async () => {
    const newStatus = !isOnoff;
    setisOnOff(newStatus);

    try {
      console.log(newStatus)
      await globalApi.setmakeorder(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }
  const formatDateRange = () => {
    if (dateFilter.from && dateFilter.to) {
      return `${format(dateFilter.from, 'MMM d, yyyy')} - ${format(dateFilter.to, 'MMM d, yyyy')}`;
    } else if (dateFilter.from) {
      return `From ${format(dateFilter.from, 'MMM d, yyyy')}`;
    } else if (dateFilter.to) {
      return `Until ${format(dateFilter.to, 'MMM d, yyyy')}`;
    }
    return 'Select date range';
  };
  const saveOrderAsPDF = async (orderId:number) => {
    await globalApi.printPDF(orderId);
    toast.success('PDF generated successfully');
  }
  ///////////////////////////////////////
  const handleDeliveryFeeSubmit = async (values: DeliveryFeeFormValues) => {
    try {
      const token = localStorage.getItem('authToken');
      // Send delivery fee updates to backend
      const response = await globalApi.setdelivery(token, values.westBank,values.jerusalem, values.interior,);
      toast.success('Delivery fees updated successfully');
      setIsDeliveryFeeDialogOpen(false);
    } catch (error) {
      console.error('Error updating delivery fees:', error);
      
     
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders Management</h2>
        <div className="flex gap-2">
        <Dialog open={isDeliveryFeeDialogOpen} onOpenChange={setIsDeliveryFeeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Delivery Fees
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Delivery Fees</DialogTitle>
                <DialogDescription>
                  Set the delivery fees for different areas. These values will be used when calculating order totals.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleDeliveryFeeSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="westBank"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>West Bank Delivery Fee (₪)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="1.00" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jerusalem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jerusalem Delivery Fee (₪)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="1.00" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interior"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interior Delivery Fee (₪)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min="0" step="1.00" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
        <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">Allow Order</span>
        <button
          onClick={toggle}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 ease-in-out
            ${isOnoff ? 'bg-green-500' : 'bg-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer active:scale-95`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 
              ${isOnoff ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
        <Select 
            value={groupBy} 
            onValueChange={(value: 'none' | 'customer') => setGroupBy(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No grouping</SelectItem>
              <SelectItem value="customer">Group by customer</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => fetchOrders()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            

        </div>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search orders by ID, customer, status, or product..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6" 
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full sm:w-[300px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
              {(dateFilter.from || dateFilter.to) && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDateFilter();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={{
                from: dateFilter.from,
                to: dateFilter.to
              }}
              onSelect={(range) => {
                setDateFilter(range || {});
                if (range?.to) {
                  setIsCalendarOpen(false);
                }
              }}
              className="p-3 pointer-events-auto"
              initialFocus
            />
          </PopoverContent>
        </Popover>
        </div>



      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
        {groupBy === 'customer' ?((filteredOrders.length <= 0 )?(
            <div className="p-4">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="text-center py-4">No orders found</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedOrders).map(([customer, data]) => (
                    <Card key={customer} className="overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleGroupExpansion(customer)}
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.includes(customer) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">{customer}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {data.count} order{data.count !== 1 ? 's' : ''}
                          </Badge>
                          <span className="font-semibold">{data.totalValue.toFixed(2)}₪</span>
                        </div>
                      </div>
                      {//make this as after
                      }
                      {expandedGroups.includes(customer) && (
                        <CardContent className="pt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Delivery Option</TableHead>
                                <TableHead>Delivery Fee</TableHead>
                                
                                <TableHead>Actions</TableHead>
                              </TableRow>
                              
                            </TableHeader>
                            <TableBody>
                {data.orders.map((order) => (
                  <React.Fragment key={order.id2}>
                    <TableRow>
                      <TableCell>#{order.id2}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          <Select
                            value={editingOrderStatus.status}
                            onValueChange={(value) => {
                              setEditingOrderStatus({ ...editingOrderStatus, status: value });
                            }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          )}
        </TableCell>
        <TableCell>{order.items.length}</TableCell>
        <TableCell>{order.total.toFixed(2)}₪</TableCell>
        <TableCell>{order.deliveryOption}</TableCell>
        <TableCell>{Number(order.deliveryFee).toFixed(2)}₪</TableCell>

        <TableCell>
          {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => setEditingOrderStatus(null)}>Cancel</Button>
              <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id2, editingOrderStatus.status)}>Save</Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => toggleExpandOrder(order.id2)}>
                <Package className="h-4 w-4 mr-2" />
                Details
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setEditingOrderStatus({ id: order.id2, status: order.status })}>
                <Pencil className="h-4 w-4 mr-2" />
                Status
              </Button>
              <Button  size="sm"
                              variant="outline"
                              onClick={() => saveOrderAsPDF(order.id2)}
                              
                               ><FontAwesomeIcon icon={faFilePdf} />Save</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-white hover:bg-red-500">
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
                      Are you sure you want to delete order #{order.id2}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteOrder(order.id2)} className="bg-red-500 hover:bg-red-600">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                    </AlertDialog>
                  </div>
                        )}
                </TableCell>
                </TableRow>

                {/* 👇 Expanded items row */}
              {expandedOrders.has(order.id2) && (
                              <TableRow>
                        <TableCell colSpan={10} className="bg-gray-100">
                          <ul >
                            {Array.isArray(order.items) && order.items.length ? (
                                   
                                      <li  className="py-1 pl-4">
                                    <table className="w-full">
                                    <thead>
                                    <tr>
                                    <th className="text-left ">Item</th>
                                    <th className="text-left">Quantity</th>
                                    <th className="text-left">Image</th>
                                    <th className="text-left">Price</th>
                                    <th className="text-left">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Iterate through items array for the current order */}
                                      {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                                        <tr key={index}>
                                          <td className="py-2">{item.itemname}</td>
                                          {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                                        <td className="py-2">
                                          <input
                                            type="text"
                                            onChange={handleInputChange}
                                            className="border rounded px-2 py-1"
                                          />
                                        <span className="ml-2 text-gray-500 italic">item before: {item.quantity}</span>

                                        </td>
                                      ) : (
                                      <td className="py-2">{item.quantity}</td>
                                      )}
                                      <td className="py-2">
                                        {item.image && <img src={item.image} alt={item.itemname} className="w-16 h-16" />}
                                      </td>
                                      <td className="py-2">
                                        {item.price && <span>{item.price.toFixed(2)}₪</span>}
                                      </td>
                                      <td>
                                      {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                                
                                  <div className="flex space-x-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingitemQuantity(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => handleedititemQuantity(order.id2,item.id1)}
                                    >
                                      Save
                                    </Button>
                                </div>):(
                                  <div className="flex space-x-2">
                                        <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-white hover:bg-red-500"
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
                                          Are you sure you want to delete order #{item.id1} ? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteitem(item.id1,order.id2)}
                                          className="bg-red-500 hover:bg-red-600"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={order.status === 'delivered'}
                                    onClick={() => setEditingitemQuantity({ id1:item.id1, id2:order.id2 })}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit
                                  </Button>
                                  </div>
                                )}
                                  </td>
                                    </tr>

                                  )
                                 )}
                                </tbody>
                              </table>
                            </li>

                                   
                                    
                                  ) : (
                                    <li className="py-1 pl-4">No items available</li>
                                  )}
                                </ul>
                              </TableCell>
                              
                            </TableRow>
                                            )}
                            </React.Fragment>
                            ))}
                            </TableBody>

                                </Table>
                                
                              </CardContent>
                            )}
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
              ):
              















              (<div className="p-4">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="text-center py-4">No orders found</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(groupedOrders).map(([customer, data]) => (
                    <Card key={customer} className="overflow-hidden">
                      <div 
                        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleGroupExpansion(customer)}
                      >
                        <div className="flex items-center gap-2">
                          {expandedGroups.includes(customer) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">{customer}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800">
                            {data.count} order{data.count !== 1 ? 's' : ''}
                          </Badge>
                          <span className="font-semibold">{data.totalValue.toFixed(2)}₪</span>
                        </div>
                      </div>
                      
                      {expandedGroups.includes(customer) && (
                        <CardContent className="pt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Delivery Option</TableHead>
                                <TableHead>Delivery Fee</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                              
                            </TableHeader>
                            <TableBody>
                   { data.orders.map((order) => (
                  <React.Fragment key={order.id2}>
                    <TableRow>
                      <TableCell>#{order.id2}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          <Select
                            value={editingOrderStatus.status}
                            onValueChange={(value) => {
                              setEditingOrderStatus({ ...editingOrderStatus, status: value });
                                    }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  )}
                      </TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>{order.total.toFixed(2)}₪</TableCell>
                      <TableCell>{order.deliveryOption}</TableCell>
                      <TableCell>{Number(order.deliveryFee).toFixed(2)}₪</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setEditingOrderStatus(null)}>Cancel</Button>
                            <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id2, editingOrderStatus.status)}>Save</Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => toggleExpandOrder(order.id2)}>
                              <Package className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingOrderStatus({ id: order.id2, status: order.status })}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Status
                            </Button>
                            <Button  size="sm"
                                    variant="outline"
                                    onClick={() => saveOrderAsPDF(order.id2)}
                                    
                                    ><FontAwesomeIcon icon={faFilePdf} />Save</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-white hover:bg-red-500">
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
                            Are you sure you want to delete order #{order.id2}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteOrder(order.id2)} className="bg-red-500 hover:bg-red-600">
                            Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                    </AlertDialogContent>
                        </AlertDialog>
                      </div>
                            )}
                    </TableCell>
                    </TableRow>

                    {/* 👇 Expanded items row */}
                  {expandedOrders.has(order.id2) && (
                              <TableRow>
                        <TableCell colSpan={10} className="bg-gray-100">
                          <ul >
                            {Array.isArray(order.items) && order.items.length ? (
                                <li  className="py-1 pl-4">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left">Item</th>
                              <th className="text-left">Quantity</th>
                              <th className="text-left">Image</th>
                              <th className="text-left">Price</th>
                              <th className="text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Iterate through items array for the current order */}
                            {order.items && Array.isArray(order.items) && 
                            order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2">{item.itemname}</td>
                                {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                                  <td className="py-2">
                                    <input
                                      type="text"
                                      onChange={handleInputChange}
                                      className="border rounded px-2 py-1"
                                    />
                                   <span className="ml-2 text-gray-500 italic">item before: {item.quantity}</span>

                                  </td>
                                ) : (
                                <td className="py-2">{item.quantity}</td>
                                )}
                                <td className="py-2">
                                  {item.image && <img src={item.image} alt={item.itemname} className="w-16 h-16" />}
                                </td>
                                <td className="py-2">
                                  {item.price && <span>{item.price.toFixed(2)}₪</span>}
                                </td>
                                <td>
                                {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingitemQuantity(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleedititemQuantity(order.id2,item.id1)}
                            >
                              Save
                            </Button>
                          </div>):(
                            <div className="flex space-x-2">
                                  <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-white hover:bg-red-500"
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
                                    Are you sure you want to delete order #{item.id1} ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteitem(item.id1,order.id2)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={order.status === 'delivered'}
                              onClick={() => setEditingitemQuantity({ id1:item.id1, id2:order.id2 })}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            </div>
                          )}
                            </td>
                              </tr>
                            ))
                            }
                          </tbody>
                        </table>
                      </li>

                            
                              
                            ) : (
                              <li className="py-1 pl-4">No items available</li>
                            )}
                          </ul>
                        </TableCell>
                        
                      </TableRow>
                              )}
              </React.Fragment>
              ))}
              </TableBody>

                          </Table>
                          
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>)) :
            ((filteredOrders.length < 0) ? 
        //here inded first
          (<Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Delivery Option</TableHead>
                <TableHead>Delivery Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingOrders  ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : orders && orders.length ? (
                orders.map((order) => (
                  <React.Fragment key={order.id2}>
                    <TableRow>
                      <TableCell>#{order.id2}</TableCell>
                      <TableCell>{order.userName}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          <Select
                            value={editingOrderStatus.status}
                            onValueChange={(value) => {
                              setEditingOrderStatus({ ...editingOrderStatus, status: value });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{order.total.toFixed(2)}₪</TableCell>
                      <TableCell>{order.deliveryOption}</TableCell>
                      <TableCell>{Number(order.deliveryFee).toFixed(2)}₪</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingOrderStatus(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id2, editingOrderStatus.status)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingOrderStatus({ id: order.id2, status: order.status })}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Status
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-white hover:bg-red-500"
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
                                    Are you sure you want to delete order #{order.id2}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteOrder(order.id2)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            {/* Show Items button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleExpandOrder(order.id2)}
                            >
                              {expandedOrders.has(order.id2) ? 'Hide Items' : 'Show Items'}
                            </Button>
                            <Button  size="sm"
                              variant="outline"
                              onClick={() => saveOrderAsPDF(order.id2)}
                              
                               ><FontAwesomeIcon icon={faFilePdf} />Save</Button>
                          </div>
                          
                        )}
                         
                      </TableCell>
                    </TableRow>

                    {/* Display items under the order when expanded */}
                    {expandedOrders.has(order.id2) && (
                      <TableRow>
                        <TableCell colSpan={10} className="bg-gray-100">
                          <ul>
                            {Array.isArray(order.items) && order.items.length ? (
                              
                                <li  className="py-1 pl-4">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left">Item</th>
                              <th className="text-left">Quantity</th>
                              <th className="text-left">Image</th>
                              <th className="text-left">Price</th>
                              <th className="text-left">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Iterate through items array for the current order */}
                            {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2">{item.itemname}</td>
                                {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                                  <td className="py-2">
                                    <input
                                      type="text"
                                      onChange={handleInputChange}
                                      className="border rounded px-2 py-1"
                                    />
                                   <span className="ml-2 text-gray-500 italic">item before: {item.quantity}</span>

                                  </td>
                                ) : (
                                <td className="py-2">{item.quantity}</td>
                                )}
                                <td className="py-2">
                                  {item.image && <img src={item.image} alt={item.itemname } className="w-16 h-16" />}
                                </td>
                                <td className="py-2">
                                  {item.price && <span>{item.price.toFixed(2)}₪</span>}
                                </td>
                                <td>
                                {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingitemQuantity(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleedititemQuantity(order.id2,item.id1)}
                            >
                              Save
                            </Button>
                          </div>):(
                            <div className="flex space-x-2">
                                  <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-white hover:bg-red-500"
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
                                    Are you sure you want to delete order #{item.id1} ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteitem(item.id1,order.id2)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={order.status === 'delivered'}
                              onClick={() => setEditingitemQuantity({ id1:item.id1, id2:order.id2 })}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            </div>
                          )}
                            </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </li>

                           
                              
                            ) : (
                              <li className="py-1 pl-4">No items available</li>
                            )}
                          </ul>
                        </TableCell>
                        
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>):
          ((<Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Delivery Option</TableHead>
                <TableHead>Delivery Fee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingOrders && !useMockData ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    Loading orders...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length>0  ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id2}>
                    <TableRow>
                      <TableCell>#{order.id2}</TableCell>
                      <TableCell>{order.userName}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          <Select
                            value={editingOrderStatus.status}
                            onValueChange={(value) => {
                              setEditingOrderStatus({ ...editingOrderStatus, status: value });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{order.total.toFixed(2)}₪</TableCell>
                      <TableCell>{order.deliveryOption}</TableCell>
                     <TableCell>{Number(order.deliveryFee).toFixed(2)}₪</TableCell>
                      <TableCell>
                        {editingOrderStatus && editingOrderStatus.id === order.id2 ? (
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingOrderStatus(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id2, editingOrderStatus.status)}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingOrderStatus({ id: order.id2, status: order.status })}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Status
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-white hover:bg-red-500"
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
                                    Are you sure you want to delete order #{order.id2}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteOrder(order.id2)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            {/* Show Items button */}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleExpandOrder(order.id2)}
                            >
                              {expandedOrders.has(order.id2) ? 'Hide Items' : 'Show Items'}
                            </Button>
                            <Button  size="sm"
                              variant="outline"
                              onClick={() => saveOrderAsPDF(order.id2)}
                              
                               ><FontAwesomeIcon icon={faFilePdf} />Save</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Display items under the order when expanded */}
                    {expandedOrders.has(order.id2) && (
                      <TableRow>
                        <TableCell colSpan={10} className="bg-gray-100">
                          <ul>
                            {Array.isArray(order.items) && order.items.length ? (
                              
                                <li  className="py-1 pl-4">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="text-left">Item</th>
                              <th className="text-left">Quantity</th>
                              <th className="text-left">Image</th>
                              <th className="text-left">Price</th>
                              <th className="text-left">Action</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {/* Iterate through items array for the current order */}
                            {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2">{item.itemname}</td>
                                {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                                  <td className="py-2">
                                    <input
                                      type="text"
                                      onChange={handleInputChange}
                                      className="border rounded px-2 py-1"
                                    />
                                   <span className="ml-2 text-gray-500 italic">item before: {item.quantity}</span>

                                  </td>
                                ) : (
                                <td className="py-2">{item.quantity}</td>
                                )}
                                <td className="py-2">
                                  {item.image && <img src={item.image} alt={item.itemname} className="w-16 h-16" />}
                                </td>
                                <td className="py-2">
                                  {item.price && <span>{item.price.toFixed(2)}₪</span>}
                                </td>
                                <td>
                                {EditingitemQuantity && EditingitemQuantity.id1 === item.id1 ? (
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingitemQuantity(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleedititemQuantity(order.id2,item.id1)}
                            >
                              Save
                            </Button>
                          </div>):(
                            <div className="flex space-x-2">
                                  <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-white hover:bg-red-500"
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
                                    Are you sure you want to delete order #{item.id1} ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteitem(item.id1,order.id2)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={order.status === 'delivered'}
                              onClick={() => setEditingitemQuantity({ id1:item.id1, id2:order.id2 })}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            </div>
                          )}
                            </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </li>

                          
                              
                            ) : (
                              <li className="py-1 pl-4">No items available</li>
                            )}
                          </ul>
                        </TableCell>
                        
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-4">
                    No orders found
                  </TableCell>
                </TableRow>
                )}
            </TableBody>
          </Table>
        )))}

        </div>
      </div>
      
    </>
  );
};

export default OrdersManagement;
