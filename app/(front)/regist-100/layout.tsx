'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import '@/app/autocomplete.css';

export default function Regist100Layout({
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

    // No need to load external CSS anymore - we have our own
    console.log('✅ Using custom autocomplete CSS');

    return () => {
      // Cleanup if needed
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

      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
