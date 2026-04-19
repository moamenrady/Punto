import { useState } from "react";

const C = {
  bg: "#F5F4FF",
  white: "#ffffff",
  border: "#E8E6FF",
  borderLight: "#F0EEFF",
  rowBorder: "#F5F4FF",
  primary: "#8A9FE8",
  primaryHov: "#7F77DD",
  accent: "#534AB7",
  accentBg: "#EEEEFF",
  accentBd: "#DDD9FF",
  text: "#1E1B3A",
  muted: "#9CA3AF",
  footerBg: "#FAFAFF",
};

function Toggle({ defaultOn = false }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        backgroundColor: on ? C.primary : "#D1D5DB",
        transition: "background-color .2s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: 16,
          height: 16,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          transform: on ? "translateX(24px)" : "translateX(4px)",
          transition: "transform .2s",
        }}
      />
    </button>
  );
}

function Badge({ type, children }) {
  const map = {
    green: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    red: { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
    purple: { bg: C.accentBg, color: C.accent, border: C.accentBd },
    amber: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  };
  const s = map[type] ?? map.purple;
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 12px",
        borderRadius: 20,
        backgroundColor: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {children}
    </span>
  );
}

const inp = {
  width: "100%",
  fontSize: 13,
  padding: "10px 14px",
  borderRadius: 10,
  border: `1px solid ${C.accentBd}`,
  backgroundColor: C.white,
  color: C.text,
  outline: "none",
  boxSizing: "border-box",
};

