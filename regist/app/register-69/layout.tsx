'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function Register69Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load CSS dynamically
  useEffect(() => {
    if (!mounted) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dist/jquery.Thailand.min.css';
    link.id = 'thailand-css';
    
    if (!document.getElementById('thailand-css')) {
      document.head.appendChild(link);
    }

    return () => {
      const existingLink = document.getElementById('thailand-css');
      if (existingLink) {
        document.head.removeChild(existingLink);
      }
    };
  }, [mounted]);

  return (
    <>
      {/* Load all scripts with afterInteractive and proper sequencing */}
      <Script
        id="jquery-lib"
        src="https://code.jquery.com/jquery-3.2.1.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ jQuery loaded');
          console.log('jQuery version:', (window as any).jQuery?.fn?.jquery);
        }}
        onError={(e) => console.error('❌ jQuery failed to load', e)}
      />
      
      <Script
        id="jql-lib"
        src="https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dependencies/JQL.min.js"
        strategy="afterInteractive"
        onLoad={() => console.log('✅ JQL loaded')}
        onError={(e) => console.error('❌ JQL failed to load', e)}
      />
      
      <Script
        id="typeahead-lib"
        src="https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dependencies/typeahead.bundle.js"
        strategy="afterInteractive"
        onLoad={() => console.log('✅ Typeahead loaded')}
        onError={(e) => console.error('❌ Typeahead failed to load', e)}
      />
      
      <Script
        id="thailand-lib"
        src="https://earthchie.github.io/jquery.Thailand.js/jquery.Thailand.js/dist/jquery.Thailand.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('✅ jquery.Thailand.js loaded');
          console.log('jQuery.Thailand available:', typeof (window as any).jQuery?.Thailand);
        }}
        onError={(e) => console.error('❌ jquery.Thailand.js failed to load', e)}
      />

      {children}
    </>
  );
}
