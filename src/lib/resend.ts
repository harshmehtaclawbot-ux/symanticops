import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCampaignEmail({
  to,
  fromName,
  fromEmail,
  subject,
  html,
  text,
  replyTo,
}: {
  to: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  return resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
    text,
    replyTo,
  });
}
