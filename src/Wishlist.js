import React,{useEffect,useState} from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Import Shopping Cart icon
import "./custom.css";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlistItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`);
            setWishlist(response.data?.items);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        }
    };

    fetchWishlistItems();
}, []);

  const removeFromWishlist = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist/${id}`);
      setWishlist(response.data);
      toast.success("Item removed from wishlist.");
    } catch (error) {
      toast.error("Failed to remove item from wishlist.");
    }
  };

  const moveToCart = async (product) => {
    await removeFromWishlist(product.productId._id);
    addToCart(product);
  };

  const addToCart = async (product) => {
    const body = {
      productId: product?.productId._id,
      quantity: 1
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, body);
      toast.success(`${product.name} added to cart.`);
    } catch (error) {
      toast.error("Failed to add item to cart.");
    }
  };
  
  return (
    <div className="wishlist-container">
      <Typography variant="h4" align="center" gutterBottom>
        Wishlist
      </Typography>
      <Grid container spacing={2} padding={5}>
        {wishlist?.length === 0 ? (
          <Typography variant="h6" align="center">
            Your wishlist is empty!
          </Typography>
        ) : (
          wishlist?.map((item) => (
            <Grid item xs={12} md={4} key={item.productId._id}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={item.productId.image}
                  alt={item.productId.name}
                />
                <CardContent>
                  <Typography variant="h5" className="product-name">
                    {item.productId.name.length > 20
                      ? item.productId.name.substring(0, 20) + "..."
                      : item.productId.name}
                  </Typography>
                  <Button
                    onClick={() => removeFromWishlist(item.productId._id)}
                    variant="outlined"
                    className="action-button"
                    startIcon={<DeleteIcon />}
                  ></Button>
                  <Button
                    onClick={() => moveToCart(item)}
                    variant="outlined"
                    style={{ marginLeft: "10px" }}
                    className="action-button"
                    startIcon={<ShoppingCartIcon />}
                  ></Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
};

export default Wishlist;