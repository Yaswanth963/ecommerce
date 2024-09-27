import React from "react";
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
import "./custom.css"; // Assuming you have this for custom styling

const Wishlist = ({ wishlist, removeFromWishlist, moveToCart }) => {
  return (
    <div className="wishlist-container">
      <Typography variant="h4" align="center" gutterBottom>
        Wishlist
      </Typography>
      <Grid container spacing={2} padding={5}>
        {wishlist.length === 0 ? (
          <Typography variant="h6" align="center">
            Your wishlist is empty!
          </Typography>
        ) : (
          wishlist.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="h5" className="product-name">
                    {item.name.length > 20
                      ? item.name.substring(0, 20) + "..."
                      : item.name}
                  </Typography>
                  <Button
                    onClick={() => removeFromWishlist(item.id)}
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
