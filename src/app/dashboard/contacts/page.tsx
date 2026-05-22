import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
          <h1 className="text-[28px] font-semibold tracking-tight text-[#1d1d1f]">Contacts</h1>
          <p className="text-[#86868b] text-sm mt-1">{contacts.length} total contacts</p>
        </div>
        <ContactsTable contacts={contacts} orgId={orgId} showAdd />
      </div>

      <div className="bg-white rounded-2xl border border-[#d2d2d7]/40 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#d2d2d7]/40">
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Name</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Email</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Company</th>
              <th className="text-left text-[#86868b] text-[11px] font-semibold uppercase tracking-wider px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d2d2d7]/30">
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-[#86868b] text-sm">
                  No contacts yet. Add your first contact.
                </td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c.id} className="hover:bg-[#f5f5f7]/60 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-[#1d1d1f] font-medium text-sm">
                      {[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#424245] text-sm">{c.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#86868b] text-sm">{c.company || "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      c.status === "ACTIVE" ? "bg-[#34c759]/10 text-[#248a3d]" :
                      c.status === "UNSUBSCRIBED" ? "bg-[#ff9500]/10 text-[#ff9500]" :
                      "bg-red-50 text-red-600"
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
