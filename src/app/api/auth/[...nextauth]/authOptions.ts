import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "./verifyCredentials";

export const authOptions: NextAuthOptions = {
   session: {
      strategy: 'jwt', // Adjust based on your requirements
   },
   // pages: {
   //    signIn: '/auth/signin',
   // },
   
   providers: [
      Credentials({
         name: 'Credentials',
         credentials: {
            email: {},
            password: {},
         },
         async authorize(credentials) {
            try {
               const data = await verifyCredentials(credentials);
               console.log('Verification result:', data);

               if (data) {
                  return {
                     id: data._id,
                     email: data.email,
                     name: data.user_name,
                     image: JSON.stringify({ _id: data._id, roll: data.roll })
                  };
               }

               return null;
            } catch (error) {
               console.error('Error during authorization:', error);
               return null; // Handle errors appropriately
            }
         },
      }),
   ],
   secret: process.env.NEXT_AUTH_SECRET,
};

