import Link from 'next/link';

export default function TaskPage() {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/tasks" 
          className="text-blue-500 hover:underline"
        >
          Back to Tasks
        </Link>
        <h1 className="text-3xl font-bold">Task Details</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="border rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Test</h2>
          <p className="text-gray-600">
            Task details
          </p>
        </div>
      </div>
    </div>
  );
} 