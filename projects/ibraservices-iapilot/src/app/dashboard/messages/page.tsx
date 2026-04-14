'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { chatContacts, messageHistory, type ChatContact, type Message } from '@/lib/data';
import { Phone, Send, Search } from 'lucide-react';

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<ChatContact>(chatContacts[0]);
  const [messages, setMessages] = useState<Message[]>(messageHistory[selectedContact.id]);

  const handleSelectContact = (contact: ChatContact) => {
    setSelectedContact(contact);
    setMessages(messageHistory[contact.id] || []);
  };

  return (
    <div className="h-[calc(100vh-10rem)]">
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-3xl font-bold font-headline">Messages</h1>
            <p className="text-muted-foreground">Direct communication with your customers.</p>
            </div>
      </div>
      <Card className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
        <div className="col-span-1 border-r flex flex-col">
          <CardHeader className='p-4'>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8" />
            </div>
          </CardHeader>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chatContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                    selectedContact.id === contact.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  )}
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
          <div className="border-b p-4 flex items-center justify-between">
            {selectedContact && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedContact.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedContact.vehicle}</p>
                </div>
              </div>
            )}
            <Button variant="destructive" size="sm">
              <Phone className="mr-2 h-4 w-4" />
              SOS Call
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-end gap-2',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.sender === 'support' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2',
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                  </div>
                  {msg.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-12" />
              <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      </Card>
    </div>
  );
}
