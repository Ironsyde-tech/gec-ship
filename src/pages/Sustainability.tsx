import { Leaf, Zap, Droplets, TreePine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Sustainability = () => {
  const goals = [
    {
      title: "Carbon Neutral Operations",
      target: 2026,
      progress: 85,
      icon: Zap,
      description: "Achieve 100% carbon neutral operations across all facilities and fleet"
    },
    {
      title: "Renewable Energy",
      target: 2025,
      progress: 92,
      icon: Zap,
      description: "Power 100% of our warehouses with renewable energy sources"
    },
    {
      title: "Plastic Reduction",
      target: 2027,
      progress: 65,
      icon: Droplets,
      description: "Eliminate 100% single-use plastics from packaging by 2027"
    },
    {
      title: "Tree Planting",
      target: 2026,
      progress: 78,
      icon: TreePine,
      description: "Plant 1 million trees to offset carbon emissions"
    }
  ];

  const initiatives = [
    {
      title: "Electric Fleet Expansion",
      description: "We're replacing our diesel fleet with electric vehicles. Currently, 40% of our last-mile delivery fleet is electric.",
      stats: "400+ electric vehicles deployed"
    },
    {
      title: "Green Packaging",
      description: "All our packaging is made from 100% recycled or biodegradable materials. We've eliminated plastic bubble wrap.",
      stats: "50,000+ tons of materials recycled annually"
    },
    {
      title: "Water Conservation",
      description: "Our facilities use advanced water recycling systems and rainwater harvesting to minimize consumption.",
      stats: "5 million gallons of water saved yearly"
    },
    {
      title: "Partner Sustainability",
      description: "We work only with logistics partners who meet our environmental standards and sustainability criteria.",
      stats: "100% of partners certified"
    },
    {
      title: "Carbon Offset Program",
      description: "Every shipment comes with the option to offset its carbon footprint through verified environmental projects.",
      stats: "2M+ tons CO2 offset in 2025"
    },
    {
      title: "Employee Green Program",
      description: "We provide incentives for employees to use public transit, bike, or carpool to work.",
      stats: "65% employee participation"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sustainability</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Our commitment to environmental responsibility and building a sustainable future for logistics.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              Our Environmental Mission
            </h2>
            <p className="text-lg text-muted-foreground">
              Global Embrace believes that logistics can be a force for good. We're committed to reducing our environmental impact while maintaining the fast, reliable service our customers expect. Our goal is to become the world's most sustainable logistics company by 2030.
            </p>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Goals</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {goals.map((goal, idx) => {
              const IconComponent = goal.icon;
              return (
                <Card key={idx} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{goal.title}</h3>
                      <p className="text-sm text-muted-foreground">Target: {goal.target}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">Progress</span>
                      <span className="text-primary">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Initiatives */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Key Initiatives</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {initiatives.map((initiative, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold mb-3">{initiative.title}</h3>
                <p className="text-muted-foreground mb-4">{initiative.description}</p>
                <div className="bg-primary/10 p-3 rounded text-sm font-semibold text-primary">
                  {initiative.stats}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2.5M+</div>
              <p className="text-primary-foreground/80">Tons CO2 Reduced</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500K+</div>
              <p className="text-primary-foreground/80">Trees Planted</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">75M+</div>
              <p className="text-primary-foreground/80">Liters Water Saved</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <p className="text-primary-foreground/80">Green Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* Report */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sustainability Report</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Read our detailed annual sustainability report to learn more about our environmental initiatives, progress, and future commitments.
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            Download 2025 Report →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;
