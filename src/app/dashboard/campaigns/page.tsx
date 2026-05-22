import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-600 text-slate-300",
  SCHEDULED: "bg-yellow-400/10 text-yellow-400",
  SENDING: "bg-blue-400/10 text-blue-400",
  SENT: "bg-green-400/10 text-green-400",
  PAUSED: "bg-orange-400/10 text-orange-400",
  CANCELLED: "bg-red-400/10 text-red-400",
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
        <h1 className="text-2xl font-bold text-white">Campaigns</h1>
        <p className="text-slate-400 mt-1">{campaigns.length} campaigns</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Mail className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-white font-medium mb-1">No campaigns yet</h3>
          <p className="text-slate-500 text-sm">Your campaigns will appear here once created by your admin.</p>
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
              <Card key={c.id} className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-medium">{c.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[c.status] ?? ""}`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{c.subject}</p>
                      <p className="text-slate-500 text-xs">
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
                            <p className="text-white font-semibold text-lg">{stat.value}</p>
                            <p className="text-slate-500 text-xs">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
