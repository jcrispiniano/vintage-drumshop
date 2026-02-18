'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redireciona para o site HTML completo
    window.location.href = '/site/index.html';
  }, []);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C1810 0%, #8B4513 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        background: 'rgba(255,255,255,0.1)',
        padding: '3rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          margin: '0 0 1rem 0',
          fontWeight: 'bold'
        }}>
          🥁 Vintage Drum Shop
        </h1>
        
        <p style={{
          fontSize: '1.3rem',
          margin: '1rem 0',
          color: 'rgba(255,255,255,0.9)'
        }}>
          Carregando...
        </p>

        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.7)'
        }}>
          <p>Revenda Oficial Wincent & Istanbul Cymbals</p>
        </div>
      </div>
    </main>
  );
}