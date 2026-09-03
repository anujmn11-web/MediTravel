function SearchBar() {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-3 backdrop-blur sm:flex-row">
      <input type="text" placeholder="Search your destination or symptoms" className="flex-1 rounded-full border border-white/20 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none ring-0" />
      <button style={{ backgroundColor: 'var(--color-accent)' }} className="rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">Start Search</button>
    </div>
  );
}

export default SearchBar;
