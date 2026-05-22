import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  const role = (session.user as any).role;
  const orgId = (session.user as any).organizationId;

  if (role === "SUPER_ADMIN") redirect("/admin");
  if (!orgId) redirect("/login");

  const org = await prisma.organization.findUnique({ where: { id: orgId }, select: { name: true } });
  if (!org) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-950">
      <DashboardSidebar orgName={org.name} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
