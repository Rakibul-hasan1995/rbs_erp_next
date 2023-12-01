import { userRolls } from "../../mongoose/model/appConfig";

interface ValidatorError {
   field: string;
   value: string
}


const userValidate = (user: any) => {
   let error: ValidatorError[] = []
   if (!user.email) {
      error.push({ field: 'email', value: '! email is required' })
   } else {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const validate = regex.test(user.email)
      if (!validate) {
         error.push({ field: 'email', value: '! invalid email' })
      }
   }
   if (!user.user_name) {
      error.push({ field: 'user_nam', value: '! user name is required' })
   } else if (user.user_name.length < 2) {
      error.push({ field: 'user_nam', value: '! invalid user name' })
   }
   if (!user.roll) {
      error.push({ field: 'roll', value: '! roll is required' })
   } else {
      const existRoll = userRolls.find((item) => item == user.roll)
      if (!existRoll) {
         error.push({ field: 'roll', value: '! invalid roll' })
      }
   }
   if (!user.contact_details?.address) {
      error.push({ field: 'address', value: 'Please Enter address' })
   }
   return {
      error,
      isValid: error.length === 0
   }
}
const userSignupValidate = (user: any) => {
   let error: ValidatorError[] = []
   if (!user.email) {
      error.push({ field: 'email', value: '! email is required' })
   } else {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const validate = regex.test(user.email)
      if (!validate) {
         error.push({ field: 'email', value: '! invalid email' })
      }
   }
   if (!user.password) {
      error.push({ field: 'password', value: '! password is required' })
   } else if (user.password.length < 5 || user.password.length >= 100) {
      error.push({ field: 'password', value: `! password is too ${user.password.length <= 5 ? 'sort' : 'long'}` })
   }

   return {
      error,
      isValid: error.length === 0
   }
}
export { userValidate, userSignupValidate }
