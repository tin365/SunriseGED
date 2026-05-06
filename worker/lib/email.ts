import { Resend } from 'resend';

type Lang = 'en' | 'my' | 'th';

interface EmailEnv {
  RESEND_API_KEY: string;
  SITE_URL: string;
  ADMIN_EMAIL?: string;
}

const copy = {
  en: {
    receivedSubject: 'Your Sunrise GED Application Has Been Received',
    receivedTitle: 'Application received',
    receivedBody: 'Thank you for applying to Sunrise GED. Our team will review your application and contact you within 3-5 business days.',
    contactSubject: 'We received your message - Sunrise GED',
    contactTitle: 'We received your message',
    contactBody: 'Thank you for contacting Sunrise GED. We usually reply within 2-3 business days.'
  },
  my: {
    receivedSubject: 'သင်၏ Sunrise GED လျှောက်လွှာကို လက်ခံရရှိပါပြီ',
    receivedTitle: 'လျှောက်လွှာ လက်ခံရရှိပါပြီ',
    receivedBody: 'Sunrise GED သို့ လျှောက်ထားသည့်အတွက် ကျေးဇူးတင်ပါသည်။ ကျွန်ုပ်တို့အဖွဲ့သည် သင်၏လျှောက်လွှာကို စိစစ်ပြီး ၃ ရက်မှ ၅ ရက်အတွင်း ဆက်သွယ်ပါမည်။',
    contactSubject: 'သင်၏စာကို လက်ခံရရှိပါပြီ - Sunrise GED',
    contactTitle: 'သင်၏စာကို လက်ခံရရှိပါပြီ',
    contactBody: 'Sunrise GED ကို ဆက်သွယ်သည့်အတွက် ကျေးဇူးတင်ပါသည်။ ပုံမှန်အားဖြင့် ၂ ရက်မှ ၃ ရက်အတွင်း ပြန်လည်ဖြေကြားပါမည်။'
  },
  th: {
    receivedSubject: 'เราได้รับใบสมัคร Sunrise GED ของคุณแล้ว',
    receivedTitle: 'ได้รับใบสมัครแล้ว',
    receivedBody: 'ขอบคุณที่สมัคร Sunrise GED ทีมงานจะตรวจสอบใบสมัครและติดต่อกลับภายใน 3-5 วันทำการ',
    contactSubject: 'เราได้รับข้อความของคุณแล้ว - Sunrise GED',
    contactTitle: 'เราได้รับข้อความของคุณแล้ว',
    contactBody: 'ขอบคุณที่ติดต่อ Sunrise GED โดยปกติเราจะตอบกลับภายใน 2-3 วันทำการ'
  }
} satisfies Record<Lang, Record<string, string>>;

function layout(env: EmailEnv, title: string, body: string) {
  const logo = `${env.SITE_URL}/logo.png`;
  return `<!doctype html><html><body style="margin:0;background:#0A0A0A;color:#fff;font-family:Inter,Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0A0A0A;padding:28px 0">
      <tr><td align="center">
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="width:min(620px,94vw);background:#1A1A1A;border:1px solid #333;border-radius:12px;overflow:hidden">
          <tr><td style="padding:24px 28px;border-bottom:4px solid #F5B800"><img src="${logo}" width="72" height="72" alt="Sunrise GED" style="display:block;border-radius:50%"></td></tr>
          <tr><td style="padding:28px"><h1 style="margin:0 0 16px;color:#F5B800;font-size:28px">${title}</h1><div style="font-size:16px;line-height:1.7">${body}</div></td></tr>
          <tr><td style="padding:18px 28px;color:#bbb;border-top:1px solid #333;font-size:13px">Sunrise Trauma Healing Education, Mae Sot, Thailand</td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}

export async function sendEmail(env: EmailEnv, args: { to: string | string[]; subject: string; html: string }) {
  if (!env.RESEND_API_KEY) return { skipped: true };
  const resend = new Resend(env.RESEND_API_KEY);
  return resend.emails.send({
    from: 'Sunrise GED <noreply@sunrisegeded.org>',
    ...args
  });
}

export function enrollmentReceivedTemplate(env: EmailEnv, language: Lang, enrollment: Record<string, unknown>) {
  const t = copy[language] ?? copy.en;
  const summary = `<p>${t.receivedBody}</p><p><strong>Name:</strong> ${enrollment.full_name ?? ''}<br><strong>Submitted:</strong> ${new Date().toLocaleDateString('en-GB')}</p><p>Messenger: facebook.com/sunrisetraumahealingeducation</p>`;
  return { subject: t.receivedSubject, html: layout(env, t.receivedTitle, summary) };
}

export function newEnrollmentAlertTemplate(env: EmailEnv, enrollment: Record<string, unknown>) {
  const name = String(enrollment.full_name ?? 'Student');
  const details = Object.entries(enrollment).map(([key, value]) => `<tr><td style="padding:6px 10px;color:#F5B800">${key}</td><td style="padding:6px 10px">${String(value ?? '')}</td></tr>`).join('');
  return {
    subject: `New Enrollment: ${name} - Action Required`,
    html: layout(env, 'New enrollment submitted', `<p>Review this application in the admin panel.</p><table>${details}</table><p><a href="${env.SITE_URL}/admin/enrollments" style="color:#F5B800">Open enrollments</a></p>`)
  };
}

export function statusUpdateTemplate(env: EmailEnv, status: string) {
  const body = `<p>Your Sunrise GED application status has been updated to <strong>${status}</strong>.</p><p>Please contact the Sunrise team if you have questions about next steps.</p>`;
  return { subject: 'Update on Your Sunrise GED Application', html: layout(env, 'Application update', body) };
}

export function contactConfirmationTemplate(env: EmailEnv, language: Lang) {
  const t = copy[language] ?? copy.en;
  return { subject: t.contactSubject, html: layout(env, t.contactTitle, `<p>${t.contactBody}</p><p>Messenger: facebook.com/sunrisetraumahealingeducation<br>Line: add the official Line account shown on the website.</p>`) };
}
