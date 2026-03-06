import React, { useState,useContext} from "react";
import { Avatar, colors, IconButton, Menu, MenuItem } from "@mui/material";
import { AuthContext } from "../context/AuthContext.jsx";
import { UserIcon } from "./Icons";
import { ClassNames } from "@emotion/react";

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
    const { user, logoutUser } = useContext(AuthContext);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton sx={{ bgcolor: '#15803d',border: '1px solid #facc15' }} onClick={handleOpen}> {/* { bgcolor: '#15803d', '&:hover': '&:hover': { boxShadow: '0 4px 6px rgba(21, 128, 61, 0.4)' } } */}
        <Avatar sx={{ bgcolor: '#15803d' }}>{user?.name?.charAt(0) || 'U'}</Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        <MenuItem onClick={logoutUser}>Logout</MenuItem>
      </Menu>
    </>
  );
}
