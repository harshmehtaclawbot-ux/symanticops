"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#1e40af;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">{{company_name}}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#111827;font-size:20px;">Hello {{first_name}},</h2>
              <p style="margin:0 0 20px;color:#374151;line-height:1.6;">
                Write your message here. You can use merge tags like {{first_name}}, {{last_name}}, and {{email}}.
              </p>
              <a href="{{cta_link}}" style="display:inline-block;background:#1e40af;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
                {{cta_text}}
              </a>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#6b7280;font-size:12px;text-align:center;">
                You received this email because you are subscribed to our list.<br>
                <a href="{{unsubscribe_url}}" style="color:#6b7280;">Unsubscribe</a>
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
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Campaign Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Campaign Name *</Label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)}
                    placeholder="Summer Sale 2025" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Organization *</Label>
                  <Select value={form.organizationId} onValueChange={(v) => v && update("organizationId", v)}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {organizations.map((o) => (
                        <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Subject Line *</Label>
                <Input value={form.subject} onChange={(e) => update("subject", e.target.value)}
                  placeholder="Your exclusive offer is waiting..." className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" required />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Preview Text</Label>
                <Input value={form.previewText} onChange={(e) => update("previewText", e.target.value)}
                  placeholder="Short text shown in inbox previews..." className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">From Name *</Label>
                  <Input value={form.fromName} onChange={(e) => update("fromName", e.target.value)}
                    placeholder="Acme Marketing" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" required />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">From Email *</Label>
                  <Input type="email" value={form.fromEmail} onChange={(e) => update("fromEmail", e.target.value)}
                    placeholder="hello@acme.com" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Reply-To</Label>
                  <Input type="email" value={form.replyTo} onChange={(e) => update("replyTo", e.target.value)}
                    placeholder="support@acme.com" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Contact List</Label>
                  <Select value={form.listId} onValueChange={(v) => v && update("listId", v)} disabled={!form.organizationId}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={form.organizationId ? "Select list" : "Select org first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {lists.map((l) => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-base">Email Content</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
                className="text-slate-400 hover:text-white gap-2"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
            </CardHeader>
            <CardContent>
              {previewMode ? (
                <div className="border border-slate-600 rounded-lg overflow-hidden h-96">
                  <iframe
                    srcDoc={form.htmlContent}
                    className="w-full h-full"
                    title="Email preview"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <Tabs defaultValue="html">
                  <TabsList className="bg-slate-700 border-slate-600 mb-4">
                    <TabsTrigger value="html" className="data-[state=active]:bg-slate-600 text-slate-300">HTML</TabsTrigger>
                    <TabsTrigger value="text" className="data-[state=active]:bg-slate-600 text-slate-300">Plain Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html">
                    <Textarea
                      value={form.htmlContent}
                      onChange={(e) => update("htmlContent", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white font-mono text-xs min-h-96 resize-y"
                      placeholder="HTML email content..."
                    />
                    <p className="text-slate-500 text-xs mt-2">
                      Merge tags: {"{{first_name}}"}, {"{{last_name}}"}, {"{{email}}"}, {"{{unsubscribe_url}}"}
                    </p>
                  </TabsContent>
                  <TabsContent value="text">
                    <Textarea
                      value={form.textContent}
                      onChange={(e) => update("textContent", e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white min-h-64 resize-y"
                      placeholder="Plain text fallback version of your email..."
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-slate-800 border-slate-700 sticky top-8">
            <CardHeader>
              <CardTitle className="text-white text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => save(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 gap-2"
                disabled={loading || !form.name || !form.subject || !form.organizationId || !form.fromName || !form.fromEmail}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Now
              </Button>
              <Button
                onClick={() => save(false)}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:text-white gap-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                Save Draft
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-base">Merge Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5 text-xs">
                {[
                  ["{{first_name}}", "Contact first name"],
                  ["{{last_name}}", "Contact last name"],
                  ["{{email}}", "Contact email"],
                  ["{{company}}", "Contact company"],
                  ["{{unsubscribe_url}}", "Unsubscribe link"],
                ].map(([tag, desc]) => (
                  <div key={tag} className="flex items-center justify-between">
                    <code className="text-blue-400 font-mono">{tag}</code>
                    <span className="text-slate-500">{desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
