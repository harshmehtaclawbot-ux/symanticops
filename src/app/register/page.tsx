"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", orgName: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <span className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">
            SymanticOps
          </span>
          <p className="text-[#86868b] text-sm font-normal">CRM · HRMS · Marketing Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#d2d2d7]/60 p-8">
          <div className="space-y-1 mb-6">
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Create your account</h2>
            <p className="text-[#86868b] text-sm">Get started with your organization</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="orgName" className="text-sm font-medium text-[#1d1d1f]">Organization Name</label>
              <input
                id="orgName"
                placeholder="Acme Corp"
                value={form.orgName}
                onChange={(e) => setForm((p) => ({ ...p, orgName: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-[#1d1d1f]">Your Name</label>
              <input
                id="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#1d1d1f]">Email</label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#1d1d1f]">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full h-11 px-4 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder:text-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]/40 focus:border-[#0071e3] transition-all"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#86868b] text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-[#0071e3] hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
