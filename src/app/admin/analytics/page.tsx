import { prisma } from "@/lib/prisma";
import { BarChart3, TrendingUp, Mail, Users } from "lucide-react";

export default async function AnalyticsPage() {
  const [totalSent, totalOpened, totalClicked, totalBounced, topCampaigns, orgStats] = await Promise.all([
    prisma.campaignStats.aggregate({ _sum: { totalSent: true, delivered: true } }),
    prisma.campaignStats.aggregate({ _sum: { opened: true } }),
    prisma.campaignStats.aggregate({ _sum: { clicked: true } }),
    prisma.campaignStats.aggregate({ _sum: { bounced: true } }),
    prisma.campaign.findMany({
      where: { status: "SENT", stats: { totalSent: { gt: 0 } } },
      take: 10,
      orderBy: { sentAt: "desc" },
      include: { stats: true, organization: { select: { name: true } } },
    }),
    prisma.organization.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { contacts: true, campaigns: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const sent = totalSent._sum.totalSent ?? 0;
  const opened = totalOpened._sum.opened ?? 0;
  const clicked = totalClicked._sum.clicked ?? 0;
  const bounced = totalBounced._sum.bounced ?? 0;
  const openRate = sent > 0 ? ((opened / sent) * 100).toFixed(1) : "0.0";
  const clickRate = sent > 0 ? ((clicked / sent) * 100).toFixed(1) : "0.0";
  const bounceRate = sent > 0 ? ((bounced / sent) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Analytics</h1>
        <p className="text-[#86868b] text-sm mt-1">Platform-wide email performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          { label: "Emails Sent", value: sent.toLocaleString(), icon: Mail, sub: "All time", color: "text-[#0071e3]" },
          { label: "Open Rate", value: `${openRate}%`, icon: TrendingUp, sub: `${opened.toLocaleString()} opens`, color: "text-[#34c759]" },
          { label: "Click Rate", value: `${clickRate}%`, icon: BarChart3, sub: `${clicked.toLocaleString()} clicks`, color: "text-[#af52de]" },
          { label: "Bounce Rate", value: `${bounceRate}%`, icon: Users, sub: `${bounced.toLocaleString()} bounces`, color: "text-[#ff3b30]" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-[#d2d2d7]/40 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#86868b] text-sm">{card.label}</p>
              <card.icon className={`w-5 h-5 ${card.color}`} strokeWidth={1.5} />
            </div>
            <p className="text-[32px] font-semibold text-[#1d1d1f] tracking-tight">{card.value}</p>
            <p className="text-[#86868b] text-xs mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
          <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Top Campaigns by Sends</h3>
          </div>
          <div className="p-6">
            {topCampaigns.length === 0 ? (
              <p className="text-[#86868b] text-sm">No sent campaigns yet</p>
            ) : (
              <div className="space-y-5">
                {topCampaigns.map((c) => {
                  const total = c.stats?.totalSent ?? 0;
                  const open = c.stats?.opened ?? 0;
                  const rate = total > 0 ? Math.round((open / total) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-[#1d1d1f] text-sm font-medium">{c.name}</p>
                          <p className="text-[#86868b] text-xs">{c.organization.name} · {total.toLocaleString()} sent</p>
                        </div>
                        <span className="text-[#248a3d] text-sm font-medium">{rate}% open</span>
                      </div>
                      <div className="h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#34c759] rounded-full transition-all" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
          <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Customer Overview</h3>
          </div>
          <div className="p-6">
            {orgStats.length === 0 ? (
              <p className="text-[#86868b] text-sm">No customers yet</p>
            ) : (
              <div className="space-y-3">
                {orgStats.map((org) => (
                  <div key={org.id} className="flex items-center justify-between py-2.5 border-b border-[#d2d2d7]/30 last:border-0">
                    <p className="text-[#1d1d1f] text-sm font-medium">{org.name}</p>
                    <div className="flex gap-4 text-xs text-[#86868b]">
                      <span>{org._count.contacts} contacts</span>
                      <span>{org._count.campaigns} campaigns</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
