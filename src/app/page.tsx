import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import connectDb from "@/lib/db";
import User from "@/model/user.model";
import { redirect } from "next/navigation";


async function Home() {
await connectDb()
const session=await auth()
console.log("session ",session)
const user=await User.findById(session?.user?.id)
if(!user){
  redirect("/login")
}

const inComplete=!user.mobile || !user.role ||(!user.mobile && user.role=="user")

if(inComplete){
return <EditRoleMobile/>
}

  return (
    <h1 className="underline text-3xl">Hello world</h1>
  );
}


export default Home