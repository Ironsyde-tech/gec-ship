import { Link } from "react-router-dom";
import { 
  Package, ArrowLeft, Globe, Users, Building2, Truck, Plane, Ship,
  Leaf, Recycle, Sun, Wind, Award, Target, Heart, Zap, ChevronRight,
  MapPin, Calendar, TrendingUp, Phone, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const milestones = [
  { year: "2010", title: "Founded", description: "Global Embrace was founded in Shanghai with a vision to connect global trade" },
  { year: "2012", title: "European Expansion", description: "Opened first European hub in Rotterdam, Netherlands" },
  { year: "2015", title: "Americas Launch", description: "Established major operations in New York and Los Angeles" },
  { year: "2018", title: "Tech Revolution", description: "Launched AI-powered tracking and route optimization" },
  { year: "2020", title: "Sustainability Pledge", description: "Committed to carbon neutrality by 2030" },
  { year: "2023", title: "50M Milestone", description: "Delivered 50 million packages worldwide" },
  { year: "2024", title: "Global Leader", description: "Operating in 220+ countries with 15,000+ employees" },
];

const HistorySection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Our Journey</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Building a Global Legacy
        </h2>
        <p className="text-muted-foreground text-lg">
          From a small logistics startup to a global shipping powerhouse, our journey has been defined by innovation, dedication, and an unwavering commitment to our customers.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
        
        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.year}
              className={`relative flex items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-medium transition-all inline-block text-left">
                  <span className="text-accent font-heading font-bold text-2xl">{milestone.year}</span>
                  <h3 className="font-heading font-bold text-foreground mt-1">{milestone.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2">{milestone.description}</p>
                </div>
              </div>
              
              {/* Center dot */}
              <div className="hidden md:flex items-center justify-center w-4 h-4 bg-accent rounded-full z-10 flex-shrink-0" />
              
              {/* Spacer */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);


const infrastructureStats = [
  { icon: Globe, value: "220+", label: "Countries", description: "Global reach across every continent" },
  { icon: Building2, value: "315", label: "Facilities", description: "Distribution centers and hubs" },
  { icon: Users, value: "15,000+", label: "Employees", description: "Dedicated logistics professionals" },
  { icon: Plane, value: "85", label: "Aircraft", description: "Cargo planes in our fleet" },
  { icon: Truck, value: "12,500", label: "Vehicles", description: "Delivery trucks worldwide" },
  { icon: Ship, value: "40", label: "Ships", description: "Ocean freight vessels" },
];

const InfrastructureSection = () => (
  <section className="py-24 gradient-hero">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Global Infrastructure</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Built for Scale
        </h2>
        <p className="text-primary-foreground/70 text-lg">
          Our extensive global network ensures your packages reach any destination reliably and efficiently.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {infrastructureStats.map((stat) => (
          <div 
            key={stat.label}
            className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-6 border border-primary-foreground/10 hover:bg-primary-foreground/15 transition-colors"
          >
            <stat.icon className="w-8 h-8 text-accent mb-4" />
            <p className="font-heading text-4xl font-bold text-primary-foreground">{stat.value}</p>
            <p className="text-accent font-semibold">{stat.label}</p>
            <p className="text-primary-foreground/60 text-sm mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* World Map Representation */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-primary-foreground/5 rounded-2xl p-8 border border-primary-foreground/10">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { region: "North America", hubs: 45 },
              { region: "Europe", hubs: 120 },
              { region: "Asia Pacific", hubs: 95 },
              { region: "Middle East", hubs: 30 },
              { region: "Africa", hubs: 25 },
            ].map((region) => (
              <div key={region.region} className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <p className="text-primary-foreground font-semibold">{region.region}</p>
                <p className="text-accent text-sm">{region.hubs} hubs</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const sustainabilityInitiatives = [
  {
    icon: Leaf,
    title: "Carbon Neutral by 2030",
    description: "Committed to achieving net-zero carbon emissions across all operations through renewable energy and carbon offset programs.",
    progress: 65,
  },
  {
    icon: Recycle,
    title: "Sustainable Packaging",
    description: "100% recyclable packaging materials and eliminated single-use plastics from our supply chain.",
    progress: 85,
  },
  {
    icon: Sun,
    title: "Renewable Energy",
    description: "Solar panels installed across 60% of our facilities, powering operations with clean energy.",
    progress: 60,
  },
  {
    icon: Zap,
    title: "Electric Fleet",
    description: "Transitioning to electric delivery vehicles in urban areas, with 2,500+ EVs already deployed.",
    progress: 40,
  },
];

const SustainabilitySection = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Sustainability</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Shipping with Purpose
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            We believe in building a sustainable future. Our commitment to environmental responsibility 
            drives every decision we make, from route optimization to packaging innovation.
          </p>

          <div className="space-y-6">
            {sustainabilityInitiatives.map((initiative) => (
              <div key={initiative.title} className="bg-card rounded-xl p-5 border border-border shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <initiative.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-foreground mb-1">{initiative.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{initiative.description}</p>
                    <div className="relative">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-accent rounded-full transition-all duration-1000"
                          style={{ width: `${initiative.progress}%` }}
                        />
                      </div>
                      <span className="absolute right-0 -top-5 text-xs text-accent font-medium">
                        {initiative.progress}% complete
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Impact Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/10 rounded-xl p-6 text-center">
              <Wind className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-foreground">45%</p>
              <p className="text-muted-foreground text-sm">CO2 Reduction Since 2020</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-6 text-center">
              <Recycle className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-foreground">12M</p>
              <p className="text-muted-foreground text-sm">kg Plastic Eliminated</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-6 text-center">
              <Sun className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-foreground">85MW</p>
              <p className="text-muted-foreground text-sm">Solar Power Generated</p>
            </div>
            <div className="bg-accent/10 rounded-xl p-6 text-center">
              <Leaf className="w-10 h-10 text-accent mx-auto mb-3" />
              <p className="font-heading text-3xl font-bold text-foreground">2M+</p>
              <p className="text-muted-foreground text-sm">Trees Planted</p>
            </div>
          </div>

          {/* Awards */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-accent" />
              <h3 className="font-heading font-bold text-foreground">Recognition</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Global Green Logistics Award 2024",
                "EPA SmartWay Excellence Award",
                "ISO 14001 Environmental Certification",
                "UN Global Compact Signatory",
              ].map((award) => (
                <li key={award} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-accent" />
                  {award}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ValuesSection = () => (
  <section className="py-24 bg-secondary/30">
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-accent font-semibold mb-3 uppercase tracking-wider text-sm">Our Values</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          What Drives Us
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[
          {
            icon: Target,
            title: "Reliability",
            description: "We deliver on our promises, every time. Your trust is our most valuable asset.",
          },
          {
            icon: TrendingUp,
            title: "Innovation",
            description: "Constantly pushing boundaries with technology to make shipping faster and smarter.",
          },
          {
            icon: Heart,
            title: "Customer First",
            description: "Every decision we make starts with one question: how does this benefit our customers?",
          },
        ].map((value) => (
          <div key={value.title} className="text-center">
            <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <value.icon className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-2">{value.title}</h3>
            <p className="text-muted-foreground">{value.description}</p>
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
          Ready to Partner with Us?
        </h2>
        <p className="text-primary-foreground/70 text-lg mb-8">
          Join thousands of businesses who trust Global Embrace for their global shipping needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/#calculator">
            <Button variant="hero" size="xl">
              Get Started
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/#contact">
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
);

const About = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-hero">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Connecting the World,{" "}
              <span className="text-gradient">One Package at a Time</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl">
              Since 2010, Global Embrace has been at the forefront of global logistics, 
              delivering excellence and innovation to businesses and individuals worldwide.
            </p>
          </div>
        </div>
      </section>

      <HistorySection />
      
      <InfrastructureSection />
      <SustainabilitySection />
      <ValuesSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default About;
