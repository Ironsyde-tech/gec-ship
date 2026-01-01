import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, Package, DollarSign, Users,
  Truck, Plane, Ship, Loader2, Calendar, ArrowUpRight
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalShipments: number;
  totalRevenue: number;
  totalUsers: number;
  shipmentsThisMonth: number;
  revenueThisMonth: number;
  shipmentsByStatus: Record<string, number>;
  shipmentsByService: Record<string, number>;
  recentShipments: Array<{
    date: string;
    count: number;
  }>;
}

const AdminAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch shipments
      const { data: shipments, error: shipmentsError } = await supabase
        .from("shipments")
        .select("*");

      if (shipmentsError) throw shipmentsError;

      // Fetch saved quotes for revenue
      const { data: quotes, error: quotesError } = await supabase
        .from("saved_quotes")
        .select("*");

      if (quotesError) throw quotesError;

      // Fetch users count
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id");

      if (usersError) throw usersError;

      // Calculate metrics
      const now = new Date();
      const periodDays = parseInt(period);
      const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const shipmentsInPeriod = shipments?.filter(
        (s) => new Date(s.created_at) >= periodStart
      ) || [];

      const shipmentsThisMonth = shipments?.filter(
        (s) => new Date(s.created_at) >= monthStart
      ) || [];

      // Revenue from booked quotes
      const bookedQuotes = quotes?.filter((q) => q.status === "booked") || [];
      const totalRevenue = bookedQuotes.reduce((sum, q) => sum + Number(q.price), 0);
      
      const quotesThisMonth = bookedQuotes.filter(
        (q) => new Date(q.created_at) >= monthStart
      );
      const revenueThisMonth = quotesThisMonth.reduce((sum, q) => sum + Number(q.price), 0);

      // Shipments by status
      const shipmentsByStatus: Record<string, number> = {};
      shipments?.forEach((s) => {
        shipmentsByStatus[s.status] = (shipmentsByStatus[s.status] || 0) + 1;
      });

      // Shipments by service
      const shipmentsByService: Record<string, number> = {};
      shipments?.forEach((s) => {
        shipmentsByService[s.service_type] = (shipmentsByService[s.service_type] || 0) + 1;
      });

      // Daily shipments for the period
      const dailyShipments: Record<string, number> = {};
      shipmentsInPeriod.forEach((s) => {
        const date = new Date(s.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        dailyShipments[date] = (dailyShipments[date] || 0) + 1;
      });

      const recentShipments = Object.entries(dailyShipments)
        .map(([date, count]) => ({ date, count }))
        .slice(-14);

      setData({
        totalShipments: shipments?.length || 0,
        totalRevenue,
        totalUsers: users?.length || 0,
        shipmentsThisMonth: shipmentsThisMonth.length,
        revenueThisMonth,
        shipmentsByStatus,
        shipmentsByService,
        recentShipments,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!data) return null;

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    picked_up: "Picked Up",
    in_transit: "In Transit",
    customs: "Customs",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  const statusColors: Record<string, string> = {
    pending: "bg-gray-500",
    picked_up: "bg-blue-500",
    in_transit: "bg-amber-500",
    customs: "bg-orange-500",
    out_for_delivery: "bg-green-500",
    delivered: "bg-green-600",
    cancelled: "bg-red-500",
  };

  const serviceIcons: Record<string, typeof Plane> = {
    "Express Air": Plane,
    "Standard Air": Plane,
    "Ground": Truck,
    "Economy Sea": Ship,
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>{data.shipmentsThisMonth} this month</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{data.totalShipments}</p>
          <p className="text-sm text-muted-foreground">Total Shipments</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <ArrowUpRight className="w-4 h-4" />
              <span>${data.revenueThisMonth.toFixed(0)} this month</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">${data.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{data.totalUsers}</p>
          <p className="text-sm text-muted-foreground">Registered Users</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Truck className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">
            {data.shipmentsByStatus["in_transit"] || 0}
          </p>
          <p className="text-sm text-muted-foreground">Currently In Transit</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipments by Status */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-6">Shipments by Status</h3>
          <div className="space-y-4">
            {Object.entries(data.shipmentsByStatus).map(([status, count]) => {
              const percentage = data.totalShipments
                ? Math.round((count / data.totalShipments) * 100)
                : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">
                      {statusLabels[status] || status}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${statusColors[status] || "bg-gray-500"} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipments by Service */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-6">Shipments by Service</h3>
          <div className="space-y-4">
            {Object.entries(data.shipmentsByService).map(([service, count]) => {
              const percentage = data.totalShipments
                ? Math.round((count / data.totalShipments) * 100)
                : 0;
              const Icon = serviceIcons[service] || Package;
              return (
                <div key={service} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{service}</span>
                      <span className="text-sm text-muted-foreground">{count} shipments</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-6">Shipment Activity (Last 14 Days)</h3>
        {data.recentShipments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No shipments in the selected period.
          </p>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {data.recentShipments.map((day, index) => {
              const maxCount = Math.max(...data.recentShipments.map((d) => d.count));
              const height = maxCount ? (day.count / maxCount) * 100 : 0;
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full bg-accent/80 rounded-t transition-all hover:bg-accent"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={`${day.date}: ${day.count} shipments`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
