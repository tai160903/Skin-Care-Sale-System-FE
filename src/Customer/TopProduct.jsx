import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Typography,
    Button,
  } from "@mui/material";
  
  const products = [
    {
      id: 1,
      name: "Kem chống nắng La Roche-Posay",
      price: "450,000 VND",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Sữa rửa mặt Cetaphil",
      price: "300,000 VND",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Kem dưỡng ẩm Neutrogena",
      price: "500,000 VND",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Tẩy tế bào chết Paula's Choice",
      price: "600,000 VND",
      image: "https://via.placeholder.com/150",
    },
  ];
  
  const TopProduct = () => {
    return (
      <Container>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ mt: 4 }}>
          Sản phẩm chăm sóc da bán chạy
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary">{product.price}</Typography>
                </CardContent>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: "auto" }}
                >
                  Thêm vào giỏ hàng
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

export default TopProduct;
