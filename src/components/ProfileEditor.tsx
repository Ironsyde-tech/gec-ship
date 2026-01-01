import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { Building, Phone, MapPin, Globe, Loader2, Save, Lock, Eye, EyeOff, Camera, X, Bell, Mail, Megaphone, Newspaper, Trash2, AlertTriangle, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  company_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  notify_shipment_updates: boolean;
  notify_quote_reminders: boolean;
  notify_promotions: boolean;
  notify_newsletters: boolean;
}

interface ProfileEditorProps {
  userId: string;
  userEmail: string;
}

const ProfileEditor = ({ userId, userEmail }: ProfileEditorProps) => {
  const [profile, setProfile] = useState<Profile>({
    company_name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    avatar_url: null,
    notify_shipment_updates: true,
    notify_quote_reminders: true,
    notify_promotions: false,
    notify_newsletters: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("company_name, phone, address, city, country, avatar_url, notify_shipment_updates, notify_quote_reminders, notify_promotions, notify_newsletters")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile({
          company_name: data.company_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "",
          avatar_url: data.avatar_url || null,
          notify_shipment_updates: data.notify_shipment_updates ?? true,
          notify_quote_reminders: data.notify_quote_reminders ?? true,
          notify_promotions: data.notify_promotions ?? false,
          notify_newsletters: data.notify_newsletters ?? false,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been changed.",
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.webp`]);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: null });
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error: any) {
      console.error("Error removing avatar:", error);
      toast({
        title: "Error",
        description: "Failed to remove avatar.",
        variant: "destructive",
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          company_name: profile.company_name || null,
          phone: profile.phone || null,
          address: profile.address || null,
          city: profile.city || null,
          country: profile.country || null,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile information.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async (key: keyof Profile, value: boolean) => {
    const updatedProfile = { ...profile, [key]: value };
    setProfile(updatedProfile);
    setSavingNotifications(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ [key]: value })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      console.error("Error updating notification:", error);
      setProfile({ ...profile, [key]: !value });
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    } finally {
      setSavingNotifications(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      const { data, error } = await supabase.functions.invoke("delete-account");

      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });

      // Sign out and redirect to home
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingAccount(false);
      setDeleteConfirmText("");
    }
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          {/* Avatar Section */}
          <div className="relative group">
            <Avatar className="w-20 h-20 border-2 border-border">
              <AvatarImage src={profile.avatar_url || undefined} alt="Profile" />
              <AvatarFallback className="text-2xl font-semibold bg-accent text-accent-foreground">
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            
            <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="w-8 h-8 rounded-full bg-background/90 border border-border flex items-center justify-center hover:bg-background transition-colors"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 text-foreground" />
                )}
              </button>
              {profile.avatar_url && (
                <button
                  onClick={handleRemoveAvatar}
                  disabled={uploadingAvatar}
                  className="w-8 h-8 rounded-full bg-destructive/90 border border-destructive flex items-center justify-center hover:bg-destructive transition-colors"
                >
                  <X className="w-4 h-4 text-destructive-foreground" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Profile Information
            </h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Hover over avatar to change or remove
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company_name" className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              Company Name
            </Label>
            <Input
              id="company_name"
              value={profile.company_name || ""}
              onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
              placeholder="Your company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Address
            </Label>
            <Input
              id="address"
              value={profile.address || ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              placeholder="123 Main Street"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={profile.city || ""}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="New York"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Country
            </Label>
            <Input
              id="country"
              value={profile.country || ""}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              placeholder="United States"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving} variant="hero">
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Email Notifications
            </h2>
            <p className="text-sm text-muted-foreground">Manage your email preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Shipment Updates</p>
                <p className="text-sm text-muted-foreground">Get notified about your shipment status changes</p>
              </div>
            </div>
            <Switch
              checked={profile.notify_shipment_updates}
              onCheckedChange={(checked) => handleNotificationToggle("notify_shipment_updates", checked)}
              disabled={savingNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Quote Reminders</p>
                <p className="text-sm text-muted-foreground">Receive reminders about saved quotes expiring</p>
              </div>
            </div>
            <Switch
              checked={profile.notify_quote_reminders}
              onCheckedChange={(checked) => handleNotificationToggle("notify_quote_reminders", checked)}
              disabled={savingNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Promotions & Offers</p>
                <p className="text-sm text-muted-foreground">Receive special deals and promotional offers</p>
              </div>
            </div>
            <Switch
              checked={profile.notify_promotions}
              onCheckedChange={(checked) => handleNotificationToggle("notify_promotions", checked)}
              disabled={savingNotifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium text-foreground">Newsletter</p>
                <p className="text-sm text-muted-foreground">Stay updated with shipping industry news and tips</p>
              </div>
            </div>
            <Switch
              checked={profile.notify_newsletters}
              onCheckedChange={(checked) => handleNotificationToggle("notify_newsletters", checked)}
              disabled={savingNotifications}
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Sun className="w-5 h-5 text-muted-foreground dark:hidden" />
            <Moon className="w-5 h-5 text-muted-foreground hidden dark:block" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Appearance
            </h2>
            <p className="text-sm text-muted-foreground">Customize how the app looks</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              theme === "light" 
                ? "border-accent bg-accent/10" 
                : "border-border bg-muted/50 hover:border-muted-foreground"
            }`}
          >
            <Sun className={`w-6 h-6 ${theme === "light" ? "text-accent" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${theme === "light" ? "text-foreground" : "text-muted-foreground"}`}>
              Light
            </span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              theme === "dark" 
                ? "border-accent bg-accent/10" 
                : "border-border bg-muted/50 hover:border-muted-foreground"
            }`}
          >
            <Moon className={`w-6 h-6 ${theme === "dark" ? "text-accent" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${theme === "dark" ? "text-foreground" : "text-muted-foreground"}`}>
              Dark
            </span>
          </button>

          <button
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              theme === "system" 
                ? "border-accent bg-accent/10" 
                : "border-border bg-muted/50 hover:border-muted-foreground"
            }`}
          >
            <Monitor className={`w-6 h-6 ${theme === "system" ? "text-accent" : "text-muted-foreground"}`} />
            <span className={`text-sm font-medium ${theme === "system" ? "text-foreground" : "text-muted-foreground"}`}>
              System
            </span>
          </button>
        </div>
      </div>

      {/* Password Change */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Change Password
            </h2>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handlePasswordChange} 
            disabled={changingPassword || !newPassword || !confirmPassword}
            variant="outline"
          >
            {changingPassword ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {changingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>

      {/* Delete Account */}
      <div className="bg-card rounded-2xl border border-destructive/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Delete Account
            </h2>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive mb-1">Warning: This action cannot be undone</p>
              <p className="text-muted-foreground">
                Deleting your account will permanently remove all your data including saved quotes, 
                shipments, and profile information. This action is irreversible.
              </p>
            </div>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3">
                <p>
                  This will permanently delete your account and remove all your data from our servers.
                  This action cannot be undone.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="delete-confirm" className="text-foreground">
                    Type <span className="font-mono font-bold">DELETE</span> to confirm:
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="font-mono"
                  />
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || deletingAccount}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deletingAccount ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProfileEditor;
