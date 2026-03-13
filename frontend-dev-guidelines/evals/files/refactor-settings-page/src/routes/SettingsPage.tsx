import { useEffect, useMemo, useState } from "react";

export function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [form, setForm] = useState({ name: "", email: "" });
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => response.json())
      .then((data) => {
        setProfile(data);
        setForm({ name: data.name, email: data.email });
      });
  }, []);

  const payload = useMemo(
    () => ({ ...form, auditLabel: `${tab}:${form.email}` }),
    [form, tab]
  );

  return (
    <section>
      <nav>
        <button onClick={() => setTab("profile")}>Profile</button>
        <button onClick={() => setTab("billing")}>Billing</button>
      </nav>
      <input
        value={form.name}
        onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
      />
      <input
        value={form.email}
        onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
      />
      <button
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await fetch("/api/profile", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          setSaving(false);
        }}
      >
        Save
      </button>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </section>
  );
}
