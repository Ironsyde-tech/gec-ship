import { TrendingUp, BarChart3, DollarSign, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const InvestorRelations = () => {
  const financials = [
    { label: "Revenue 2025", value: "$850M", change: "+45% YoY" },
    { label: "Active Customers", value: "2.3M", change: "+65% YoY" },
    { label: "Shipments/Day", value: "500K+", change: "+52% YoY" },
    { label: "Valuation", value: "$2.8B", change: "Series B" }
  ];

  const milestones = [
    {
      year: 2021,
      title: "Founded",
      description: "Global Embrace launches with seed funding"
    },
    {
      year: 2022,
      title: "Series A",
      description: "Raised $15M for technology and expansion"
    },
    {
      year: 2023,
      title: "1M Customers",
      description: "Reached 1 million active customers milestone"
    },
    {
      year: 2024,
      title: "International Expansion",
      description: "Expanded to 50+ countries across 6 continents"
    },
    {
      year: 2025,
      title: "Series B",
      description: "Raised $50M to accelerate growth and innovation"
    },
    {
      year: 2026,
      title: "Projected IPO",
      description: "Planning for public market entry"
    }
  ];

  const team = [
    {
      name: "Alex Richardson",
      role: "CEO & Founder",
      background: "Former VP of Operations at TechLogistics"
    },
    {
      name: "Sarah Mitchell",
      role: "CFO",
      background: "Harvard MBA, 15 years in logistics finance"
    },
    {
      name: "David Chen",
      role: "CTO",
      background: "Stanford PhD, AI expert from Google"
    },
    {
      name: "Emily Rodriguez",
      role: "COO",
      background: "Built operations for 3 successful startups"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Investor Relations</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Transforming global logistics with technology. We're building the future of supply chain management.
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financials.map((metric, idx) => (
              <Card key={idx} className="p-6 text-center">
                <p className="text-muted-foreground text-sm mb-3">{metric.label}</p>
                <div className="text-3xl font-bold mb-2">{metric.value}</div>
                <p className="text-primary font-semibold text-sm">{metric.change}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Growth Timeline</h2>
          <div className="space-y-8">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {milestone.year}
                  </div>
                  {idx !== milestones.length - 1 && <div className="w-1 h-16 bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Leadership Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, idx) => (
              <Card key={idx} className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-primary font-semibold text-sm mb-2">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.background}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Investor Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <BarChart3 className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-3">Financial Statements</h3>
              <p className="text-sm text-muted-foreground mb-4">Quarterly and annual financial reports</p>
              <button className="text-primary font-semibold hover:underline">Download →</button>
            </Card>
            <Card className="p-6">
              <TrendingUp className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-3">Investor Presentations</h3>
              <p className="text-sm text-muted-foreground mb-4">Latest pitch decks and company overview</p>
              <button className="text-primary font-semibold hover:underline">Access →</button>
            </Card>
            <Card className="p-6">
              <DollarSign className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-bold mb-3">SEC Filings</h3>
              <p className="text-sm text-muted-foreground mb-4">All regulatory filings and documents</p>
              <button className="text-primary font-semibold hover:underline">View →</button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Investor Contact</h2>
          <p className="text-muted-foreground mb-8">
            For investor inquiries, partnership opportunities, or media requests
          </p>
          <a href="mailto:investors@globalembrace.com" className="text-primary font-semibold hover:underline text-lg">
            investors@globalembrace.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default InvestorRelations;
