import Link from 'next/link';


export default function CreateTaskPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/tasks" 
          className="text-blue-500 hover:underline"
        >
          Back
        </Link>
        <h1 className="text-3xl font-bold text-[#212529]">Create New Task</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="border rounded-lg p-6 shadow-md">
          <p className="text-center text-gray-600">
            Task creation form 
          </p>
        </div>
      </div>
    </div>
  );
} 