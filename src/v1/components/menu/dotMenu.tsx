'use client'
import { Box, ExtendButtonBase, IconButton, IconButtonTypeMap, ListItemIcon, Menu, MenuItem, Typography } from '@mui/material'
import React from 'react'
import { BiUser } from 'react-icons/bi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

type Props = {
   itemJson: {
      title: string;
      onClick: () => void;
      icon?: any
   }[];
   icon?: any;
   iconSize?: 'small' | 'medium';
   iconColor?: "default" | "error" | "primary" | "secondary" | "info" | "success" | "warning" | "inherit"
}




export default function DotMenu({ itemJson, icon, iconSize, iconColor }: Props) {
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
         <IconButton
            size={iconSize}
            color={iconColor || 'info'}
            onClick={handleClick} >
            {icon ? icon : <HiOutlineDotsHorizontal />}
         </IconButton>
         <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
               'aria-labelledby': 'basic-button',
            }}
         >
            {itemJson.map((item) => (
               <MenuItem
                  key={item.title}
                  onClick={() => {
                     handleClose()
                     item.onClick()
                  }}
               >
                  {item.icon &&
                     <ListItemIcon>
                        {item.icon}
                     </ListItemIcon>}

                  {item.title}</MenuItem>
            ))}

         </Menu>
      </Box>


   )
}
