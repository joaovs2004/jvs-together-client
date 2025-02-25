export default function Error() {
  return (
    <div className="flex min-h-screen min-w-screen bg-zinc-950 text-white p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Error</h1>
        <h2 className="text-2xl font-semibold mb-6 text-gray-300">You must provide the room ID after the URL</h2>
        <p className="text-gray-400 leading-relaxed">Example: {window.location.protocol}//{window.location.host}/room1</p>
      </div>
    </div>
  );
}
