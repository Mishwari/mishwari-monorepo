import React from 'react';

const TransactionSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex justify-between items-center rounded-md bg-white w-full h-14 py-2 px-4">
      <div className="flex gap-5 justify-between items-center">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col justify-between">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-16"></div>
    </div>
  );
};

export default TransactionSkeleton;
