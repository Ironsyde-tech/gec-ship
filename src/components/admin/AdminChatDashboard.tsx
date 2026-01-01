import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  Send, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  status: string;
  subject: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  content: string;
  sender_type: "user" | "agent" | "system" | "bot";
  sender_name?: string;
  created_at: string;
}

const AdminChatDashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    loadConversations();

    // Subscribe to new conversations
    const channel = supabase
      .channel("admin-conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_conversations" },
        () => loadConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Subscribe to messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const channel = supabase
      .channel(`admin-chat-${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast({
        title: "Error",
        description: "Failed to load conversations.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);

    // Assign agent if not assigned
    if (conversation.status === "open" && user) {
      await supabase
        .from("chat_conversations")
        .update({ 
          status: "assigned", 
          assigned_agent_id: user.id,
          updated_at: new Date().toISOString()
        })
        .eq("id", conversation.id);
      
      loadConversations();
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedConversation || isSending) return;

    const messageContent = input.trim();
    setInput("");
    setIsSending(true);

    try {
      const { error } = await supabase.from("chat_messages").insert({
        conversation_id: selectedConversation.id,
        sender_id: user?.id,
        sender_type: "agent",
        sender_name: "Support Agent",
        content: messageContent,
      });

      if (error) throw error;

      // Update conversation timestamp
      await supabase
        .from("chat_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedConversation.id);

    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const closeConversation = async () => {
    if (!selectedConversation) return;

    try {
      await supabase
        .from("chat_conversations")
        .update({ 
          status: "closed", 
          closed_at: new Date().toISOString() 
        })
        .eq("id", selectedConversation.id);

      // Send closing message
      await supabase.from("chat_messages").insert({
        conversation_id: selectedConversation.id,
        sender_type: "system",
        sender_name: "System",
        content: "This conversation has been closed. Thank you for contacting support!",
      });

      setSelectedConversation(null);
      setMessages([]);
      loadConversations();

      toast({
        title: "Conversation closed",
        description: "The chat has been marked as resolved.",
      });
    } catch (error) {
      console.error("Error closing conversation:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Open</Badge>;
      case "assigned":
        return <Badge className="bg-yellow-500">In Progress</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Live Chat Support
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadConversations}>
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex gap-4 p-4 pt-0 overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border rounded-lg overflow-hidden flex flex-col">
          <div className="p-3 bg-muted border-b">
            <p className="text-sm font-medium">
              Conversations ({conversations.filter(c => c.status !== "closed").length})
            </p>
          </div>
          <ScrollArea className="flex-1">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className={cn(
                    "p-3 border-b cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedConversation?.id === conv.id && "bg-muted"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate max-w-[120px]">
                          {conv.user_name || "Customer"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                          {conv.user_email}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(conv.status)}
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatTime(conv.updated_at)}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-3 bg-muted border-b flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedConversation.user_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedConversation.user_email}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedConversation.status !== "closed" && (
                    <Button variant="outline" size="sm" onClick={closeConversation}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Close
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex",
                        message.sender_type === "agent" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2",
                          message.sender_type === "agent"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : message.sender_type === "system"
                            ? "bg-muted text-muted-foreground text-center w-full text-sm"
                            : "bg-card border rounded-bl-md"
                        )}
                      >
                        {message.sender_type !== "agent" && message.sender_type !== "system" && (
                          <p className="text-xs font-medium text-primary mb-1">
                            {message.sender_name || "Customer"}
                          </p>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          message.sender_type === "agent" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        )}>
                          {formatTime(message.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              {selectedConversation.status !== "closed" && (
                <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your reply..."
                    disabled={isSending}
                  />
                  <Button type="submit" disabled={!input.trim() || isSending}>
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminChatDashboard;
