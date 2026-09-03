import SectionHeader from '../components/SectionHeader';

function About() {
  return (
    <main style={{ backgroundColor: 'var(--color-bg)' }} className="min-h-screen px-4 py-20 sm:px-6 lg:px-8 transition-colors">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="About" title="A thoughtful digital healthcare companion for modern travelers." description="MediTravel AI connects people to reliable medical guidance before, during, and after travel." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="rounded-[2rem] border p-8 shadow-sm">
            <h3 style={{ color: 'var(--color-text)' }} className="text-xl font-semibold">Our mission</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 text-sm leading-7">We aim to make healthcare discovery simple, fast, and trustworthy when people are away from home. By unifying doctor listings, hospitals, and emergency information, we reduce uncertainty during critical moments.</p>
          </div>
          <div style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }} className="rounded-[2rem] border p-8 shadow-sm">
            <h3 style={{ color: 'var(--color-text)' }} className="text-xl font-semibold">What makes us different</h3>
            <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 text-sm leading-7">The platform is designed with care, clarity, and user confidence in mind. It focuses on a polished experience for patients, families, and travel planners alike.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
