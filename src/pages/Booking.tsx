import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  Package, MapPin, CreditCard, CheckCircle2, ArrowRight, ArrowLeft,
  Building2, User, Phone, Mail, Globe, Loader2, Truck, Plane, Ship,
  Clock, Shield, Info, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import Header from "@/components/Header";

// Shipping service icons map
const serviceIcons: Record<string, typeof Plane> = {
  "Express Air": Plane,
  "Standard Air": Plane,
  "Ground": Truck,
  "Economy Sea": Ship,
};

interface QuoteData {
  id: string;
  origin: string;
  destination: string;
  actual_weight: number;
  chargeable_weight: number;
  volumetric_weight: number;
  length: number;
  width: number;
  height: number;
  selected_service: string;
  price: number;
  delivery_days: string;
}

interface AddressForm {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const emptyAddress: AddressForm = {
  fullName: "",
  company: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const countries = [
  "United States", "Canada", "Mexico", "United Kingdom", "Germany", 
  "France", "Netherlands", "Spain", "Italy", "Sweden", "Australia",
  "New Zealand", "Japan", "South Korea", "Singapore", "China", 
  "India", "Brazil", "South Africa", "United Arab Emirates"
];

const steps = [
  { id: 1, name: "Review", icon: Package },
  { id: 2, name: "Addresses", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Confirm", icon: CheckCircle2 },
];

const Booking = () => {
  const [searchParams] = useSearchParams();
  const quoteId = searchParams.get("quote");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Address forms
  const [senderAddress, setSenderAddress] = useState<AddressForm>(emptyAddress);
  const [recipientAddress, setRecipientAddress] = useState<AddressForm>(emptyAddress);
  const [sameAsSender, setSameAsSender] = useState(false);

  // Package details
  const [packageDescription, setPackageDescription] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Payment (mock for now)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Result
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/book" + (quoteId ? `?quote=${quoteId}` : ""));
    }
  }, [user, authLoading, navigate, quoteId]);

  useEffect(() => {
    if (quoteId && user) {
      fetchQuote();
    } else if (!quoteId) {
      setLoading(false);
    }
  }, [quoteId, user]);

  const fetchQuote = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_quotes")
        .select("*")
        .eq("id", quoteId)
        .single();

      if (error) throw error;
      setQuote(data);

