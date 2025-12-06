import { getToken } from "next-auth/jwt"
import { NextRequest,NextResponse} from "next/server"


export async function proxy(req:NextRequest) {
  const {pathname}=req.nextUrl
  // console.log(pathname)
  const publicRoutes=["/login","/register","/api/auth"]
  if(publicRoutes.some((path)=>pathname.startsWith(path))){
    return NextResponse.next()
  }
  const token=await getToken({req,secret:process.env.AUTH_SECRET})
  console.log("token is here",token)
  console.log("req url ",req.url)
  if(!token){
    const loginUrl=new URL("/login",req.url)
    loginUrl.searchParams.set("callback",req.url)
    // console.log("login url ",loginUrl)
      return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config={
  matcher:'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
}