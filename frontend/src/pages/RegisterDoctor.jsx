import SectionHeader from '../components/SectionHeader';

function RegisterDoctor() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Register Doctor" title="Join the MediTravel AI network." description="List your practice and connect with travelers looking for trusted care." />
        <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <form className="grid gap-5 lg:grid-cols-2">
            <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Full name" />
            <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Specialty" />
            <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="City" />
            <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Clinic / Hospital" />
            <textarea rows="5" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500 lg:col-span-2" placeholder="Tell travelers about your experience and availability" />
            <button className="rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 lg:col-span-2">Submit registration</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default RegisterDoctor;
