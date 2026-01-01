import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mb-8">
                Last updated: January 1, 2025
              </p>

              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Global Embrace Logistics ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    2. Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Account Information:</strong> Name, email address, phone number, company name, and password when you create an account</li>
                    <li><strong>Shipping Information:</strong> Origin and destination addresses, package details, and recipient information</li>
                    <li><strong>Payment Information:</strong> Billing address and payment method details (processed securely by our payment providers)</li>
                    <li><strong>Communication Data:</strong> Messages you send us through our contact form or chat support</li>
                    <li><strong>Usage Data:</strong> Information about how you interact with our website and services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Process and fulfill your shipping orders</li>
                    <li>Send you shipping updates and tracking information</li>
                    <li>Communicate with you about your account and our services</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Improve our website and services</li>
                    <li>Send promotional communications (with your consent)</li>
                    <li>Comply with legal obligations and protect our rights</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    4. Information Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We may share your information with:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Shipping Partners:</strong> Carriers and logistics providers who help deliver your packages</li>
                    <li><strong>Service Providers:</strong> Third parties who perform services on our behalf (payment processing, email delivery, analytics)</li>
                    <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    We do not sell your personal information to third parties for marketing purposes.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    5. Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    6. Data Retention
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Shipping records may be retained for up to 7 years for legal and regulatory compliance.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    7. Your Rights
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    To exercise these rights, please contact us using the information below.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    8. Cookies and Tracking
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience on our website. Cookies help us remember your preferences, understand how you use our site, and improve our services. You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    9. International Transfers
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    10. Children's Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    11. Changes to This Policy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. We encourage you to review this policy periodically.
                  </p>
                </section>

                <section>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
                    12. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="mt-3 text-muted-foreground">
                    <p>Email: privacy@globalembrace.com</p>
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

export default PrivacyPolicy;
