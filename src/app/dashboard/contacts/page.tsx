import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContactsTable } from "@/components/dashboard/contacts-table";

export default async function ContactsPage() {
  const session = await auth();
  const orgId = (session!.user as any).organizationId as string;

  const contacts = await prisma.contact.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contacts</h1>
          <p className="text-slate-400 mt-1">{contacts.length} total contacts</p>
        </div>
        <ContactsTable contacts={contacts} orgId={orgId} showAdd />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Email</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Company</th>
              <th className="text-left text-slate-400 text-xs font-medium uppercase tracking-wider px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  No contacts yet. Add your first contact.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">
                      {[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 text-sm">{c.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-400 text-sm">{c.company || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "ACTIVE" ? "bg-green-400/10 text-green-400" :
                      c.status === "UNSUBSCRIBED" ? "bg-yellow-400/10 text-yellow-400" :
                      "bg-red-400/10 text-red-400"
                    }`}>
                      {c.status}
                    </span>
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
