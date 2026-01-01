import { useState, useEffect } from "react";
import {
  Package, Search, Filter, MoreHorizontal, Eye, MapPin,
  Clock, CheckCircle2, Truck, Plane, Ship, RefreshCw,
  Edit, Plus, X, Loader2, ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  user_id: string | null;
}

interface ShipmentEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string;
  description: string | null;
  created_at: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-700" },
  { value: "picked_up", label: "Picked Up", color: "bg-blue-100 text-blue-700" },
  { value: "in_transit", label: "In Transit", color: "bg-amber-100 text-amber-700" },
  { value: "customs", label: "Customs", color: "bg-orange-100 text-orange-700" },
  { value: "out_for_delivery", label: "Out for Delivery", color: "bg-green-100 text-green-700" },
  { value: "delivered", label: "Delivered", color: "bg-green-200 text-green-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

const serviceIcons: Record<string, typeof Plane> = {
  "Express Air": Plane,
  "Standard Air": Plane,
  "Ground": Truck,
  "Economy Sea": Ship,
};

const AdminShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Edit modal state
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [saving, setSaving] = useState(false);

  // Add event modal state
  const [addingEventFor, setAddingEventFor] = useState<Shipment | null>(null);
  const [eventStatus, setEventStatus] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [addingEvent, setAddingEvent] = useState(false);

  // Events modal state
  const [viewingEventsFor, setViewingEventsFor] = useState<Shipment | null>(null);
  const [shipmentEvents, setShipmentEvents] = useState<ShipmentEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .order("created_at", { ascending: sortOrder === "asc" });

      if (error) throw error;
      setShipments(data || []);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast({
        title: "Error",
        description: "Failed to load shipments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchShipmentEvents = async (shipmentId: string) => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase
        .from("shipment_events")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShipmentEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load shipment events.",
        variant: "destructive",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleUpdateShipment = async () => {
    if (!editingShipment) return;

    setSaving(true);
    try {
      const updates: Partial<Shipment> = {
        status: editStatus,
        current_location: editLocation,
        updated_at: new Date().toISOString(),
      };

      // If status is delivered, set actual_delivery
      if (editStatus === "delivered") {
        updates.actual_delivery = new Date().toISOString();
      }

      const { error } = await supabase
        .from("shipments")
        .update(updates)
        .eq("id", editingShipment.id);

      if (error) throw error;

      // Also add a tracking event
      await supabase.from("shipment_events").insert({
        shipment_id: editingShipment.id,
        status: editStatus,
        location: editLocation,
        description: `Status updated to ${statusOptions.find(s => s.value === editStatus)?.label}`,
      });

      toast({
        title: "Shipment updated",
        description: `Tracking #${editingShipment.tracking_number} has been updated.`,
      });

      setEditingShipment(null);
      fetchShipments();
    } catch (error) {
      console.error("Error updating shipment:", error);
      toast({
        title: "Error",
        description: "Failed to update shipment.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddEvent = async () => {
    if (!addingEventFor) return;

    setAddingEvent(true);
    try {
      const { error } = await supabase.from("shipment_events").insert({
        shipment_id: addingEventFor.id,
        status: eventStatus,
        location: eventLocation,
        description: eventDescription || null,
      });

      if (error) throw error;

      // Update shipment current location and status
      await supabase
        .from("shipments")
        .update({
          status: eventStatus,
          current_location: eventLocation,
          updated_at: new Date().toISOString(),
          ...(eventStatus === "delivered" ? { actual_delivery: new Date().toISOString() } : {}),
        })
        .eq("id", addingEventFor.id);

      toast({
        title: "Event added",
        description: "Tracking event has been added successfully.",
      });

      setAddingEventFor(null);
      setEventStatus("");
      setEventLocation("");
      setEventDescription("");
      fetchShipments();
    } catch (error) {
      console.error("Error adding event:", error);
      toast({
        title: "Error",
        description: "Failed to add tracking event.",
        variant: "destructive",
      });
    } finally {
      setAddingEvent(false);
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

  const getStatusBadge = (status: string) => {
    const statusInfo = statusOptions.find((s) => s.value === status);
    return (
      <Badge className={`${statusInfo?.color || "bg-gray-100"} border-0`}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tracking #, origin, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchShipments(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground">{shipments.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-gray-600">
            {shipments.filter((s) => s.status === "pending").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">In Transit</p>
          <p className="text-2xl font-bold text-amber-600">
            {shipments.filter((s) => s.status === "in_transit").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Out for Delivery</p>
          <p className="text-2xl font-bold text-green-600">
            {shipments.filter((s) => s.status === "out_for_delivery").length}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Delivered</p>
          <p className="text-2xl font-bold text-green-700">
            {shipments.filter((s) => s.status === "delivered").length}
          </p>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Location</TableHead>
              <TableHead>
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    fetchShipments();
                  }}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  Created
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredShipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Package className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No shipments found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredShipments.map((shipment) => {
                const ServiceIcon = serviceIcons[shipment.service_type] || Package;
                return (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <span className="font-mono font-medium">
                        {shipment.tracking_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ServiceIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{shipment.service_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{shipment.origin}</p>
                        <p className="text-muted-foreground">→ {shipment.destination}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {shipment.current_location}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(shipment.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingShipment(shipment);
                              setEditStatus(shipment.status);
                              setEditLocation(shipment.current_location);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setAddingEventFor(shipment);
                              setEventStatus(shipment.status);
                              setEventLocation(shipment.current_location);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Event
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setViewingEventsFor(shipment);
                              fetchShipmentEvents(shipment.id);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Events
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Shipment Modal */}
      <Dialog open={!!editingShipment} onOpenChange={() => setEditingShipment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment Status</DialogTitle>
            <DialogDescription>
              Update the status and location for tracking #{editingShipment?.tracking_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Location</Label>
              <Input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="e.g., Chicago, IL - Distribution Center"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingShipment(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateShipment} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Modal */}
      <Dialog open={!!addingEventFor} onOpenChange={() => setAddingEventFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tracking Event</DialogTitle>
            <DialogDescription>
              Add a new tracking event for #{addingEventFor?.tracking_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={eventStatus} onValueChange={setEventStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="e.g., Los Angeles, CA - Sorting Facility"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (Optional)</Label>
              <Textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="e.g., Package scanned at facility"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddingEventFor(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddEvent} disabled={addingEvent || !eventStatus || !eventLocation}>
              {addingEvent ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Events Modal */}
      <Dialog open={!!viewingEventsFor} onOpenChange={() => setViewingEventsFor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tracking History</DialogTitle>
            <DialogDescription>
              Events for #{viewingEventsFor?.tracking_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            {loadingEvents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-accent" />
              </div>
            ) : shipmentEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tracking events yet.
              </p>
            ) : (
              <div className="space-y-4">
                {shipmentEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`flex gap-4 ${index !== shipmentEvents.length - 1 ? "pb-4 border-b border-border" : ""}`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      {index !== shipmentEvents.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(event.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.created_at)}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{event.location}</p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShipments;
