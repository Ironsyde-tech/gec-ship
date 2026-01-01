import { 
  Package, Plane, Truck, Ship, Zap, Clock, Shield, Globe, 
  CheckCircle2, X, ArrowRight, Building2, Box, Weight,
  Calendar, MapPin, Phone, Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ShippingCalculator from "@/components/ShippingCalculator";

const services = [
  {
    id: "express",
    icon: Zap,
    name: "Express Air",
    tagline: "When every hour counts",
    description: "Our fastest shipping option with guaranteed next-day delivery to major cities worldwide. Perfect for urgent documents, time-sensitive materials, and critical business shipments.",
    deliveryTime: "1-2 days",
    priceRange: "From $49.99",
    features: [
      "Next-day delivery to 50+ countries",
      "Priority customs clearance",
      "Real-time GPS tracking",
      "Dedicated customer support",
      "Up to $10,000 insurance included",
      "Temperature-controlled options",
    ],
    color: "accent",
  },
  {
    id: "air",
    icon: Plane,
    name: "Air Freight",
    tagline: "Speed meets reliability",
    description: "Reliable air freight services for larger shipments. Ideal for businesses needing consistent delivery times without the premium of express shipping.",
    deliveryTime: "3-5 days",
    priceRange: "From $29.99",
    features: [
      "Delivery to 150+ countries",
      "Customs documentation support",
      "Online tracking portal",
      "Business hours support",
      "Up to $5,000 insurance included",
      "Consolidation services",
    ],
    color: "primary",
  },
  {
    id: "ground",
    icon: Truck,
    name: "Ground Shipping",
    tagline: "Cost-effective reliability",
    description: "Economical ground transport across continents with reliable schedules. Perfect for non-urgent shipments and bulk orders.",
    deliveryTime: "5-10 days",
    priceRange: "From $14.99",
    features: [
      "Cross-border expertise",
      "LTL & FTL options",
      "Tracking updates",
      "Email support",
      "Up to $2,000 insurance included",
      "Warehousing available",
    ],
    color: "secondary",
  },
  {
    id: "ocean",
    icon: Ship,
    name: "Ocean Freight",
    tagline: "Best value for bulk",
    description: "Cost-effective ocean freight for large shipments and containers. Ideal for international trade and bulk goods transport.",
    deliveryTime: "15-45 days",
    priceRange: "From $199.99",
    features: [
      "FCL & LCL options",
      "Port-to-port service",
      "Container tracking",
      "Documentation handling",
      "Cargo insurance options",
      "Customs brokerage",
    ],
    color: "muted",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    description: "Perfect for occasional shippers",
    price: "Pay as you go",
    priceNote: "No monthly fees",
    features: [
      { name: "Standard shipping rates", included: true },
      { name: "Online tracking", included: true },
      { name: "Email support", included: true },
      { name: "Basic insurance ($500)", included: true },
      { name: "Priority handling", included: false },
      { name: "Dedicated account manager", included: false },
      { name: "API access", included: false },
      { name: "Custom integrations", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Business",
    description: "For growing businesses",
    price: "$99",
    priceNote: "/month + shipping",
    features: [
      { name: "10% discount on all shipments", included: true },
      { name: "Priority tracking & alerts", included: true },
      { name: "Phone & email support", included: true },
      { name: "Enhanced insurance ($5,000)", included: true },
      { name: "Priority handling", included: true },
      { name: "Dedicated account manager", included: false },
      { name: "API access", included: true },
      { name: "Custom integrations", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For high-volume shippers",
    price: "Custom",
    priceNote: "Tailored to your needs",
    features: [
      { name: "Volume-based discounts", included: true },
      { name: "Real-time tracking dashboard", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Full cargo insurance", included: true },
      { name: "Priority handling", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "Full API access", included: true },
      { name: "Custom integrations", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const comparisonFeatures = [
  { 
    category: "Delivery",
    features: [
      { name: "Delivery Speed", express: "1-2 days", air: "3-5 days", ground: "5-10 days", ocean: "15-45 days" },
      { name: "Weekend Delivery", express: "Available", air: "Saturday only", ground: "No", ocean: "N/A" },
      { name: "Same-Day Option", express: "Yes", air: "No", ground: "No", ocean: "No" },
    ]
  },
  { 
    category: "Coverage",
    features: [
      { name: "Countries Served", express: "50+", air: "150+", ground: "25+", ocean: "180+" },
      { name: "Door-to-Door", express: "Yes", air: "Yes", ground: "Yes", ocean: "Port-to-Port" },
      { name: "Remote Areas", express: "Limited", air: "Yes", ground: "Yes", ocean: "N/A" },
    ]
  },
  { 
    category: "Limits & Insurance",
    features: [
      { name: "Max Weight", express: "70 kg", air: "500 kg", ground: "20,000 kg", ocean: "No limit" },
      { name: "Included Insurance", express: "$10,000", air: "$5,000", ground: "$2,000", ocean: "Optional" },
      { name: "Dangerous Goods", express: "Limited", air: "Yes", ground: "Yes", ocean: "Yes" },
    ]
  },
];

const HeroSection = () => (
  <section className="relative pt-32 pb-20 overflow-hidden gradient-hero">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-accent font-semibold mb-4 uppercase tracking-wider text-sm">Our Services</p>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
          Shipping Solutions for{" "}
          <span className="text-gradient">Every Need</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
          From urgent documents to ocean freight, we offer comprehensive logistics 
          solutions tailored to your business requirements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="xl">
            Get a Quote
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button variant="hero-outline" size="xl">
            Compare Services
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const ServicesGrid = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Choose Your Service</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Flexible Shipping Options
        </h2>
        <p className="text-muted-foreground text-lg">
          Select the shipping method that best fits your timeline and budget.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div 
            key={service.id}
            className="group gradient-card rounded-2xl p-8 border border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">{service.name}</h3>
                  <p className="text-muted-foreground text-sm">{service.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-accent font-bold">{service.priceRange}</p>
                <p className="text-muted-foreground text-sm">{service.deliveryTime}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">{service.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-foreground/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Pricing Plans</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose a plan that works for your shipping volume and business needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingTiers.map((tier) => (
          <div 
            key={tier.name}
            className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
              tier.popular 
                ? "bg-primary text-primary-foreground shadow-medium border-2 border-accent" 
                : "bg-card text-foreground shadow-soft border border-border"
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="font-heading text-xl font-bold mb-2">{tier.name}</h3>
              <p className={`text-sm mb-4 ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {tier.description}
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-heading text-4xl font-bold">{tier.price}</span>
                <span className={`text-sm ${tier.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {tier.priceNote}
                </span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  {feature.included ? (
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${tier.popular ? "text-accent" : "text-accent"}`} />
                  ) : (
                    <X className={`w-5 h-5 flex-shrink-0 ${tier.popular ? "text-primary-foreground/30" : "text-muted-foreground/50"}`} />
                  )}
                  <span className={feature.included ? "" : tier.popular ? "text-primary-foreground/50" : "text-muted-foreground/50"}>
                    {feature.name}
                  </span>
                </li>
              ))}
            </ul>
            
            <Button 
              variant={tier.popular ? "hero" : "outline"} 
              className="w-full"
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ComparisonSection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Compare Services</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Find the Right Fit
        </h2>
        <p className="text-muted-foreground text-lg">
          Compare our shipping services side by side to make the best choice for your needs.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 font-heading font-bold text-foreground">Feature</th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="font-heading font-bold text-foreground">Express</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plane className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-heading font-bold text-foreground">Air Freight</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-heading font-bold text-foreground">Ground</span>
                </div>
              </th>
              <th className="text-center py-4 px-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Ship className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-heading font-bold text-foreground">Ocean</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((category) => (
              <>
                <tr key={category.category} className="bg-secondary/30">
                  <td colSpan={5} className="py-3 px-4 font-heading font-bold text-foreground">
                    {category.category}
                  </td>
                </tr>
                {category.features.map((feature, idx) => (
                  <tr key={`${category.category}-${idx}`} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-4 text-foreground">{feature.name}</td>
                    <td className="py-4 px-4 text-center text-accent font-medium">{feature.express}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{feature.air}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{feature.ground}</td>
                    <td className="py-4 px-4 text-center text-muted-foreground">{feature.ocean}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

const AdditionalServices = () => (
  <section className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Value-Added Services</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Enhance Your Shipping
        </h2>
        <p className="text-muted-foreground text-lg">
          Add-on services to customize your shipping experience.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Shield, title: "Extended Insurance", description: "Up to $100,000 coverage for high-value shipments", price: "From $9.99" },
          { icon: Clock, title: "Time-Definite Delivery", description: "Guaranteed delivery within a specific time window", price: "From $14.99" },
          { icon: Building2, title: "Warehousing", description: "Short and long-term storage at strategic locations", price: "Custom pricing" },
          { icon: Box, title: "Custom Packaging", description: "Specialized packaging for fragile or oversized items", price: "From $4.99" },
          { icon: Weight, title: "Freight Consolidation", description: "Combine multiple shipments for cost savings", price: "Save up to 30%" },
          { icon: Calendar, title: "Scheduled Pickup", description: "Regular pickups on your preferred schedule", price: "Free for Business" },
          { icon: Globe, title: "Customs Brokerage", description: "Expert handling of international documentation", price: "From $24.99" },
          { icon: MapPin, title: "White Glove Delivery", description: "Premium delivery with setup and installation", price: "From $49.99" },
        ].map((service, idx) => (
          <div 
            key={idx}
            className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-medium hover:border-accent/50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <service.icon className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-heading font-bold text-foreground mb-2">{service.title}</h3>
            <p className="text-muted-foreground text-sm mb-3">{service.description}</p>
            <p className="text-accent font-semibold text-sm">{service.price}</p>
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
          Ready to Start Shipping?
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-8">
          Get an instant quote or speak with our logistics experts to find the perfect solution for your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/#calculator">
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
  <footer className="bg-primary pt-16 pb-8">
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
            {["Express Shipping", "Air Freight", "Sea Freight", "Road Transport", "Warehousing"].map((item) => (
              <li key={item}>
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-primary-foreground mb-4">Company</h4>
          <ul className="space-y-3">
            {["About Us", "Careers", "Newsroom", "Sustainability", "Investor Relations"].map((item) => (
              <li key={item}>
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-primary-foreground mb-4">Support</h4>
          <ul className="space-y-3">
            {["Help Center", "Track Shipment", "Shipping Calculator", "FAQs", "Contact Us"].map((item) => (
              <li key={item}>
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors text-sm">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/40 text-sm">
            © 2024 Global Embrace Logistics. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="text-primary-foreground/40 hover:text-primary-foreground text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ShippingCalculator />
      <ServicesGrid />
      <PricingSection />
      <ComparisonSection />
      <AdditionalServices />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Services;
