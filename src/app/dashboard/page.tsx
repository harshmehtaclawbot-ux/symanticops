export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Mail, List, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  const orgId = (session!.user as any).organizationId as string;

  const [contacts, campaigns, lists, sentStats] = await Promise.all([
    prisma.contact.count({ where: { organizationId: orgId, status: "ACTIVE" } }),
    prisma.campaign.count({ where: { organizationId: orgId } }),
    prisma.contactList.count({ where: { organizationId: orgId } }),
    prisma.campaignStats.aggregate({
      where: { campaign: { organizationId: orgId } },
      _sum: { totalSent: true, opened: true, clicked: true },
    }),
  ]);

  const recentCampaigns = await prisma.campaign.findMany({
    where: { organizationId: orgId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { stats: true },
  });

  const totalSent = sentStats._sum.totalSent ?? 0;
  const totalOpened = sentStats._sum.opened ?? 0;
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Dashboard</h1>
        <p className="text-[#86868b] text-sm mt-1">Your marketing overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: "Active Contacts", value: contacts.toLocaleString(), icon: Users, color: "text-[#0071e3]" },
          { label: "Total Campaigns", value: campaigns.toLocaleString(), icon: Mail, color: "text-[#af52de]" },
          { label: "Contact Lists", value: lists.toLocaleString(), icon: List, color: "text-[#34c759]" },
          { label: "Avg Open Rate", value: `${openRate}%`, icon: TrendingUp, color: "text-[#ff9500]" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#d2d2d7]/40 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#86868b] text-sm">{card.label}</p>
                <p className="text-[32px] font-semibold text-[#1d1d1f] mt-1 tracking-tight">{card.value}</p>
              </div>
              <card.icon className={`w-8 h-8 ${card.color}`} strokeWidth={1.5} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
        <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
          <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Recent Campaigns</h3>
        </div>
        <div className="p-6">
          {recentCampaigns.length === 0 ? (
            <p className="text-[#86868b] text-sm">No campaigns yet. Create your first campaign.</p>
          ) : (
            <div className="space-y-3">
              {recentCampaigns.map((c) => {
                const sent = c.stats?.totalSent ?? 0;
                const opened = c.stats?.opened ?? 0;
                const rate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
                return (
                  <div key={c.id} className="flex items-center justify-between py-3 border-b border-[#d2d2d7]/30 last:border-0">
                    <div>
                      <p className="text-[#1d1d1f] text-sm font-medium">{c.name}</p>
                      <p className="text-[#86868b] text-xs mt-0.5">{c.subject} · {format(c.createdAt, "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`font-medium px-2.5 py-1 rounded-full ${
                        c.status === "SENT" ? "bg-[#34c759]/10 text-[#248a3d]" :
                        c.status === "DRAFT" ? "bg-[#f5f5f7] text-[#86868b]" :
                        "bg-[#0071e3]/10 text-[#0071e3]"
                      }`}>{c.status}</span>
                      {c.status === "SENT" && (
                        <span className="text-[#86868b]">{sent} sent · {rate}% open</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
