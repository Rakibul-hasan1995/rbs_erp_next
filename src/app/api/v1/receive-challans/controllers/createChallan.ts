import challanValidate from "@/app/api/lib/validation/createChalanValidate"

export const createChallan = async (ReceiveChallan: any, body: any, ) => {
   try {
      const validate = challanValidate(body)
      if (!validate.isValid) {
         return { code: 400, message: 'Bad Request', data: validate.error }
      }
      const existChallan = await ReceiveChallan.findOne({ challan_no: validate.data.challan_no })
      if (existChallan) {
         return { code: 400, message: 'Bad Request', data: [{ field: 'challan_no', value: `Challan no -${validate.data.challan_no} is Already Exist` }] }
      }
      const challan = new ReceiveChallan(validate.data)
      await challan.save()

      return { code: 201, data: challan, links: [{ self: `/api/v1/receive-challans/${challan._id}` }] }

   } catch (error: any) {
      const response = {
         code: 500,
         error,
         message: error.message,
      };
      return response
   }

}