import connectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { data } from "motion/react-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const { name, email, password } = await req.json()
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        if (password < 6) {
            return NextResponse.json({ message: "password at least 6 character long" }, { status: 400 })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name, email, password: hashPassword
        })

        return NextResponse.json({ message: "user created successfully",data:user }, { status: 201 })

    }
    catch (err) {
        return NextResponse.json({ message: `error in register user ${err}` }, { status: 500 })
    }
}