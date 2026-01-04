import { NextResponse } from "next/server";
import axios from "axios";

// 🔧 PASTE YOUR N8N URL HERE AGAIN
const N8N_WEBHOOK_URL = "https://rahulydv.app.n8n.cloud/webhook/93ed3f41-19d4-4ef2-b25a-4f2016a9aa5e";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Next.js Server talks to n8n (No CORS issues here!)
        const response = await axios.post(N8N_WEBHOOK_URL, body);

        // 2. Return the n8n data back to your Frontend
        return NextResponse.json(response.data);

    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json(
            { error: "Failed to connect to AI Brain" },
            { status: 500 }
        );
    }
}