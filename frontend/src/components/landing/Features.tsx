const features = [
  'Auto branch creation from tasks',
  'PR → task auto-complete',
  'Simple kanban per repository',
  'AI task breakdown',
];

export default function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB] text-center mb-10">
          What you get
        </h2>
        <ul className="max-w-sm mx-auto space-y-4">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-[#E5E7EB]">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#6366F1] shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