      // Pre-fill user email in sender
      if (user?.email) {
        setSenderAddress(prev => ({ ...prev, email: user.email || "" }));
      }
    } catch (error) {
      console.error("Error fetching quote:", error);
      toast({
        title: "Quote not found",
        description: "The quote you're looking for doesn't exist or has expired.",
        variant: "destructive",
      });
      navigate("/services");
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!quote) {
        toast({
          title: "No quote selected",
          description: "Please select a shipping quote first.",
          variant: "destructive",
        });
        return false;
      }
      if (!packageDescription.trim()) {
        toast({
          title: "Package description required",
          description: "Please describe the contents of your package.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }

    if (step === 2) {
      const requiredFields = ["fullName", "phone", "addressLine1", "city", "postalCode", "country"];
      
      for (const field of requiredFields) {
        if (!senderAddress[field as keyof AddressForm]) {
          toast({
            title: "Sender information incomplete",
            description: `Please fill in all required sender fields.`,
            variant: "destructive",
          });
          return false;
        }
        if (!recipientAddress[field as keyof AddressForm]) {
          toast({
            title: "Recipient information incomplete",
            description: `Please fill in all required recipient fields.`,
            variant: "destructive",
          });
          return false;
        }
      }
      return true;
    }

    if (step === 3) {
      if (paymentMethod === "card") {
        if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
          toast({
            title: "Payment information incomplete",
            description: "Please fill in all card details.",
            variant: "destructive",
          });
          return false;
        }
      }
      if (!agreedToTerms) {
        toast({
          title: "Terms not accepted",
          description: "Please agree to the terms and conditions.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateTotal = () => {
    if (!quote) return 0;
    let total = Number(quote.price);
    if (insuranceSelected && declaredValue) {
      total += Number(declaredValue) * 0.02; // 2% insurance fee
    }
    return total;
  };

  const handleSubmitBooking = async () => {
    if (!validateStep(3) || !quote || !user) return;

    setSubmitting(true);
    try {
      // Create the shipment
      const { data: shipment, error: shipmentError } = await supabase
        .from("shipments")
        .insert({
          user_id: user.id,
          origin: `${senderAddress.city}, ${senderAddress.country}`,
          destination: `${recipientAddress.city}, ${recipientAddress.country}`,
          current_location: `${senderAddress.city}, ${senderAddress.country}`,
          service_type: quote.selected_service,
          weight: quote.chargeable_weight,
          status: "pending",
          estimated_delivery: new Date(
            Date.now() + parseInt(quote.delivery_days) * 24 * 60 * 60 * 1000
          ).toISOString(),
        })
        .select()
        .single();

      if (shipmentError) throw shipmentError;

      // Create initial shipment event
      await supabase.from("shipment_events").insert({
        shipment_id: shipment.id,
        status: "pending",
        location: `${senderAddress.city}, ${senderAddress.country}`,
        description: "Shipment booked, awaiting pickup",
      });

      // Update the quote status
      await supabase
        .from("saved_quotes")
        .update({ status: "booked" })
        .eq("id", quote.id);

      setTrackingNumber(shipment.tracking_number);
      setCurrentStep(4);

      toast({
        title: "Booking confirmed!",
        description: `Your tracking number is ${shipment.tracking_number}`,
      });
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!quote && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-foreground mb-4">
                No Quote Selected
              </h1>
              <p className="text-muted-foreground mb-8">
                Please get a shipping quote first before proceeding to booking.
              </p>
              <Link to="/services">
                <Button variant="hero">
                  Get a Quote
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const ServiceIcon = quote ? (serviceIcons[quote.selected_service] || Package) : Package;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
                <div 
                  className="absolute left-0 top-5 h-0.5 bg-accent transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step) => (
                  <div key={step.id} className="relative flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                        currentStep >= step.id
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
              {/* Step 1: Review Quote & Package Details */}
              {currentStep === 1 && quote && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      Review Your Shipment
                    </h2>
                    <p className="text-muted-foreground">
                      Confirm your shipping details and add package information.
                    </p>
                  </div>

                  {/* Quote Summary */}
                  <div className="bg-muted/50 rounded-xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center">
                        <ServiceIcon className="w-6 h-6 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">
                          {quote.selected_service}
                        </h3>
                        <p className="text-muted-foreground">
                          {quote.origin} → {quote.destination}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-accent">
                          ${Number(quote.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quote.delivery_days} days delivery
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Actual Weight</p>
                        <p className="font-medium">{quote.actual_weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dimensions</p>
                        <p className="font-medium">{quote.length}×{quote.width}×{quote.height} cm</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Volumetric</p>
                        <p className="font-medium">{quote.volumetric_weight} kg</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Chargeable</p>
                        <p className="font-medium">{quote.chargeable_weight} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Package Description */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description">Package Contents *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the contents of your package (e.g., Electronics - Laptop computer)"
                        value={packageDescription}
                        onChange={(e) => setPackageDescription(e.target.value)}
                        className="mt-1.5"
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="declaredValue">Declared Value (USD)</Label>
                        <Input
                          id="declaredValue"
                          type="number"
                          placeholder="0.00"
                          value={declaredValue}
                          onChange={(e) => setDeclaredValue(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="insurance"
                            checked={insuranceSelected}
                            onCheckedChange={(checked) => setInsuranceSelected(checked as boolean)}
                          />
                          <Label htmlFor="insurance" className="text-sm">
                            Add shipping insurance (2% of declared value)
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any special handling instructions..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="mt-1.5"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Addresses */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      Shipping Addresses
                    </h2>
                    <p className="text-muted-foreground">
                      Enter the sender and recipient details.
                    </p>
                  </div>

                  {/* Sender Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-accent" />
                      </div>
                      Sender (From)
                    </h3>
                    <AddressFormFields
                      address={senderAddress}
                      setAddress={setSenderAddress}
                      prefix="sender"
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    {/* Recipient Address */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        Recipient (To)
                      </h3>
                      <AddressFormFields
                        address={recipientAddress}
                        setAddress={setRecipientAddress}
                        prefix="recipient"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && quote && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      Payment Details
                    </h2>
                    <p className="text-muted-foreground">
                      Complete your booking with secure payment.
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-muted/50 rounded-xl p-6">
                    <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{quote.selected_service}</span>
                        <span className="font-medium">${Number(quote.price).toFixed(2)}</span>
                      </div>
                      {insuranceSelected && declaredValue && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping Insurance</span>
                          <span className="font-medium">
                            ${(Number(declaredValue) * 0.02).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-xl text-accent">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "card"
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <CreditCard className="w-6 h-6 mb-2" />
                        <span className="font-medium">Credit Card</span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod("paypal")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === "paypal"
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <Globe className="w-6 h-6 mb-2" />
                        <span className="font-medium">PayPal</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="bg-muted/50 rounded-xl p-6 text-center">
                      <p className="text-muted-foreground">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-accent hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-accent hover:underline">
                        Privacy Policy
                      </Link>
                      . I understand that my shipment will be processed according to these terms.
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                    Booking Confirmed!
                  </h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your shipment has been successfully booked. You will receive a confirmation email shortly.
                  </p>

                  {trackingNumber && (
                    <div className="bg-muted/50 rounded-xl p-6 max-w-sm mx-auto mb-8">
                      <p className="text-sm text-muted-foreground mb-2">Your Tracking Number</p>
                      <p className="font-mono text-2xl font-bold text-accent">{trackingNumber}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to={`/tracking?number=${trackingNumber}`}>
                      <Button variant="hero">
                        Track Shipment
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/my-shipments">
                      <Button variant="outline">
                        View All Shipments
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {currentStep < 3 ? (
                    <Button variant="hero" onClick={nextStep}>
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="hero"
                      onClick={handleSubmitBooking}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Booking
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Address Form Fields Component
const AddressFormFields = ({
  address,
  setAddress,
  prefix,
}: {
  address: AddressForm;
  setAddress: React.Dispatch<React.SetStateAction<AddressForm>>;
  prefix: string;
}) => {
  const updateField = (field: keyof AddressForm, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}-fullName`}>Full Name *</Label>
          <Input
            id={`${prefix}-fullName`}
            placeholder="John Doe"
            value={address.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-company`}>Company</Label>
          <Input
            id={`${prefix}-company`}
            placeholder="Company name (optional)"
            value={address.company}
            onChange={(e) => updateField("company", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`${prefix}-phone`}>Phone *</Label>
          <Input
            id={`${prefix}-phone`}
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={address.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-email`}>Email</Label>
          <Input
            id={`${prefix}-email`}
            type="email"
            placeholder="email@example.com"
            value={address.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${prefix}-address1`}>Address Line 1 *</Label>
        <Input
          id={`${prefix}-address1`}
          placeholder="Street address"
          value={address.addressLine1}
          onChange={(e) => updateField("addressLine1", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor={`${prefix}-address2`}>Address Line 2</Label>
        <Input
          id={`${prefix}-address2`}
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={address.addressLine2}
          onChange={(e) => updateField("addressLine2", e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`${prefix}-city`}>City *</Label>
          <Input
            id={`${prefix}-city`}
            placeholder="City"
            value={address.city}
            onChange={(e) => updateField("city", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-state`}>State / Province</Label>
          <Input
            id={`${prefix}-state`}
            placeholder="State"
            value={address.state}
            onChange={(e) => updateField("state", e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor={`${prefix}-postal`}>Postal Code *</Label>
          <Input
            id={`${prefix}-postal`}
            placeholder="12345"
            value={address.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`${prefix}-country`}>Country *</Label>
        <Select
          value={address.country}
          onValueChange={(value) => updateField("country", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Booking;
