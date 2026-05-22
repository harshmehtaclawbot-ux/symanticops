import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Platform-wide email performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Emails Sent", value: sent.toLocaleString(), icon: Mail, sub: "All time", color: "text-blue-400" },
          { label: "Open Rate", value: `${openRate}%`, icon: TrendingUp, sub: `${opened.toLocaleString()} opens`, color: "text-green-400" },
          { label: "Click Rate", value: `${clickRate}%`, icon: BarChart3, sub: `${clicked.toLocaleString()} clicks`, color: "text-purple-400" },
          { label: "Bounce Rate", value: `${bounceRate}%`, icon: Users, sub: `${bounced.toLocaleString()} bounces`, color: "text-red-400" },
        ].map((card) => (
          <Card key={card.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">{card.label}</p>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-slate-500 text-xs mt-1">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Top Campaigns by Sends</CardTitle>
          </CardHeader>
          <CardContent>
            {topCampaigns.length === 0 ? (
              <p className="text-slate-500 text-sm">No sent campaigns yet</p>
            ) : (
              <div className="space-y-4">
                {topCampaigns.map((c) => {
                  const total = c.stats?.totalSent ?? 0;
                  const open = c.stats?.opened ?? 0;
                  const rate = total > 0 ? Math.round((open / total) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="text-white text-sm font-medium">{c.name}</p>
                          <p className="text-slate-500 text-xs">{c.organization.name} · {total.toLocaleString()} sent</p>
                        </div>
                        <span className="text-green-400 text-sm font-medium">{rate}% open</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${rate}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Customer Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {orgStats.length === 0 ? (
              <p className="text-slate-500 text-sm">No customers yet</p>
            ) : (
              <div className="space-y-3">
                {orgStats.map((org) => (
                  <div key={org.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                    <p className="text-white text-sm font-medium">{org.name}</p>
                    <div className="flex gap-4 text-xs text-slate-400">
                      <span>{org._count.contacts} contacts</span>
                      <span>{org._count.campaigns} campaigns</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
