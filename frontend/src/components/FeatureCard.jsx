function FeatureCard({ title, description, icon: Icon, accent }) {
  return (
    <article style={{
      backgroundColor: 'var(--color-surface)',
      borderColor: 'var(--color-border)',
    }} className="group rounded-3xl border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div style={{ backgroundColor: accent || 'var(--color-accent)' }} className="inline-flex rounded-2xl p-3 text-white">
        <Icon className="h-6 w-6" />
      </div>
      <h3 style={{ color: 'var(--color-text)' }} className="mt-6 text-xl font-semibold">{title}</h3>
      <p style={{ color: 'var(--color-text-secondary)' }} className="mt-3 text-sm leading-7">{description}</p>
    </article>
  );
}

export default FeatureCard;
