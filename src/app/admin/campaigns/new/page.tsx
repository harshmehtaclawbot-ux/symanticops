export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { CampaignBuilder } from "@/components/admin/campaign-builder";

export default async function NewCampaignPage() {
  const orgs = await prisma.organization.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Campaign</h1>
        <p className="text-slate-400 mt-1">Build and send an email campaign</p>
      </div>
      <CampaignBuilder organizations={orgs} />
    </div>
  );
}
