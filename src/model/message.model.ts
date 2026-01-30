import mongoose from "mongoose";

interface IMessage{
        _id?:mongoose.Types.ObjectId,
    roomId:mongoose.Types.ObjectId,
    text:string,
    senderId:mongoose.Types.ObjectId,
    time:string,
        createdAt?:Date,
     updatedAt?:Date

}

const messageSchema=new mongoose.Schema<IMessage>({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    text:{
        type:String
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    time:String

},{timestamps:true})

messageSchema.index({roomId:1,createdAt:1})
const Message=mongoose.models.Message || mongoose.model("Message",messageSchema)

export  default Message
