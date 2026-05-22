import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  organizationId: z.string(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgId = (session.user as any).organizationId as string;
  if (!orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  const orgId = (session.user as any).organizationId as string;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const targetOrgId = role === "SUPER_ADMIN" ? parsed.data.organizationId : orgId;
  if (!targetOrgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.contact.findUnique({
    where: { email_organizationId: { email: parsed.data.email, organizationId: targetOrgId } },
  });
  if (existing) {
    return NextResponse.json({ error: "Contact with this email already exists" }, { status: 409 });
  }

  const contact = await prisma.contact.create({
    data: {
      email: parsed.data.email,
      firstName: parsed.data.firstName || null,
      lastName: parsed.data.lastName || null,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      jobTitle: parsed.data.jobTitle || null,
      organizationId: targetOrgId,
    },
  });

  return NextResponse.json({ contact }, { status: 201 });
}
