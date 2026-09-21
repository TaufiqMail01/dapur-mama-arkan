import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-sm text-slate-500">
      <p>© {new Date().getFullYear()} Dapur Mama Arkan. All rights reserved. • Fleksibel & Mudah Diedit.</p>
    </footer>
  );
}