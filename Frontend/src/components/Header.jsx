import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";

const unauthenticatedPages = ["Home", "Sign Up", "Login"];
const authenticatedPages = ["Dashboard", "Profile"];
const settings = ["Profile", "Setting", "Dashboard", "Logout"];

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageClick = async (page) => {
    if (page === "Home") {
      navigate("/");
      return;
    }
    if (page === "Dashboard" && isAuthenticated) {
      navigate("/dashboard");
      return;
    }
    if (page === "Profile" && isAuthenticated) {
      navigate("/profile");
      return;
    }
    if (page === "Setting" && isAuthenticated) {
      navigate("/setting");
      return;
    }
    if (page === "Logout" && isAuthenticated) {
      try {
        logout();
        navigate("/");
      } catch (error) {
        console.error("Logout failed:", error);
      }
      return;
    }
    if (page === "Login" && !isAuthenticated) {
      navigate("/login");
    } else if (page === "Sign Up" && !isAuthenticated) {
      navigate("/signup");
    } else {
      navigate("/notFound");
    }
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const currentPages = isAuthenticated
    ? authenticatedPages
    : unauthenticatedPages;

  return (
    <AppBar position="static" sx={{ backgroundColor: "#CA7F2A" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#C10008",
              textDecoration: "none",
            }}
          >
            GameStore
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#C10008" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {currentPages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography sx={{ textAlign: "center", color: "#C10008" }}>
                    {page}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#C10008",
              textDecoration: "none",
            }}
          >
            GameStore
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {currentPages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{ my: 2, color: "#C10008", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {isAuthenticated && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handlePageClick(setting)}
                  >
                    <Typography sx={{ textAlign: "center", color: "#357E1F" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
