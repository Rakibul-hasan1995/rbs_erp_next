import updateChallanValidate from "@/app/api/lib/validation/updateChallanValidate";

export const updateChallan = async (Model: any, id: string, body: any) => {
   try {

      const challan = await Model.findById(id)

      if (!challan) {
         return {
            code: 400,
            message: 'challan not found'
         }
      }
      const validate = updateChallanValidate(body);

      if (!validate.isValid) {
         return {
            code: 400,
            data: validate.error,
            message: 'Bad Request'
         }
      }
      if (validate.data.challan_no) {
         const existChallan = await Model.find({ challan_no: validate.data.challan_no })
         if (existChallan.length) {
            if (existChallan.length !== 1) {
               console.log(existChallan.length)
               return { code: 400, message: 'Bad Request', data: [{ field: 'challan_no', value: `Challan no -${validate.data.challan_no} is Already Exist1` }] }
            } else if (existChallan[0]._id.toString() !== challan._id.toString()) {
               return { code: 400, message: 'Bad Request', data: [{ field: 'challan_no', value: `Challan no -${validate.data.challan_no} is Already Exist2` }] }
            }
         }
      }


      Object.assign(challan, validate.data)
    
      await challan.save();
      return {
         code: 200,
         data: challan,
         message: 'Successfully Update Data'
      }


   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }

}