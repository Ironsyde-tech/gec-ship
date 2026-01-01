import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Package, Plane, Truck, Ship, ArrowRight, Info, MapPin, Weight, Ruler, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

// Country data with zone classifications for pricing
const countries = [
  { name: "United States", zone: 1, code: "US" },
  { name: "Canada", zone: 1, code: "CA" },
  { name: "Mexico", zone: 2, code: "MX" },
  { name: "United Kingdom", zone: 2, code: "GB" },
  { name: "Germany", zone: 2, code: "DE" },
  { name: "France", zone: 2, code: "FR" },
  { name: "Netherlands", zone: 2, code: "NL" },
  { name: "Spain", zone: 2, code: "ES" },
  { name: "Italy", zone: 2, code: "IT" },
  { name: "Sweden", zone: 2, code: "SE" },
  { name: "Australia", zone: 3, code: "AU" },
  { name: "New Zealand", zone: 3, code: "NZ" },
  { name: "Japan", zone: 3, code: "JP" },
  { name: "South Korea", zone: 3, code: "KR" },
  { name: "Singapore", zone: 3, code: "SG" },
  { name: "China", zone: 3, code: "CN" },
  { name: "India", zone: 4, code: "IN" },
  { name: "Brazil", zone: 4, code: "BR" },
  { name: "South Africa", zone: 4, code: "ZA" },
  { name: "United Arab Emirates", zone: 3, code: "AE" },
];

// Base rates per kg by zone (in USD)
const zoneRates: Record<number, number> = {
  1: 4.50,  // Domestic/North America
  2: 8.25,  // Europe
  3: 12.50, // Asia-Pacific
  4: 15.75, // Remote regions
};

// Shipping options with multipliers and details
const shippingOptions = [
  {
    id: "express",
    name: "Express Air",
    icon: Plane,
    days: "1-2",
    multiplier: 3.5,
    description: "Fastest delivery with priority handling",
    fuelSurcharge: 0.15,
    handlingFee: 12.99,
  },
  {
    id: "standard",
    name: "Standard Air",
    icon: Plane,
    days: "3-5",
    multiplier: 2.2,
    description: "Reliable air freight service",
    fuelSurcharge: 0.12,
    handlingFee: 8.99,
  },
  {
    id: "ground",
    name: "Ground",
    icon: Truck,
    days: "5-7",
    multiplier: 1.5,
    description: "Cost-effective overland transport",
    fuelSurcharge: 0.08,
    handlingFee: 5.99,
  },
  {
    id: "economy",
    name: "Economy Sea",
    icon: Ship,
    days: "14-21",
    multiplier: 1.0,
    description: "Best value for non-urgent shipments",
    fuelSurcharge: 0.05,
    handlingFee: 24.99,
  },
];

interface QuoteOption {
  id: string;
  name: string;
  price: number;
  days: string;
  icon: typeof Plane;
  description: string;
  breakdown: {
    baseRate: number;
    fuelSurcharge: number;
    handlingFee: number;
  };
}

interface QuoteResult {
  chargeableWeight: number;
  actualWeight: number;
  volumetricWeight: number;
  origin: string;
  destination: string;
  zone: number;
  options: QuoteOption[];
}

