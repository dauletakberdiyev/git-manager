export default function DemoSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1100px] mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">See it in action</h2>
        <p className="mt-3 text-[#9CA3AF]">From idea to done in seconds</p>

        <div className="mt-10 mx-auto max-w-2xl bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1F2937]">
            <span className="w-3 h-3 rounded-full bg-[#374151]" />
            <span className="w-3 h-3 rounded-full bg-[#374151]" />
            <span className="w-3 h-3 rounded-full bg-[#374151]" />
          </div>
          <div className="flex items-center justify-center h-56 text-[#4B5563] text-sm">
            Demo coming soon
          </div>
        </div>
      </div>
    </section>
  );
}
