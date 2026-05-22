import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Mail } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  DRAFT: "bg-[#f5f5f7] text-[#86868b]",
  SCHEDULED: "bg-[#ff9500]/10 text-[#ff9500]",
  SENDING: "bg-[#0071e3]/10 text-[#0071e3]",
  SENT: "bg-[#34c759]/10 text-[#248a3d]",
  PAUSED: "bg-[#ff9500]/10 text-[#ff9500]",
  CANCELLED: "bg-red-50 text-red-600",
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
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Campaigns</h1>
          <p className="text-[#86868b] text-sm mt-1">{campaigns.length} total campaigns</p>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] active:scale-[0.98] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Campaign
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d2d2d7]/40">
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Campaign</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Organization</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Sent</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Opens</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Clicks</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2d2d7]/30">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <Mail className="w-8 h-8 text-[#d2d2d7] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[#86868b] text-sm">No campaigns yet</p>
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[#1d1d1f] font-medium text-sm">{c.name}</p>
                      <p className="text-[#86868b] text-xs mt-0.5 truncate max-w-48">{c.subject}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{c.organization.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{c.stats?.totalSent ?? 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">
                      {c.stats ? `${c.stats.opened} (${c.stats.totalSent > 0 ? Math.round((c.stats.opened / c.stats.totalSent) * 100) : 0}%)` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">
                      {c.stats ? `${c.stats.clicked} (${c.stats.totalSent > 0 ? Math.round((c.stats.clicked / c.stats.totalSent) * 100) : 0}%)` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[c.status] ?? ""}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#86868b] text-xs">{format(c.createdAt, "MMM d, yyyy")}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/campaigns/${c.id}`} className="text-[#0071e3] text-sm font-medium hover:underline">
                      View
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
