export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
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
    { label: "Total Customers", value: stats.orgs, icon: Building2, color: "text-[#0071e3]" },
    { label: "Active Users", value: stats.users, icon: Users, color: "text-[#34c759]" },
    { label: "Total Campaigns", value: stats.campaigns, icon: Mail, color: "text-[#af52de]" },
    { label: "Campaigns Sent", value: stats.sentCampaigns, icon: TrendingUp, color: "text-[#ff9500]" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Admin Dashboard</h1>
        <p className="text-[#86868b] text-sm mt-1">Overview of your platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
          <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Recent Customers</h3>
          </div>
          <div className="p-6">
            {stats.recentOrgs.length === 0 ? (
              <p className="text-[#86868b] text-sm">No customers yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrgs.map((org) => (
                  <div key={org.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1d1d1f] text-sm font-medium">{org.name}</p>
                      <p className="text-[#86868b] text-xs mt-0.5">{org._count.users} users · {org._count.contacts} contacts</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${org.isActive ? "bg-[#34c759]/10 text-[#248a3d]" : "bg-red-50 text-red-600"}`}>
                      {org.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm">
          <div className="px-6 py-4 border-b border-[#d2d2d7]/40">
            <h3 className="text-[15px] font-semibold text-[#1d1d1f]">Recent Campaigns</h3>
          </div>
          <div className="p-6">
            {stats.recentCampaigns.length === 0 ? (
              <p className="text-[#86868b] text-sm">No campaigns yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentCampaigns.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-[#1d1d1f] text-sm font-medium">{c.name}</p>
                      <p className="text-[#86868b] text-xs mt-0.5">{c.organization.name}</p>
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      c.status === "SENT" ? "bg-[#34c759]/10 text-[#248a3d]" :
                      c.status === "DRAFT" ? "bg-[#f5f5f7] text-[#86868b]" :
                      c.status === "SENDING" ? "bg-[#0071e3]/10 text-[#0071e3]" :
                      "bg-[#ff9500]/10 text-[#ff9500]"
                    }`}>
                      {c.status}
                    </span>
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
