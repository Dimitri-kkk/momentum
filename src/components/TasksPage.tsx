"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

type Department = { id: number; name: string };
type Priority = { id: number; name: string };
type Employee = { id: number; name: string; image?: string };
type Task = {
  id: number;
  name: string;
  description: string;
  due_date: string;
  department: {
    id: number;
    name: string;
  };
  employee: {
    id: number;
    name: string;
    surname: string;
    avatar?: string;
    department: {
      id: number;
      name: string;
    };
  };
  priority: {
    id: number;
    name: string;
    icon: string;
  };
  status: {
    id: number;
    name: string;
  };
  total_comments: number;
};

type Status = {
  id: number;
  name: string;
};

export default function TasksPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [activeStatusTab, setActiveStatusTab] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [depsRes, prioritiesRes, employeesRes, tasksRes, statusesRes] = await Promise.all([
          fetch('https://momentum.redberryinternship.ge/api/departments', {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          }),
          fetch('https://momentum.redberryinternship.ge/api/priorities', {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          }),
          fetch('https://momentum.redberryinternship.ge/api/employees', {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          }),
          fetch('https://momentum.redberryinternship.ge/api/tasks', {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          }),
          fetch('https://momentum.redberryinternship.ge/api/statuses', {
            headers: { Authorization: `Bearer ${API_TOKEN}` }
          })
        ]);
        
        if (!depsRes.ok || !prioritiesRes.ok || !employeesRes.ok || !tasksRes.ok || !statusesRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const [depsData, prioritiesData, employeesData, tasksData, statusesData] = await Promise.all([
          depsRes.json(),
          prioritiesRes.json(),
          employeesRes.json(),
          tasksRes.json(),
          statusesRes.json()
        ]);
        
        console.log('Priorities from API:', prioritiesData);
        console.log('Statuses from API:', statusesData);
        
        const formattedPriorities = Array.isArray(prioritiesData) 
          ? prioritiesData 
          : prioritiesData.data || [];
          
        const formattedStatuses = Array.isArray(statusesData) 
          ? statusesData 
          : statusesData.data || [];
        
        setDepartments(depsData);
        setPriorities(formattedPriorities);
        setEmployees(employeesData);
        setTasks(tasksData);
        setStatuses(formattedStatuses);
        setFilteredTasks(tasksData); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...tasks];
    
    // Filter by departments if any selected
    if (selectedDepartments.length > 0) {
      result = result.filter(task => {
        const taskDeptId = Number(task.department.id);
        return selectedDepartments.some(deptId => Number(deptId) === taskDeptId);
      });
    }
    
    // Filter by priorities if any selected
    if (selectedPriorities.length > 0) {
      result = result.filter(task => {
        const taskPriorityId = Number(task.priority.id);
        return selectedPriorities.some(priorityId => Number(priorityId) === taskPriorityId);
      });
    }
    
    // Filter by employee if selected
    if (selectedEmployee !== null) {
      result = result.filter(task => {
        if (typeof task.employee.id === 'undefined') {
          return false;
        }
        
        const taskEmployeeId = typeof task.employee.id === 'object' 
          ? Number(task.employee.id) 
          : Number(task.employee.id);
          
        return Number(selectedEmployee) === taskEmployeeId;
      });
    }
    
    // Filter by status tab if selected
    if (activeStatusTab !== null) {
      result = result.filter(task => 
        Number(task.status.id) === activeStatusTab
      );
    }
    
    setFilteredTasks(result);
  }, [tasks, selectedDepartments, selectedPriorities, selectedEmployee, activeStatusTab]);

  // Helper function to get tasks by status
  const getTasksByStatus = (statusId: number) => {
    return filteredTasks.filter(task => task.status.id === statusId);
  };

  // Helper function to get predefined button styles for card types based on status
  const getStatusButtonStyle = (statusId: number) => {
    switch (statusId) {
      case 1: 
        return "bg-[#F7BC30] text-white rounded-md";
      case 2: 
        return "bg-[#FB5607] text-white rounded-md";
      case 3: 
        return "bg-[#FF006E] text-white rounded-md";
      case 4: 
        return "bg-[#3A86FF] text-white rounded-md";
    }
  };

  // Handle status tab selection
  const handleStatusTabClick = (statusId: number) => {
    setActiveStatusTab(activeStatusTab === statusId ? null : statusId);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-[#212529]">დავალებების გვერდი</h1>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-6 text-black">
            <MultiSelectDropdown
              options={departments}
              placeholder="დეპარტამენტი"
              selectedIds={selectedDepartments}
              onChange={setSelectedDepartments}
              activeColor="purple"
            />
            
            <MultiSelectDropdown
              options={priorities}
              placeholder="პრიორიტეტი"
              selectedIds={selectedPriorities}
              onChange={setSelectedPriorities}
              activeColor="purple"
            />
            
            <SingleSelectDropdown
              options={employees}
              placeholder="თანამშრომელი"
              selectedId={selectedEmployee}
              onChange={setSelectedEmployee}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {statuses.map(status => (
              <button 
                key={status.id}
                className={`text-center py-3 font-medium ${getStatusButtonStyle(status.id)}`}
                onClick={() => handleStatusTabClick(status.id)}
              >
                {status.name}
              </button>
            ))}
          </div>
          
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {statuses.map(status => {
                const isActive = activeStatusTab === status.id || activeStatusTab === null;
                
                return (
                  <div 
                    key={status.id} 
                    className={`space-y-4 ${!isActive ? 'opacity-50' : ''}`}
                  >
                 
                    {isActive && (
                      <>
                        {filteredTasks
                          .filter(task => task.status.id === status.id)
                          .map(task => (
                            <TaskCard key={task.id} task={task} />
                          ))
                        }
                        {filteredTasks.filter(task => task.status.id === status.id).length === 0 && (
                          <p className="text-gray-500 text-sm">No tasks in this category</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MultiSelectDropdown({ 
  options, 
  placeholder, 
  selectedIds, 
  onChange,
  activeColor
}: { 
  options: { id: number; name: string }[];
  placeholder: string;
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  activeColor: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelection = (id: number) => {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter(item => item !== id)
        : [...selectedIds, id]
    );
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const selectedCount = selectedIds.length;

  return (
    <div className="relative w-full md:w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 border ${isOpen ? 'border-purple-500' : 'border-pink-200'} rounded-lg bg-white`}
        type="button"
      >
        <div className="flex items-center">
          <span className="text-gray-700">{placeholder}</span>
          {selectedCount > 0 && (
            <span className="ml-2 bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.id}
              className={`cursor-pointer px-4 py-2 flex items-center space-x-2 ${
                selectedIds.includes(option.id) ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
              }`}
              onClick={() => toggleSelection(option.id)}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(option.id)}
                onChange={() => toggleSelection(option.id)}
                className="w-4 h-4 accent-purple-600"
              />
              <span>{option.name}</span>
            </div>
          ))}
          
          <div className="p-2 flex justify-end border-t">
            <button 
              className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm"
              onClick={handleApply}
            >
              არჩევა
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SingleSelectDropdown({ 
  options, 
  placeholder,   
  selectedId, 
  onChange,
}: { 
  options: { id: number; name: string; image?: string }[];
  placeholder: string;
  selectedId: number | null;
  onChange: (id: number | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: number) => {
    onChange(id === selectedId ? null : id);
  };

  const handleApply = () => {
    setIsOpen(false);
  };

  const hasSelection = selectedId !== null;

  return (
    <div className="relative w-full md:w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 border rounded-lg bg-white shadow-sm"
        type="button"
      >
        <div className="flex items-center">
          <span>{placeholder}</span>
          {hasSelection && (
            <span className="ml-2 bg-purple-100 text-purple-600 text-xs px-2 py-0.5 rounded-full">
              1
            </span>
          )}
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.id}
              className={`cursor-pointer px-4 py-2 flex items-center space-x-2 ${
                selectedId === option.id ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option.id)}
            >
              <input
                type="radio"
                checked={selectedId === option.id}
                onChange={() => handleSelect(option.id)}
                className="w-4 h-4 accent-purple-600"
              />
              
              <div className="flex items-center gap-2">
                {option.image && (
                  <img 
                    src={option.image} 
                    alt={option.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{option.name}</span>
              </div>
            </div>
          ))}
          
          <div className="p-2 flex justify-end border-t">
            <button 
              className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm"
              onClick={handleApply}
            >
              არჩევა
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  // Helper function to get predefined styles based on priorities
  const getPriorityStyle = (priorityId: number) => {
    switch (priorityId) {
      case 1: 
        return 'bg-white text-[#08A508] border border-[#08A508]';
      case 2: 
        return 'bg-white text-[#FFBE0B] border border-[#FFBE0B]';
      case 3: 
        return 'bg-white text-[#FA4D4D] border border-[#FA4D4D]';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()} აპრ, ${date.getFullYear()}`;
  };
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-1 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${getPriorityStyle(task.priority.id)}`}>
            {task.priority.icon && (
              <img 
                src={task.priority.icon} 
                alt=""
                className="w-3 h-3 mr-1" 
              />
            )}
            {task.priority.name}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {task.due_date ? formatDate(task.due_date) : ''}
        </span>
      </div>
      
      <h3 className="font-semibold text-sm mb-1 text-gray-900">{task.name}</h3>
      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {task.employee?.avatar ? (
            <img 
              src={task.employee.avatar} 
              alt={`${task.employee.name} ${task.employee.surname}`} 
              className="w-7 h-7 rounded-full object-cover border border-gray-200" 
            />
          ) : (
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300">
              {task.employee?.name.charAt(0) || '?'}
            </div>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <span className="mr-1">
            {task.total_comments}
          </span>
            <Image alt="comments" src="/comments.png" width="22" height="22" />
        </div>
      </div>
    </div>
  );
}
