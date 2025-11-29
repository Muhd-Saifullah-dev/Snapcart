import { Connection } from "mongoose"

declare global{
    var mangoose:{
        conn:Connection | null,
        promise:Promise<Connection> | null
    }
}

export {}