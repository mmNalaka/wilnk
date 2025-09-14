/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, Trash2, Save } from "lucide-react";

interface UserSettings {
  name: string;
  email: string;
  bio: string;
  avatar: string;
  plan: "free" | "pro" | "enterprise";
  emailNotifications: boolean;
  analyticsEmails: boolean;
  marketingEmails: boolean;
  twoFactorEnabled: boolean;
  defaultTheme: string;
  customDomain: string;
}

// Mock settings service
const mockSettingsService = {
  async getSettings(): Promise<UserSettings> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      name: "John Doe",
      email: "john@example.com",
      bio: "Digital creator and entrepreneur",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      plan: "pro",
      emailNotifications: true,
      analyticsEmails: true,
      marketingEmails: false,
      twoFactorEnabled: false,
      defaultTheme: "modern",
      customDomain: "johndoe.com",
    };
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Settings updated:", settings);
  },

  async deleteAccount(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Account deleted");
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await mockSettingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await mockSettingsService.updateSettings(settings);
      // Show success message
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;

    try {
      await mockSettingsService.deleteAccount();
      // Redirect to goodbye page
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Settings</h1>
          <p className="text-muted-foreground">Failed to load settings.</p>
          <Button onClick={loadSettings} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Manage your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={settings.avatar}
                onChange={(e) => updateSetting("avatar", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => updateSetting("name", e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting("email", e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => updateSetting("bio", e.target.value)}
              placeholder="Tell people about yourself..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="defaultTheme">Default Theme</Label>
            <Select
              value={settings.defaultTheme}
              onValueChange={(value) => updateSetting("defaultTheme", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="colorful">Colorful</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plan & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan & Billing
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">
                You are currently on the {settings.plan} plan
              </p>
            </div>
            <Badge variant={settings.plan === "free" ? "secondary" : "default"}>
              {settings.plan.toUpperCase()}
            </Badge>
          </div>

          {settings.plan !== "free" && (
            <div>
              <Label htmlFor="customDomain">Custom Domain</Label>
              <Input
                id="customDomain"
                value={settings.customDomain}
                onChange={(e) => updateSetting("customDomain", e.target.value)}
                placeholder="yourdomain.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Connect your own domain to your Link-in-Bio pages
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline">Manage Billing</Button>
            {settings.plan === "free" && <Button>Upgrade to Pro</Button>}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive notifications about your account activity
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                updateSetting("emailNotifications", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Analytics Reports</p>
              <p className="text-sm text-muted-foreground">
                Weekly analytics reports via email
              </p>
            </div>
            <Switch
              checked={settings.analyticsEmails}
              onCheckedChange={(checked) =>
                updateSetting("analyticsEmails", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">
                Product updates and tips
              </p>
            </div>
            <Switch
              checked={settings.marketingEmails}
              onCheckedChange={(checked) =>
                updateSetting("marketingEmails", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>Keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={settings.twoFactorEnabled}
              onCheckedChange={(checked) =>
                updateSetting("twoFactorEnabled", checked)
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Download Account Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
            <p className="text-sm text-red-700 mb-4">
              This will permanently delete your account and all associated data.
              This action cannot be undone.
            </p>

            <div className="space-y-2">
              <Label htmlFor="deleteConfirm" className="text-red-800">
                Type &quot;DELETE&quot; to confirm
              </Label>
              <Input
                id="deleteConfirm"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="max-w-xs"
              />
            </div>

            <Button
              variant="destructive"
              className="mt-4"
              disabled={deleteConfirm !== "DELETE"}
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
