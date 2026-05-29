import { useMemo, useState } from 'react';

type Dict = Record<string, any>;

export default function EnrollmentForm({ dict, locale }: { dict: Dict; locale: 'en' | 'my' | 'th' }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');
  const f = dict.enroll.form;
  const errors = useMemo(
    () => ({
      en: { required: 'Please complete all required fields.', reason: 'Please write at least 50 characters.' },
      my: { required: 'လိုအပ်သော အချက်အလက်များကို ဖြည့်ပါ။', reason: 'အနည်းဆုံး စာလုံး ၅၀ ရေးပါ။' },
      th: { required: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', reason: 'กรุณาเขียนอย่างน้อย 50 ตัวอักษร' }
    }),
    []
  );

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
      <div id="enrollment-form" className="rounded-card border border-sun/40 bg-surface p-7 shadow-warm sm:p-9">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-dawn text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m5 12 5 5 9-11" />
          </svg>
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold text-ink">{f.successTitle}</h2>
        <p className="mt-4 leading-relaxed text-ink-soft">{f.successMsg}</p>
        <ol className="mt-6 space-y-3 text-sm text-ink-soft">
          <li>1. The admissions team reviews your application.</li>
          <li>2. We contact your family for a short conversation.</li>
          <li>3. Accepted students receive orientation details.</li>
        </ol>
      </div>
    );
  }

  return (
    <form id="enrollment-form" onSubmit={submit} className="rounded-card border border-line bg-surface p-6 shadow-warm sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={f.fullName} name="full_name" required />
        <Field label={f.burmeseName} name="burmese_name" />
        <Field label={f.dob} name="date_of_birth" type="date" required />
        <fieldset className="rounded-xl border border-line-strong p-3.5">
          <legend className="px-1 text-sm font-semibold text-ink-soft">{f.gender}</legend>
          <div className="flex flex-wrap gap-4 pt-1 text-sm text-ink-soft">
            {(['male', 'female', 'other'] as const).map((value) => (
              <label key={value} className="flex items-center gap-2">
                <input required name="gender" type="radio" value={value} className="accent-ember" />
                {f[value]}
              </label>
            ))}
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
          <span className="field-label">{f.address}</span>
          <textarea name="address" required rows={3} className="input resize-y" />
        </label>
        <label className="sm:col-span-2">
          <span className="field-label">{f.reason}</span>
          <textarea
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            minLength={50}
            rows={5}
            className="input resize-y"
          />
          <span className="mt-1.5 block text-xs text-ink-muted">{reason.trim().length}/50</span>
        </label>
      </div>
      {error && <p className="mt-5 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-deep">{error}</p>}
      <button disabled={loading} className="btn btn-primary mt-7 w-full disabled:cursor-not-allowed disabled:opacity-70">
        {loading ? f.submitting : f.submit}
      </button>
    </form>
  );
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label>
      <span className="field-label">
        {label}
        {required ? ' *' : ''}
      </span>
      <input name={name} type={type} required={required} className="input" />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select name={name} className="input cursor-pointer">
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
