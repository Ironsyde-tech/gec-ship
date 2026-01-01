import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Package, ArrowLeft, MapPin, Phone, Mail, Clock, Send, 
  MessageSquare, Headphones, FileText, ChevronRight, Globe,
  Building2, Users, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

const offices = [
  {
    city: "New York",
    country: "United States",
    address: "350 Fifth Avenue, Suite 7820",
    phone: "+1 (212) 555-0123",
    email: "newyork@globalembrace.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM EST",
    isHQ: true,
  },
  {
    city: "London",
    country: "United Kingdom",
    address: "1 Canada Square, Canary Wharf",
    phone: "+44 20 7123 4567",
    email: "london@globalembrace.com",
    hours: "Mon-Fri: 9:00 AM - 5:30 PM GMT",
    isHQ: false,
  },
  {
    city: "Shanghai",
    country: "China",
    address: "88 Century Avenue, Pudong",
    phone: "+86 21 5888 8888",
    email: "shanghai@globalembrace.com",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM CST",
    isHQ: false,
  },
  {
    city: "Dubai",
    country: "United Arab Emirates",
    address: "Dubai World Trade Centre, Tower 2",
    phone: "+971 4 555 1234",
    email: "dubai@globalembrace.com",
    hours: "Sun-Thu: 8:00 AM - 5:00 PM GST",
    isHQ: false,
  },
];

const supportOptions = [
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "Our global support team is available around the clock to assist you.",
    action: "Call Now",
    contact: "+1 (800) 555-SHIP",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Get instant answers from our support specialists via live chat.",
    action: "Start Chat",
    contact: "Available 24/7",
  },
  {
    icon: FileText,
    title: "Help Center",
    description: "Browse our comprehensive FAQ and self-service resources.",
    action: "Visit Help Center",
    contact: "500+ Articles",
  },
];

const ContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("contact-form", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          subject: formData.subject,
          message: formData.message,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. Check your email for a confirmation.",
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again or contact us directly at support@globalembrace.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground font-medium">Full Name *</Label>
          <Input
            id="name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">Email Address *</Label>
          <Input
            id="email"
            type="email"
            required
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-background"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-foreground font-medium">Company Name</Label>
          <Input
            id="company"
            placeholder="Your Company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-foreground font-medium">Subject *</Label>
        <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
          <SelectTrigger className="h-12 bg-background">
            <SelectValue placeholder="Select a topic" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border z-50">
            <SelectItem value="shipping">Shipping Inquiry</SelectItem>
            <SelectItem value="tracking">Tracking Issue</SelectItem>
            <SelectItem value="quote">Request a Quote</SelectItem>
            <SelectItem value="partnership">Business Partnership</SelectItem>
            <SelectItem value="complaint">File a Complaint</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-foreground font-medium">Message *</Label>
        <Textarea
          id="message"
          required
          placeholder="How can we help you?"
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="bg-background resize-none"
        />
      </div>

      <Button 
        type="submit" 
        variant="hero" 
        size="xl" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>Sending...</>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form, you agree to our Privacy Policy and Terms of Service.
      </p>
    </form>
  );
};

