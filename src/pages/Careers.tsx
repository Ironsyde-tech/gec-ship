import { Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Careers = () => {
  const positions = [
    {
      title: "Senior Logistics Manager",
      location: "New York, NY",
      type: "Full-time",
      department: "Operations",
      description: "Lead our logistics operations and manage regional warehouse teams."
    },
    {
      title: "Software Engineer (React/TypeScript)",
      location: "Remote",
      type: "Full-time",
      department: "Engineering",
      description: "Build scalable web applications for our customer-facing platform."
    },
    {
      title: "Customer Success Manager",
      location: "San Francisco, CA",
      type: "Full-time",
      department: "Customer Success",
      description: "Manage relationships with enterprise clients and ensure satisfaction."
    },
    {
      title: "Data Analytics Specialist",
      location: "Remote",
      type: "Full-time",
      department: "Analytics",
      description: "Analyze shipping data and provide insights to improve operations."
    },
    {
      title: "Supply Chain Coordinator",
      location: "Los Angeles, CA",
      type: "Part-time",
      department: "Operations",
      description: "Coordinate shipments and manage supplier relationships."
    },
    {
      title: "UX/UI Designer",
      location: "Remote",
      type: "Full-time",
      department: "Design",
      description: "Design intuitive user experiences for our global logistics platform."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Help us connect the world through reliable shipping. We're building the future of logistics with talented, passionate people.
          </p>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Work at Global Embrace?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Global Impact</h3>
              <p className="text-muted-foreground">
                Work on a platform that connects millions of people across the world every day.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Use cutting-edge technology to solve complex logistics challenges.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-bold text-lg mb-3">Great People</h3>
              <p className="text-muted-foreground">
                Collaborate with talented, collaborative teams across offices worldwide.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Health Insurance", "401k Match", "Flexible Hours", "Remote Options", "Professional Development", "Stock Options", "Free Lunch", "Gym Membership"].map((benefit) => (
              <div key={benefit} className="text-center">
                <div className="text-3xl mb-3">✓</div>
                <p className="font-semibold">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Open Positions</h2>
          <div className="space-y-6">
            {positions.map((job, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{job.title}</h3>
                    <p className="text-sm text-primary font-semibold">{job.department}</p>
                  </div>
                  <Button>Apply Now</Button>
                </div>
                <p className="text-muted-foreground mb-4">{job.description}</p>
                <div className="flex flex-col sm:flex-row gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {job.type}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see a role that fits?</h2>
          <p className="text-primary-foreground/80 mb-8">
            We're always looking for talented people. Send us your resume and let's talk!
          </p>
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            <a href="mailto:careers@globalembrace.com" className="underline hover:no-underline">
              careers@globalembrace.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
