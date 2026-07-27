function SearchBar() {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/10 p-3 backdrop-blur sm:flex-row">
      <input type="text" placeholder="Search your destination or symptoms" className="flex-1 rounded-full border border-white/20 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none ring-0" />
      <button className="rounded-full bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400">Start Search</button>
    </div>
  );
}

export default SearchBar;
