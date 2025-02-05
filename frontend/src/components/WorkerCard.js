import React from 'react';
import { User, Circle } from 'lucide-react';

const statusColors = {
  active: 'bg-green-500',
  inactive: 'bg-gray-500',
  busy: 'bg-yellow-500'
};

const statusText = {
  active: 'Active',
  inactive: 'Inactive',
  busy: 'Busy'
};

const WorkerCard = ({ worker }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 p-3 rounded-full">
          <User className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{worker.name}</h3>
          <div className="flex items-center mt-2">
            <Circle className={`w-3 h-3 ${statusColors[worker.status]} mr-2`} fill="currentColor" />
            <span className="text-sm text-gray-600">{statusText[worker.status]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
