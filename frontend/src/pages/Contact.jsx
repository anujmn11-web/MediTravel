import SectionHeader from '../components/SectionHeader';

function Contact() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg)' }} className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Contact" title="Reach the MediTravel AI support team." description="We are here to help with healthcare guidance, partnership questions, and project support." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <form style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="rounded-[2rem] border p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="Your name" />
              <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="Email address" />
              <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] sm:col-span-2" placeholder="Subject" />
              <textarea rows="5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] sm:col-span-2" placeholder="How can we help?" />
            </div>
            <button style={{ backgroundColor: 'var(--color-accent)' }} className="mt-6 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90">Send Message</button>
          </form>
          <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }} className="rounded-[2rem] border p-8 shadow-sm">
            <h3 style={{ color: 'var(--color-text)' }} className="text-xl font-semibold">Support details</h3>
            <ul style={{ color: 'var(--color-text-secondary)' }} className="mt-6 space-y-4 text-sm">
              <li>📧 support@meditravel.ai</li>
              <li>📞 +91 1800 200 3000</li>
              <li>📍 Mumbai, India</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
