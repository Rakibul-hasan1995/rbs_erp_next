import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Checkbox, Divider, IconButton, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { CustomScrollbarBox } from '@/v1/components/CustomScrollBox';
import { GoChevronDown } from 'react-icons/go';
import useCustomerServices from '@/hooks/useCustomerServices';
import { useRouter } from 'next/navigation';
import useOrderServices from '@/hooks/useOrderServices';

interface Option {
   secondaryText: string;
   value: string;
   _id: string
}


export default function Asynchronous() {
   const router = useRouter()


   // search menu functions========>>>
   type SearchIn = 'customers' | 'orders'

   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const openMenu = Boolean(anchorEl);
   const handleClose = () => {
      setAnchorEl(null);
   };
   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };
   const searchByItem = ['customers', 'orders']



   // search menu functions========>>>

   const [open, setOpen] = React.useState(false);
   const [options, setOptions] = React.useState<readonly Option[]>([]);
   const [loading, setLoading] = React.useState<boolean>(false)
   const [inputValue, setInputValue] = React.useState<string>('');
   const [searchIn, setSearchIn] = React.useState<SearchIn>('customers');


   const handleNavigation = (id: string) => {
      if (searchIn == 'customers') {
         setOptions([])
         return router.push(`/v2/customers/details?selected=${id}`)
      }
      if (searchIn == 'orders') {
         setOptions([])
         return router.push(`/v1/orders/profile/${id}`)
      }
   }



   const RenderOptions = (props: any, option: Option) => {
      const { key, ...otherProps } = props;  // Extract key prop
      return (
         <ListItem key={key} {...otherProps} onClick={() => handleNavigation(option._id)}>
            <ListItemText primary={option.value}
               secondary={option.secondaryText}
            />
         </ListItem>
      );
   }


   const { search: fetchOrder } = useOrderServices({ storeData: false })
   const fetchOrderData = async (text: string) => {
      setLoading(true)
      let data = await fetchOrder({ search: text, limit: 10, })
      const ModData = data?.map((item) => ({ secondaryText: item.customer.user_name, _id: item._id, value: `${item.program_name} ${item.order_name}` })) || []
      setOptions(ModData)
      setLoading(false)
   }


   const { fetchData: fetchCustomer } = useCustomerServices({ storeData: false })
   const fetchCustomerData = async (text: string) => {
      setLoading(true)
      let data: any = await fetchCustomer({ search: text, search_by: 'user_name', limit: 10, page: 1, expand: "false" })
      const ModData = data?.data?.data?.map((item: any) => ({ secondaryText: item.email, _id: item._id, value: item.name })) || []
      setOptions(ModData)
      setLoading(false)
   }

   const handleInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
      setInputValue(newInputValue);
      if (newInputValue.length < 3) {
         return
      }
      if (searchIn == 'customers') {
         fetchCustomerData(newInputValue)
      }
      if (searchIn == 'orders') {
         fetchOrderData(newInputValue)
      }
   };


   return (
      <>
         <Autocomplete
            id="asynchronous-demo"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
               setOpen(true);
            }}
            onClose={() => {
               setOpen(false);
            }}
            onChange={(_e, value) => {
               if (value?._id) {
                  handleNavigation(value._id)
               }
            }}

            inputValue={inputValue}
            onInputChange={handleInputChange}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            getOptionLabel={(option) => option.value}
            options={options}
            renderOption={RenderOptions}
            ListboxComponent={CustomScrollbarBox}
            loading={loading}
            size='small'
            renderInput={(params) => (
               <TextField
                  placeholder={`Search in ${searchIn}`}
                  {...params}
                  label=""
                  InputProps={{
                     ...params.InputProps,
                     endAdornment: (
                        <React.Fragment>
                           {loading ? <CircularProgress color="inherit" size={20} /> : null}
                           {params.InputProps.endAdornment}
                        </React.Fragment>
                     ),
                     startAdornment: (
                        <React.Fragment >
                           <IconButton size='small' onClick={handleClick}>
                              <FaMagnifyingGlass />
                           </IconButton>
                           <GoChevronDown />
                           {params.InputProps.endAdornment}
                        </React.Fragment>
                     ),
                  }}
               />
            )}
         />
         <Menu open={openMenu}
            onClose={handleClose}
            anchorEl={anchorEl}
         >
            <Typography m={2} fontStyle={'italic'} align='center'>Search In </Typography>
            <Divider />
            {searchByItem.map((item: any) => (
               <MenuItem
                  key={item}
                  sx={{ minWidth: '300px' }}
                  onClick={() => setSearchIn(item)}
               >
                  <ListItemIcon>
                     <Checkbox
                        edge="start"
                        checked={Boolean(searchIn == item)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': item }}
                     />
                  </ListItemIcon>
                  <ListItemText id={item} primary={item} />
               </MenuItem>
            ))}
         </Menu>
      </>
   );
}

