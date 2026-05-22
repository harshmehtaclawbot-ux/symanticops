"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCustomerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", website: "", industry: "", plan: "starter",
    adminName: "", adminEmail: "", adminPassword: "",
  });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  const inputClass = "w-full h-11 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create customer");
      } else {
        toast.success("Customer created successfully");
        router.push("/admin/customers");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-1.5 text-sm text-[#0071e3] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">New Customer</h1>
          <p className="text-[#86868b] text-sm">Add a new organization to the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
          <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Organization Details</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Organization Name *</label>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Acme Corp" className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Business Email</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="hello@acme.com" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Phone</label>
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 555 0100" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Website</label>
                <input value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://acme.com" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Industry</label>
                <input value={form.industry} onChange={(e) => update("industry", e.target.value)} placeholder="Technology" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Plan</label>
                <select value={form.plan} onChange={(e) => update("plan", e.target.value)} className={inputClass}>
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
          <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Admin User</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Name *</label>
                <input value={form.adminName} onChange={(e) => update("adminName", e.target.value)} placeholder="Jane Smith" className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#1d1d1f]">Email *</label>
                <input type="email" value={form.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} placeholder="jane@acme.com" className={inputClass} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#1d1d1f]">Temporary Password *</label>
              <input type="password" value={form.adminPassword} onChange={(e) => update("adminPassword", e.target.value)} placeholder="Min 8 characters" className={inputClass} minLength={8} required />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="h-11 px-6 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Customer"}
          </button>
          <Link
            href="/admin/customers"
            className="h-11 px-6 rounded-xl border border-[#d2d2d7] text-[#424245] text-sm font-medium hover:bg-[#f5f5f7] transition-all inline-flex items-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
