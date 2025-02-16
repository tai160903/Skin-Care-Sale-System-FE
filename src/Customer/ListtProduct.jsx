import { List, ListItem, ListItemText, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import productSerivce from "../services/productService";

const ListProduct = () => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <List>
        {data.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ListProduct;
