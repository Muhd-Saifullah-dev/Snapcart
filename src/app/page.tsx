import { auth } from "@/auth";
import EditRoleMobile from "@/components/EditRoleMobile";
import Nav from "@/components/Nav";
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

const plainUser=JSON.parse(JSON.stringify(user))
  return (
    <>
    <Nav user={plainUser}/>
    </>
  );
}


export default Home