import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Package, FileText, Trash2, Loader2, ArrowRight, Calendar, MapPin, Weight, DollarSign, Truck, MapPinHouse, User } from "lucide-react";
import AddressBook from "@/components/AddressBook";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import ProfileEditor from "@/components/ProfileEditor";
interface SavedQuote {
  id: string;
  origin: string;
  destination: string;
  actual_weight: number;
  chargeable_weight: number;
  selected_service: string;
  price: number;
  delivery_days: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingCallback, setRequestingCallback] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchQuotes();
    }
  }, [user]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved quotes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteQuote = async (id: string) => {
    try {
      const { error } = await supabase
        .from("saved_quotes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setQuotes(quotes.filter(q => q.id !== id));
      toast({
        title: "Quote deleted",
        description: "The quote has been removed.",
      });
    } catch (error) {
      console.error("Error deleting quote:", error);
      toast({
        title: "Error",
        description: "Failed to delete quote.",
        variant: "destructive",
      });
    }
  };

  const requestCallback = async (quote: SavedQuote) => {
    setRequestingCallback(quote.id);
    try {
      // Get user profile for contact info
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name, phone")
        .eq("user_id", user?.id)
        .single();

      const { error } = await supabase.functions.invoke("booking-request", {
        body: {
          quoteId: quote.id,
          origin: quote.origin,
          destination: quote.destination,
          service: quote.selected_service,
          price: Number(quote.price),
          deliveryDays: quote.delivery_days,
          weight: Number(quote.chargeable_weight),
          userEmail: user?.email,
          userName: profile?.company_name,
          userPhone: profile?.phone,
        },
      });

      if (error) throw error;

      // Update local state
      setQuotes(quotes.map(q => 
        q.id === quote.id ? { ...q, status: "callback_requested" } : q
      ));

      toast({
        title: "Callback Requested!",
        description: "Our team will contact you within 24 hours to finalize your booking.",
      });
    } catch (error) {
      console.error("Error requesting callback:", error);
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequestingCallback(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="quotes" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <TabsList className="bg-muted">
                  <TabsTrigger value="quotes" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Quotes
                  </TabsTrigger>
                  <TabsTrigger value="addresses" className="flex items-center gap-2">
                    <MapPinHouse className="w-4 h-4" />
                    Addresses
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3">
                  <Link to="/my-shipments">
                    <Button variant="outline" size="sm">
                      <Truck className="w-4 h-4" />
                      My Shipments
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button variant="hero" size="sm">
                      New Quote
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <TabsContent value="quotes">
                {quotes.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                      No saved quotes yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Get a shipping quote and save it to view it here later.
                    </p>
                    <Link to="/services">
                      <Button variant="outline">
                        Get a Quote
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-accent-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-foreground">
                                  {quote.selected_service}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(quote.created_at)}
                                </p>
                              </div>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                <div>
                                  <p className="text-muted-foreground">Route</p>
                                  <p className="font-medium text-foreground">
                                    {quote.origin} → {quote.destination}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Weight className="w-4 h-4 text-accent" />
                                <div>
                                  <p className="text-muted-foreground">Weight</p>
                                  <p className="font-medium text-foreground">
                                    {quote.chargeable_weight} kg
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-accent" />
                                <div>
                                  <p className="text-muted-foreground">Price</p>
                                  <p className="font-medium text-accent">
                                    ${Number(quote.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Delivery</p>
                                <p className="font-medium text-foreground">
                                  {quote.delivery_days} days
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              quote.status === "saved"
                                ? "bg-accent/10 text-accent"
                                : quote.status === "callback_requested"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {quote.status === "callback_requested" ? "Callback Requested" : quote.status === "booked" ? "Booked" : quote.status}
                            </span>
                            <div className="flex items-center gap-2">
                              {quote.status === "saved" && (
                                <Link to={`/book?quote=${quote.id}`}>
                                  <Button
                                    variant="hero"
                                    size="sm"
                                  >
                                    <ArrowRight className="w-4 h-4" />
                                    Book Now
                                  </Button>
                                </Link>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteQuote(quote.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="addresses">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground">Saved Addresses</h2>
                    <p className="text-muted-foreground text-sm">Manage your shipping addresses for faster checkout</p>
                  </div>
                  {user && <AddressBook userId={user.id} />}
                </div>
              </TabsContent>

              <TabsContent value="profile">
                {user && <ProfileEditor userId={user.id} userEmail={user.email || ""} />}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
