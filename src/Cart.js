import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  const total = cart.reduce((acc, item) => acc + item.productId.price * item.quantity, 0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`); 
      setCart(response.data?.items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const moveToWishlist = async (product) => {
    await removeFromCart(product.productId._id);
    addToWishlist(product);
  };

  const addToWishlist = async (product) => {
    const body = {
      productId: product?.productId._id
    };
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`, body);
      toast.success(`${product.productId.name} added to wishlist.`);
    } catch (error) {
      toast.error("Failed to add item to wishlist.");
    }
  };

  const incrementQuantity = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/cart/increment/${id}`);
      toast.success("Item quantity increased.");
      fetchCartItems();
    } catch (error) {
      toast.error("Failed to increment quantity.");
    }
  };

  const decrementQuantity = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/cart/decrement/${id}`);
      toast.success("Item quantity decreased.");
      fetchCartItems(); 
    } catch (error) {
      toast.error("Failed to decrement quantity.");
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${id}`);
      fetchCartItems(); 
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error("Failed to remove item from cart.");
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {cart.length > 0 ? (
        <div>
          {cart.map((item) => (
            <Card key={item.productId._id} style={{ marginBottom: "20px" }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <CardMedia
                      component="img"
                      image={item.productId.image}
                      alt={item.productId.name}
                      style={{ height: "100px", objectFit: "cover" }}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h6">{item.productId.name}</Typography>
                    <Typography variant="body2">
                      ${item.productId.price} x {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={() => decrementQuantity(item.productId._id)}
                      disabled={item.quantity === 1}
                      variant="contained"
                      size="small"
                    >
                      -1
                    </Button>
                    <Button
                      onClick={() => incrementQuantity(item.productId._id)}
                      variant="contained"
                      size="small"
                      style={{ marginLeft: "10px" }}
                    >
                      +1
                    </Button>
                    <Button
                      onClick={() => removeFromCart(item.productId._id)}
                      variant="outlined"
                      size="small"
                      style={{ marginLeft: "10px" }}
                    >
                      Remove
                    </Button>
                    <Button
                      onClick={() => moveToWishlist(item)}
                      variant="contained"
                      color="primary"
                      size="small"
                      style={{ marginLeft: "10px" }}
                    >
                      Move to Wishlist
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          <Typography variant="h6" style={{ marginTop: "20px" }}>
            Total: ${total.toFixed(2)}
          </Typography>
        </div>
      ) : (
        <Typography>Your cart is empty.</Typography>
      )}
    </div>
  );
};

export default Cart;
