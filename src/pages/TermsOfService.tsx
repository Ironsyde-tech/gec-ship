import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link to="/">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
                Terms of Service
              </h1>
              <p className="text-muted-foreground mb-8">
                Last updated: January 1, 2025
              </p>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Global Embrace Logistics services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    2. Description of Services
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Global Embrace Logistics provides international and domestic shipping, freight forwarding, and logistics services. Our services include but are not limited to:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
                    <li>Express air freight shipping</li>
                    <li>Standard air freight shipping</li>
                    <li>Ground transportation services</li>
                    <li>Economy sea freight shipping</li>
                    <li>Package tracking and monitoring</li>
                    <li>Customs clearance assistance</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    3. User Responsibilities
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Users of our services agree to:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
                    <li>Provide accurate and complete information for all shipments</li>
                    <li>Comply with all applicable laws and regulations regarding shipping</li>
                    <li>Not ship prohibited or restricted items</li>
                    <li>Properly package all items to prevent damage during transit</li>
                    <li>Pay all applicable fees and charges in a timely manner</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    4. Prohibited Items
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    The following items are strictly prohibited from shipping through our services:
                  </p>
                  <ul className="list-disc pl-6 mt-3 space-y-2 text-muted-foreground">
                    <li>Hazardous materials and dangerous goods (unless properly declared)</li>
                    <li>Illegal substances and contraband</li>
                    <li>Weapons and explosives</li>
                    <li>Perishable goods without proper packaging</li>
                    <li>Items prohibited by international shipping regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    5. Pricing and Payment
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All prices quoted are estimates based on the information provided. Final charges may vary based on actual weight, dimensions, and destination. Payment is due upon booking unless otherwise agreed. We accept major credit cards and bank transfers.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    6. Liability and Insurance
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Global Embrace Logistics liability for loss or damage is limited to the declared value of the shipment or the maximum liability allowed by applicable international conventions, whichever is less. We strongly recommend purchasing additional insurance for valuable items.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    7. Delivery Times
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Delivery times are estimates only and are not guaranteed. Global Embrace Logistics is not liable for delays caused by customs, weather, carrier issues, or other circumstances beyond our control.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    8. Claims
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Claims for loss or damage must be submitted in writing within 30 days of delivery or expected delivery date. Claims must include supporting documentation such as photos of damage and proof of value.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    9. Modifications to Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Global Embrace Logistics reserves the right to modify these terms at any time. Changes will be effective immediately upon posting to our website. Continued use of our services constitutes acceptance of modified terms.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    10. Contact Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-3 text-muted-foreground">
                    <p>Email: legal@globalembrace.com</p>
                    <p>Phone: 1-800-SWIFT-SHIP</p>
                    <p>Address: 123 Logistics Way, Suite 500, New York, NY 10001</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Global Embrace Logistics. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
