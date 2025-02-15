import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const StatsCard = ({ title, value }) => {
  return (
    <Grid item xs={12} sm={4}>
      <Card sx={{ textAlign: "center", p: 2 }}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default StatsCard;
