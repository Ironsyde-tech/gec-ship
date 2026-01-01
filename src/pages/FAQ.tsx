import { 
  Package, Search, Truck, Plane, Globe, Shield, Clock, 
  CreditCard, FileText, HelpCircle, Phone, Mail, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import { useState } from "react";

const faqCategories = [
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Questions about shipping methods, delivery times, and tracking",
    questions: [
      {
        q: "How long does standard shipping take?",
        a: "Standard shipping typically takes 5-10 business days for domestic deliveries and 10-21 business days for international shipments. Delivery times may vary based on destination, customs processing, and local conditions."
      },
      {
        q: "Can I track my package in real-time?",
        a: "Yes! All shipments include real-time GPS tracking. You can track your package through our website, mobile app, or by entering your tracking number on our tracking page. You'll receive automatic updates at every milestone."
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Same-day delivery is available in select metropolitan areas for orders placed before 10 AM local time. This service is available with our Express Air option. Contact us to check availability in your area."
      },
      {
        q: "What happens if my package is delayed?",
        a: "If your package is delayed, you'll receive automatic notifications with updated delivery estimates. For time-critical shipments with guaranteed delivery dates, you may be eligible for a refund or credit. Contact our support team for assistance."
      },
      {
        q: "Can I change the delivery address after shipping?",
        a: "Address changes are possible for most shipments before they reach the final delivery hub. Log into your account or contact customer support as soon as possible. Additional fees may apply for address changes."
      },
      {
        q: "Do you deliver on weekends and holidays?",
        a: "Weekend delivery is available for Express shipments in most areas. Saturday delivery is included with Express Air service. We do not deliver on major holidays, and these days are not counted as business days."
      },
    ],
  },
  {
    id: "customs",
    icon: FileText,
    title: "Customs & International",
    description: "Information about customs, duties, and international shipping",
    questions: [
      {
        q: "How do customs duties and taxes work?",
        a: "Customs duties and taxes are determined by the destination country based on the declared value and type of goods. These fees are typically the responsibility of the recipient unless you choose our Duties Paid (DDP) service."
      },
      {
        q: "What documents do I need for international shipping?",
        a: "International shipments require a commercial invoice, customs declaration form, and sometimes additional documents like certificates of origin or export licenses. We provide guidance and can prepare most documentation for you."
      },
      {
        q: "Which countries do you ship to?",
        a: "We ship to over 220 countries and territories worldwide. Some destinations may have restrictions on certain goods. Check our coverage page or contact us to confirm availability for your specific destination."
      },
      {
        q: "How long does customs clearance take?",
        a: "Customs clearance typically takes 1-3 business days for most shipments. Complex items or incomplete documentation may cause delays. Our customs brokerage service can help expedite the process."
      },
      {
        q: "What items are prohibited for international shipping?",
        a: "Prohibited items vary by country but commonly include hazardous materials, weapons, certain electronics, and perishables. We provide a comprehensive prohibited items list during booking. Contact us for specific guidance."
      },
      {
        q: "Can you help with customs brokerage?",
        a: "Yes, we offer full customs brokerage services. Our licensed brokers handle all documentation, classification, and clearance procedures to ensure smooth transit through customs."
      },
    ],
  },
  {
    id: "pricing",
    icon: CreditCard,
    title: "Pricing & Payments",
    description: "Questions about rates, billing, and payment options",
    questions: [
      {
        q: "How are shipping rates calculated?",
        a: "Shipping rates are based on package dimensions (dimensional weight), actual weight, origin, destination, and service level. We use whichever is greater between actual and dimensional weight. Get an instant quote using our shipping calculator."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and offer invoicing for business accounts. Prepaid shipping credits are also available for regular shippers."
      },
      {
        q: "Do you offer volume discounts?",
        a: "Yes! We offer tiered volume discounts for regular shippers. Business and Enterprise plan members receive automatic discounts of 10-30% depending on monthly volume. Contact our sales team for custom pricing."
      },
      {
        q: "Are there any hidden fees?",
        a: "We believe in transparent pricing. All fees including fuel surcharges, residential delivery fees, and handling charges are disclosed upfront before you confirm your shipment. No surprise charges."
      },
      {
        q: "Can I get a refund if my shipment is late?",
        a: "For services with guaranteed delivery times, you may be eligible for a full or partial refund if we miss the commitment. Submit a claim within 15 days of delivery. Terms vary by service level."
      },
      {
        q: "How do I access my invoices?",
        a: "All invoices are available in your account dashboard under the Billing section. You can download PDF invoices, view payment history, and set up automatic payments for convenience."
      },
    ],
  },
  {
    id: "packaging",
    icon: Package,
    title: "Packaging & Restrictions",
    description: "Guidelines for packaging, size limits, and prohibited items",
    questions: [
      {
        q: "What are the size and weight limits?",
        a: "Size and weight limits vary by service: Express Air (70 kg, 150 cm length), Air Freight (500 kg, no dimension limit), Ground (20,000 kg), Ocean Freight (unlimited). Contact us for oversized or heavy freight quotes."
      },
      {
        q: "Do you provide packaging materials?",
        a: "Yes, we offer a range of packaging materials including boxes, envelopes, bubble wrap, and specialty containers. These can be ordered online or picked up at our service centers. Some are free for account holders."
      },
      {
        q: "How should I package fragile items?",
        a: "Fragile items should be wrapped individually in bubble wrap, surrounded by at least 2 inches of cushioning material, and placed in a sturdy corrugated box. Mark the package as FRAGILE and consider our enhanced insurance."
      },
      {
        q: "Can I ship batteries or electronics?",
        a: "Yes, most consumer electronics and batteries can be shipped with proper declaration. Lithium batteries have specific regulations including quantity limits and labeling requirements. We provide guidance during booking."
      },
      {
        q: "What items cannot be shipped?",
        a: "Prohibited items include explosives, flammable gases, toxic substances, radioactive materials, and illegal goods. Restricted items like alcohol, tobacco, and certain foods require special handling and documentation."
      },
      {
        q: "Do you offer custom packaging solutions?",
        a: "Yes, we provide custom packaging for unusual items, artwork, furniture, and industrial equipment. Our packaging specialists can design solutions for any shipping challenge. Contact us for a consultation."
      },
    ],
  },
  {
    id: "insurance",
    icon: Shield,
    title: "Insurance & Claims",
    description: "Coverage options, claims process, and liability information",
    questions: [
      {
        q: "Is my shipment insured?",
        a: "All shipments include basic coverage: Express ($10,000), Air Freight ($5,000), Ground ($2,000). For higher-value items, we recommend purchasing extended insurance up to $100,000 or more."
      },
      {
        q: "How do I file a claim for damaged goods?",
        a: "Claims should be filed within 21 days of delivery. Log into your account, go to Claims, and provide photos of damage, packaging, and the invoice. Most claims are processed within 5-7 business days."
      },
      {
        q: "What is covered by shipping insurance?",
        a: "Our insurance covers loss, theft, and damage during transit. It does not cover improper packaging, inherent product defects, or items prohibited from coverage. Review your policy for specific terms."
      },
      {
        q: "How much additional insurance can I purchase?",
        a: "Extended insurance is available up to $100,000 per shipment, with higher limits available for Enterprise customers. Premium rates start at $0.50 per $100 of declared value."
      },
      {
        q: "What documentation is needed for a claim?",
        a: "Required documentation includes: original invoice, photos of damaged items and packaging, tracking number, and a detailed description of the damage. Keep all packaging materials until the claim is resolved."
      },
      {
        q: "How long does the claims process take?",
        a: "Most claims are reviewed within 5-7 business days. Simple claims may be approved immediately, while complex cases requiring investigation can take up to 30 days. You'll receive status updates throughout."
      },
    ],
  },
  {
    id: "account",
    icon: HelpCircle,
    title: "Account & Support",
    description: "Help with your account, technical issues, and contacting support",
    questions: [
      {
        q: "How do I create a business account?",
        a: "Creating a business account is easy. Click 'Sign Up' and select 'Business Account.' You'll need your business name, tax ID, and contact information. Business accounts unlock volume discounts and additional features."
      },
      {
        q: "Can I schedule regular pickups?",
        a: "Yes! Business and Enterprise account holders can schedule recurring pickups daily, weekly, or on custom schedules. Scheduled pickups are free for qualifying accounts. Set this up in your account settings."
      },
      {
        q: "How do I integrate with my e-commerce platform?",
        a: "We offer direct integrations with Shopify, WooCommerce, Magento, and other major platforms. API access is available for Business and Enterprise accounts. Visit our Developer Portal for documentation."
      },
      {
        q: "What are your customer support hours?",
        a: "Our customer support is available 24/7 for Express shipments. Standard support hours are Monday-Friday, 8 AM - 8 PM (local time). Enterprise customers have dedicated account managers available anytime."
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a reset link within minutes. If you don't see it, check your spam folder or contact support."
      },
      {
        q: "Can I add multiple users to my business account?",
        a: "Yes, Business and Enterprise accounts support unlimited users with role-based permissions. Admins can invite team members, set shipping limits, and control access to billing information."
      },
    ],
  },
];

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative pt-32 pb-20 overflow-hidden gradient-hero">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent font-semibold mb-4 uppercase tracking-wider text-sm">Help Center</p>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl mb-8">
            Find answers to common questions about shipping, customs, pricing, and more.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-background/95 border-0 text-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CategoryNav = () => (
  <section className="py-12 bg-background border-b border-border">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {faqCategories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-medium transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <category.icon className="w-6 h-6 text-accent" />
            </div>
            <span className="font-medium text-foreground text-center text-sm">{category.title}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        {faqCategories.map((category) => (
          <div key={category.id} id={category.id} className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                <category.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>
            
            <Accordion type="single" collapsible className="space-y-3">
              {category.questions.map((item, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`${category.id}-${idx}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-soft"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-accent hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactCTA = () => (
  <section className="py-20 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-soft">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-4">
                Still have questions?
              </h2>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help. Reach out and we will get back to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button variant="default" size="lg">
                    Contact Support
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold text-foreground">24/7 Support</p>
                <p className="text-muted-foreground text-sm">For Express shipments</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <Mail className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold text-foreground">Email Us</p>
                <p className="text-muted-foreground text-sm">support@globalembrace.com</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <Phone className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold text-foreground">Call Us</p>
                <p className="text-muted-foreground text-sm">1-800-SWIFT</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <Globe className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="font-semibold text-foreground">Live Chat</p>
                <p className="text-muted-foreground text-sm">Available 24/7</p>
              </div>
            </div>
          </div>
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

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CategoryNav />
      <FAQSection />
      <ContactCTA />
      <Footer />
    </div>
  );
};

export default FAQ;
