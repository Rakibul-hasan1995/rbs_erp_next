import productionUpdateValidate from "@/app/api/lib/validation/updateProductionValidate";
import { Production } from "@/app/api/mongoose/model/Production";

export const updateProduction = async (id: string, body: any) => {
   try {
      const updateProduction = await Production.findById(id);

      if (!updateProduction) {
         return {
            code: 400,
            message: 'Data Not Found'
         }
      }
      const validate = productionUpdateValidate(body);

      if (!validate.isValid) {
         return {
            code: 400,
            data: validate.error,
            message: 'Bad Request'
         }
      }
      console.log(validate.updates)


      Object.assign(updateProduction, validate.updates)


      // Save the updated production document
      await updateProduction.save();

      return {
         code: 200,
         data: updateProduction,
         message: 'Successfully Update Data'
      }
   } catch (error: any) {
      return {
         code: 500,
         error,
         message: error.message
      }
   }
};

