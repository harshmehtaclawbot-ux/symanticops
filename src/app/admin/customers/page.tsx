export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";

export default async function CustomersPage() {
  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true, contacts: true, campaigns: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Customers</h1>
          <p className="text-[#86868b] text-sm mt-1">{orgs.length} organizations</p>
        </div>
        <Link
          href="/admin/customers/new"
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#0071e3] text-white text-sm font-medium hover:bg-[#0077ed] active:scale-[0.98] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d2d2d7]/40">
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Organization</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Plan</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Users</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Contacts</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Campaigns</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2d2d7]/30">
            {orgs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <Building2 className="w-8 h-8 text-[#d2d2d7] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[#86868b] text-sm">No customers yet. Add your first customer.</p>
                </td>
              </tr>
            ) : (
              orgs.map((org) => (
                <tr key={org.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[#1d1d1f] font-medium text-sm">{org.name}</p>
                      <p className="text-[#86868b] text-xs mt-0.5">{org.email || org.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm capitalize">{org.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{org._count.users}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{org._count.contacts}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{org._count.campaigns}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${org.isActive ? "bg-[#34c759]/10 text-[#248a3d]" : "bg-red-50 text-red-600"}`}>
                      {org.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${org.id}`} className="text-[#0071e3] text-sm font-medium hover:underline">
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
