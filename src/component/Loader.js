import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2 h-20">
      <div className="w-5 h-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-5 h-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-5 h-5 bg-white rounded-full animate-bounce"></div>
    </div>
  );
};

export default Loader;
