import React from "react";
import { List, ListItem, ListItemText, Paper } from "@mui/material";

const ListItems = ({ items, onItemClick }) => {
  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
      <List>
        {items.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={() => onItemClick && onItemClick(item)}
          >
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ListItems;
