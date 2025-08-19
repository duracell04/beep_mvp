// Header.tsx – shared header
import React from 'react';
import BeepLogo from './BeepLogo';

export default function Header() {
  return (
    <header className="flex items-center p-4">
      <a href="/" className="inline-flex items-center">
        <BeepLogo withWordmark />
      </a>
    </header>
  );
}
