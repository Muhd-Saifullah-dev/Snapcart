import nodemailer from "nodemailer";


const transport=nodemailer.createTransport({
    port: 587,
  service:"gmail",
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
})

transport.verify((error)=>{
    if(error){
        console.error("Mail server error ",error)
    }
    else{
        console.log("Mail server ready")
    }
})

export const sendMail=async(toEmail:string,subject:string,html:string)=>{
    try {
        await transport.sendMail({
           to:toEmail,
           from:`"Snapcart" < ${process.env.EMAIL} >`,
           subject:subject,
           html:html
        })

        await transport.close()
        return true
    } catch (error) {
        console.log("send mail error",error)
        return false
    }
}