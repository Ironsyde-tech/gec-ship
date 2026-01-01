import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Package, ArrowLeft, Printer, Download, Loader2, AlertCircle,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  service_type: string;
  weight: number;
  created_at: string;
}

const ShippingLabel = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const labelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (trackingNumber) {
      fetchShipment();
    }
  }, [trackingNumber]);

  const fetchShipment = async () => {
    try {
      const { data, error } = await supabase
        .from("shipments")
        .select("*")
        .eq("tracking_number", trackingNumber)
        .single();

      if (error) throw error;
      setShipment(data);
    } catch (error) {
      console.error("Error fetching shipment:", error);
      toast({
        title: "Error",
        description: "Failed to load shipment for label.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
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
              Unable to generate label for tracking: {trackingNumber}
            </p>
            <Link to="/my-shipments">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Shipments
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Print styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #shipping-label, #shipping-label * {
              visibility: visible;
            }
            #shipping-label {
              position: absolute;
              left: 0;
              top: 0;
              width: 4in;
              height: 6in;
              margin: 0;
              padding: 0;
              box-shadow: none !important;
              border: none !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="no-print">
        <Header />
      </div>

      <main className="pt-24 pb-16 no-print">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                Print Label
              </Button>
            </div>

            <p className="text-center text-muted-foreground mb-6">
              Preview your shipping label below. Click "Print Label" to print.
            </p>
          </div>
        </div>
      </main>

      {/* Label Preview */}
      <div className="flex justify-center pb-16">
        <div
          id="shipping-label"
          ref={labelRef}
          className="w-[4in] bg-white text-black border-2 border-black shadow-lg"
          style={{ minHeight: "6in" }}
        >
          {/* Header */}
          <div className="border-b-2 border-black p-3 flex items-center justify-between bg-black text-white">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6" />
              <span className="font-bold text-lg tracking-tight">GLOBAL EMBRACE</span>
            </div>
            <span className="text-xs">{shipment.service_type}</span>
          </div>

          {/* Barcode Area */}
          <div className="border-b-2 border-black p-4 text-center">
            <div className="font-mono text-2xl font-bold tracking-widest mb-2">
              {shipment.tracking_number}
            </div>
            {/* Simulated barcode */}
            <div className="flex justify-center items-end gap-[2px] h-12 mx-auto" style={{ width: "80%" }}>
              {shipment.tracking_number.split("").map((char, i) => {
                const height = 30 + ((char.charCodeAt(0) * (i + 1)) % 20);
                const width = (char.charCodeAt(0) % 2) === 0 ? 2 : 3;
                return (
                  <div
                    key={i}
                    className="bg-black"
                    style={{ height: `${height}px`, width: `${width}px` }}
                  />
                );
              })}
            </div>
          </div>

          {/* From Section */}
          <div className="border-b-2 border-black p-3">
            <div className="text-xs font-bold uppercase mb-1 text-gray-600">FROM:</div>
            <div className="text-sm">
              <p className="font-bold">{shipment.origin}</p>
            </div>
          </div>

          {/* To Section */}
          <div className="border-b-2 border-black p-3 bg-gray-50">
            <div className="text-xs font-bold uppercase mb-1 text-gray-600">TO:</div>
            <div className="text-lg">
              <p className="font-bold text-xl">{shipment.destination}</p>
            </div>
          </div>

          {/* Destination Large */}
          <div className="border-b-2 border-black p-4 text-center">
            <div className="text-4xl font-black tracking-tight">
              {shipment.destination.split(",")[0].toUpperCase()}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-3 border-r-2 border-black">
              <div className="text-xs text-gray-600 uppercase">Weight</div>
              <div className="font-bold">{shipment.weight} KG</div>
            </div>
            <div className="p-3">
              <div className="text-xs text-gray-600 uppercase">Date</div>
              <div className="font-bold">{formatDate(shipment.created_at)}</div>
            </div>
          </div>

          {/* QR Code Area */}
          <div className="p-3 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p>Track at: globalembrace.com/tracking</p>
              <p>Support: 1-800-EMBRACE</p>
            </div>
            <div className="w-16 h-16 bg-gray-100 border border-gray-300 flex items-center justify-center">
              <QrCode className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          {/* Footer */}
          <div className="bg-black text-white text-center py-2 text-xs">
            Handle with care • globalembrace.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingLabel;
