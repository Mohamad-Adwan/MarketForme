
import React, { useState, useEffect } from 'react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Product } from '@/types';
import { Search, Filter } from 'lucide-react';
import { productApi } from '@/services/apiService';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
    const [Items, setItems] = useState<Product[]>([]);
    useEffect(() => {
      const fetchItems = async () => {
        try {
          const items = await productApi.getAll(); // Assuming this fetches products
          setItems(items);
        } catch (error) {
          console.error('Failed to fetch cart items:', error);
        }
      };
      fetchItems();
    }, []);
  // Extract unique categories
  const categories = ['all', ...new Set(Items.map(product => product.category))];
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(Items);

  // Apply filters
  useEffect(() => {
    let result = [...Items];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, categoryFilter]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length === 0 ?(searchQuery.length ===0 ?(
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Items.map((product) => (
            <ProductCard key={product.id1} product={product} />
          ))}
        </div>): (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No products match your search criteria.
          </p>
        </div>
      ) ): (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id1} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
