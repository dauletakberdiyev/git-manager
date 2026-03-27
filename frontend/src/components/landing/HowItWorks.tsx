const steps = [
  'Create a task',
  'A branch is created automatically',
  'Write your code',
  'Open & merge a PR',
  'Task is marked as done',
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB]">How it works</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-0">
          {steps.map((step, i) => (
            <div key={i} className="flex sm:flex-col items-center gap-4 sm:gap-2 flex-1">
              <div className="flex flex-col sm:flex-row items-center sm:w-full">
                <div className="w-9 h-9 shrink-0 rounded-full bg-[#111827] border border-[#6366F1] flex items-center justify-center text-[#6366F1] font-bold text-sm">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:block flex-1 h-px bg-[#1F2937] mx-1" />
                )}
                {i < steps.length - 1 && (
                  <div className="sm:hidden w-px h-6 bg-[#1F2937] ml-[17px]" />
                )}
              </div>
              <p className="text-[#9CA3AF] text-sm text-center sm:text-center max-w-[110px] leading-snug pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[#4B5563] text-sm">
          No manual updates. No context switching.
        </p>
      </div>
    </section>
  );
}
