import { Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";

const Newsroom = () => {
  const articles = [
    {
      title: "Global Embrace Launches AI-Powered Route Optimization",
      date: "December 28, 2025",
      author: "Sarah Johnson",
      category: "Product",
      excerpt: "We're excited to announce the launch of our new AI-powered route optimization system, which reduces delivery times by 30% on average.",
      image: "📦"
    },
    {
      title: "Expansion into 50 New Markets Across Asia",
      date: "December 15, 2025",
      author: "Michael Chen",
      category: "Expansion",
      excerpt: "Global Embrace has announced its biggest expansion yet, entering 50 new markets across Asia Pacific, enabling us to serve millions more customers.",
      image: "🌏"
    },
    {
      title: "Global Embrace Named Best Logistics Startup of 2025",
      date: "December 1, 2025",
      author: "Emily Rodriguez",
      category: "Awards",
      excerpt: "We're honored to receive the Best Logistics Startup award from the Global Commerce Association for our innovation and customer service.",
      image: "🏆"
    },
    {
      title: "Sustainability Report: Carbon Neutral by 2026",
      date: "November 20, 2025",
      author: "David Thompson",
      category: "Sustainability",
      excerpt: "Our latest sustainability report shows significant progress toward our goal of becoming carbon neutral by 2026. Learn about our initiatives.",
      image: "♻️"
    },
    {
      title: "Introduces Advanced Shipment Tracking Technology",
      date: "November 5, 2025",
      author: "Jennifer Lee",
      category: "Product",
      excerpt: "Our new real-time tracking system uses satellite technology to provide accurate, minute-by-minute updates on shipments worldwide.",
      image: "🛰️"
    },
    {
      title: "Global Embrace Completes Series B Funding Round",
      date: "October 15, 2025",
      author: "Robert Martinez",
      category: "Funding",
      excerpt: "We've successfully completed our Series B funding round, raising $50M to accelerate our growth and expand our technological capabilities.",
      image: "💰"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Newsroom</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            Latest news, press releases, and announcements from Global Embrace.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{articles[0].image}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary mb-2">{articles[0].category}</p>
                <h2 className="text-3xl font-bold mb-4">{articles[0].title}</h2>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {articles[0].date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {articles[0].author}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">{articles[0].excerpt}</p>
          </Card>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Recent Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(1).map((article, idx) => (
              <Card key={idx} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-4xl mb-4">{article.image}</div>
                <p className="text-sm font-semibold text-primary mb-2">{article.category}</p>
                <h3 className="text-lg font-bold mb-3 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Press Kit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Press Kit</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Logos & Brand Assets</h3>
              <p className="text-muted-foreground mb-4">Download our official logos, brand guidelines, and assets for press use.</p>
              <button className="text-primary font-semibold hover:underline">Download →</button>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Executive Bios</h3>
              <p className="text-muted-foreground mb-4">Learn more about our leadership team and founding story.</p>
              <button className="text-primary font-semibold hover:underline">View →</button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Press Inquiries?</h2>
          <p className="text-muted-foreground mb-8">
            Contact our press team for interviews, statements, or additional information.
          </p>
          <a href="mailto:press@globalembrace.com" className="text-primary font-semibold hover:underline">
            press@globalembrace.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default Newsroom;
