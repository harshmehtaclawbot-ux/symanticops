import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  previewText: z.string().optional(),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  replyTo: z.string().email().optional().or(z.literal("")),
  htmlContent: z.string().min(1),
  textContent: z.string().optional(),
  organizationId: z.string(),
  listId: z.string().optional().or(z.literal("")),
  send: z.boolean().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as any).role;
  const orgId = (session.user as any).organizationId as string;

  const where = role === "SUPER_ADMIN" ? {} : { organizationId: orgId };
  const campaigns = await prisma.campaign.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { stats: true },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { send, listId, replyTo, previewText, textContent, ...data } = parsed.data;

  const campaign = await prisma.campaign.create({
    data: {
      ...data,
      listId: listId || null,
      replyTo: replyTo || null,
      previewText: previewText || null,
      textContent: textContent || null,
      createdById: session.user!.id!,
      status: "DRAFT",
    },
  });

  await prisma.campaignStats.create({
    data: { campaignId: campaign.id },
  });

  if (send) {
    sendCampaignAsync(campaign.id).catch(console.error);
  }

  return NextResponse.json({ campaign }, { status: 201 });
}

async function sendCampaignAsync(campaignId: string) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
    include: {
      list: { include: { members: { include: { contact: true } } } },
      organization: true,
    },
  });

  if (!campaign) return;

  const contacts = campaign.listId && campaign.list
    ? campaign.list.members.map((m) => m.contact).filter((c) => c.status === "ACTIVE")
    : await prisma.contact.findMany({
        where: { organizationId: campaign.organizationId, status: "ACTIVE" },
      });

  if (contacts.length === 0) {
    await prisma.campaign.update({ where: { id: campaignId }, data: { status: "SENT", sentAt: new Date() } });
    return;
  }

  await prisma.campaign.update({ where: { id: campaignId }, data: { status: "SENDING" } });

  const { resend } = await import("@/lib/resend");
  let sent = 0;

  for (const contact of contacts) {
    const html = replaceMergeTags(campaign.htmlContent, contact, campaignId);
    const text = campaign.textContent ? replaceMergeTags(campaign.textContent, contact, campaignId) : undefined;

    try {
      await resend.emails.send({
        from: `${campaign.fromName} <${campaign.fromEmail}>`,
        to: contact.email,
        subject: campaign.subject,
        html,
        text,
        replyTo: campaign.replyTo ?? undefined,
      });
      sent++;

      await prisma.emailEvent.create({
        data: { campaignId, contactId: contact.id, eventType: "DELIVERED" },
      });
    } catch (err) {
      await prisma.emailEvent.create({
        data: { campaignId, contactId: contact.id, eventType: "BOUNCED", metadata: { error: String(err) } },
      });
    }
  }

  await prisma.campaign.update({ where: { id: campaignId }, data: { status: "SENT", sentAt: new Date() } });
  await prisma.campaignStats.update({
    where: { campaignId },
    data: { totalSent: contacts.length, delivered: sent, bounced: contacts.length - sent },
  });
}

function replaceMergeTags(content: string, contact: any, campaignId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  return content
    .replace(/\{\{first_name\}\}/g, contact.firstName ?? "")
    .replace(/\{\{last_name\}\}/g, contact.lastName ?? "")
    .replace(/\{\{email\}\}/g, contact.email)
    .replace(/\{\{company\}\}/g, contact.company ?? "")
    .replace(/\{\{unsubscribe_url\}\}/g, `${appUrl}/unsubscribe?c=${contact.id}&cid=${campaignId}`);
}
