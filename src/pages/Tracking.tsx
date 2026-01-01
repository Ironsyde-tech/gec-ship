import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Package, Search, MapPin, Clock, CheckCircle2, Truck, Plane, 
  Building2, Home, Bell, Mail, MessageSquare, ChevronRight,
  Globe, Calendar, Weight, Box, ArrowLeft, Phone, Loader2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ShipmentEvent {
  id: string;
  status: string;
  location: string;
  description: string | null;
  created_at: string;
}

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  current_location: string;
  current_lat: number | null;
  current_lng: number | null;
  status: string;
  service_type: string;
  weight: number;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  pending: { label: "Pending", icon: Package, color: "text-muted-foreground" },
  picked_up: { label: "Picked Up", icon: Building2, color: "text-blue-500" },
  in_transit: { label: "In Transit", icon: Plane, color: "text-accent" },
  customs: { label: "Customs Clearance", icon: Globe, color: "text-orange-500" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "text-green-500" },
  delivered: { label: "Delivered", icon: Home, color: "text-green-600" },
};

const TrackingMap = ({ shipment }: { shipment: Shipment }) => {
  return (
    <div className="relative bg-primary rounded-2xl overflow-hidden h-80 lg:h-full min-h-[320px]">
      {/* Stylized map background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-foreground" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Route path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 10 70 Q 25 30, 50 50 T 90 40"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="0.5"
          className="transition-all duration-1000"
        />
        <path
          d="M 10 70 Q 25 30, 50 50 T 90 40"
          fill="none"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="0.3"
          strokeDasharray="2 2"
          opacity="0.3"
        />
      </svg>

      {/* Location markers */}
      <div className="absolute inset-0">
        {/* Origin */}
        <div className="absolute left-[8%] top-[65%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-accent rounded-full" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs text-primary-foreground/80 bg-primary/80 px-2 py-1 rounded">{shipment.origin.split(',')[0]}</span>
            </div>
          </div>
        </div>
        
        {/* Current location */}
        <div className="absolute left-[50%] top-[45%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-6 h-6 bg-accent rounded-full animate-pulse shadow-accent" />
            <div className="absolute -inset-2 border-2 border-accent rounded-full animate-ping opacity-50" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded font-medium">
                {shipment.current_location.split(' - ')[0]}
              </span>
            </div>
          </div>
        </div>
        
        {/* Destination */}
        <div className="absolute left-[92%] top-[35%] transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className={`w-4 h-4 border-2 rounded-full ${shipment.status === 'delivered' ? 'bg-green-500 border-green-500' : 'border-primary-foreground/50 bg-primary'}`} />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs text-primary-foreground/80 bg-primary/80 px-2 py-1 rounded">{shipment.destination.split(',')[0]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-primary/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-primary-foreground/10">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-primary-foreground/80">Live Tracking</span>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm rounded-lg p-3 border border-primary-foreground/10">
        <div className="flex items-center gap-4 text-xs text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-accent" />
            <span>Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrackingTimeline = ({ events }: { events: ShipmentEvent[] }) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-0">
      {sortedEvents.map((event, index) => {
        const config = statusConfig[event.status] || statusConfig.pending;
        const Icon = config.icon;
        const isLatest = index === 0;

        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline line */}
            {index < sortedEvents.length - 1 && (
              <div className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-16px)] ${isLatest ? 'bg-accent' : 'bg-border'}`} />
            )}
            
            {/* Icon */}
            <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isLatest 
                ? 'bg-accent text-accent-foreground shadow-accent animate-pulse' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                <h4 className={`font-semibold ${isLatest ? 'text-accent' : 'text-foreground'}`}>
                  {config.label}
                </h4>
                {isLatest && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent w-fit">
                    Current Status
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(event.created_at).toLocaleString()}
                </span>
              </div>
              {event.description && (
                <p className="text-sm text-muted-foreground">{event.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const NotificationSettings = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground">Delivery Notifications</h3>
          <p className="text-sm text-muted-foreground">Stay updated on your shipment</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label htmlFor="email-notif" className="font-medium text-foreground">Email Notifications</Label>
              <p className="text-xs text-muted-foreground">Receive updates via email</p>
            </div>
          </div>
          <Switch id="email-notif" checked={emailEnabled} onCheckedChange={setEmailEnabled} />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label htmlFor="sms-notif" className="font-medium text-foreground">SMS Notifications</Label>
              <p className="text-xs text-muted-foreground">Get text message alerts</p>
            </div>
          </div>
          <Switch id="sms-notif" checked={smsEnabled} onCheckedChange={setSmsEnabled} />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div>
              <Label htmlFor="push-notif" className="font-medium text-foreground">Push Notifications</Label>
              <p className="text-xs text-muted-foreground">Browser push notifications</p>
            </div>
          </div>
          <Switch id="push-notif" checked={pushEnabled} onCheckedChange={setPushEnabled} />
        </div>
      </div>
    </div>
  );
};

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<ShipmentEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  // Subscribe to real-time updates when we have a shipment
  useEffect(() => {
    if (!shipment) return;

    const channel = supabase
      .channel('shipment-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
          filter: `id=eq.${shipment.id}`
        },
        (payload) => {
          console.log('Shipment updated:', payload);
          setShipment(payload.new as Shipment);
          toast({
            title: "Shipment Updated",
            description: `Status: ${statusConfig[payload.new.status]?.label || payload.new.status}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipment?.id, toast]);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Enter tracking number",
        description: "Please enter a valid tracking number to search.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      // Fetch shipment
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber.trim().toUpperCase())
        .maybeSingle();

      if (shipmentError) throw shipmentError;

      if (!shipmentData) {
        setShipment(null);
        setEvents([]);
        toast({
          title: "Not found",
          description: "No shipment found with that tracking number.",
          variant: "destructive",
        });
        return;
      }

      setShipment(shipmentData);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("shipment_events")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("created_at", { ascending: false });

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      toast({
        title: "Shipment found",
        description: `Tracking ${shipmentData.tracking_number} - ${statusConfig[shipmentData.status]?.label || shipmentData.status}`,
      });
    } catch (error) {
      console.error("Error searching shipment:", error);
      toast({
        title: "Error",
        description: "Failed to search for shipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-hero">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Track Your Shipment
          </h1>
          <p className="text-primary-foreground/70 text-lg mb-8 max-w-2xl">
            Enter your tracking number to get real-time updates on your package location and delivery status.
          </p>

          <div className="max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter tracking number (e.g., SS1234567890)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 bg-background/95 border-0 h-14"
                />
              </div>
              <Button variant="hero" size="xl" onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track"}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-primary-foreground/50 text-sm mt-3">
              Try: SS1234567890, SS0987654321, or SS1122334455
            </p>
          </div>
        </div>
      </section>

      {searched && shipment && (
        <>
          {/* Status Banner */}
          <section className="py-6 bg-accent/10 border-y border-accent/20">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    {(() => {
                      const Icon = statusConfig[shipment.status]?.icon || Package;
                      return <Icon className="w-6 h-6 text-accent-foreground" />;
                    })()}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-heading font-bold text-lg text-foreground">{shipment.tracking_number}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold text-accent">{statusConfig[shipment.status]?.label || shipment.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Est. Delivery</p>
                    <p className="font-semibold text-foreground">{formatDate(shipment.estimated_delivery)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Service</p>
                    <p className="font-semibold text-foreground">{shipment.service_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-green-500 animate-spin" style={{ animationDuration: '3s' }} />
                    <span className="text-green-500 text-xs font-medium">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Timeline & Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Map */}
                  <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent" />
                        Shipment Route
                      </h3>
                    </div>
                    <TrackingMap shipment={shipment} />
                  </div>

                  {/* Shipment Details */}
                  <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
                    <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-accent" />
                      Shipment Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">Origin</span>
                        </div>
                        <p className="font-semibold text-foreground">{shipment.origin}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">Destination</span>
                        </div>
                        <p className="font-semibold text-foreground">{shipment.destination}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Weight className="w-4 h-4" />
                          <span className="text-sm">Weight</span>
                        </div>
                        <p className="font-semibold text-foreground">{shipment.weight} kg</p>
                      </div>
                      <div className="p-4 rounded-xl bg-secondary/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Created</span>
                        </div>
                        <p className="font-semibold text-foreground">{formatDate(shipment.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
                    <h3 className="font-heading font-bold text-foreground mb-6 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-accent" />
                      Tracking History
                    </h3>
                    {events.length > 0 ? (
                      <TrackingTimeline events={events} />
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No tracking events yet. Check back soon!
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - Notifications */}
                <div className="space-y-8">
                  <NotificationSettings />

                  {/* Contact Support */}
                  <div className="bg-card rounded-2xl border border-border shadow-soft p-6">
                    <h3 className="font-heading font-bold text-foreground mb-4">Need Help?</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Having issues with your shipment? Our support team is here to help.
                    </p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Phone className="w-4 h-4" />
                        Call 1-800-EMBRACE
                      </Button>
                      <Link to="/contact" className="block">
                        <Button variant="hero" className="w-full">
                          Contact Support
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {searched && !shipment && !loading && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                Shipment Not Found
              </h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find a shipment with tracking number "{trackingNumber}". Please check the number and try again.
              </p>
              <Button variant="outline" onClick={() => setTrackingNumber("")}>
                Try Another Number
              </Button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default Tracking;
