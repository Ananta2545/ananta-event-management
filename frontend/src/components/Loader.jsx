import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in">
    <div className="relative">
      <div className="w-10 h-10 border-[2.5px] border-gray-100 rounded-full" />
      <div className="absolute inset-0 w-10 h-10 border-[2.5px] border-transparent border-t-indigo-500 rounded-full animate-spin" />
    </div>
    <p className="text-[13px] text-gray-400 font-medium">{text}</p>
  </div>
);

export default Loader;
