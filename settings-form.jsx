import { useState } from "react";
import { User, Bell, Mail, MessageSquare, Smartphone, Check } from "lucide-react";

const initialProfile = {
  name: "Alex Rivera",
  email: "alex@example.com",
  title: "Product Designer",
  timezone: "America/Sao_Paulo",
};

const initialNotifications = {
  emailUpdates: true,
  emailBilling: true,
  emailMarketing: false,
  pushMessages: true,
  pushMentions: true,
  smsAlerts: false,
  frequency: "instant",
};

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && (
          <p className="text-sm text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600 ${
          checked ? "bg-teal-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function Field({ label, children, hint }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-xs text-slate-400 mt-1">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-shadow";

export default function SettingsForm() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState(initialProfile);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [saved, setSaved] = useState(false);
  const [savedTab, setSavedTab] = useState(null);

  const updateProfile = (key, value) =>
    setProfile((p) => ({ ...p, [key]: value }));
  const updateNotif = (key, value) =>
    setNotifications((n) => ({ ...n, [key]: value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setSavedTab(tab);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-full w-full bg-slate-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your profile and how you hear from us.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 px-2">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                  tab === id
                    ? "text-teal-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={16} />
                {label}
                {tab === id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSave} className="p-6">
            {tab === "profile" && (
              <div className="space-y-5">
                <div className="flex items-center gap-4 pb-2">
                  <div className="h-14 w-14 rounded-full bg-teal-600 text-white flex items-center justify-center text-lg font-semibold shrink-0">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <button
                      type="button"
                      className="text-sm font-medium text-teal-700 hover:text-teal-800"
                    >
                      Change photo
                    </button>
                    <p className="text-xs text-slate-400 mt-0.5">
                      JPG or PNG, up to 5MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full name">
                    <input
                      type="text"
                      className={inputClass}
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Title">
                    <input
                      type="text"
                      className={inputClass}
                      value={profile.title}
                      onChange={(e) => updateProfile("title", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Email address" hint="Used for sign-in and account notices.">
                  <input
                    type="email"
                    className={inputClass}
                    value={profile.email}
                    onChange={(e) => updateProfile("email", e.target.value)}
                  />
                </Field>

                <Field label="Timezone">
                  <select
                    className={inputClass}
                    value={profile.timezone}
                    onChange={(e) => updateProfile("timezone", e.target.value)}
                  >
                    <option value="America/Sao_Paulo">
                      Brasília Time (São Paulo)
                    </option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </Field>
              </div>
            )}

            {tab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-slate-800 mb-1">
                    <Mail size={16} />
                    <h2 className="text-sm font-semibold">Email</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <Toggle
                      label="Product updates"
                      description="New features and improvements."
                      checked={notifications.emailUpdates}
                      onChange={(v) => updateNotif("emailUpdates", v)}
                    />
                    <Toggle
                      label="Billing notices"
                      description="Invoices, receipts, and payment issues."
                      checked={notifications.emailBilling}
                      onChange={(v) => updateNotif("emailBilling", v)}
                    />
                    <Toggle
                      label="Marketing"
                      description="Tips, offers, and occasional surveys."
                      checked={notifications.emailMarketing}
                      onChange={(v) => updateNotif("emailMarketing", v)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-800 mb-1">
                    <MessageSquare size={16} />
                    <h2 className="text-sm font-semibold">Push</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <Toggle
                      label="Direct messages"
                      checked={notifications.pushMessages}
                      onChange={(v) => updateNotif("pushMessages", v)}
                    />
                    <Toggle
                      label="Mentions"
                      checked={notifications.pushMentions}
                      onChange={(v) => updateNotif("pushMentions", v)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-slate-800 mb-1">
                    <Smartphone size={16} />
                    <h2 className="text-sm font-semibold">SMS</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    <Toggle
                      label="Critical alerts only"
                      description="Reserved for account security and outages."
                      checked={notifications.smsAlerts}
                      onChange={(v) => updateNotif("smsAlerts", v)}
                    />
                  </div>
                </div>

                <Field label="Delivery frequency">
                  <select
                    className={inputClass}
                    value={notifications.frequency}
                    onChange={(e) => updateNotif("frequency", e.target.value)}
                  >
                    <option value="instant">As it happens</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                  </select>
                </Field>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-slate-100">
              {saved && savedTab === tab && (
                <span className="flex items-center gap-1.5 text-sm text-teal-700 mr-auto">
                  <Check size={16} /> Saved
                </span>
              )}
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                onClick={() =>
                  tab === "profile"
                    ? setProfile(initialProfile)
                    : setNotifications(initialNotifications)
                }
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-600"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
