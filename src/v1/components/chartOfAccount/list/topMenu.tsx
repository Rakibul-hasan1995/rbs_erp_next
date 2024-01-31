'use client'
import { Box, Button,  Menu, MenuItem } from '@mui/material'
import React from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

export default function COAListTopMenu() {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };
   return (
      <Box>
         <Button
            endIcon={!open ? <IoIosArrowDown /> : <IoIosArrowUp />}
            size='large'
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
         >
            Dashboard
         </Button>
         <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
               'aria-labelledby': 'basic-button',
            }}
         >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
         </Menu>
      </Box>


   )
}
