export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Mail } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  DRAFT: "bg-[#f5f5f7] text-[#86868b]",
  SCHEDULED: "bg-[#ff9500]/10 text-[#ff9500]",
  SENDING: "bg-[#0071e3]/10 text-[#0071e3]",
  SENT: "bg-[#34c759]/10 text-[#248a3d]",
  PAUSED: "bg-[#ff9500]/10 text-[#ff9500]",
  CANCELLED: "bg-red-50 text-red-600",
};

export default async function DashboardCampaignsPage() {
  const session = await auth();
  const orgId = (session!.user as any).organizationId as string;

  const campaigns = await prisma.campaign.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
    include: { stats: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Campaigns</h1>
        <p className="text-[#86868b] text-sm mt-1">{campaigns.length} campaigns</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail className="w-12 h-12 text-[#d2d2d7] mb-4" strokeWidth={1.2} />
          <h3 className="text-[#1d1d1f] font-medium mb-1">No campaigns yet</h3>
          <p className="text-[#86868b] text-sm">Your campaigns will appear here once created by your admin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map((c) => {
            const sent = c.stats?.totalSent ?? 0;
            const opened = c.stats?.opened ?? 0;
            const clicked = c.stats?.clicked ?? 0;
            const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;
            const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0;

            return (
              <div key={c.id} className="bg-white rounded-2xl border border-[#d2d2d7]/40 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="text-[#1d1d1f] font-medium">{c.name}</h3>
                      <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusColors[c.status] ?? ""}`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[#86868b] text-sm">{c.subject}</p>
                    <p className="text-[#86868b] text-xs">
                      From: {c.fromName} &lt;{c.fromEmail}&gt; · {format(c.createdAt, "MMM d, yyyy")}
                    </p>
                  </div>

                  {c.status === "SENT" && (
                    <div className="flex gap-6 text-center">
                      {[
                        { label: "Sent", value: sent.toLocaleString() },
                        { label: "Open Rate", value: `${openRate}%` },
                        { label: "Click Rate", value: `${clickRate}%` },
                      ].map((stat) => (
                        <div key={stat.label}>
                          <p className="text-[#1d1d1f] font-semibold text-lg">{stat.value}</p>
                          <p className="text-[#86868b] text-xs">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
