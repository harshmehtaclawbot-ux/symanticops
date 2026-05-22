import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Your marketing overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Active Contacts", value: contacts.toLocaleString(), icon: Users, color: "text-blue-400" },
          { label: "Total Campaigns", value: campaigns.toLocaleString(), icon: Mail, color: "text-purple-400" },
          { label: "Contact Lists", value: lists.toLocaleString(), icon: List, color: "text-green-400" },
          { label: "Avg Open Rate", value: `${openRate}%`, icon: TrendingUp, color: "text-orange-400" },
        ].map((card) => (
          <Card key={card.label} className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <card.icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white text-base">Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCampaigns.length === 0 ? (
            <p className="text-slate-500 text-sm">No campaigns yet. Create your first campaign.</p>
          ) : (
            <div className="space-y-3">
              {recentCampaigns.map((c) => {
                const sent = c.stats?.totalSent ?? 0;
                const opened = c.stats?.opened ?? 0;
                const rate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
                return (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <p className="text-slate-500 text-xs">{c.subject} · {format(c.createdAt, "MMM d, yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${
                        c.status === "SENT" ? "bg-green-400/10 text-green-400" :
                        c.status === "DRAFT" ? "bg-slate-600 text-slate-400" :
                        "bg-blue-400/10 text-blue-400"
                      }`}>{c.status}</span>
                      {c.status === "SENT" && (
                        <span className="text-slate-400">{sent} sent · {rate}% open</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
