import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontSize={25}>E-Cart</Typography>
        <div>
          <Button color="inherit" component={Link} to="/">
            Products
          </Button>
          <IconButton color="inherit" component={Link} to="/wishlist">
            <FavoriteIcon />
          </IconButton>
          <IconButton color="inherit" component={Link} to="/cart">
            <ShoppingCartIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
