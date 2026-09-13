import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useAuthStore } from "@sr/store/useAuthStore";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", to: "/" },
  { label: "Corretores", to: "/corretores" },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { corretor, logout } = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box className="min-h-screen flex bg-[#f6f1ea]">
      <Box
        component="aside"
        className="w-64 shrink-0 bg-[#16332b] text-white flex flex-col p-6"
      >
        <Typography variant="h5" fontWeight={700} className="mb-8">
          Habita
        </Typography>

        <List className="flex-1">
          {menuItems.map((item) => (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              end={item.to === "/"}
              sx={{
                borderRadius: 2,
                mb: 1,
                color: "white",
                "&.active": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>

        <Divider className="!border-white/10 mb-4" />
        <Typography variant="body2" className="text-white/70 mb-3">
          {corretor?.nome}
        </Typography>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleLogout}
          className="normal-case"
        >
          Sair
        </Button>
      </Box>

      <Box component="main" className="flex-1 p-8">
        <Outlet />
      </Box>
    </Box>
  );
}
