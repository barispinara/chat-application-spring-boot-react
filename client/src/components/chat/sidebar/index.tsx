import { SettingsTwoTone, Logout } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography, useTheme, alpha, Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { getAllChatRoomsOfUser } from "../../../redux/slices/chatRoomSlice";
import ChatListTab from "./ChatListTab";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useThemeContext } from "../../../context/ThemeContext";
import { logout } from "../../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  React.useEffect(() => {
    dispatch(getAllChatRoomsOfUser());
  }, [dispatch]);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
      }}
    >
      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                borderColor: alpha(theme.palette.primary.main, 0.4),
              },
              mr: 1.5
            }}
          >
            {user?.firstName[0]}
          </Avatar>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                letterSpacing: "0.5px",
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "0.875rem",
              }}
            >
              Online
            </Typography>
          </Box>
          <IconButton
            onClick={handleOpenSettings}
            sx={{
              p: 1,
              color: theme.palette.primary.main,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                transform: "rotate(15deg)",
              },
              ml: "auto"
            }}
            size="small"
          >
            <SettingsTwoTone fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Chats Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
        }}
      >
        <ChatListTab />
      </Box>

      {/* Settings Dialog */}
      <Dialog
        open={isSettingsOpen}
        onClose={handleCloseSettings}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            pb: 2,
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
            }}
          >
            Settings
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Theme Toggle */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </Typography>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  color: theme.palette.primary.main,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              >
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Box>

            {/* Logout Button */}
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                mt: 2,
                py: 1,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                borderColor: alpha(theme.palette.error.main, 0.5),
                color: theme.palette.error.main,
                "&:hover": {
                  borderColor: theme.palette.error.main,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Sidebar;
