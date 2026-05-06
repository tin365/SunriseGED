import { useMemo, useState } from 'react';

type Dict = Record<string, any>;

export default function EnrollmentForm({ dict, locale }: { dict: Dict; locale: 'en' | 'my' | 'th' }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const f = dict.enroll.form;
  const errors = useMemo(() => ({
    en: { required: 'Please complete all required fields.', reason: 'Please write at least 50 characters.' },
    my: { required: 'လိုအပ်သော အချက်အလက်များကို ဖြည့်ပါ။', reason: 'အနည်းဆုံး စာလုံး ၅၀ ရေးပါ။' },
    th: { required: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', reason: 'กรุณาเขียนอย่างน้อย 50 ตัวอักษร' }
  }), []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setError(errors[locale].required);
      form.reportValidity();
      return;
    }
    if (reason.trim().length < 50) {
      setError(errors[locale].reason);
      return;
    }
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, language: locale })
      });
      if (!res.ok) throw new Error('submit failed');
      setSuccess(true);
      setTimeout(() => document.getElementById('enrollment-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
    } catch {
      setError(f.errorMsg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div id="enrollment-form" className="rounded-2xl border border-gold/40 bg-site-dark p-6 sm:p-8">
        <h2 className="font-heading text-3xl font-bold text-gold">{f.successTitle}</h2>
        <p className="mt-4 leading-7 text-white/80">{f.successMsg}</p>
        <ol className="mt-6 space-y-3 text-sm text-white/70">
          <li>1. The admissions team reviews your application.</li>
          <li>2. We contact your family for a short conversation.</li>
          <li>3. Accepted students receive orientation details.</li>
        </ol>
      </div>
    );
  }

  return (
    <form id="enrollment-form" onSubmit={submit} className="rounded-2xl border border-white/10 bg-site-dark p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f.fullName} name="full_name" required />
        <Field label={f.burmeseName} name="burmese_name" />
        <Field label={f.dob} name="date_of_birth" type="date" required />
        <fieldset className="rounded-md border border-white/10 p-3">
          <legend className="px-1 text-sm font-semibold text-gold">{f.gender}</legend>
          <div className="flex flex-wrap gap-4 pt-2 text-sm">
            {(['male', 'female', 'other'] as const).map((value) => <label key={value} className="flex items-center gap-2"><input required name="gender" type="radio" value={value} />{f[value]}</label>)}
          </div>
        </fieldset>
        <Field label={f.phone} name="phone" type="tel" />
        <Field label="Email" name="email" type="email" />
        <Field label={f.parentName} name="parent_name" required />
        <Field label={f.parentPhone} name="parent_phone" type="tel" required />
        <Select label={f.prevEducation} name="previous_education" options={['None', 'Primary', 'Middle School', 'High School Incomplete']} />
        <Select label={f.englishLevel} name="english_level" options={['None', 'Basic', 'Intermediate', 'Advanced']} />
        <Select label="How did you hear about us?" name="heard_from" options={['Friend or family', 'Facebook', 'Community organization', 'Teacher', 'Other']} />
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-gold">{f.address}</span>
          <textarea name="address" required rows={3} className="w-full rounded-md border border-white/10 bg-site-black px-3 py-3 text-white outline-none focus:border-gold" />
        </label>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-gold">{f.reason}</span>
          <textarea name="reason" value={reason} onChange={(e) => setReason(e.target.value)} required minLength={50} rows={5} className="w-full rounded-md border border-white/10 bg-site-black px-3 py-3 text-white outline-none focus:border-gold" />
        </label>
      </div>
      {error && <p className="mt-5 rounded-md border border-orange/60 bg-orange/10 px-4 py-3 text-sm text-orange-light">{error}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-md bg-gold px-5 py-3 font-bold text-site-black transition hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? f.submitting : f.submit}
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <label><span className="mb-2 block text-sm font-semibold text-gold">{label}{required ? ' *' : ''}</span><input name={name} type={type} required={required} className="w-full rounded-md border border-white/10 bg-site-black px-3 py-3 text-white outline-none focus:border-gold" /></label>;
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <label><span className="mb-2 block text-sm font-semibold text-gold">{label}</span><select name={name} className="w-full rounded-md border border-white/10 bg-site-black px-3 py-3 text-white outline-none focus:border-gold"><option value="">-</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
