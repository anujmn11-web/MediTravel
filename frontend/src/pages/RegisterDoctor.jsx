import SectionHeader from '../components/SectionHeader';

function RegisterDoctor() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg)' }} className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Register Doctor" title="Join the MediTravel AI network." description="List your practice and connect with travelers looking for trusted care." />
        <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="mt-10 rounded-[2rem] border p-8 shadow-sm">
          <form className="grid gap-5 lg:grid-cols-2">
            <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="Full name" />
            <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="Specialty" />
            <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="City" />
            <input style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)]" placeholder="Clinic / Hospital" />
            <textarea rows="5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }} className="rounded-2xl border px-4 py-3 text-sm outline-none focus:border-[var(--color-accent)] lg:col-span-2" placeholder="Tell travelers about your experience and availability" />
            <button style={{ backgroundColor: 'var(--color-accent)' }} className="rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 lg:col-span-2">Submit registration</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default RegisterDoctor;
