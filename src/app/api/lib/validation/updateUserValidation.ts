import { userRolls } from "../../mongoose/model/appConfig";

interface ValidatorError {
   field: string;
   value: string;
}

export const updateUserValidation = (data: any) => {
   let error: ValidatorError[] = [];
   let updates: any = {}

   if ('email' in data) {
      updates.email = data.email
      if (!data.email) {
         error.push({ field: 'email', value: '! email is required' })
      } else {
         const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
         const validate = regex.test(data.email)
         if (!validate) {
            error.push({ field: 'email', value: '! invalid email' })
         }
      }
   }
   if ('user_name' in data) {
      updates.user_name = data.user_name

      const length = data.user_name?.length
      if (length < 5 || length > 50) {
         error.push({ field: 'user_name', value: `user name is too ${length > 5 ? 'long' : 'sort'}` });
      }
   }
   if ('roll' in data) {
      updates.roll = data.roll
      const existRoll = userRolls.find((item) => item == data.roll)
      if (!existRoll) {
         error.push({ field: 'roll', value: '! invalid roll' })
      }
   }
   if ('contact_details' in data) {
      updates.contact_details = {}
      const value = data.contact_details

      if ('address' in value) {
         updates.contact_details.address = value.address
         if (value.address?.length < 10) {
            error.push({ field: 'address', value: 'Please Enter valid address' })
         }
      }
      if ('phone' in value) {
         updates.contact_details.phone = value.phone
         if (value.phone?.length < 10) {
            error.push({ field: 'phone', value: 'Please Enter valid Phone' })
         }
      }
      if ('contactParsonName' in value) {
         updates.contact_details.contactParsonName = value.contactParsonName
         if (value.contactParsonName?.length < 3) {
            error.push({ field: 'contactParsonName', value: 'Please Enter valid Name' })
         }
      }
   }


   return {
      error,
      isValid: error.length === 0,
      updates
   };
};