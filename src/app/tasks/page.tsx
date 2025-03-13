import Link from 'next/link';

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-semibold text-[#212529]">დავალებების გვერდი</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-[#212529]">Task cards</h2>
          <p className="mt-2 text-[#212529]">Task cards will be displayed here</p>
        </div>
      </div>
    </div>
  );
} 