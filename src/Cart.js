import React from "react";
import { Button, Typography, Card, CardContent, Grid, CardMedia } from "@mui/material";

const Cart = ({
  cart,
  removeFromCart,
  moveToWishlist,
  incrementQuantity,
  decrementQuantity,
}) => {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Cart
      </Typography>
      {cart.length > 0 ? (
        <div>
          {cart.map((item) => (
            <Card key={item.id} style={{ marginBottom: "20px" }}>
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
                      onClick={() => decrementQuantity(item.id)}
                      disabled={item.quantity === 1}
                      variant="contained"
                      size="small"
                    >
                      -1
                    </Button>
                    <Button
                      onClick={() => incrementQuantity(item.id)}
                      variant="contained"
                      size="small"
                      style={{ marginLeft: "10px" }}
                    >
                      +1
                    </Button>
                    <Button
                      onClick={() => removeFromCart(item.id)}
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
