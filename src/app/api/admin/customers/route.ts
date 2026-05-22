import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { slugify } from "@/lib/slug";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  plan: z.enum(["starter", "growth", "enterprise"]).default("starter"),
  adminName: z.string().min(1),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8),
});

async function requireAdmin(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orgs = await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { users: true, contacts: true } } },
  });
  return NextResponse.json({ orgs });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, phone, website, industry, plan, adminName, adminEmail, adminPassword } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existingUser) {
    return NextResponse.json({ error: "Admin email already in use" }, { status: 409 });
  }

  const slug = await uniqueSlug(slugify(name));
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const org = await prisma.organization.create({
    data: {
      name,
      slug,
      email: email || null,
      phone: phone || null,
      website: website || null,
      industry: industry || null,
      plan,
      users: {
        create: {
          name: adminName,
          email: adminEmail,
          passwordHash,
          role: "ORG_ADMIN",
          isActive: true,
        },
      },
    },
  });

  return NextResponse.json({ org }, { status: 201 });
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 0;
  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}
