
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2, X } from 'lucide-react';
import { supportChatbot, type SupportChatbotInput, type SupportChatbotOutput } from '@/ai/flows/support-chatbot';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useChatbot } from '@/contexts/chatbot-context';
import { useLanguage } from '@/contexts/language-context'; 

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export default function ChatbotWidget() {
  const { language: currentSelectedLanguage, mounted: languageMounted } = useLanguage(); 
  const { isChatbotOpen, setIsChatbotOpen } = useChatbot();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (languageMounted) {
      setMessages([
        {
          id: 'initial-bot-message',
          sender: 'bot',
          text: currentSelectedLanguage === 'amharic' 
            ? "ሰላም! እኔ የኢዚሜድስ የድጋፍ ቦት ነኝ። በዛሬው ዕለት በትዕዛዝ፣ ምርመራ ወይም የጤና መረጃ እንዴት ልረዳዎት እችላለሁ?" 
            : "Hello! I'm EasyMeds support bot. How can I help you today with orders, tests, or health information?",
        },
      ]);
    }
  }, [languageMounted, currentSelectedLanguage]);


  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isChatbotOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !languageMounted) return; 

    const userMessageText = inputValue;
    setInputValue(''); 

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMessageText,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const input: SupportChatbotInput = {
        query: userMessageText,
        language: currentSelectedLanguage, 
      };
      const output: SupportChatbotOutput = await supportChatbot(input);
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: output.response,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling chatbot:', error);
      const errorMessageText = currentSelectedLanguage === 'amharic'
        ? 'ይቅርታ፣ ጥያቄዎን በማስኬድ ላይ ችግር አጋጥሞኛል። እባክዎ ከጥቂት ደቂቃዎች በኋላ እንደገና ይሞክሩ።'
        : 'Sorry, I encountered an issue processing your request. Please try again in a few moments.';
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: errorMessageText,
      };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        variant: 'destructive',
        title: currentSelectedLanguage === 'amharic' ? 'የቻትቦት ስህተት' : 'Chatbot Error',
        description: currentSelectedLanguage === 'amharic' ? 'ከቻትቦቱ ምላሽ ማግኘት አልተቻለም።' : 'Could not get a response from the chatbot.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!languageMounted) { 
    return <div className="fixed bottom-6 right-6 w-16 h-16" aria-hidden="true" />;
  }

  return (
    <Sheet open={isChatbotOpen} onOpenChange={setIsChatbotOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="fixed bottom-6 right-6 rounded-full shadow-xl w-16 h-16 p-0 bg-primary hover:bg-primary/90 transform transition-all hover:scale-110 focus:ring-4 focus:ring-primary/50"
          aria-label="Open support chat"
          data-ai-hint="chat bubble"
        >
          {isChatbotOpen ? <X className="h-8 w-8 text-primary-foreground" /> : <MessageSquare className="h-8 w-8 text-primary-foreground" /> }
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-md flex flex-col p-0 data-[state=open]:shadow-2xl">
        <SheetHeader className="p-4 border-b bg-card">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <Bot className="text-primary h-6 w-6" /> 
            {currentSelectedLanguage === 'amharic' ? 'ኢዚሜድስ ድጋፍ' : 'EasyMeds Support'}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {currentSelectedLanguage === 'amharic' 
              ? 'ስለ ትዕዛዞች፣ ምርቶች፣ ምርመራዎች ወይም አጠቃላይ የጤና መረጃ ይጠይቁ።' 
              : 'Ask about orders, products, tests, or general health info.'}
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="flex-1 bg-background" viewportRef={scrollViewportRef}>
          <div className="p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2 w-full',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'bot' && (
                  <Bot className="w-7 h-7 text-primary shrink-0 mb-1 p-1 bg-primary/10 rounded-full" />
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm shadow-sm',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  )}
                >
                  {message.text.split('\\n').map((line, index) => ( 
                    <span key={index}>
                      {line}
                      {index < message.text.split('\\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
                {message.sender === 'user' && (
                  <User className="w-7 h-7 text-muted-foreground shrink-0 mb-1 p-1 bg-muted rounded-full" />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <Bot className="w-7 h-7 text-primary shrink-0 mb-1 p-1 bg-primary/10 rounded-full" />
                <div className="max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm shadow-sm bg-secondary text-secondary-foreground rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="p-3 border-t bg-card">
          <form
            className="flex w-full items-center space-x-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Input
              type="text"
              placeholder={currentSelectedLanguage === 'amharic' ? 'መልዕክትዎን እዚህ ያስገቡ...' : 'Type your message...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 h-11 text-base focus-visible:ring-primary"
              disabled={isLoading}
              aria-label="Chat message input"
            />
            <Button type="submit" size="icon" className="h-11 w-11 bg-primary hover:bg-primary/90" disabled={isLoading || !inputValue.trim()}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
