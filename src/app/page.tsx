export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BarChart3, Users, Mail, Shield, ArrowRight, Check } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session) {
    const role = (session.user as any).role;
    redirect(role === "SUPER_ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#d2d2d7]/50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="SymanticOps" width={160} height={40} className="h-8 w-auto" priority />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-[#424245] hover:text-[#1d1d1f] transition-colors">
              Sign In
            </Link>
            <Link
              href="/register"
              className="h-9 px-5 rounded-full bg-[#1d1d1f] text-white text-sm font-medium hover:bg-[#424245] transition-colors inline-flex items-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#0071e3]/8 text-[#0071e3] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 tracking-wide uppercase">
          CRM · HRMS · Marketing — All in one
        </div>
        <h1 className="text-[56px] font-semibold tracking-tight text-[#1d1d1f] leading-[1.07] mb-6 max-w-3xl mx-auto">
          The platform your business was waiting for
        </h1>
        <p className="text-[19px] text-[#424245] leading-relaxed max-w-2xl mx-auto mb-10">
          SymanticOps brings together CRM, HR management, and email marketing so your team can move faster and grow smarter.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="h-12 px-8 rounded-full bg-[#0071e3] text-white text-[15px] font-medium hover:bg-[#0077ed] active:scale-[0.98] transition-all shadow-sm inline-flex items-center gap-2"
          >
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="h-12 px-8 rounded-full border border-[#d2d2d7] text-[#1d1d1f] text-[15px] font-medium hover:bg-white transition-all inline-flex items-center"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Users,
              color: "text-[#0071e3]",
              bg: "bg-[#0071e3]/8",
              title: "CRM",
              desc: "Manage contacts, track interactions, and build lasting customer relationships with a clean, fast interface.",
              items: ["Contact management", "Activity timeline", "Segmentation"],
            },
            {
              icon: Shield,
              color: "text-[#34c759]",
              bg: "bg-[#34c759]/8",
              title: "HRMS",
              desc: "Streamline your HR workflows — onboarding, org management, roles, and team access all in one place.",
              items: ["Team management", "Role-based access", "Org hierarchy"],
            },
            {
              icon: Mail,
              color: "text-[#af52de]",
              bg: "bg-[#af52de]/8",
              title: "Email Marketing",
              desc: "Design, send, and track email campaigns with merge tags, analytics, and deliverability built in.",
              items: ["Campaign builder", "Open & click tracking", "Contact lists"],
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm p-8">
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.color}`} strokeWidth={1.8} />
              </div>
              <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-3">{f.title}</h3>
              <p className="text-[#424245] text-sm leading-relaxed mb-5">{f.desc}</p>
              <ul className="space-y-2">
                {f.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[#424245]">
                    <Check className="w-3.5 h-3.5 text-[#34c759] flex-shrink-0" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-[#d2d2d7]/40">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "Multi-tenant", label: "Architecture" },
            { value: "Real-time", label: "Analytics" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "HTTPS", label: "End-to-end encrypted" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-[28px] font-semibold text-[#1d1d1f] tracking-tight">{s.value}</p>
              <p className="text-[#86868b] text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics preview */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-[40px] font-semibold tracking-tight text-[#1d1d1f] mb-4">
            Insights that drive growth
          </h2>
          <p className="text-[17px] text-[#424245] max-w-xl mx-auto">
            Every campaign, every contact, every action — tracked and presented in a dashboard that actually makes sense.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BarChart3, label: "Open Rate", value: "28.4%", color: "text-[#0071e3]", bg: "bg-[#0071e3]/8" },
            { icon: Mail, label: "Emails Sent", value: "124K", color: "text-[#af52de]", bg: "bg-[#af52de]/8" },
            { icon: Users, label: "Active Contacts", value: "8,312", color: "text-[#34c759]", bg: "bg-[#34c759]/8" },
            { icon: Shield, label: "Bounce Rate", value: "1.2%", color: "text-[#ff9500]", bg: "bg-[#ff9500]/8" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm p-6">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`w-4 h-4 ${s.color}`} strokeWidth={1.8} />
              </div>
              <p className="text-[26px] font-semibold text-[#1d1d1f] tracking-tight">{s.value}</p>
              <p className="text-[#86868b] text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#1d1d1f] rounded-3xl px-12 py-16 text-center">
          <h2 className="text-[36px] font-semibold text-white tracking-tight mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#86868b] text-[17px] mb-8 max-w-md mx-auto">
            Join teams already using SymanticOps to manage customers, people, and campaigns.
          </p>
          <Link
            href="/register"
            className="h-12 px-8 rounded-full bg-white text-[#1d1d1f] text-[15px] font-medium hover:bg-[#f5f5f7] active:scale-[0.98] transition-all inline-flex items-center gap-2"
          >
            Create your account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d2d2d7]/50 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logo.png" alt="SymanticOps" width={120} height={30} className="h-6 w-auto opacity-60" />
          <p className="text-[#86868b] text-xs">© {new Date().getFullYear()} SymanticOps. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-[#86868b]">
            <a href="#" className="hover:text-[#1d1d1f] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#1d1d1f] transition-colors">Terms</a>
            <a href="/login" className="hover:text-[#1d1d1f] transition-colors">Sign In</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
