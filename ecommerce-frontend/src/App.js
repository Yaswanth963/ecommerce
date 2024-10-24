import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import ProductDetails from "./ProductDetails";
import Cart from "./Cart";
import Wishlist from "./Wishlist";

const App = () => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch products from API using axios
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`); // Adjust the API route accordingly
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load products.");
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart and wishlist data from the database using axios
  useEffect(() => {
    const fetchCartWishlist = async () => {
      try {
        const cartResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`);
        const wishlistResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`);

        setCart(cartResponse.data?.[0]?.items);
        setWishlist(wishlistResponse.data);
      } catch (error) {
        toast.error("Failed to load cart/wishlist data.");
      }
    };
    fetchCartWishlist();
  }, []);

  // Sync cart and wishlist data to the API using axios
  const addToCart = async (product) => {
    const body={
      _id:product._id
    };
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, body);
      setCart(response.data);
      toast.success(`${product.name} added to cart.`);
    } catch (error) {
      toast.error("Failed to add item to cart.");
    }
  };

  const addToWishlist = async (product) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`, product);
      setWishlist(response.data);
      toast.success(`${product.name} added to wishlist.`);
    } catch (error) {
      toast.error("Failed to add item to wishlist.");
    }
  };

  const incrementQuantity = async (id) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/increment/${id}`);
      setCart(response.data);
      toast.success("Item quantity increased.");
    } catch (error) {
      toast.error("Failed to increment quantity.");
    }
  };

  const decrementQuantity = async (id) => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/decrement/${id}`);
      setCart(response.data);
      toast.success("Item quantity decreased.");
    } catch (error) {
      toast.error("Failed to decrement quantity.");
    }
  };

  const removeFromCart = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${id}`);
      setCart(response.data);
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error("Failed to remove item from cart.");
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/${id}`);
      setWishlist(response.data);
      toast.success("Item removed from wishlist.");
    } catch (error) {
      toast.error("Failed to remove item from wishlist.");
    }
  };

  const moveToWishlist = async (product) => {
    await removeFromCart(product.id);
    addToWishlist(product);
  };

  const moveToCart = async (product) => {
    await removeFromWishlist(product.id);
    addToCart(product);
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList products={products} />} />
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
              addToWishlist={addToWishlist}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              moveToWishlist={moveToWishlist}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
          }
        />
        <Route
          path="/wishlist"
          element={
            <Wishlist
              wishlist={wishlist}
              removeFromWishlist={removeFromWishlist}
              moveToCart={moveToCart}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
