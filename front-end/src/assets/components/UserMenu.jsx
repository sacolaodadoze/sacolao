import React, { useState, useContext } from "react";
import { Avatar, colors, IconButton, Menu, MenuItem } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

import { AuthContext } from "../context/AuthContext.jsx";

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
      <Tooltip title={`${user?.name || "User"}`}>
        <IconButton
          title={`${user?.name || "User"}`}
          size="small"
          className="btn-login"
          /* sx={{ bgcolor: '#15803d',border: '1px solid #facc15' }}  */ onClick={
            handleOpen
          }
        >
          {" "}
          {/* { bgcolor: '#15803d', '&:hover': '&:hover': { boxShadow: '0 4px 6px rgba(21, 128, 61, 0.4)' } } */}
          <Avatar className="btn-login">
            {user?.name?.charAt(0) || "U"}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        <MenuItem onClick={logoutUser}>Sair</MenuItem>
      </Menu>
    </>
  );
}
