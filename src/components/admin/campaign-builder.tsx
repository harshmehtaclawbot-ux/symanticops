"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Send, Save, Eye } from "lucide-react";

type Org = { id: string; name: string };
type List = { id: string; name: string };

const defaultHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{subject}}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'DM Sans','Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#0071e3;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">{{company_name}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#1d1d1f;font-size:20px;font-weight:600;">Hello {{first_name}},</h2>
              <p style="margin:0 0 24px;color:#424245;line-height:1.7;font-size:15px;">
                Write your message here. You can use merge tags like {{first_name}}, {{last_name}}, and {{email}}.
              </p>
              <a href="{{cta_link}}" style="display:inline-block;background:#0071e3;color:#ffffff;padding:12px 28px;border-radius:980px;text-decoration:none;font-weight:600;font-size:14px;">
                {{cta_text}}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f5f7;padding:24px 40px;border-top:1px solid #d2d2d7;">
              <p style="margin:0;color:#86868b;font-size:12px;text-align:center;">
                You received this email because you are subscribed to our list.<br>
                <a href="{{unsubscribe_url}}" style="color:#86868b;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export function CampaignBuilder({ organizations }: { organizations: Org[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<List[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"html" | "text">("html");

  const [form, setForm] = useState({
    name: "",
    subject: "",
    previewText: "",
    fromName: "",
    fromEmail: "",
    replyTo: "",
    organizationId: "",
    listId: "",
    htmlContent: defaultHtml,
    textContent: "",
  });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const inputClass = "w-full h-11 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all";

  useEffect(() => {
    if (!form.organizationId) { setLists([]); return; }
    fetch(`/api/admin/customers/${form.organizationId}/lists`)
      .then((r) => r.json())
      .then((data) => setLists(data.lists ?? []))
      .catch(() => setLists([]));
  }, [form.organizationId]);

  async function save(send?: boolean) {
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, send }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save campaign");
      } else {
        toast.success(send ? "Campaign is being sent!" : "Campaign saved as draft");
        router.push("/admin/campaigns");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
            <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Campaign Settings</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1d1d1f]">Campaign Name *</label>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)}
                    placeholder="Summer Sale 2025" className={inputClass} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1d1d1f]">Organization *</label>
                  <select value={form.organizationId} onChange={(e) => update("organizationId", e.target.value)} className={inputClass}>
                    <option value="">Select organization</option>
                    {organizations.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Subject Line *</label>
                <input value={form.subject} onChange={(e) => update("subject", e.target.value)}
                  placeholder="Your exclusive offer is waiting..." className={inputClass} required />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Preview Text</label>
                <input value={form.previewText} onChange={(e) => update("previewText", e.target.value)}
                  placeholder="Short text shown in inbox previews..." className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1d1d1f]">From Name *</label>
                  <input value={form.fromName} onChange={(e) => update("fromName", e.target.value)}
                    placeholder="Acme Marketing" className={inputClass} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1d1d1f]">From Email *</label>
                  <input type="email" value={form.fromEmail} onChange={(e) => update("fromEmail", e.target.value)}
                    placeholder="hello@acme.com" className={inputClass} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1d1d1f]">Reply-To</label>
                  <input type="email" value={form.replyTo} onChange={(e) => update("replyTo", e.target.value)}
                    placeholder="support@acme.com" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[#1d1d1f]">Contact List</label>
                  <select value={form.listId} onChange={(e) => update("listId", e.target.value)} disabled={!form.organizationId} className={inputClass}>
                    <option value="">{form.organizationId ? "Select list" : "Select org first"}</option>
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
            <div className="px-6 py-4 border-b border-[#d2d2d7]/40 flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Email Content</h3>
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="inline-flex items-center gap-1.5 text-sm text-[#0071e3] font-medium hover:underline"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? "Edit" : "Preview"}
              </button>
            </div>
            <div className="p-6">
              {previewMode ? (
                <div className="border border-[#d2d2d7] rounded-xl overflow-hidden h-96">
                  <iframe
                    srcDoc={form.htmlContent}
                    className="w-full h-full"
                    title="Email preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex gap-1 mb-4 bg-[#f5f5f7] rounded-lg p-1 w-fit">
                    <button
                      onClick={() => setActiveTab("html")}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "html" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b]"}`}
                    >
                      HTML
                    </button>
                    <button
                      onClick={() => setActiveTab("text")}
                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === "text" ? "bg-white text-[#1d1d1f] shadow-sm" : "text-[#86868b]"}`}
                    >
                      Plain Text
                    </button>
                  </div>
                  {activeTab === "html" ? (
                    <>
                      <textarea
                        value={form.htmlContent}
                        onChange={(e) => update("htmlContent", e.target.value)}
                        className="w-full min-h-96 px-4 py-3 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
                        placeholder="HTML email content..."
                      />
                      <p className="text-[#86868b] text-xs mt-2">
                        Merge tags: {"{{first_name}}"}, {"{{last_name}}"}, {"{{email}}"}, {"{{unsubscribe_url}}"}
                      </p>
                    </>
                  ) : (
                    <textarea
                      value={form.textContent}
                      onChange={(e) => update("textContent", e.target.value)}
                      className="w-full min-h-64 px-4 py-3 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
                      placeholder="Plain text fallback version of your email..."
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm sticky top-8">
            <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={() => save(true)}
                className="w-full h-11 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm inline-flex items-center justify-center gap-2"
                disabled={loading || !form.name || !form.subject || !form.organizationId || !form.fromName || !form.fromEmail}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Now
              </button>
              <button
                onClick={() => save(false)}
                className="w-full h-11 rounded-xl border border-[#d2d2d7] text-[#424245] text-sm font-medium hover:bg-[#f5f5f7] transition-all inline-flex items-center justify-center gap-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
            <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
              <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Merge Tags</h3>
            </div>
            <div className="p-6">
              <div className="space-y-2.5 text-xs">
                {[
                  ["{{first_name}}", "Contact first name"],
                  ["{{last_name}}", "Contact last name"],
                  ["{{email}}", "Contact email"],
                  ["{{company}}", "Contact company"],
                  ["{{unsubscribe_url}}", "Unsubscribe link"],
                ].map(([tag, desc]) => (
                  <div key={tag} className="flex items-center justify-between">
                    <code className="text-[#0071e3] font-mono bg-[#0071e3]/5 px-2 py-0.5 rounded">{tag}</code>
                    <span className="text-[#86868b]">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
