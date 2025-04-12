"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        color: '#333',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚫 Unauthorized</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          You do not have permission to access this page.
        </p>
        <Link
         style={{
          background: '#0070f3',
          padding: '0.8rem 1.5rem',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none'
        }} href="/">
          Go Back Home
        </Link>
      </div>
    );
  }
  