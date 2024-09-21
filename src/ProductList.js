import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";
import "./custom.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/products.json`)
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <Grid container spacing={2} padding={5}>
      {products.map((product) => (
        <Grid item xs={12} md={4} key={product.id}>
          <Card className="product-card">
            <CardMedia
              component="img"
              height="200"
              image={product.image} // Assuming product.image contains the URL of the product image
              alt={product.name}
              className="product-image"
            />
            <CardContent>
              <Typography variant="h5">{product.name}</Typography>
              <Typography className="description">
                {product.description.length > 100
                  ? product.description.substring(0, 100) + "..."
                  : product.description}
              </Typography>
              <Typography>${product.price}</Typography>
              <Button
                component={Link}
                to={`/product/${product.id}`}
                variant="contained"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductList;
