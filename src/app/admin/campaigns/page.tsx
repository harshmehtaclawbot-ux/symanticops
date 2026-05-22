import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Mail } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-600 text-slate-300",
  SCHEDULED: "bg-yellow-400/10 text-yellow-400",
  SENDING: "bg-blue-400/10 text-blue-400",
  SENT: "bg-green-400/10 text-green-400",
  PAUSED: "bg-orange-400/10 text-orange-400",
  CANCELLED: "bg-red-400/10 text-red-400",
};

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true } },
      stats: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-slate-400 mt-1">{campaigns.length} total campaigns</p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button className="bg-blue-600 hover:bg-blue-500 gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Campaign</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Organization</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Sent</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Opens</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Clicks</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">No campaigns yet</p>
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{c.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5 truncate max-w-48">{c.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{c.organization.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{c.stats?.totalSent ?? 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">
                      {c.stats ? `${c.stats.opened} (${c.stats.totalSent > 0 ? Math.round((c.stats.opened / c.stats.totalSent) * 100) : 0}%)` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">
                      {c.stats ? `${c.stats.clicked} (${c.stats.totalSent > 0 ? Math.round((c.stats.clicked / c.stats.totalSent) * 100) : 0}%)` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status] ?? ""}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-xs">
                      {format(c.createdAt, "MMM d, yyyy")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/campaigns/${c.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">View</Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
