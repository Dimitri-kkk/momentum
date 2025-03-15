'use client';

import TasksPage from '@/components/TasksPage';


// API Token - in a real app, this would be stored securely
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export default function Tasks() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <TasksPage />
    </main>
  );
} 