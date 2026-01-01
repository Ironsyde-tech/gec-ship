import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package, Truck, Plane, Ship, MapPin, Clock, CheckCircle2,
  Search, Filter, ArrowRight, Loader2, Eye, RefreshCw,
  Calendar, ChevronDown, MoreHorizontal, ExternalLink, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { CardListSkeleton, StatsSkeleton } from "@/components/LoadingSkeletons";

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  current_location: string;
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
  customs: { label: "Customs", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
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

const MyShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/my-shipments");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchShipments();
    }
  }, [user]);

  const fetchShipments = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast({
        title: "Error",
        description: "Failed to load your shipments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string | null) => {
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-muted rounded animate-pulse" />
              </div>
              <StatsSkeleton />
              <div className="mt-8">
                <CardListSkeleton count={4} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">
                  My Shipments
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track and manage all your shipments in one place
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchShipments(true)}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Link to="/services">
                  <Button variant="hero" size="sm">
                    New Shipment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tracking number, origin, or destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="customs">Customs</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Total Shipments</p>
                <p className="text-2xl font-bold text-foreground">{shipments.length}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold text-amber-600">
                  {shipments.filter(s => s.status === "in_transit").length}
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">
                  {shipments.filter(s => s.status === "delivered").length}
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-gray-600">
                  {shipments.filter(s => s.status === "pending").length}
                </p>
              </div>
            </div>

            {/* Shipments List */}
            {filteredShipments.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                  {searchQuery || statusFilter !== "all"
                    ? "No shipments found"
                    : "No shipments yet"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== "all"
                    ? "Try adjusting your search or filters."
                    : "Book your first shipment to get started."}
                </p>
                {!searchQuery && statusFilter === "all" && (
                  <Link to="/services">
                    <Button variant="outline">
                      Create Shipment
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredShipments.map((shipment) => {
                  const ServiceIcon = serviceIcons[shipment.service_type] || Package;
                  const statusInfo = getStatusInfo(shipment.status);

                  return (
                    <div
                      key={shipment.id}
                      className="bg-card rounded-xl border border-border p-6 hover:shadow-medium transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Left: Service & Tracking */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center flex-shrink-0">
                            <ServiceIcon className="w-6 h-6 text-accent-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-mono font-semibold text-foreground">
                                {shipment.tracking_number}
                              </span>
                              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0`}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {shipment.service_type} • {shipment.weight} kg
                            </p>
                          </div>
                        </div>

                        {/* Center: Route */}
                        <div className="flex items-center gap-4 flex-1 lg:justify-center">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">From</p>
                            <p className="font-medium text-foreground">{shipment.origin}</p>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <div className="w-16 h-0.5 bg-border relative">
                              <div
                                className="absolute inset-y-0 left-0 bg-accent transition-all"
                                style={{
                                  width: shipment.status === "delivered" ? "100%" :
                                         shipment.status === "out_for_delivery" ? "80%" :
                                         shipment.status === "customs" ? "60%" :
                                         shipment.status === "in_transit" ? "40%" :
                                         shipment.status === "picked_up" ? "20%" : "5%"
                                }}
                              />
                            </div>
                            <div className={`w-2 h-2 rounded-full ${
                              shipment.status === "delivered" ? "bg-green-500" : "bg-border"
                            }`} />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">To</p>
                            <p className="font-medium text-foreground">{shipment.destination}</p>
                          </div>
                        </div>

                        {/* Right: Dates & Actions */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              {shipment.status === "delivered" ? "Delivered" : "Est. Delivery"}
                            </p>
                            <p className="font-medium text-foreground">
                              {shipment.status === "delivered"
                                ? formatDate(shipment.actual_delivery || shipment.updated_at)
                                : formatDate(shipment.estimated_delivery)}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/shipment/${shipment.tracking_number}`}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/tracking?number=${shipment.tracking_number}`}
                                  className="flex items-center gap-2"
                                >
                                  <MapPin className="w-4 h-4" />
                                  Track Shipment
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/shipment/${shipment.tracking_number}/label`}
                                  className="flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  Print Label
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(shipment.tracking_number);
                                    toast({
                                      title: "Copied!",
                                      description: "Tracking number copied to clipboard.",
                                    });
                                  }}
                                  className="flex items-center gap-2 w-full"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Tracking #
                                </button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Current Location */}
                      {shipment.status !== "pending" && shipment.status !== "delivered" && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="text-muted-foreground">Current Location:</span>
                            <span className="font-medium text-foreground">
                              {shipment.current_location}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyShipments;
