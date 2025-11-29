import mongoose from "mongoose";

interface IUSER {
    _id?: mongoose.Schema.Types.ObjectId
    name: string
    email: string
    password: string
    mobile?: string
    role: "user" | "deliveryBoy" | "admin"
}

const userSchema = new mongoose.Schema<IUSER>({
    name: {
        type: String,
        required:true
    },
    email: { 
        type: String, 
        unique: true,
         required: true 
        },
    password: { 
        type: String,
        required:true
     },
     mobile:{
        type:String,
        required:false
     },
     role:{
        type:String,
        enum:["user","deliveryBoy","admin"],
        default:"user"

     }


}, { timestamps: true })

const User=mongoose.models.User ||   mongoose.model("User",userSchema);
export default User