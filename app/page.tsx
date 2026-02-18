export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '800px',
        background: 'rgba(255,255,255,0.05)',
        padding: '3rem',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h1 style={{
          fontSize: '4rem',
          margin: '0 0 1rem 0',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          🥁 Vintage Drum Shop
        </h1>
        
        <p style={{
          fontSize: '1.5rem',
          margin: '1rem 0 2rem 0',
          color: 'rgba(255,255,255,0.8)'
        }}>
          Sua loja de baterias vintage
        </p>

        <div style={{
          background: 'rgba(0,0,0,0.2)',
          padding: '1.5rem',
          borderRadius: '10px',
          marginTop: '2rem'
        }}>
          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)'
          }}>
            ✨ Site em construção<br/>
            🚀 GitHub Pages configurado<br/>
            🎵 Em breve, a melhor seleção de baterias vintage
          </p>
        </div>

        <footer style={{
          marginTop: '3rem',
          fontSize: '0.9rem',
          color: 'rgba(255,255,255,0.5)'
        }}>
          © 2026 Vintage Drum Shop
        </footer>
      </div>
    </main>
  )
}
