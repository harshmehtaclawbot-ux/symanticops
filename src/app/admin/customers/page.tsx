import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">{orgs.length} organizations</p>
        </div>
        <Link href="/admin/customers/new">
          <Button className="bg-blue-600 hover:bg-blue-500 gap-2">
            <Plus className="w-4 h-4" /> Add Customer
          </Button>
        </Link>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Organization</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Plan</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Users</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Contacts</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Campaigns</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {orgs.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">No customers yet. Add your first customer.</p>
                </td>
              </tr>
            ) : (
              orgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{org.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{org.email || org.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm capitalize">{org.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{org._count.users}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{org._count.contacts}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{org._count.campaigns}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={org.isActive ? "default" : "secondary"}
                      className={org.isActive ? "bg-green-400/10 text-green-400 hover:bg-green-400/20" : ""}
                    >
                      {org.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/customers/${org.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        View
                      </Button>
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
