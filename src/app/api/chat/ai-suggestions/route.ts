import connectDb from '@/lib/db';
import axios from 'axios';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { message, role } = await req.json();
        const prompt = `You are a professional delivery assistent chatbot
    
    You will be given:
    -role:either "user" or "delivery_boy"
    -last message:the last message sent in the conversation
    
    Your task:
    👉 If role is "user"-> generate 3 short Whatsapp-style reply Suggestions that a user could send to the delivery boy
    👉 If role is "delivery_boy" -> generate 3 short Whatsapp-style reply suggestions that a delivery boy could send to the user
    ⚠️ Follow these rules:
    - Replies must match the context of the last message.
    - Keep replies short,human-like (max 10 word)
    - Use emojis naturally (max one per reply),
    - No generic replies  like "Okay" or "Thank you".
    - Must be helpful, respectful,and relevant to delivery,status,help,or location.
    -No numbering,No extra intructions,No extra text.
    - Just return comma-separated reply suggestions
    
    Return only the three reply suggestions,comma-separated.
    
    Role:${role}
    Last message:${message}`;
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        const data = await response.data;
        const replyText = data.candidates[0].content.parts[0].text || '';
        const suggest = replyText.split(',').map((s: string) => s.trim());
        return NextResponse.json(suggest, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: `error in gemini api ${error} ` },
            { status: 500 }
        );
    }
}