const OfficeMap = () => (
  <div className="relative bg-primary rounded-2xl overflow-hidden h-80 lg:h-full min-h-[400px]">
    {/* Stylized world map background */}
    <div className="absolute inset-0 opacity-20">
      <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-foreground" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapGrid)" />
      </svg>
    </div>

    {/* Office location markers */}
    <div className="absolute inset-0">
      {/* New York */}
      <div className="absolute left-[22%] top-[35%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
        <div className="relative">
          <div className="w-5 h-5 bg-accent rounded-full animate-pulse shadow-accent" />
          <div className="absolute -inset-1 border-2 border-accent rounded-full animate-ping opacity-30" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded font-medium">New York (HQ)</span>
          </div>
        </div>
      </div>

      {/* London */}
      <div className="absolute left-[47%] top-[30%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
        <div className="relative">
          <div className="w-4 h-4 bg-accent rounded-full" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded font-medium">London</span>
          </div>
        </div>
      </div>

      {/* Dubai */}
      <div className="absolute left-[58%] top-[48%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
        <div className="relative">
          <div className="w-4 h-4 bg-accent rounded-full" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded font-medium">Dubai</span>
          </div>
        </div>
      </div>

      {/* Shanghai */}
      <div className="absolute left-[78%] top-[42%] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
        <div className="relative">
          <div className="w-4 h-4 bg-accent rounded-full" />
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-accent-foreground bg-accent px-2 py-1 rounded font-medium">Shanghai</span>
          </div>
        </div>
      </div>

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 22 35 Q 35 25, 47 30"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="0.15"
          strokeDasharray="1 1"
          opacity="0.5"
        />
        <path
          d="M 47 30 Q 52 40, 58 48"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="0.15"
          strokeDasharray="1 1"
          opacity="0.5"
        />
        <path
          d="M 58 48 Q 68 45, 78 42"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="0.15"
          strokeDasharray="1 1"
          opacity="0.5"
        />
      </svg>
    </div>

    {/* Legend */}
    <div className="absolute bottom-4 left-4 bg-primary/90 backdrop-blur-sm rounded-lg p-3 border border-primary-foreground/10">
      <p className="text-xs text-primary-foreground/80 mb-2 font-medium">Global Offices</p>
      <div className="flex items-center gap-4 text-xs text-primary-foreground/60">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full" />
          <span>Headquarters</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-accent rounded-full" />
          <span>Regional Office</span>
        </div>
      </div>
    </div>

    {/* Stats overlay */}
    <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/10">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="font-heading text-2xl font-bold text-accent">4</p>
          <p className="text-xs text-primary-foreground/60">Major Offices</p>
        </div>
        <div className="text-center">
          <p className="font-heading text-2xl font-bold text-accent">220+</p>
          <p className="text-xs text-primary-foreground/60">Countries</p>
        </div>
      </div>
    </div>
  </div>
);

const Contact = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-hero">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Get in Touch
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl">
              Have questions about our services? Need help with a shipment? Our team is here to help you 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-12 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {supportOptions.map((option) => (
              <div 
                key={option.title}
                className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-medium transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <option.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{option.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{option.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent font-semibold text-sm">{option.contact}</span>
                  <Button variant="ghost" size="sm" className="text-accent hover:text-accent">
                    {option.action}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Send Us a Message</h2>
                  <p className="text-muted-foreground text-sm">We typically respond within 24 hours</p>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
                <ContactForm />
              </div>
            </div>

            {/* Map */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Our Global Presence</h2>
                  <p className="text-muted-foreground text-sm">Offices across 4 continents</p>
                </div>
              </div>
              
              <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-soft">
                <OfficeMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Office Locations</p>
            <h2 className="font-heading text-3xl font-bold text-foreground">Visit Us</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office) => (
              <div 
                key={office.city}
                className={`bg-card rounded-xl p-6 border shadow-soft hover:shadow-medium transition-all ${
                  office.isHQ ? 'border-accent' : 'border-border'
                }`}
              >
                {office.isHQ && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3">
                    <Building2 className="w-3 h-3" />
                    Headquarters
                  </span>
                )}
                <h3 className="font-heading font-bold text-foreground text-lg">{office.city}</h3>
                <p className="text-accent text-sm mb-4">{office.country}</p>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{office.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-8">
              Find quick answers to common questions about shipping, tracking, and our services.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
              {[
                "How do I track my shipment?",
                "What are your delivery times?",
                "How do I file a claim?",
                "What items cannot be shipped?",
              ].map((question) => (
                <button 
                  key={question}
                  className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground text-sm">{question}</span>
                </button>
              ))}
            </div>
            
            <Button variant="outline" size="lg">
              View All FAQs
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-8 border-t border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-heading font-bold text-primary-foreground">Global Embrace</span>
            </Link>
            <p className="text-primary-foreground/50 text-sm">
              © 2024 Global Embrace International. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Contact;
