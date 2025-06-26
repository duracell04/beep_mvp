import React from 'react';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
