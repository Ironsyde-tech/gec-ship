import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Tracking from "./pages/Tracking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import FAQ from "./pages/FAQ";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import MyShipments from "./pages/MyShipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import ShippingLabel from "./pages/ShippingLabel";
import Admin from "./pages/Admin";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import Newsroom from "./pages/Newsroom";
import Sustainability from "./pages/Sustainability";
import InvestorRelations from "./pages/InvestorRelations";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import LiveChatWidget from "./components/LiveChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book" element={<Booking />} />
              <Route path="/my-shipments" element={<MyShipments />} />
              <Route path="/shipment/:trackingNumber" element={<ShipmentDetails />} />
              <Route path="/shipment/:trackingNumber/label" element={<ShippingLabel />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/newsroom" element={<Newsroom />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/investor-relations" element={<InvestorRelations />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <LiveChatWidget />
          </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
