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
import "./custom.css";

const ProductDetails = ({ addToCart, addToWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch("/products.json")
      .then((response) => response.json())
      .then((data) => {
        const foundProduct = data.find((p) => p.id === parseInt(id));
        setProduct(foundProduct);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
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
            image={product.image} // Assuming the JSON has an "image" property with the image URL
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
  );
};

export default ProductDetails;