const ShippingCalculator = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateQuote = () => {
    const weightNum = parseFloat(weight) || 0;
    const lengthNum = parseFloat(length) || 0;
    const widthNum = parseFloat(width) || 0;
    const heightNum = parseFloat(height) || 0;

    // Validate inputs
    if (weightNum <= 0 || lengthNum <= 0 || widthNum <= 0 || heightNum <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers for all fields.",
        variant: "destructive",
      });
      return;
    }

    // Calculate volumetric weight (dimensional weight)
    // Industry standard: L x W x H / 5000 for cm to get kg
    const volumetricWeight = (lengthNum * widthNum * heightNum) / 5000;
    const chargeableWeight = Math.max(weightNum, volumetricWeight);

    // Get destination zone for pricing
    const destCountry = countries.find(c => c.name === destination);
    const originCountry = countries.find(c => c.name === origin);
    const zone = destCountry?.zone || 4;
    
    // Calculate base rate based on zone
    const baseZoneRate = zoneRates[zone];
    
    // Apply distance modifier (same zone = discount)
    const sameZone = originCountry?.zone === destCountry?.zone;
    const distanceModifier = sameZone ? 0.85 : 1.0;

    // Generate pricing for each shipping option
    const options: QuoteOption[] = shippingOptions.map((opt) => {
      const baseRate = chargeableWeight * baseZoneRate * opt.multiplier * distanceModifier;
      const fuelSurcharge = baseRate * opt.fuelSurcharge;
      const handlingFee = opt.handlingFee;
      const totalPrice = baseRate + fuelSurcharge + handlingFee;

      return {
        id: opt.id,
        name: opt.name,
        price: Math.round(totalPrice * 100) / 100,
        days: opt.days,
        icon: opt.icon,
        description: opt.description,
        breakdown: {
          baseRate: Math.round(baseRate * 100) / 100,
          fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
          handlingFee: handlingFee,
        },
      };
    });

    setQuote({
      chargeableWeight: Math.round(chargeableWeight * 100) / 100,
      actualWeight: weightNum,
      volumetricWeight: Math.round(volumetricWeight * 100) / 100,
      origin,
      destination,
      zone,
      options,
    });
    setSelectedOption(null);
    setShowBreakdown(null);

    toast({
      title: "Quote Generated",
      description: `Found ${options.length} shipping options for your package.`,
    });
  };

  const sendEmailNotification = async (type: "quote_saved" | "booking_confirmed", selected: QuoteOption) => {
    if (!user?.email || !quote) return;
    
    try {
      await supabase.functions.invoke("send-notification", {
        body: {
          type,
          email: user.email,
          data: {
            origin: quote.origin,
            destination: quote.destination,
            service: selected.name,
            price: selected.price,
            deliveryDays: selected.days,
            weight: quote.chargeableWeight,
          },
        },
      });
      console.log(`${type} email sent successfully`);
    } catch (error) {
      console.error("Error sending email notification:", error);
      // Don't throw - email is a nice-to-have, not critical
    }
  };

  const handleProceedToBook = async () => {
    if (!selectedOption || !quote) return;
    
    const selected = quote.options.find(o => o.id === selectedOption);
    if (!selected) return;

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book a shipment.",
      });
      navigate("/auth?redirect=/services");
      return;
    }

    // First save the quote, then navigate to booking
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from("saved_quotes").insert({
        user_id: user.id,
        origin: quote.origin,
        destination: quote.destination,
        actual_weight: quote.actualWeight,
        volumetric_weight: quote.volumetricWeight,
        chargeable_weight: quote.chargeableWeight,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        selected_service: selected.name,
        price: selected.price,
        delivery_days: selected.days,
        status: "saved",
      }).select().single();

      if (error) throw error;

      // Navigate to booking page with the quote ID
      navigate(`/book?quote=${data.id}`);
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: "Failed to proceed to booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveQuote = async () => {
    if (!selectedOption || !quote) return;
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save quotes.",
      });
      navigate("/auth");
      return;
    }

    const selected = quote.options.find(o => o.id === selectedOption);
    if (!selected) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from("saved_quotes").insert({
        user_id: user.id,
        origin: quote.origin,
        destination: quote.destination,
        actual_weight: quote.actualWeight,
        volumetric_weight: quote.volumetricWeight,
        chargeable_weight: quote.chargeableWeight,
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        selected_service: selected.name,
        price: selected.price,
        delivery_days: selected.days,
        status: "saved",
      });

      if (error) throw error;

      // Send email notification
      await sendEmailNotification("quote_saved", selected);

      toast({
        title: "Quote saved!",
        description: "A confirmation email has been sent to your inbox.",
      });
    } catch (error) {
      console.error("Error saving quote:", error);
      toast({
        title: "Error",
        description: "Failed to save quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = origin && destination && weight && length && width && height;

  return (
    <section id="calculator" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">
            Shipping Calculator
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Get an Instant Shipping Quote
          </h2>
          <p className="text-muted-foreground text-lg">
            Enter your shipment details below and receive accurate pricing for all our shipping options.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl border border-border shadow-medium overflow-hidden">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Form Section */}
              <div className="lg:col-span-3 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Shipment Details
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Origin & Destination */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin" className="text-foreground font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        Origin Country
                      </Label>
                      <Select value={origin} onValueChange={setOrigin}>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border z-50">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="text-foreground font-medium flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-accent" />
                        Destination Country
                      </Label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="h-12 bg-background">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border z-50">
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.name}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-foreground font-medium flex items-center gap-2">
                      <Weight className="w-4 h-4 text-accent" />
                      Package Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="e.g., 5.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min="0.1"
                      step="0.1"
                      className="bg-background"
                    />
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-2">
                    <Label className="text-foreground font-medium flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-accent" />
                      Package Dimensions (cm)
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Input
                          type="number"
                          placeholder="Length"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          min="1"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Width"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          min="1"
                          className="bg-background"
                        />
                      </div>
                      <div>
                        <Input
                          type="number"
                          placeholder="Height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          min="1"
                          className="bg-background"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Info className="w-3 h-3" />
                      Volumetric weight (L×W×H÷5000) applies if greater than actual weight
                    </p>
                  </div>

                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={calculateQuote}
                    disabled={!isFormValid}
                  >
                    Calculate Quote
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Results Section */}
              <div className="lg:col-span-2 bg-secondary/50 p-8 border-l border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    Your Quote
                  </h3>
                </div>

                {!quote ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Calculator className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      Enter your shipment details to see available shipping options and prices.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Route Summary */}
                    <div className="bg-background rounded-lg p-3 border border-border">
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{quote.origin}</span>
                        {" → "}
                        <span className="font-medium text-foreground">{quote.destination}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Actual:</span>{" "}
                          <span className="font-medium text-foreground">{quote.actualWeight} kg</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Volumetric:</span>{" "}
                          <span className="font-medium text-foreground">{quote.volumetricWeight} kg</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Chargeable:</span>{" "}
                          <span className="font-semibold text-accent">{quote.chargeableWeight} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Options */}
                    {quote.options.map((option) => (
                      <div key={option.id}>
                        <button
                          onClick={() => setSelectedOption(option.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            selectedOption === option.id
                              ? "border-accent bg-accent/10 shadow-accent"
                              : "border-border bg-card hover:border-accent/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  selectedOption === option.id
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <option.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{option.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {option.days} business days
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-heading text-xl font-bold text-foreground">
                                ${option.price.toFixed(2)}
                              </p>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowBreakdown(showBreakdown === option.id ? null : option.id);
                                }}
                                className="text-xs text-accent hover:underline"
                              >
                                {showBreakdown === option.id ? "Hide" : "View"} breakdown
                              </button>
                            </div>
                          </div>
                        </button>
                        
                        {/* Price Breakdown */}
                        {showBreakdown === option.id && (
                          <div className="mt-2 p-3 bg-muted/50 rounded-lg text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Base shipping rate:</span>
                              <span className="text-foreground">${option.breakdown.baseRate.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Fuel surcharge:</span>
                              <span className="text-foreground">${option.breakdown.fuelSurcharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Handling fee:</span>
                              <span className="text-foreground">${option.breakdown.handlingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-1 border-t border-border font-medium">
                              <span className="text-foreground">Total:</span>
                              <span className="text-accent">${option.price.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        disabled={!selectedOption || isSaving}
                        onClick={handleSaveQuote}
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Quote
                      </Button>
                      <Button
                        variant="hero"
                        size="lg"
                        className="flex-1"
                        disabled={!selectedOption}
                        onClick={handleProceedToBook}
                      >
                        Book Now
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mt-2">
                      {user ? "Save your quote to access it later from your dashboard." : "Sign in to save quotes for later."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingCalculator;
