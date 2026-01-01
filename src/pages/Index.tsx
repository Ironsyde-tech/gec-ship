import { Plane, Truck, Globe, Clock, Shield, MapPin, Phone, Mail, ChevronRight, Search, ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@/assets/hero-bg.jpg";
import { useState } from "react";
import ShippingCalculator from "@/components/ShippingCalculator";
import Header from "@/components/Header";

const HeroSection = () => {
  const [trackingNumber, setTrackingNumber] = useState("");

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 gradient-hero opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
            <Globe className="w-4 h-4 text-accent" />
            <span className="text-primary-foreground/90 text-sm font-medium">Delivering to 220+ Countries Worldwide</span>
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Your Package,{" "}
            <span className="text-gradient">Anywhere</span> in the World
          </h1>
          
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-2xl">
            Fast, reliable, and secure international shipping solutions. From documents to freight, 
            we connect businesses and people across the globe.
          </p>

          <div className="bg-primary-foreground/10 backdrop-blur-md rounded-2xl p-6 border border-primary-foreground/20 mb-8">
            <p className="text-primary-foreground/80 text-sm mb-3 font-medium">Track your shipment</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter tracking number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="pl-12 bg-background/95 border-0 h-14"
                />
              </div>
              <Link to="/tracking">
                <Button variant="hero" size="xl">
                  Track Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold">24/7 Support</p>
                <p className="text-primary-foreground/60 text-sm">Always here for you</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-primary-foreground font-semibold">Secure Shipping</p>
                <p className="text-primary-foreground/60 text-sm">Fully insured</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const services = [
  {
    icon: Plane,
    title: "Express Air Freight",
    description: "Next-day and same-week delivery to major cities worldwide. Perfect for time-critical shipments.",
    features: ["Door-to-door delivery", "Real-time tracking", "Priority handling"],
  },
  {
    icon: Truck,
    title: "Ground Shipping",
    description: "Cost-effective road transport across continents with reliable delivery schedules.",
    features: ["LTL & FTL options", "Cross-border expertise", "Warehousing"],
  },
  {
    icon: Package,
    title: "E-commerce Solutions",
    description: "Seamless integration for online retailers with fulfillment and returns management.",
    features: ["API integration", "Customs clearance", "Last-mile delivery"],
  },
];

const ServicesSection = () => (
  <section id="services" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Our Services</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Shipping Solutions for Every Need
        </h2>
        <p className="text-muted-foreground text-lg">
          From urgent documents to heavy freight, we have the perfect solution for your logistics needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="group gradient-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <service.icon className="w-7 h-7 text-accent-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">{service.title}</h3>
            <p className="text-muted-foreground mb-6">{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-foreground/80">
                  <ChevronRight className="w-4 h-4 text-accent" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link to="/services">
              <Button variant="outline" className="mt-6 w-full">
                Learn More
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const stats = [
  { value: "220+", label: "Countries Served" },
  { value: "50M+", label: "Packages Delivered" },
  { value: "99.8%", label: "On-Time Delivery" },
  { value: "24/7", label: "Customer Support" },
];

const StatsSection = () => (
  <section className="py-20 gradient-hero">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p className="font-heading text-4xl md:text-5xl font-bold text-accent mb-2">{stat.value}</p>
            <p className="text-primary-foreground/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TrackingSection = () => (
  <section id="tracking" className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Track & Trace</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Know Where Your Package Is, Always
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our advanced tracking system provides real-time updates at every step of your shipment's journey. 
            From pickup to delivery, stay informed with precise location data and estimated arrival times.
          </p>
          
          <div className="space-y-4">
            {[
              { step: 1, title: "Package Collected", status: "complete", time: "Dec 28, 9:00 AM" },
              { step: 2, title: "In Transit - Local Hub", status: "complete", time: "Dec 28, 2:30 PM" },
              { step: 3, title: "Customs Clearance", status: "current", time: "Dec 29, 8:00 AM" },
              { step: 4, title: "Out for Delivery", status: "pending", time: "Est. Dec 30" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.status === 'complete' ? 'bg-accent text-accent-foreground' :
                  item.status === 'current' ? 'bg-accent/20 border-2 border-accent text-accent' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {item.status === 'complete' ? '✓' : item.step}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${item.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card rounded-2xl p-8 shadow-medium border border-border">
          <h3 className="font-heading text-xl font-bold text-foreground mb-6">Quick Track</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tracking Number</label>
              <Input placeholder="e.g., GE1234567890" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Destination Country (Optional)</label>
              <Input placeholder="e.g., United States" />
            </div>
            <Link to="/tracking">
              <Button variant="hero" size="lg" className="w-full">
                Track Shipment
                <Search className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Recent tracking:</p>
            <div className="space-y-2">
              {["SS9876543210", "SS5432109876"].map((num) => (
                <button 
                  key={num}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                >
                  <span className="font-mono text-sm text-foreground">{num}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const CoverageSection = () => (
  <section id="coverage" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Global Network</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Worldwide Coverage, Local Expertise
        </h2>
        <p className="text-muted-foreground text-lg">
          Our extensive network spans across continents, ensuring your packages reach even the most remote destinations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { region: "North America", countries: 3, hubs: 45 },
          { region: "Europe", countries: 44, hubs: 120 },
          { region: "Asia Pacific", countries: 48, hubs: 95 },
          { region: "Middle East & Africa", countries: 68, hubs: 55 },
        ].map((region, index) => (
          <div 
            key={index}
            className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-medium transition-all hover:border-accent/50"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{region.region}</h3>
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">{region.countries} countries</span>
              <span className="text-accent font-medium">{region.hubs} hubs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 gradient-hero relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Ready to Ship with Confidence?
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-8">
          Get an instant quote for your shipment and experience world-class logistics service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/services">
            <Button variant="hero" size="xl">
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="hero-outline" size="xl">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="bg-primary pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-heading text-xl font-bold text-primary-foreground">Global Embrace</span>
          </div>
          <p className="text-primary-foreground/60 mb-6">
            Connecting the world through reliable, fast, and secure shipping solutions since 2010.
          </p>
          <div className="flex gap-4">
            {[Phone, Mail, Globe].map((Icon, index) => (
              <button 
                key={index}
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors group"
              >
                <Icon className="w-5 h-5 text-primary-foreground/60 group-hover:text-accent-foreground" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-primary-foreground mb-4">Services</h4>
          <ul className="space-y-3">
            <li><Link to="/services" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Express Shipping</Link></li>
            <li><Link to="/services" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Air Freight</Link></li>
            <li><Link to="/services" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Sea Freight</Link></li>
            <li><Link to="/services" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Road Transport</Link></li>
            <li><Link to="/services" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Warehousing</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-primary-foreground mb-4">Company</h4>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">About Us</Link></li>
            <li><Link to="/careers" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Careers</Link></li>
            <li><Link to="/newsroom" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Newsroom</Link></li>
            <li><Link to="/sustainability" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Sustainability</Link></li>
            <li><Link to="/investor-relations" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Investor Relations</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-primary-foreground mb-4">Support</h4>
          <ul className="space-y-3">
            <li><Link to="/faq" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Help Center</Link></li>
            <li><Link to="/tracking" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Track Shipment</Link></li>
            <li><Link to="/faq" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">FAQs</Link></li>
            <li><Link to="/contact" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Contact Us</Link></li>
            <li><Link to="/contact" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">Shipping Calculator</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-primary-foreground/50 text-sm">
          © 2025 Global Embrace International. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link to="/privacy" className="text-primary-foreground/50 hover:text-primary-foreground text-sm transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-primary-foreground/50 hover:text-primary-foreground text-sm transition-colors">
            Terms of Service
          </Link>
          <Link to="/cookies" className="text-primary-foreground/50 hover:text-primary-foreground text-sm transition-colors">
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ShippingCalculator />
      <StatsSection />
      <TrackingSection />
      <CoverageSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
