'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import { cn } from '@/lib/utils'
import Loader from '@/components/loader'

function AIBot() {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null)
    const [messages, setMessages] = useState<
        { role: "user" | "assistant"; text: string }[]
    >([{
        role: "assistant",
        text: `Hello, how can I assist you today? `,
    }]);


    // Initialize AI chat once per component lifecycle
    const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINIE_API_KEY });
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: [...messages.map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.text }],
        }))],
        config: {
            temperature: 0.5,
            maxOutputTokens: 1024,
        }
    });



    const fetchOpen = async () => {
        if (!input.trim()) { return };
        setLoading(true);
        setMessages((prev) => [...prev, { role: "user", text: input }]);
        try {
            endRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" })
            const responseStream = await chat.sendMessageStream({
                message: input,
            });
            let assistantReply = "";
            for await (const chunk of responseStream) {
                // Append new chunk text
                assistantReply += chunk.text;
                setMessages((prev) => {
                    if (prev.length === 0 || prev[prev.length - 1].role !== "assistant") {
                        return [...prev, { role: "assistant", text: assistantReply }];
                    } else {
                        endRef.current?.scrollIntoView({ behavior: 'smooth', block: "end" })
                        return [
                            ...prev.slice(0, -1),
                            { role: "assistant", text: assistantReply },
                        ];
                    }
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setInput("");
        }
    };


    //  make overflow hidden
    useEffect(() => {
        document.body.style.overflow = "hidden"
    }, [])
    return (
        <section className='flex flex-col h-full gap-1'>
            <ScrollArea className='h-[calc(100svh-160px)] max-w-5xl w-full mx-auto !overflow-auto flex flex-col border-2 rounded-lg px-4 py-4'>
                {messages.map((item, index) => (
                    <div
                        key={index}
                        className={cn("border-2 w-fit  max-w-4xl overflow-x-auto py-0.5 shadow-xl rounded-xl mb-2 ", {
                            "mr-auto rounded-tl-none": item.role === "assistant",
                            "ml-auto rounded-tr-none bg-primary/60": item.role === "user",
                        })}
                    >
                        <div className={cn("px-0.5 w-fit", {
                            "!ml-auto": item.role == 'user'
                        })}>
                            <Badge variant={'outline'} >{
                                item.role == "assistant" ? "Bot" : "You"
                            }</Badge>
                        </div>
                        <div className='px-3 py-1'>
                            <Markdown>{item.text}</Markdown>
                        </div>
                    </div>
                ))}
                <h1 ref={endRef} className='h-20'>{loading && <Loader />}</h1>
            </ScrollArea>
            <div className='h-[100px] flex justify-center gap-2'>
                <Textarea className='max-w-2xl h-20' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Ask something.' />
                <Button
                    size={'icon'}
                    onClick={fetchOpen}
                    disabled={loading || !input.trim()}
                >
                    {loading ? <Loader /> : <Send />}
                </Button>

            </div>
        </section>
    )
}

export default AIBot