function Card({ children }) {
  return (
    <div
      style={{
        backgroundColor: C.white,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(127,111,245,.07)",
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, desc }) {
  return (
    <div
      style={{
        padding: "18px 28px",
        borderBottom: `1px solid ${C.borderLight}`,
      }}
    >
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>
        {title}
      </p>
      {desc && (
        <p style={{ margin: "4px 0 0", fontSize: 12, color: C.muted }}>
          {desc}
        </p>
      )}
    </div>
  );
}

function Row({ label, desc, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 28px",
        borderBottom: `1px solid ${C.rowBorder}`,
      }}
    >
      <div style={{ flex: 1, marginRight: 24 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: C.text }}>
          {label}
        </p>
        {desc && (
          <p style={{ margin: "3px 0 0", fontSize: 12, color: C.muted }}>
            {desc}
          </p>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function BtnPrimary({ children, style = {}, ...p }) {
  return (
    <button
      style={{
        padding: "9px 20px",
        borderRadius: 10,
        backgroundColor: C.primary,
        color: "#fff",
        fontSize: 13,
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        ...style,
      }}
      {...p}
    >
      {children}
    </button>
  );
}

function BtnSecondary({ children, style = {}, ...p }) {
  return (
    <button
      style={{
        padding: "9px 20px",
        borderRadius: 10,
        backgroundColor: C.white,
        color: C.accent,
        fontSize: 13,
        fontWeight: 500,
        border: `1px solid ${C.accentBd}`,
        cursor: "pointer",
        ...style,
      }}
      {...p}
    >
      {children}
    </button>
  );
}

function BtnDanger({ children, style = {}, ...p }) {
  return (
    <button
      style={{
        padding: "9px 20px",
        borderRadius: 10,
        backgroundColor: "#FEF2F2",
        color: "#EF4444",
        fontSize: 13,
        fontWeight: 600,
        border: "1px solid #FECACA",
        cursor: "pointer",
        ...style,
      }}
      {...p}
    >
      {children}
    </button>
  );
}

function CardFooter({ children }) {
  return (
    <div
      style={{
        padding: "14px 28px",
        backgroundColor: C.footerBg,
        borderTop: `1px solid ${C.borderLight}`,
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
      }}
    >
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <p
      style={{
        margin: "0 0 6px",
        fontSize: 11,
        fontWeight: 600,
        color: C.muted,
        textTransform: "uppercase",
        letterSpacing: ".05em",
      }}
    >
      {children}
    </p>
  );
}

function PageProfile() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <CardHeader
          title="Profile picture"
          desc="Update your photo displayed across the platform."
        />
        <div
          style={{
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "linear-gradient(135deg,#7F6FF5,#3ECFAA)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            AH
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <BtnPrimary style={{ width: 140 }}>Upload photo</BtnPrimary>
            <BtnSecondary style={{ width: 140 }}>Remove photo</BtnSecondary>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Personal information"
          desc="Update your name, contact details and role."
        />
        <div
          style={{
            padding: "20px 28px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          {[
            { label: "First name", val: "Ahmed", type: "text" },
            { label: "Last name", val: "Hassan", type: "text" },
            { label: "Email", val: "a.hassan@company.com", type: "email" },
            { label: "Phone", val: "+20 100 000 0000", type: "tel" },
            { label: "Job title", val: "Senior IT Engineer", type: "text" },
          ].map((f) => (
            <div key={f.label}>
              <Label>{f.label}</Label>
              <input style={inp} type={f.type} defaultValue={f.val} />
            </div>
          ))}
          <div>
            <Label>Department</Label>
            <select style={{ ...inp }}>
              <option>Infrastructure</option>
              <option>Operations</option>
              <option>Security</option>
              <option>Support</option>
            </select>
          </div>
        </div>
        <CardFooter>
          <BtnSecondary>Cancel</BtnSecondary>
          <BtnPrimary>Save changes</BtnPrimary>
        </CardFooter>
      </Card>
    </div>
  );
}

function PageAccount() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <CardHeader
          title="Change password"
          desc="Use a strong password you don't use elsewhere."
        />
        <div
          style={{
            padding: "20px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {[
            { label: "Current password", ph: "Enter current password" },
            { label: "New password", ph: "Min. 8 characters" },
            { label: "Confirm new password", ph: "Re-enter new password" },
          ].map((f) => (
            <div key={f.label}>
              <Label>{f.label}</Label>
              <input style={inp} type="password" placeholder={f.ph} />
            </div>
          ))}
        </div>
        <CardFooter>
          <BtnPrimary>Update password</BtnPrimary>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader
          title="Two-factor authentication"
          desc="Add an extra layer of security to your account."
        />
        <Row label="Authenticator app" desc="Use Google Authenticator or Authy">
          <Badge type="green">Enabled</Badge>
          <BtnSecondary style={{ padding: "6px 14px", fontSize: 12 }}>
            Manage
          </BtnSecondary>
        </Row>
        <Row label="SMS backup code" desc="Receive a one-time code via SMS">
          <Badge type="red">Disabled</Badge>
          <BtnSecondary style={{ padding: "6px 14px", fontSize: 12 }}>
            Enable
          </BtnSecondary>
        </Row>
      </Card>
    </div>
  );
}

function PageNotifications() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <CardHeader
          title="Ticket alerts"
          desc="Get notified about your support tickets."
        />
        <Row
          label="New ticket assigned"
          desc="When a ticket is assigned to you"
        >
          <Toggle defaultOn={true} />
        </Row>
        <Row label="Ticket status update" desc="When a ticket's status changes">
          <Toggle defaultOn={true} />
        </Row>
        <Row label="SLA breach warning" desc="Alert 1 hour before SLA deadline">
          <Toggle defaultOn={true} />
        </Row>
        <Row
          label="New comment on ticket"
          desc="When someone replies to your ticket"
        >
          <Toggle defaultOn={false} />
        </Row>
      </Card>
      <Card>
        <CardHeader
          title="System alerts"
          desc="Critical and operational system notifications."
        />
        <Row
          label="Server downtime alert"
          desc="Immediate alert on infrastructure failure"
        >
          <Toggle defaultOn={true} />
        </Row>
        <Row
          label="Security incidents"
          desc="Unauthorized access or policy violations"
        >
          <Toggle defaultOn={true} />
        </Row>
        <Row label="Weekly summary email" desc="Sent every Sunday at 8:00 AM">
          <Toggle defaultOn={false} />
        </Row>
      </Card>
    </div>
  );
}

