// import { NextFunction, Response, Request } from "express";
// import { accountValidation } from "../../../../lib/account/createAccountValidation";
// import { Account } from "../../../../model/account";

// export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
//    try {
//       const id = req.params._id
//       const { account_name,description = '', status = 'active' } = req.body
      
//       const account = await Account.findById(id)
//       if (!account) {
//          return res.status(400).json({
//             code: 400,
//             message: 'account not found'
//          })
//       }

//       const validate = accountValidation(req.body);

//       if (!validate.isValid) {
//          return res.status(400).json({
//             code: 400,
//             data: validate.error,
//             message: 'Bad Request'
//          });
//       }

//       Object.assign(account, { account_name, description, status })

//       await account.save();
//       return res.status(200).json({
//          code: 200,
//          data: account,
//          message: 'Successfully Update Data'
//       });


//    } catch (error) {
//       next(error)
//    }

// }