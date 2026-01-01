import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Package, ArrowLeft, MapPin, Calendar, Weight, DollarSign,
  Truck, Plane, Ship, Clock, CheckCircle2, Copy, Printer,
  FileText, Download, Share2, Loader2, RefreshCw, AlertCircle,
  Phone, Mail, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import TrackingView, { TrackingEvent } from "@/components/TrackingTimeline";
import { CardSkeleton } from "@/components/LoadingSkeletons";

interface Shipment {
  id: string;
  tracking_number: string;
  user_id: string | null;
  origin: string;
  destination: string;
  current_location: string;
  current_lat: number | null;
  current_lng: number | null;
  status: string;
  service_type: string;
  weight: number;
  estimated_delivery: string | null;
  actual_delivery: string | null;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-gray-600", bgColor: "bg-gray-100 dark:bg-gray-800" },
  picked_up: { label: "Picked Up", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  in_transit: { label: "In Transit", color: "text-amber-600", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  customs: { label: "In Customs", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  out_for_delivery: { label: "Out for Delivery", color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  delivered: { label: "Delivered", color: "text-green-700", bgColor: "bg-green-200 dark:bg-green-900/50" },
  cancelled: { label: "Cancelled", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
};

const serviceIcons: Record<string, typeof Plane> = {
  "Express Air": Plane,
  "Standard Air": Plane,
  "Ground": Truck,
  "Economy Sea": Ship,
};

const ShipmentDetails = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (trackingNumber) {
      fetchShipmentDetails();
    }
  }, [trackingNumber, user]);

  const fetchShipmentDetails = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      // Fetch shipment
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber)
        .single();

      if (shipmentError) {
        if (shipmentError.code === "PGRST116") {
          toast({
            title: "Shipment Not Found",
            description: "No shipment found with this tracking number.",
            variant: "destructive",
          });
          navigate("/tracking");
          return;
        }
        throw shipmentError;
      }

      setShipment(shipmentData);

      // Fetch tracking events
      const { data: eventsData, error: eventsError } = await supabase
        .from("shipment_events")
        .select("*")
        .eq("shipment_id", shipmentData.id)
        .order("created_at", { ascending: false });

      if (!eventsError) {
        setEvents(
          (eventsData || []).map((e: any) => ({
            id: e.id,
            status: e.status,
            location: e.location,
            description: e.description || e.status.replace(/_/g, " "),
            timestamp: e.created_at,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching shipment:", error);
      toast({
        title: "Error",
        description: "Failed to load shipment details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const copyTrackingNumber = () => {
    if (shipment) {
      navigator.clipboard.writeText(shipment.tracking_number);
      toast({ title: "Tracking number copied!" });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusInfo = (status: string) => {
    return statusConfig[status] || statusConfig.pending;
  };

  const ServiceIcon = shipment ? (serviceIcons[shipment.service_type] || Package) : Package;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="h-8 w-32 bg-muted rounded animate-pulse" />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Shipment Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find a shipment with tracking number: {trackingNumber}
            </p>
            <Link to="/tracking">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tracking
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const statusInfo = getStatusInfo(shipment.status);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button & Actions */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchShipmentDetails(true)}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={copyTrackingNumber}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Link to={`/shipment/${trackingNumber}/label`}>
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Main Info Card */}
            <Card className="mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                      <ServiceIcon className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{shipment.tracking_number}</CardTitle>
                      <CardDescription>{shipment.service_type}</CardDescription>
                    </div>
                  </div>
                  <Badge className={`${statusInfo.bgColor} ${statusInfo.color} text-sm px-4 py-1.5`}>
                    {statusInfo.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Route */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-6">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">From</p>
                    <p className="font-semibold text-lg">{shipment.origin}</p>
                  </div>
                  <div className="flex items-center gap-2 text-accent">
                    <div className="w-8 h-0.5 bg-accent" />
                    <Plane className="w-5 h-5" />
                    <div className="w-8 h-0.5 bg-accent" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-sm text-muted-foreground">To</p>
                    <p className="font-semibold text-lg">{shipment.destination}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">Current Location</span>
                    </div>
                    <p className="font-medium">{shipment.current_location || "Processing"}</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Weight className="w-4 h-4" />
                      <span className="text-xs">Weight</span>
                    </div>
                    <p className="font-medium">{shipment.weight} kg</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Est. Delivery</span>
                    </div>
                    <p className="font-medium">{formatShortDate(shipment.estimated_delivery)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Progress */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Shipment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <TrackingView
                  events={events}
                  currentStatus={shipment.status}
                />
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shipment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">{formatShortDate(shipment.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatShortDate(shipment.updated_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Type</p>
                    <p className="font-medium">{shipment.service_type}</p>
                  </div>
                  {shipment.actual_delivery && (
                    <div>
                      <p className="text-sm text-muted-foreground">Delivered On</p>
                      <p className="font-medium text-green-600">{formatDate(shipment.actual_delivery)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-muted/30 rounded-xl text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about your shipment, our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="outline" asChild>
                  <a href="mailto:support@globalembrace.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:1-800-EMBRACE">
                    <Phone className="w-4 h-4 mr-2" />
                    1-800-EMBRACE
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShipmentDetails;
