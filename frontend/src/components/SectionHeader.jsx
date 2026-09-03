function SectionHeader({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p style={{ color: 'var(--color-accent)' }} className="text-sm font-semibold uppercase tracking-[0.25em]">{eyebrow}</p>
      <h2 style={{ color: 'var(--color-text)' }} className="mt-4 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p style={{ color: 'var(--color-text-secondary)' }} className="mt-4 text-lg leading-8">{description}</p>
    </div>
  );
}

export default SectionHeader;
