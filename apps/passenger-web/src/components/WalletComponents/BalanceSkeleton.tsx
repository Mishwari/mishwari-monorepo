import React from 'react';

const BalanceSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col gap-2">
      {/* <div className="h-6 bg-gray-300 rounded w-24"></div> */}
      <div className="flex gap-2 h-max">
        <div className="h-[60px] bg-gray-300 rounded w-28"></div>
        <div className="h-6 bg-gray-300 rounded w-12 self-end"></div>
      </div>
    </div>
  );
};

export default BalanceSkeleton;
