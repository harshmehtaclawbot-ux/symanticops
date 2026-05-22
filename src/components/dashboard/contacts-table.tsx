"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Contact = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  jobTitle: string | null;
  phone: string | null;
  status: string;
};

export function ContactsTable({ contacts, orgId, showAdd }: { contacts: Contact[]; orgId: string; showAdd?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", company: "", jobTitle: "", phone: "" });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, organizationId: orgId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add contact");
      } else {
        toast.success("Contact added");
        setOpen(false);
        setForm({ email: "", firstName: "", lastName: "", company: "", jobTitle: "", phone: "" });
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (!showAdd) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button className="bg-blue-600 hover:bg-blue-500 gap-2"><Plus className="w-4 h-4" /> Add Contact</Button>}
      />
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Email *</Label>
            <Input value={form.email} onChange={(e) => update("email", e.target.value)}
              type="email" placeholder="contact@company.com"
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">First Name</Label>
              <Input value={form.firstName} onChange={(e) => update("firstName", e.target.value)}
                placeholder="Jane" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Last Name</Label>
              <Input value={form.lastName} onChange={(e) => update("lastName", e.target.value)}
                placeholder="Smith" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-slate-300">Company</Label>
              <Input value={form.company} onChange={(e) => update("company", e.target.value)}
                placeholder="Acme Corp" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Job Title</Label>
              <Input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)}
                placeholder="Marketing Manager" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Phone</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)}
              placeholder="+1 555 0100" className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-500" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Contact"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:text-white">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
