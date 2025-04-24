
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AdminSettings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem(`userSettings_${user?.id}`);
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setName(settings.name || user?.name || "");
      setEmail(settings.email || user?.email || "");
      setEnableEmailNotifications(settings.enableEmailNotifications);
    }
  }, [user]);

  const handleSave = () => {
    const settings = {
      name,
      email,
      enableEmailNotifications,
    };
    localStorage.setItem(`userSettings_${user?.id}`, JSON.stringify(settings));
    
    const updatedUser = {
      ...user,
      name,
      email,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    setSaved(true);
    toast.success("Settings saved successfully");
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-lg mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-7">
        <Settings className="text-primary w-8 h-8" />
        <h1 className="text-3xl font-bold">Settings (Admin)</h1>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Admin Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={enableEmailNotifications}
                onCheckedChange={setEnableEmailNotifications}
                id="email-notifications"
              />
              <label
                htmlFor="email-notifications"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Enable admin email notifications
              </label>
            </div>
            <Button className="w-full mt-3" onClick={handleSave}>
              Save Changes
            </Button>
            {saved && (
              <div className="text-green-600 text-sm text-center mt-2 animate-fadeIn">
                Changes saved!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
