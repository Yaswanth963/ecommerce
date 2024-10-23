import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./custom.css";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [selectedPriceRange, setSelectedPriceRange] = useState(""); // Price range state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to load products.");
      }
    };
  
    fetchProducts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Handle price range select change
  const handlePriceRangeChange = (event) => {
    setSelectedPriceRange(event.target.value);
  };

  // Filter products based on search and selected price range
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);

    // Price range filtering logic
    let matchesPriceRange = true;
    if (selectedPriceRange === "below50") {
      matchesPriceRange = product.price < 50;
    } else if (selectedPriceRange === "50to100") {
      matchesPriceRange = product.price >= 50 && product.price <= 100;
    } else if (selectedPriceRange === "100to200") {
      matchesPriceRange = product.price >= 100 && product.price <= 200;
    }else if (selectedPriceRange === "200to300") {
      matchesPriceRange = product.price > 200 && product.price <= 300;
      }
      else if (selectedPriceRange === "300to400") {
        matchesPriceRange = product.price > 300 && product.price <= 400;
      }
    else if (selectedPriceRange === "above400") {
      matchesPriceRange = product.price > 400;
    }
    return matchesSearch && matchesPriceRange;
  });

  return (
    <div style={{ padding: "20px" }}>
      {/* Container for Search Bar and Price Filter */}
      <Box
        mb={4}
        sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
      >
        {/* Search Bar */}
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />

        {/* Price Range Dropdown */}
        <FormControl fullWidth>
          <InputLabel>Filter by Price</InputLabel>
          <Select
            value={selectedPriceRange}
            onChange={handlePriceRangeChange}
            label="Filter by Price"
          >
            <MenuItem value="">All Prices</MenuItem>
            <MenuItem value="below50">Below $50</MenuItem>
            <MenuItem value="50to100">$50 - $100</MenuItem>
            <MenuItem value="100to200">$100 - $200</MenuItem>
            <MenuItem value="200to300">$200 - $300</MenuItem>
            <MenuItem value="300to400">$300 - $400</MenuItem>
            <MenuItem value="above400">Above $400</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Product List */}
      <Grid container spacing={2} padding={5}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item xs={12} md={4} key={product.id}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
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
                    to={`/product/${product._id}`}
                    variant="contained"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary">
            No products match your search or price range.
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default ProductList;
