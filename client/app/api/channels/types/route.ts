import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("http://localhost:8888/channel/type", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Backend error:", errorData);
            
            const defaultData = {
                success: true,
                data: [
                    {
                        id: 1,
                        name: "Đăng bài viết tự động bằng AI",
                        slug: "auto-posting"
                    },
                    {
                        id: 2,
                        name: "Chatbot tự động",
                        slug: "chatbot"
                    }
                ]
            };
            return NextResponse.json(defaultData);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to fetch service types:", error);
        
        const defaultData = {
            success: true,
            data: [
                {
                    id: 1,
                    name: "Đăng bài viết tự động bằng AI",
                    slug: "auto-posting"
                },
                {
                    id: 2,
                    name: "Chatbot tự động",
                    slug: "chatbot"
                }
            ]
        };
        return NextResponse.json(defaultData);
    }
} 