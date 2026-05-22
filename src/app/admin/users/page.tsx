export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { format } from "date-fns";

const roleBadge: Record<string, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-600",
  ORG_ADMIN: "bg-[#0071e3]/10 text-[#0071e3]",
  ORG_USER: "bg-[#f5f5f7] text-[#86868b]",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { organization: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Users</h1>
        <p className="text-[#86868b] text-sm mt-1">{users.length} total users</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d2d2d7]/40">
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">User</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Organization</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Role</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2d2d7]/30">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <Users className="w-8 h-8 text-[#d2d2d7] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-[#86868b] text-sm">No users yet</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-[#1d1d1f] font-medium text-sm">{user.name || "—"}</p>
                      <p className="text-[#86868b] text-xs mt-0.5">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{user.organization?.name ?? "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${roleBadge[user.role] ?? ""}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${user.isActive ? "bg-[#34c759]/10 text-[#248a3d]" : "bg-red-50 text-red-600"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#86868b] text-xs">{format(user.createdAt, "MMM d, yyyy")}</span>
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
