import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./custom.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const addToCart = async (product) => {
    const body = {
      productId: product?._id,
      quantity: 1
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, body);
      toast.success(`${product.name} added to cart.`);
    } catch (error) {
      toast.error("Failed to add item to cart.");
    }
  };

  const addToWishlist = async (product) => {
    const body ={
      productId:product?._id
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/wishlist`, body);
      toast.success(`${product.name} added to wishlist.`);
    } catch (error) {
      toast.error("Failed to add item to wishlist.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load product details.");
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "80vh" }}
      >
        <Grid item xs={12} md={8} lg={6}>
          <Card className="product-details-card">
            <CardMedia
              component="img"
              alt={product.name}
              height="300"
              image={product.image}
              title={product.name}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Typography variant="h5" color="primary">
                ${product.price}
              </Typography>
              <div className="button-container">
                <Button
                  onClick={() => addToCart(product)}
                  variant="contained"
                  size="large"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => addToWishlist(product)}
                  variant="outlined"
                  size="large"
                  style={{ marginLeft: "10px" }}
                >
                  Add to Wishlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductDetails;