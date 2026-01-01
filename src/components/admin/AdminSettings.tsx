import { useState } from "react";
import { Settings, Bell, Mail, Globe, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newBookingAlerts, setNewBookingAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);

  // Company settings
  const [companyName, setCompanyName] = useState("Global Embrace Logistics");
  const [supportEmail, setSupportEmail] = useState("support@globalembrace.com");
  const [supportPhone, setSupportPhone] = useState("+1 (800) 555-SHIP");

  // Shipping settings
  const [defaultInsuranceRate, setDefaultInsuranceRate] = useState("2");
  const [fuelSurchargeRate, setFuelSurchargeRate] = useState("12");

  const handleSave = async () => {
    setSaving(true);
    // Simulate save - in real app, this would save to database
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive notifications about shipments and bookings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email notifications for important events
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>New Booking Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a new booking is placed
              </p>
            </div>
            <Switch
              checked={newBookingAlerts}
              onCheckedChange={setNewBookingAlerts}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Daily Digest</Label>
              <p className="text-sm text-muted-foreground">
                Receive a daily summary of all shipment activity
              </p>
            </div>
            <Switch checked={dailyDigest} onCheckedChange={setDailyDigest} />
          </div>
        </CardContent>
      </Card>

      {/* Company Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Company Information
          </CardTitle>
          <CardDescription>
            Update your company details that appear on invoices and emails.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Shipping Configuration
          </CardTitle>
          <CardDescription>
            Configure default rates and surcharges for shipping calculations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insuranceRate">Default Insurance Rate (%)</Label>
              <Input
                id="insuranceRate"
                type="number"
                min="0"
                max="100"
                value={defaultInsuranceRate}
                onChange={(e) => setDefaultInsuranceRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Percentage of declared value for shipping insurance
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelSurcharge">Fuel Surcharge Rate (%)</Label>
              <Input
                id="fuelSurcharge"
                type="number"
                min="0"
                max="100"
                value={fuelSurchargeRate}
                onChange={(e) => setFuelSurchargeRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Applied to base shipping rates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Customize email templates for automated notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 text-center">
            <p className="text-muted-foreground">
              Email template customization coming soon.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
