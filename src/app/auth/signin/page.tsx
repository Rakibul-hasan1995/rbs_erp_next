import { redirect } from "next/navigation";
import SigninForm from "./SigninForm";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";


export default async function SignIn() {
   const session = await getServerSession(authOptions)

   if (session) {
      redirect('/v1/dashboard')
   }

   return (
      <SigninForm />
   );
}