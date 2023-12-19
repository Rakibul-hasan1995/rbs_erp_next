

'use client'

import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Collapse } from '@mui/material';
import { AiOutlineMenu } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io';
import { MdKeyboardBackspace, MdOutlineLogout, MdWbSunny } from 'react-icons/md';
import { RiSunLine } from 'react-icons/ri';
import Link from 'next/link';
import { useThemeContext } from '@/v1/context/themeContext';
import { usePathname, useRouter } from 'next/navigation';

import styles from './style.module.css';
import { MenuItem, routeStructure } from './sideMenuItems';

const CustomScrollbarBox = styled(Box)({
   '&::-webkit-scrollbar': {
      display: 'none',
   },
   overflow: 'auto',
});

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
   width: drawerWidth,
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
   }),
   overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   overflowX: 'hidden',
   width: `calc(${theme.spacing(7)} + 1px)`,
   [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
   },
});

const DrawerHeader = styled('div')(({ theme }) => ({
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'flex-end',
   padding: theme.spacing(0, 1),
   ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
   open?: boolean;
}

const AppBar = styled(MuiAppBar, {
   shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
   zIndex: theme.zIndex.drawer + 1,
   transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
   }),
   ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,

      transition: theme.transitions.create(['width', 'margin'], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   }),
}));

const CustomDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
   ({ theme, open }) => ({
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      ...(open && {
         ...openedMixin(theme),
         '& .MuiDrawer-paper': openedMixin(theme),
      }),
      ...(!open && {
         ...closedMixin(theme),
         '& .MuiDrawer-paper': closedMixin(theme),
      }),
   }),
);

const Sidebar = ({ children, active = 'people sdf' }: { children: any; active?: string }) => {

   //   window.addEventListener("beforeunload", (ev) => {
   //       ev.preventDefault();
   //       return ev.returnValue = 'Are you sure you want to close?';
   //    });

   const router = useRouter();

   const [open, setOpen] = React.useState(false);
   // const [activeName, setActiveName] = React.useState('');


   const handleDrawerOpen = () => {
      setOpen(true);
   };

   const handleDrawerClose = () => {
      setOpen(false);
   };

   const Item = ({ item }: { item: MenuItem }) => {
      const Component = item.parent ? MultiItems : SingleItem;
      return <Component item={item} />;
   };

   const SingleItem = ({ item }: { item: MenuItem }) => {
      const pathName = usePathname()
      const isActive = pathName == item.link

      return (
         <ListItem disablePadding sx={{ display: 'block' }}>
            <Link href={item.link || '#'} passHref legacyBehavior>
               <ListItemButton
                  selected={Boolean(isActive)}
                  sx={{
                     minHeight: 48,
                     justifyContent: open ? 'initial' : 'center',
                     px: 2.5,
                     color: isActive ? 'primary.main' : 'text.primary',
                     fontWeight: isActive ? 'bold' : 'normal',
                  }}
               >
                  <ListItemIcon
                     sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? 'primary.main' : 'text.primary',
                     }}

                  >
                     {item.icon !== 'dot' ? <item.icon /> : <BsDot />}
                  </ListItemIcon>
                  <ListItemText
                     primary={item.title}
                     sx={{ opacity: open ? 1 : 0, }}
                  />
               </ListItemButton>
            </Link>
         </ListItem>
      );
   };

   const MultiItems = ({ item }: { item: MenuItem }) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const handleClick = () => {
         handleDrawerOpen();
         setIsOpen((prev) => !prev);
      };

      const pathName = usePathname()
      const arr = item.name.split('.');
      const itemName = arr[arr.length - 1];
      // const isActive = pathName.includes(itemName);
      const isActive = Boolean(item.child?.find((child) => child.link == pathName))
      // const find = item.child?.find((child)=> child.link == pathName)
      // console.log(find)









      return (
         <React.Fragment>
            <ListItem disablePadding sx={{ display: 'block' }}>
               {/* <Link href={item?.link || '#'} passHref legacyBehavior> */}
               <ListItemButton
                  onClick={handleClick}
                  selected={isActive}
                  sx={{
                     minHeight: 48,
                     justifyContent: open ? 'initial' : 'center',
                     px: 2.5,
                     color: isActive ? 'primary.main' : 'text.primary',
                     fontWeight: isActive ? 'bold' : 'normal',
                  }}
               >
                  <ListItemIcon
                     sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isActive ? 'primary.main' : 'text.primary',
                     }}
                  >
                     {item.icon !== 'dot' ? <item.icon /> : <BsDot />}
                  </ListItemIcon>
                  <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0, }} />
                  <IoIosArrowDown className={isOpen && styles.collapseIcon} />
               </ListItemButton>
               {/* </Link> */}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
               <List component="div" disablePadding>
                  {item?.child?.map((child: any, key: any) => (
                     <Item key={key} item={child} />
                  ))}
               </List>
            </Collapse>
         </React.Fragment>
      );
   };

   const { toggleDarkMode, isDarkMode, title } = useThemeContext();

   return (
      <Box sx={{ display: 'flex' }}>
         <AppBar position="fixed" open={open}>
            <Toolbar>
               <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                     marginRight: 5,
                     ...(open && { display: 'none' }),
                  }}
               >
                  <AiOutlineMenu />
               </IconButton>
               <IconButton
                  onClick={() => router.back()}
                  color="inherit"
                  sx={{
                     marginRight: 5,
                  }}
               >
                  <MdKeyboardBackspace />
               </IconButton>
               <Typography variant="h6" noWrap component="div">
                  {title}
               </Typography>
               <Box ml={'auto'}>
                  <IconButton onClick={() => alert('please add function in sidebar:271')}>
                     <MdOutlineLogout />
                  </IconButton>
               </Box>
            </Toolbar>

         </AppBar>
         <CustomDrawer variant="permanent" open={open}>
            <DrawerHeader>
               <Box width={'100%'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                  Monapy
                  <IconButton onClick={handleDrawerClose}>
                     <IoIosArrowBack />
                  </IconButton>
               </Box>
            </DrawerHeader>
            <Divider />
            <CustomScrollbarBox >
               {routeStructure?.map((item) => (
                  <React.Fragment key={item.name}>
                     <Item item={item} />
                  </React.Fragment>
               ))}
            </CustomScrollbarBox>
            <Divider />
            <Box sx={{ mx: 'auto', mt: 'auto' }}>
               <IconButton onClick={toggleDarkMode}>
                  {isDarkMode ? <MdWbSunny /> : <RiSunLine />}
               </IconButton>
            </Box>
         </CustomDrawer>
         <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
            <DrawerHeader />
            {children}
         </Box>
      </Box>
   );
};

export default Sidebar;
