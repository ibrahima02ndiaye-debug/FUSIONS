'use client';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Send, Loader2, Bot } from 'lucide-react';
import { answerCustomerQuestions } from '@/ai/flows/answer-customer-questions';

type Message = {
  id: number;
  sender: 'user' | 'ai';
  text: string;
};

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm IBRA's AI assistant. How can I help you today with your car or our services?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await answerCustomerQuestions({
        question: input,
        customerName: 'Alex Ray',
        vehicleInfo: '2021 Honda Civic, VIN: 1HGCV1...',
        garageServices: 'Oil changes, brake repairs, tire rotation, engine diagnostics, AC service.',
      });
      const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: result.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-0">
        <div className="mb-6">
            <h1 className="text-3xl font-bold font-headline">AI Chat Assistant</h1>
            <p className="text-muted-foreground">Get instant answers and assistance for your questions.</p>
        </div>
        <Card className="h-[calc(100vh-12rem)] w-full max-w-4xl mx-auto flex flex-col">
            <CardHeader className="flex flex-row items-center gap-3">
                <Bot className="h-8 w-8 text-primary"/>
                <div>
                    <CardTitle className="font-headline">IBRA Service OS Assistant</CardTitle>
                    <CardDescription>Powered by Google Gemini</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                        key={msg.id}
                        className={cn('flex items-end gap-2', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                        >
                        {msg.sender === 'ai' && (
                            <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={20} /></AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={cn(
                            'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2',
                            msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/avatar1/100/100" />
                            <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                        )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-end gap-2 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot size={20} /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg px-4 py-2 flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                <div className="border-t p-4">
                    <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about service costs, appointment times, etc."
                        className="pr-12"
                        disabled={isLoading}
                        />
                        <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        disabled={isLoading || !input.trim()}
                        >
                        <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    </form>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
