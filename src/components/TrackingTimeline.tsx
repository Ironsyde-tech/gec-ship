import { useState, useEffect } from "react";
import {
  Package, Truck, Plane, Ship, MapPin, Clock, CheckCircle2,
  Circle, Loader2, AlertCircle, Box, Warehouse, FileCheck,
  Home, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  description: string;
  timestamp: string;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
  currentStatus: string;
  loading?: boolean;
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "picked_up", label: "Picked Up", icon: Box },
  { key: "in_transit", label: "In Transit", icon: Truck },
  { key: "customs", label: "Customs", icon: FileCheck },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const getStatusIndex = (status: string): number => {
  const index = statusSteps.findIndex((s) => s.key === status);
  return index >= 0 ? index : 0;
};

const getEventIcon = (status: string) => {
  switch (status) {
    case "pending":
      return Package;
    case "picked_up":
      return Box;
    case "in_transit":
      return Truck;
    case "customs":
    case "customs_cleared":
      return FileCheck;
    case "arrived_hub":
    case "departed_hub":
      return Warehouse;
    case "out_for_delivery":
      return Truck;
    case "delivered":
      return CheckCircle2;
    case "exception":
    case "delay":
      return AlertCircle;
    default:
      return Circle;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

// Progress Bar Component
export const TrackingProgressBar = ({ currentStatus }: { currentStatus: string }) => {
  const currentIndex = getStatusIndex(currentStatus);
  const isDelivered = currentStatus === "delivered";
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600 dark:text-red-400 font-medium">Shipment Cancelled</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
          
          {/* Progress Line */}
          <div
            className="absolute top-5 left-0 h-1 bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
            }}
          />

          {/* Steps */}
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className="relative flex flex-col items-center z-10"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-accent/30"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium text-center whitespace-nowrap",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
            {(() => {
              const CurrentIcon = statusSteps[currentIndex]?.icon || Package;
              return <CurrentIcon className="w-5 h-5 text-accent-foreground" />;
            })()}
          </div>
          <div>
            <p className="font-medium text-foreground">
              {statusSteps[currentIndex]?.label || "Processing"}
            </p>
            <p className="text-sm text-muted-foreground">
              Step {currentIndex + 1} of {statusSteps.length}
            </p>
          </div>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{
              width: `${((currentIndex + 1) / statusSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Timeline Component
export const TrackingTimeline = ({
  events,
  currentStatus,
  loading = false,
}: TrackingTimelineProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No tracking events yet</p>
        <p className="text-sm">Events will appear here once your shipment is processed</p>
      </div>
    );
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-0">
      {sortedEvents.map((event, index) => {
        const { date, time } = formatTimestamp(event.timestamp);
        const Icon = getEventIcon(event.status);
        const isFirst = index === 0;
        const isLast = index === sortedEvents.length - 1;
        const isException = event.status === "exception" || event.status === "delay";

        return (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10",
                  isFirst
                    ? "bg-accent text-accent-foreground"
                    : isException
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              {!isLast && (
                <div className="w-0.5 flex-1 bg-border min-h-[40px]" />
              )}
            </div>

            {/* Event Content */}
            <div className={cn("pb-8 flex-1", isLast && "pb-0")}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isFirst ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  <p>{date}</p>
                  <p className="text-xs">{time}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Combined Full Tracking View
const TrackingView = ({
  events,
  currentStatus,
  loading = false,
}: TrackingTimelineProps) => {
  return (
    <div className="space-y-8">
      <TrackingProgressBar currentStatus={currentStatus} />
      <div className="border-t pt-6">
        <h3 className="font-semibold text-foreground mb-4">Tracking History</h3>
        <TrackingTimeline events={events} currentStatus={currentStatus} loading={loading} />
      </div>
    </div>
  );
};

export default TrackingView;
