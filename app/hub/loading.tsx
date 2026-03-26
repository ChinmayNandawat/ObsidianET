export default function HubLoading() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-zinc-800/60 animate-pulse h-48 w-full"
        />
      ))}
    </div>
  );
}
