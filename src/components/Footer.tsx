
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ShopEase</h3>
            <p className="text-muted-foreground text-sm">
              Your one-stop shop for premium products with excellent service and competitive prices.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-muted-foreground hover:text-primary text-sm">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Returns & Refunds
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">
                Email: info@techshop.com
              </li>
              <li className="text-muted-foreground text-sm">
                Phone: (+970) 595-642-327
              </li>
              <li className="text-muted-foreground text-sm">
                Address: Tulkrem, Palestine
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tech-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