function PagePermissions() {
  const perms = [
    {
      label: "Server management",
      desc: "Full read/write access to servers",
      type: "green",
      status: "Granted",
    },
    {
      label: "User management",
      desc: "Create, edit and deactivate user accounts",
      type: "green",
      status: "Granted",
    },
    {
      label: "Network configuration",
      desc: "Manage firewall, VLANs and routing",
      type: "green",
      status: "Granted",
    },
    {
      label: "Billing & invoices",
      desc: "View and export financial records",
      type: "red",
      status: "Denied",
    },
    {
      label: "Security audit logs",
      desc: "Read-only access to audit trails",
      type: "purple",
      status: "Read only",
    },
  ];
  return (
    <Card>
      <CardHeader
        title="Access control"
        desc="Your current system permissions — contact admin to request changes."
      />
      {perms.map((p) => (
        <Row key={p.label} label={p.label} desc={p.desc}>
          <Badge type={p.type}>{p.status}</Badge>
        </Row>
      ))}
    </Card>
  );
}

function PageAppearance() {
  const sel = { ...inp, width: "auto" };
  return (
    <Card>
      <CardHeader
        title="Display preferences"
        desc="Customize how the platform looks for you."
      />
      <Row label="Color theme" desc="Choose your preferred color mode">
        <select style={{ ...sel, width: 160 }}>
          <option>System default</option>
          <option>Light</option>
          <option>Dark</option>
        </select>
      </Row>

      <CardFooter>
        <BtnSecondary>Discard</BtnSecondary>
        <BtnPrimary>Save changes</BtnPrimary>
      </CardFooter>
    </Card>
  );
}

function PageDanger() {
  const actions = [
    {
      label: "Deactivate account",
      desc: "Temporarily disable your account. You can reactivate anytime.",
      btn: "Deactivate",
      safe: false,
    },
    {
      label: "Export my data",
      desc: "Download a full archive of all your account data.",
      btn: "Export data",
      safe: true,
    },
    {
      label: "Delete account",
      desc: "Permanently delete your account. This action cannot be undone.",
      btn: "Delete account",
      safe: false,
    },
  ];
  return (
    <Card>
      <CardHeader
        title="Deactivate Or Delete"
        desc="These actions are permanent and cannot be reversed."
      />
      {actions.map((a, i) => (
        <div
          key={a.label}
          style={{
            borderBottom:
              i < actions.length - 1 ? `1px solid ${C.rowBorder}` : "none",
          }}
        >
          <Row label={a.label} desc={a.desc}>
            {a.safe ? (
              <BtnSecondary style={{ padding: "6px 14px", fontSize: 12 }}>
                {a.btn}
              </BtnSecondary>
            ) : (
              <BtnDanger style={{ padding: "6px 14px", fontSize: 12 }}>
                {a.btn}
              </BtnDanger>
            )}
          </Row>
        </div>
      ))}
    </Card>
  );
}

const TABS = [
  { id: "profile", label: "Profile" },
  { id: "account", label: "Account & security" },
  { id: "notifications", label: "Notifications" },
  { id: "permissions", label: "Permissions" },
  { id: "appearance", label: "Appearance" },
  { id: "danger", label: "Account Actions" },
];

export default function Settings() {
  const [active, setActive] = useState("profile");

  const PAGES = {
    profile: <PageProfile />,
    account: <PageAccount />,
    notifications: <PageNotifications />,
    permissions: <PagePermissions />,
    appearance: <PageAppearance />,
    danger: <PageDanger />,
  };

  return (
    <div style={{ minHeight: "100%", padding: 32, backgroundColor: C.bg }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.text }}
          >
            Settings
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: C.muted }}>
            Manage your account and preferences.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            backgroundColor: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 8,
            marginBottom: 24,
            gap: 4,
            boxShadow: "0 1px 4px rgba(127,111,245,.06)",
          }}
        >
          {TABS.map((t) => {
            const isDanger = t.id === "danger";
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                style={{
                  flex: 1,
                  padding: "10px 4px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  transition: "all .15s",
                  backgroundColor: isActive
                    ? isDanger
                      ? "#FEF2F2"
                      : C.primary
                    : "transparent",
                  color: isActive
                    ? isDanger
                      ? "#EF4444"
                      : "#fff"
                    : isDanger
                      ? "#F87171"
                      : C.muted,
                  boxShadow:
                    isActive && !isDanger
                      ? "0 4px 12px rgba(138,159,232,.3)"
                      : "none",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {PAGES[active]}
      </div>
    </div>
  );
}