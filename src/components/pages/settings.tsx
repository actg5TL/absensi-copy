import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Settings as SettingsIcon,
  Bell,
  Mail,
  MapPin,
  Moon,
  Clock,
  LogOut,
  Save,
  Loader2,
  Shield,
  Plus,
  X,
  Building,
  Server,
} from "lucide-react";
import ChangePasswordForm from "../auth/ChangePasswordForm";
import { useAuth } from "../../../supabase/auth";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import TopNavigation from "../dashboard/layout/TopNavigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserSettings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  location_tracking: boolean;
  dark_mode: boolean;
  language: string;
  timezone: string;
  auto_checkout: boolean;
}

interface AppSettings {
  departments: string[];
  email_recipients: {
    attendance: string[];
    leave_request: string[];
  };
  smtp_settings: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
}

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    notifications_enabled: true,
    email_notifications: true,
    location_tracking: true,
    dark_mode: false,
    language: "en",
    timezone: "UTC",
    auto_checkout: false,
  });
  const [appSettings, setAppSettings] = useState<AppSettings>({
    departments: [],
    email_recipients: {
      attendance: [],
      leave_request: [],
    },
    smtp_settings: {
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      username: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [newAttendanceEmail, setNewAttendanceEmail] = useState("");
  const [newLeaveEmail, setNewLeaveEmail] = useState("");

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetchAppSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching settings:", error);
        return;
      }

      if (data) {
        setSettings({
          notifications_enabled: data.notifications_enabled ?? true,
          email_notifications: data.email_notifications ?? true,
          location_tracking: data.location_tracking ?? true,
          dark_mode: data.dark_mode ?? false,
          language: data.language ?? "en",
          timezone: data.timezone ?? "UTC",
          auto_checkout: data.auto_checkout ?? false,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAppSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .in("setting_key", [
          "departments",
          "email_recipients",
          "smtp_settings",
        ]);

      if (error) {
        console.error("Error fetching app settings:", error);
        return;
      }

      if (data) {
        const settingsMap = data.reduce(
          (acc, setting) => {
            acc[setting.setting_key] = setting.setting_value;
            return acc;
          },
          {} as Record<string, any>,
        );

        setAppSettings({
          departments: settingsMap.departments || [],
          email_recipients: settingsMap.email_recipients || {
            attendance: [],
            leave_request: [],
          },
          smtp_settings: settingsMap.smtp_settings || {
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            username: "",
            password: "",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching app settings:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);

      // Save user settings
      const { error: userError } = await supabase.from("user_settings").upsert({
        user_id: user.id,
        ...settings,
        updated_at: new Date().toISOString(),
      });

      if (userError) throw userError;

      // Save app settings
      const appSettingsUpdates = [
        {
          setting_key: "departments",
          setting_value: appSettings.departments,
          updated_at: new Date().toISOString(),
        },
        {
          setting_key: "email_recipients",
          setting_value: appSettings.email_recipients,
          updated_at: new Date().toISOString(),
        },
        {
          setting_key: "smtp_settings",
          setting_value: appSettings.smtp_settings,
          updated_at: new Date().toISOString(),
        },
      ];

      for (const setting of appSettingsUpdates) {
        const { error: appError } = await supabase
          .from("app_settings")
          .upsert(setting, { onConflict: "setting_key" });

        if (appError) throw appError;
      }

      toast({
        title: t("settings.saved"),
        description: t("settings.savedDescription"),
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: t("settings.error"),
        description: t("settings.errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (
    key: keyof UserSettings,
    value: boolean | string,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const addDepartment = () => {
    if (
      newDepartment.trim() &&
      !appSettings.departments.includes(newDepartment.trim())
    ) {
      setAppSettings((prev) => ({
        ...prev,
        departments: [...prev.departments, newDepartment.trim()],
      }));
      setNewDepartment("");
    }
  };

  const removeDepartment = (index: number) => {
    setAppSettings((prev) => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index),
    }));
  };

  const addAttendanceEmail = () => {
    if (
      newAttendanceEmail.trim() &&
      appSettings.email_recipients.attendance.length < 5 &&
      !appSettings.email_recipients.attendance.includes(
        newAttendanceEmail.trim(),
      )
    ) {
      setAppSettings((prev) => ({
        ...prev,
        email_recipients: {
          ...prev.email_recipients,
          attendance: [
            ...prev.email_recipients.attendance,
            newAttendanceEmail.trim(),
          ],
        },
      }));
      setNewAttendanceEmail("");
    }
  };

  const removeAttendanceEmail = (index: number) => {
    setAppSettings((prev) => ({
      ...prev,
      email_recipients: {
        ...prev.email_recipients,
        attendance: prev.email_recipients.attendance.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const addLeaveEmail = () => {
    if (
      newLeaveEmail.trim() &&
      appSettings.email_recipients.leave_request.length < 5 &&
      !appSettings.email_recipients.leave_request.includes(newLeaveEmail.trim())
    ) {
      setAppSettings((prev) => ({
        ...prev,
        email_recipients: {
          ...prev.email_recipients,
          leave_request: [
            ...prev.email_recipients.leave_request,
            newLeaveEmail.trim(),
          ],
        },
      }));
      setNewLeaveEmail("");
    }
  };

  const removeLeaveEmail = (index: number) => {
    setAppSettings((prev) => ({
      ...prev,
      email_recipients: {
        ...prev.email_recipients,
        leave_request: prev.email_recipients.leave_request.filter(
          (_, i) => i !== index,
        ),
      },
    }));
  };

  const handleSmtpChange = (
    key: keyof AppSettings["smtp_settings"],
    value: string | number | boolean,
  ) => {
    setAppSettings((prev) => ({
      ...prev,
      smtp_settings: {
        ...prev.smtp_settings,
        [key]: value,
      },
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app, you'd want to handle this more carefully
      toast({
        title: t("settings.deleteAccount"),
        description: t("settings.deleteAccountDescription"),
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
        <p className="text-lg text-gray-600">{t("settings.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              {t("settings.notifications.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.notifications.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">
                  {t("settings.notifications.push.label")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("settings.notifications.push.description")}
                </p>
              </div>
              <Switch
                checked={settings.notifications_enabled}
                onCheckedChange={(checked) =>
                  handleSettingChange("notifications_enabled", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">
                  {t("settings.notifications.email.label")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("settings.notifications.email.description")}
                </p>
              </div>
              <Switch
                checked={settings.email_notifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("email_notifications", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="location-tracking">
                  {t("settings.location.title")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("settings.location.description")}
                </p>
              </div>
              <Switch
                checked={settings.location_tracking}
                onCheckedChange={(checked) =>
                  handleSettingChange("location_tracking", checked)
                }
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-checkout">
                  {t("settings.autoCheckout.label")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("settings.autoCheckout.description")}
                </p>
              </div>
              <Switch
                checked={settings.auto_checkout}
                onCheckedChange={(checked) =>
                  handleSettingChange("auto_checkout", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Change Password Form */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              {t("settings.changePassword.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.changePassword.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ChangePasswordForm />
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" />
              {t("settings.appearance.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.appearance.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">
                  {t("settings.appearance.darkMode.label")}
                </Label>
                <p className="text-sm text-gray-500">
                  {t("settings.appearance.darkMode.description")}
                </p>
              </div>
              <Switch
                checked={settings.dark_mode}
                onCheckedChange={(checked) =>
                  handleSettingChange("dark_mode", checked)
                }
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>{t("settings.appearance.timezone")}</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  handleSettingChange("timezone", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="Asia/Jakarta">
                    Asia/Jakarta (WIB)
                  </SelectItem>
                  <SelectItem value="Asia/Makassar">
                    Asia/Makassar (WITA)
                  </SelectItem>
                  <SelectItem value="Asia/Jayapura">
                    Asia/Jayapura (WIT)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Department Management */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              {t("settings.department.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.department.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-department">
                {t("settings.department.addNew")}
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter department name"
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addDepartment();
                    }
                  }}
                />
                <Button
                  onClick={addDepartment}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{t("settings.department.current")}</h4>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {appSettings.departments.map((dept, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {dept}
                    <button
                      onClick={() => removeDepartment(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Recipients */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              {t("settings.emailRecipients.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.emailRecipients.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Attendance Email Recipients */}
            <div className="space-y-2">
              <Label htmlFor="attendance-email">
                {t("settings.emailRecipients.attendance.label")}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newAttendanceEmail}
                  onChange={(e) => setNewAttendanceEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addAttendanceEmail();
                    }
                  }}
                />
                <Button
                  onClick={addAttendanceEmail}
                  size="sm"
                  disabled={appSettings.email_recipients.attendance.length >= 5}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {appSettings.email_recipients.attendance.map((email, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {email}
                    <button
                      onClick={() => removeAttendanceEmail(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {t("settings.emailRecipients.attendance.limit")}
              </p>
            </div>

            <Separator />

            {/* Leave Request Email Recipients */}
            <div className="space-y-2">
              <Label htmlFor="leave-email">
                {t("settings.emailRecipients.leave.label")}
              </Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={newLeaveEmail}
                  onChange={(e) => setNewLeaveEmail(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addLeaveEmail();
                    }
                  }}
                />
                <Button
                  onClick={addLeaveEmail}
                  size="sm"
                  disabled={
                    appSettings.email_recipients.leave_request.length >= 5
                  }
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {appSettings.email_recipients.leave_request.map(
                  (email, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {email}
                      <button
                        onClick={() => removeLeaveEmail(index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ),
                )}
              </div>
              <p className="text-xs text-gray-500">
                {t("settings.emailRecipients.leave.limit")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* SMTP Settings */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-indigo-600" />
              {t("settings.smtp.title")}
            </CardTitle>
            <CardDescription>
              {t("settings.smtp.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">
                  {t("settings.smtp.host")}
                </Label>
                <Input
                  placeholder="smtp.gmail.com"
                  value={appSettings.smtp_settings.host}
                  onChange={(e) => handleSmtpChange("host", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">
                  {t("settings.smtp.port")}
                </Label>
                <Input
                  type="number"
                  placeholder="587"
                  value={appSettings.smtp_settings.port}
                  onChange={(e) =>
                    handleSmtpChange("port", parseInt(e.target.value) || 587)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-user">
                {t("settings.smtp.username")}
              </Label>
              <Input
                type="email"
                placeholder="your-email@gmail.com"
                value={appSettings.smtp_settings.username}
                onChange={(e) => handleSmtpChange("username", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">
                {t("settings.smtp.password")}
              </Label>
              <Input
                type="password"
                placeholder="Your app password"
                value={appSettings.smtp_settings.password}
                onChange={(e) => handleSmtpChange("password", e.target.value)}
              />
              <p className="text-sm text-gray-500">
                {t("settings.smtp.passwordHint")}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={appSettings.smtp_settings.secure}
                onCheckedChange={(checked) =>
                  handleSmtpChange("secure", checked)
                }
              />
              <Label htmlFor="smtp-ssl">
                {t("settings.smtp.useSsl")}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card className="bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">{t("settings.save.title")}</h3>
              <p className="text-sm text-gray-500">
                {t("settings.save.description")}
              </p>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("settings.saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Removed Danger Zone - Simplified settings */}
    </div>
  );
}
