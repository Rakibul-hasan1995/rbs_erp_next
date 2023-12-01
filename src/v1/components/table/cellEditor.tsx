
// // DateEditor.js
// import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
// import moment from 'moment';
// import { Axios } from '../../utils/axios-config';

// // const DateEditor = forwardRef((params: any, ref) => {
// //    const [date, setDate] = useState(new Date(params.value));
// //    useImperativeHandle(ref, () => ({
// //       getValue() {
// //          return moment(date).format('yy-MM-DD') // Convert the edited date back to the original format.
// //       },
// //    }));

// //    return (
// //       <div className="p-2 dark:bg-base-dark-secondary rounded-md bg-base-light-primary dark:text-base-dark-text text-black h-auto border-red-200 shadow-sm">
// //          <StandardInput type='date' onChange={(e) => setDate(e)} value={moment(date).format('yy-MM-DD')}
// //             label={''} name={''} onBlur={() => { }} />
// //       </div>
// //    );
// // });

// const CustomerEditor = forwardRef((_params: any, ref) => {

//    const [customerName, setCustomerName] = useState('')
//    const [customer, setCustomer] = useState([{ label: '', value: '' }])
//    const [selectedCustomer, setSelectedCustomer] = useState('')
//    const [customerSearchText, setCustomerSearchText] = useState('a')




//    useEffect(() => {
//       const debounceTimeout = setTimeout(() => {
//          const find = customer.find((item) => item.label?.includes(customerSearchText))
//          if (!find) {
//             fetchCustomer()
//          }
//       }, 1000);

//       return () => {
//          // Cleanup: Clear the debounce timeout when the component unmounts or when searchTerm changes
//          clearTimeout(debounceTimeout);
//       };
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//    }, [customerSearchText]);


//    const fetchCustomer = async () => {
//       try {
//          const { data } = await Axios
//             .get(`/api/v1/users?roll=customer${customerSearchText ? `&search_by=user_name&search=${customerSearchText}` : ''}`)
//          const customers = data.data.map((item: any) => { return { value: item._id, label: item.user_name } })

//          setCustomer(customers)
//       } catch (error) {
//          console.log(error)
//       }
//    }

//    const handleClientChange = (value: string) => {
//       const find = customer.find((item) => item.label == value)
//       if (find) {
//          setSelectedCustomer(find.value)
//       }
//    }

//    useImperativeHandle(ref, () => ({
//       getValue() {
//          return selectedCustomer // Convert the edited date back to the original format.
//       },
//    }));

//    return (
//       <div className="p-2 dark:bg-base-dark-secondary rounded-md bg-base-light-primary dark:text-base-dark-text text-black h-auto border-red-200 shadow-sm">
//          <SelectStandardInput
//             optionsArray={customer}
//             error={null}
//             type="text"
//             label={"Customer *"}
//             value={customerName}
//             onBlur={() => { }}
//             onChange={(e: any) => {
//                const value = e.target.value
//                setCustomerSearchText(value)
//                handleClientChange(value)
//                setCustomerName(value)
//             }}
//          // {...field}
//          />
//       </div>
//    );
// });

// export { DateEditor, CustomerEditor }
