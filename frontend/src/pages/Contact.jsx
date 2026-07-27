import SectionHeader from '../components/SectionHeader';

function Contact() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow="Contact" title="Reach the MediTravel AI support team." description="We are here to help with healthcare guidance, partnership questions, and project support." />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <form className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Your name" />
              <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500" placeholder="Email address" />
              <input className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500 sm:col-span-2" placeholder="Subject" />
              <textarea rows="5" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-teal-500 sm:col-span-2" placeholder="How can we help?" />
            </div>
            <button className="mt-6 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-500">Send Message</button>
          </form>
          <div className="rounded-[2rem] border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
            <h3 className="text-xl font-semibold">Support details</h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-300">
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
