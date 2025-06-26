import React from 'react';

export default function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-500 text-white p-2 rounded w-full text-center">
      {message}
    </div>
  );
}
