function FeatureCard({ title, description, icon: Icon, accent }) {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={`inline-flex rounded-2xl p-3 text-white ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </article>
  );
}

export default FeatureCard;
