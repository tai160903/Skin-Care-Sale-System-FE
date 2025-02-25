import {
    Card,
    Avatar,
    Typography,
    Button,
    Box,
    IconButton,
  } from "@mui/material";
  import { Edit, Lock } from "@mui/icons-material";
  import { Facebook, Twitter, LinkedIn, Instagram } from "@mui/icons-material";
  
  const Profile = () => {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Card
          sx={{
            maxWidth: 400,
            p: 2,
            textAlign: "center",
            boxShadow: 3,
          }}
        >
          <Avatar
            src="https://via.placeholder.com/150"
            alt="Profile Picture"
            sx={{ width: 100, height: 100, mx: "auto", mb: 2, cursor: "pointer" }}
            onClick={() => alert("Change Profile Picture")}
          />
          <Typography variant="h5" fontWeight="bold" sx={{ cursor: "pointer" }} onClick={() => alert("Change Name")}> 
            John Doe
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Software Engineer
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Passionate about building scalable web applications and user-friendly
            interfaces.
          </Typography>
          <Box display="flex" justifyContent="center" gap={1}>
            <IconButton color="primary">
              <Facebook />
            </IconButton>
            <IconButton color="primary">
              <Twitter />
            </IconButton>
            <IconButton color="primary">
              <LinkedIn />
            </IconButton>
            <IconButton color="primary">
              <Instagram />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap={1} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={() => alert("Edit Profile")}
            >
              Edit Profile
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<Lock />}
              onClick={() => alert("Change Password")}
            >
              Change Password
            </Button>
          </Box>
        </Card>
      </Box>
    );
  };
  
  export default Profile;
