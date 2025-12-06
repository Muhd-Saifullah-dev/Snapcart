import NextAuth from "next-auth"
 import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
   Credentials({
      credentials: {
        email: { label: "email",type:"email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credential,request) {
        await connectDb()
        const email=credential.email
        const password=credential.password as string
        const user=await User.findOne({email})
        if(!user){
            throw new Error("user does not exist")
        }
        const isMatched=await bcrypt.compare(password,user.password)
        if(!isMatched){
       
            throw new Error("Invalid password")
        }
        return{
            id:user._id.toString(),
            email:user.email,
            name:user.name,
            role:user.role
        }
      },
    }),
    Google({
      clientId:process.env.CLIENT_ID,
      clientSecret:process.env.CLIENT_SECRET
    })
  ],
  callbacks:{
    async signIn({user,account}){
      if(account?.provider=="google"){
        await connectDb()
        let dbUser=await User.findOne({email:user.email})
        if(!dbUser){
         dbUser=await User.create({
            email:user.email,
            name:user.name,
            image:user.image,
            
          })
        }
        user.id=dbUser._id.toString()
        user.role=dbUser.role
        console.log(user)
      }
      return true
    },
    jwt({token,user}) {
        if(user){
            token.id=user.id
            token.name=user.name
            token.email=user.email
            token.role=user.role
        }
        return token
    },

    session({session,token}) {
        if(session.user){
            session.user.id=token.id as string
            session.user.email=token.email as string
            session.user.name=token.name as string
            session.user.role=token.role as string
        }
        return session
    },
  },
  pages:{
    signIn:"/login",
    error:"/login"
  },
  session:{
    strategy:"jwt",
    maxAge:10*24*60*60*1000
  },
  secret:process.env.AUTH_SECRET
})