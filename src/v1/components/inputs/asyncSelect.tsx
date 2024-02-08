

import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export interface AsyncSelectOptionOption {
   label: string;
   value: any;
   avatar?: string;
}

interface Props {
   onSelect: (arg: AsyncSelectOptionOption) => void;
   loadOption: (arg: string) => void;
   options: AsyncSelectOptionOption[];
   defaultValue?: AsyncSelectOptionOption | null;
   error?: string | any;
   label: string;
   sx?: any;
   placeholder?: string;
   autoFocus?: boolean;
   inputRef?: (arg: React.Ref<any>) => void
}

const AsynchronousSelect = React.forwardRef(({
   onSelect,
   loadOption,
   options,
   defaultValue,
   error,
   label,
   sx,
   autoFocus = false,
   placeholder = '',
   inputRef = () => { }
}: Props, ref?: React.ForwardedRef<HTMLInputElement>) => {
   const [inputValue, setInputValue] = useState<string>('');
   const [selectedOption, setSelectedOption] = useState<AsyncSelectOptionOption | null>(
      defaultValue || null
   );

   const handleInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
      setInputValue(newInputValue);
      if (selectedOption?.label !== newInputValue) {
         loadOption(newInputValue);
      }
   };

   return (
      <Autocomplete

         autoFocus={autoFocus}
         filterSelectedOptions
         value={selectedOption}
         options={options}
         getOptionLabel={(option) => option.label}
         isOptionEqualToValue={(option, value) => true}
         size="small"
         onChange={(_event, newValue: AsyncSelectOptionOption | null) => {
            setSelectedOption(newValue);
            if (newValue) {
               onSelect(newValue);
            }
         }}
         sx={sx}
         inputValue={inputValue}
         onInputChange={handleInputChange}
         renderOption={(props: any, option) => (
            <li
               key={option.label}
               onClick={props.onClick}
               className={props.className}
               onMouseMove={props.onMouseMove}
               role={props.role}
               onTouchStart={props.onTouchStart}
               tabIndex={props.tabIndex}
               aria-selected={props['aria-selected']}
               aria-disabled={props['aria-disabled']}
               id={props.id}
               data-option-index={props['data-option-index']}
            >
               {option.avatar && (
                  <img
                     src={option.avatar}
                     alt={option.label}
                     style={{ marginRight: '8px', width: '50px', height: '50px', borderRadius: '25%' }}
                  />
               )}
               {option.label}
            </li>
         )}
         renderInput={(params) => (
            <TextField
               inputRef={(inpRef) => inputRef(inpRef)}
               // autoFocus={autoFocus}
               {...params}
               placeholder={placeholder}
               error={Boolean(error)}
               helperText={error}
               label={label}
               InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                     <>
                        {params.InputProps.endAdornment}
                        {selectedOption?.avatar && (
                           <img
                              src={selectedOption.avatar}
                              alt={selectedOption.label}
                              style={{ marginLeft: '8px', width: '30px', height: '30px', borderRadius: '50%' }}
                           />
                        )}
                     </>
                  ),
               }}
            />
         )}
         clearOnBlur
         clearOnEscape

      />
   );
})

export default AsynchronousSelect;
