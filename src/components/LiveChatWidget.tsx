import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, User, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_type: "user" | "agent" | "system" | "bot";
  sender_name?: string;
  created_at: string;
}

interface Conversation {
  id: string;
  status: string;
  assigned_agent_id?: string;
}

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing conversation on mount
  useEffect(() => {
    if (user && isOpen) {
      loadExistingConversation();
    }
  }, [user, isOpen]);

  // Subscribe to new messages in real-time
  useEffect(() => {
    if (!conversation?.id) return;

    const channel = supabase
      .channel(`chat-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add if it's not from the current user (avoid duplicates)
          if (newMessage.sender_type !== "user") {
            setMessages((prev) => [...prev, newMessage]);
            setAgentTyping(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation?.id]);

  const loadExistingConversation = async () => {
    if (!user) return;

    try {
      // Find open conversation for this user
      const { data: existingConv, error: convError } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["open", "assigned"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (convError) throw convError;

      if (existingConv) {
        setConversation(existingConv);
        
        // Load messages
        const { data: messagesData, error: msgError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", existingConv.id)
          .order("created_at", { ascending: true });

        if (msgError) throw msgError;
        setMessages(messagesData || []);
      } else {
        // Add welcome message
        setMessages([{
          id: "welcome",
          content: "👋 Hi! Welcome to Global Embrace support. How can we help you today?",
          sender_type: "system",
          sender_name: "Support",
          created_at: new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const startConversation = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to start a live chat.",
        variant: "destructive",
      });
      return null;
    }

    setIsConnecting(true);

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, company_name")
        .eq("user_id", user.id)
        .single();

      // Create new conversation
      const { data: newConv, error: convError } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: user.id,
          user_email: profile?.email || user.email,
          user_name: profile?.company_name || "Customer",
          status: "open",
          subject: "Support Request",
        })
        .select()
        .single();

      if (convError) throw convError;

      setConversation(newConv);

      // Add system message
      const { error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: newConv.id,
          sender_type: "system",
          sender_name: "Support",
          content: "You're now connected to our support team. An agent will be with you shortly.",
        });

      if (msgError) throw msgError;

      // Notify admins (in a real app, this could trigger a notification)
      toast({
        title: "Connected",
        description: "You're now connected to our support team.",
      });

      return newConv;
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to connect to support. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageContent = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      let currentConversation = conversation;

      // Start conversation if not exists
      if (!currentConversation) {
        currentConversation = await startConversation();
        if (!currentConversation) {
          setIsLoading(false);
          return;
        }
      }

      // Add optimistic message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        sender_type: "user",
        sender_name: "You",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMessage]);

      // Insert message into database
      const { data: newMessage, error: msgError } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: currentConversation.id,
          sender_id: user?.id,
          sender_type: "user",
          sender_name: "You",
          content: messageContent,
        })
        .select()
        .single();

      if (msgError) throw msgError;

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMessage.id ? newMessage : m))
      );

      // Simulate agent typing indicator
      setTimeout(() => setAgentTyping(true), 1000);
      
      // Auto-response for demo (in production, real agents would respond)
      setTimeout(async () => {
        const autoResponses = [
          "Thank you for your message! An agent will respond shortly.",
          "I've noted your request. Our team is reviewing it now.",
          "Thanks for reaching out! We typically respond within a few minutes.",
        ];
        
        // Only send auto-response if no agent has responded
        const { data: recentMessages } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", currentConversation!.id)
          .eq("sender_type", "agent")
          .gte("created_at", new Date(Date.now() - 30000).toISOString());

        if (!recentMessages || recentMessages.length === 0) {
          await supabase.from("chat_messages").insert({
            conversation_id: currentConversation!.id,
            sender_type: "bot",
            sender_name: "Support Bot",
            content: autoResponses[Math.floor(Math.random() * autoResponses.length)],
          });
        }
        setAgentTyping(false);
      }, 3000);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          isOpen
            ? "bg-gray-600 rotate-0"
            : "bg-primary hover:bg-primary/90 animate-pulse"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-background rounded-2xl shadow-2xl border border-border transition-all duration-300 overflow-hidden",
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-foreground">Live Support</h3>
              <p className="text-xs text-primary-foreground/70">
                {conversation?.status === "assigned" 
                  ? "Connected to agent" 
                  : "We typically reply instantly"}
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-muted/30">
          {!user && (
            <div className="text-center py-8">
              <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                Please sign in to start a live chat with our support team.
              </p>
              <Button asChild size="sm">
                <a href="/auth">Sign In</a>
              </Button>
            </div>
          )}

          {user && messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender_type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.sender_type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : message.sender_type === "system"
                    ? "bg-muted text-muted-foreground text-center w-full text-sm"
                    : "bg-card border border-border rounded-bl-md"
                )}
              >
                {message.sender_type !== "user" && message.sender_type !== "system" && (
                  <p className="text-xs font-medium text-primary mb-1">
                    {message.sender_name || "Agent"}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    message.sender_type === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))}

          {agentTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              </div>
            </div>
          )}

          {isConnecting && (
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting to support...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {user && (
          <form onSubmit={sendMessage} className="p-4 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || isConnecting}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading || isConnecting}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default LiveChatWidget;
