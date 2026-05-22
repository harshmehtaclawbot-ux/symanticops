import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Mail, TrendingUp } from "lucide-react";

async function getStats() {
  const [orgs, users, campaigns, sentCampaigns] = await Promise.all([
    prisma.organization.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: true, role: { not: "SUPER_ADMIN" } } }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: "SENT" } }),
  ]);

  const recentOrgs = await prisma.organization.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true, contacts: true } } },
  });

  const recentCampaigns = await prisma.campaign.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { organization: { select: { name: true } } },
  });

  return { orgs, users, campaigns, sentCampaigns, recentOrgs, recentCampaigns };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const statCards = [
    { label: "Total Customers", value: stats.orgs, icon: Building2, color: "text-blue-400" },
    { label: "Active Users", value: stats.users, icon: Users, color: "text-green-400" },
    { label: "Total Campaigns", value: stats.campaigns, icon: Mail, color: "text-purple-400" },
    { label: "Campaigns Sent", value: stats.sentCampaigns, icon: TrendingUp, color: "text-orange-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentOrgs.length === 0 ? (
              <p className="text-slate-500 text-sm">No customers yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrgs.map((org) => (
                  <div key={org.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{org.name}</p>
                      <p className="text-slate-500 text-xs">{org._count.users} users · {org._count.contacts} contacts</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${org.isActive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                      {org.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-base">Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentCampaigns.length === 0 ? (
              <p className="text-slate-500 text-sm">No campaigns yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentCampaigns.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <p className="text-slate-500 text-xs">{c.organization.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "SENT" ? "bg-green-400/10 text-green-400" :
                      c.status === "DRAFT" ? "bg-slate-600 text-slate-400" :
                      c.status === "SENDING" ? "bg-blue-400/10 text-blue-400" :
                      "bg-yellow-400/10 text-yellow-400"
                    }`}>
                      {c.status}
                    </span>
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
