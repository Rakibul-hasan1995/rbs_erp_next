'use client'
import { Box, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import React from 'react'
import { BiUser } from 'react-icons/bi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

type Props = {
   itemJson: [{
      title: string;
      onClick: () => void;
      icon?: any
   }]
}




export default function DotMenu({ itemJson }: Props) {
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
            color='info' onClick={handleClick} >
            <HiOutlineDotsHorizontal />
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
                  {item.icon && <ListItemIcon>
                     {item.icon}
                  </ListItemIcon>}

                  {item.title}</MenuItem>
            ))}

         </Menu>
      </Box>


   )
}
