import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const [cart, setCart] = useState([]);

  // Fetch cart items from the API
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`);
      setCart(response.data?.[0]?.items || []);
    } catch (error) {
      toast.error("Failed to load cart data.");
    }
  };

  // Fetch cart on component mount
  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.length > 0 ? cart.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0;

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/${id}`);
      setCart(prevCart => prevCart.filter(item => item._id !== id));
      toast.success("Item removed from cart.");
    } catch (error) {
      toast.error("Failed to remove item from cart.");
    }
  };

  const incrementQuantity = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/increment/${id}`);
      setCart(prevCart => 
        prevCart.map(item => 
          item._id === id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      );
      toast.success("Item quantity increased.");
    } catch (error) {
      toast.error("Failed to increment quantity.");
    }
  };

  const decrementQuantity = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/decrement/${id}`);
      setCart(prevCart => {
        const updatedCart = prevCart.map(item => 
          item._id === id 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        ).filter(item => item.quantity > 0); // Remove item if quantity is 0
        return updatedCart;
      });
      toast.success("Item quantity decreased.");
    } catch (error) {
      toast.error("Failed to decrement quantity.");
    }
  };

  const moveToWishlist = async (item) => {
    // Assuming you have a function to handle moving items to the wishlist
    // Implement your wishlist API call here if required
    await removeFromCart(item._id);
    // Add to wishlist logic here...
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {cart.length > 0 ? (
        <div>
          {cart.map((item) => (
            <Card key={item._id} style={{ marginBottom: "20px" }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <CardMedia
                      component="img"
                      image={item.image} // Ensure your product object has an 'image' property
                      alt={item.name}
                      style={{ height: "100px", objectFit: "cover" }} // Adjust height as needed
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2">
                      ${item.price} x {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      onClick={() => decrementQuantity(item._id)}
                      disabled={item.quantity === 1}
                      variant="contained"
                      size="small"
                    >
                      -1
                    </Button>
                    <Button
                      onClick={() => incrementQuantity(item._id)}
                      variant="contained"
                      size="small"
                      style={{ marginLeft: "10px" }}
                    >
                      +1
                    </Button>
                    <Button
                      onClick={() => removeFromCart(item._id)}
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
