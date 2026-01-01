const CookiePolicy = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-primary-foreground/80">Last updated: January 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us remember information about your visit, such as your preferred language and other settings. Cookies can be either "persistent" cookies or "session" cookies.
            </p>

            <h2>2. How We Use Cookies</h2>
            <p>
              Global Embrace uses cookies for several purposes:
            </p>
            <ul>
              <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable you to navigate our site and use its features, such as accessing secure areas.</li>
              <li><strong>Performance Cookies:</strong> These cookies collect information about how visitors use our website, such as which pages are visited most often. This helps us improve our site's performance.</li>
              <li><strong>Functionality Cookies:</strong> These cookies allow us to remember your preferences and provide personalized features, such as remembering your login information.</li>
              <li><strong>Marketing Cookies:</strong> These cookies are used to track your browsing habits to deliver targeted advertisements based on your interests.</li>
              <li><strong>Analytics Cookies:</strong> These cookies help us understand how visitors interact with our website using analytics tools.</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Cookie Type</th>
                  <th className="text-left p-2">Purpose</th>
                  <th className="text-left p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Session ID</td>
                  <td className="p-2">Maintain user session</td>
                  <td className="p-2">Session</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">User Preferences</td>
                  <td className="p-2">Remember display settings</td>
                  <td className="p-2">1 Year</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Authentication</td>
                  <td className="p-2">Keep you logged in</td>
                  <td className="p-2">30 Days</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Analytics</td>
                  <td className="p-2">Track website usage</td>
                  <td className="p-2">2 Years</td>
                </tr>
                <tr>
                  <td className="p-2">Marketing</td>
                  <td className="p-2">Deliver targeted ads</td>
                  <td className="p-2">90 Days</td>
                </tr>
              </tbody>
            </table>

            <h2>4. Third-Party Cookies</h2>
            <p>
              We work with third-party service providers who may place cookies on your device. These include:
            </p>
            <ul>
              <li>Google Analytics for website analytics</li>
              <li>Stripe for payment processing</li>
              <li>Social media platforms for integration</li>
              <li>Marketing partners for targeted advertising</li>
            </ul>
            <p>
              These third parties have their own cookie policies and privacy practices. We encourage you to review their policies.
            </p>

            <h2>5. Your Cookie Choices</h2>
            <p>
              You have the right to choose whether or not to accept cookies. Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul>
              <li>Delete cookies from your device</li>
              <li>Disable cookies in your browser</li>
              <li>Opt-out of specific cookie categories</li>
              <li>Use browser extensions to block cookies</li>
            </ul>
            <p>
              Please note that disabling certain cookies may impact the functionality of our website and your user experience.
            </p>

            <h2>6. Consent Management</h2>
            <p>
              When you first visit our website, you'll see a cookie consent banner. You can:
            </p>
            <ul>
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences</li>
            </ul>
            <p>
              Your choices are saved in a cookie and respected across future visits.
            </p>

            <h2>7. Tracking Technologies</h2>
            <p>
              Beyond cookies, we may use other tracking technologies such as:
            </p>
            <ul>
              <li>Web beacons and pixels</li>
              <li>Local storage and session storage</li>
              <li>Mobile app analytics</li>
              <li>IP address logging</li>
            </ul>

            <h2>8. Data Retention</h2>
            <p>
              We retain cookie data in accordance with our Privacy Policy. Essential cookies are maintained for as long as necessary to provide our services. Marketing and analytics cookies are typically retained for 1-2 years.
            </p>

            <h2>9. GDPR and Privacy Rights</h2>
            <p>
              If you are in the European Union, you have additional rights under GDPR:
            </p>
            <ul>
              <li>Right to access cookie data</li>
              <li>Right to erasure</li>
              <li>Right to restrict processing</li>
              <li>Right to object to certain cookies</li>
            </ul>
            <p>
              You can exercise these rights by contacting us at privacy@globalembrace.com.
            </p>

            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Changes will be effective immediately upon posting. We encourage you to review this policy periodically for updates.
            </p>

            <h2>11. Contact Us</h2>
            <p>
              If you have questions about our use of cookies or this policy, please contact us:
            </p>
            <ul>
              <li>Email: privacy@globalembrace.com</li>
              <li>Address: Global Embrace Logistics, 123 Commerce Street, New York, NY 10001</li>
              <li>Phone: +1-800-EMBRACE-1</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm">
                <strong>Quick Settings:</strong> You can manage your cookie preferences at any time by visiting our <a href="#" className="text-primary hover:underline">Preference Center</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
