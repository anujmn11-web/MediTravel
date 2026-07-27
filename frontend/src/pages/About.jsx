import SectionHeader from '../components/SectionHeader';

function About() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="About" title="A thoughtful digital healthcare companion for modern travelers." description="MediTravel AI connects people to reliable medical guidance before, during, and after travel." />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Our mission</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">We aim to make healthcare discovery simple, fast, and trustworthy when people are away from home. By unifying doctor listings, hospitals, and emergency information, we reduce uncertainty during critical moments.</p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">What makes us different</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">The platform is designed with care, clarity, and user confidence in mind. It focuses on a polished experience for patients, families, and travel planners alike.</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default About;
