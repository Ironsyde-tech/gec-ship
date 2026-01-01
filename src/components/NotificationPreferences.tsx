import { useState, useEffect } from "react";
import { Bell, Mail, Package, Tag, Clock, Loader2, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NotificationPreferencesProps {
  userId: string;
}

interface Preferences {
  notify_shipment_updates: boolean;
  notify_quote_reminders: boolean;
  notify_promotions: boolean;
  notify_newsletters: boolean;
}

const notificationOptions = [
  {
    key: "notify_shipment_updates" as keyof Preferences,
    label: "Shipment Updates",
    description: "Get notified when your shipment status changes, including pickup, transit, and delivery",
    icon: Package,
    recommended: true,
  },
  {
    key: "notify_quote_reminders" as keyof Preferences,
    label: "Quote Reminders",
    description: "Receive reminders about saved quotes that are about to expire",
    icon: Clock,
    recommended: true,
  },
  {
    key: "notify_promotions" as keyof Preferences,
    label: "Promotions & Offers",
    description: "Be the first to know about exclusive discounts and special offers",
    icon: Tag,
    recommended: false,
  },
  {
    key: "notify_newsletters" as keyof Preferences,
    label: "Newsletter",
    description: "Monthly updates about Global Embrace, industry news, and shipping tips",
    icon: Mail,
    recommended: false,
  },
];

const NotificationPreferences = ({ userId }: NotificationPreferencesProps) => {
  const [preferences, setPreferences] = useState<Preferences>({
    notify_shipment_updates: true,
    notify_quote_reminders: true,
    notify_promotions: false,
    notify_newsletters: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialPrefs, setInitialPrefs] = useState<Preferences | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  useEffect(() => {
    if (initialPrefs) {
      const changed = Object.keys(preferences).some(
        (key) => preferences[key as keyof Preferences] !== initialPrefs[key as keyof Preferences]
      );
      setHasChanges(changed);
    }
  }, [preferences, initialPrefs]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("notify_shipment_updates, notify_quote_reminders, notify_promotions, notify_newsletters")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (data) {
        const prefs = {
          notify_shipment_updates: data.notify_shipment_updates ?? true,
          notify_quote_reminders: data.notify_quote_reminders ?? true,
          notify_promotions: data.notify_promotions ?? false,
          notify_newsletters: data.notify_newsletters ?? false,
        };
        setPreferences(prefs);
        setInitialPrefs(prefs);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          notify_shipment_updates: preferences.notify_shipment_updates,
          notify_quote_reminders: preferences.notify_quote_reminders,
          notify_promotions: preferences.notify_promotions,
          notify_newsletters: preferences.notify_newsletters,
        })
        .eq("user_id", userId);

      if (error) throw error;

      setInitialPrefs(preferences);
      setHasChanges(false);
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEnableAll = () => {
    setPreferences({
      notify_shipment_updates: true,
      notify_quote_reminders: true,
      notify_promotions: true,
      notify_newsletters: true,
    });
  };

  const handleDisableNonEssential = () => {
    setPreferences({
      notify_shipment_updates: true,
      notify_quote_reminders: true,
      notify_promotions: false,
      notify_newsletters: false,
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent" />
          </div>
          <div>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Manage how we communicate with you</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleEnableAll}>
            Enable All
          </Button>
          <Button variant="outline" size="sm" onClick={handleDisableNonEssential}>
            Essential Only
          </Button>
        </div>

        <Separator />

        {/* Notification Options */}
        <div className="space-y-4">
          {notificationOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.key}
                className="flex items-start justify-between gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor={option.key}
                        className="font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                      {option.recommended && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={option.key}
                  checked={preferences[option.key]}
                  onCheckedChange={() => handleToggle(option.key)}
                />
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {hasChanges ? "You have unsaved changes" : "All changes saved"}
          </p>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
