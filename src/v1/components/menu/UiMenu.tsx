'use client'
import { Box, Button, ListItemIcon, Menu, MenuItem } from '@mui/material'
import React from 'react'

type Props = {
   itemJson: {
      title: string;
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
      icon?: any
   }[];
   buttonProps?: any
   title?: string
}




export default function UiMenu({ itemJson, buttonProps, title }: Props) {
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
            color='info'
            onClick={handleClick} {...buttonProps} >
            {title}
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
            {itemJson.map((item) => (
               <MenuItem
                  sx={{ px: 3, py: 1.5 }}
                  key={item.title}
                  onClick={(e: any) => {
                     handleClose()
                     item.onClick(e)
                  }}
               >
                  {item.icon &&
                     <ListItemIcon>
                        {item.icon}
                     </ListItemIcon>}

                  {item.title}
               </MenuItem>
            ))}

         </Menu>
      </Box>


   )
}
