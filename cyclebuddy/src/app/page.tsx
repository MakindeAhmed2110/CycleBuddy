'use client'; // This is a client component

import React from 'react';
import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('./landing-css/page'), {
    ssr: false,
});

// eslint-disable-next-line import/no-default-export
export default function Page() {
    return <LandingPage />;
}
