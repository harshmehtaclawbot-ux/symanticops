import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { format } from "date-fns";

const roleBadge: Record<string, string> = {
  SUPER_ADMIN: "bg-red-400/10 text-red-400",
  ORG_ADMIN: "bg-blue-400/10 text-blue-400",
  ORG_USER: "bg-slate-600 text-slate-300",
};

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { organization: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">{users.length} total users</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">User</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Organization</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Role</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-500">No users yet</p>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{user.name || "—"}</p>
                      <p className="text-slate-500 text-xs">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{user.organization?.name ?? "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge[user.role] ?? ""}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.isActive ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-xs">{format(user.createdAt, "MMM d, yyyy")}</span>
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
