// Hero.jsx v2 — dark navy · Space Mono display
const Hero = ({ navigate }) => (
  <section style={{
    background:'#07080A', minHeight:'90vh',
    display:'flex', flexDirection:'column', justifyContent:'flex-end',
    padding:'120px 32px 80px', position:'relative', overflow:'hidden',
  }}>
    {/* Grid texture */}
    <div style={{
      position:'absolute', inset:0, opacity:0.03,
      backgroundImage:'linear-gradient(rgba(15,76,158,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(15,76,158,0.8) 1px, transparent 1px)',
      backgroundSize:'48px 48px', pointerEvents:'none',
    }} />
    {/* Blue accent corner */}
    <div style={{ position:'absolute', top:'80px', right:'80px', width:'1px', height:'160px', background:'#0F4C9E', opacity:0.6 }} />
    <div style={{ position:'absolute', top:'80px', right:'80px', width:'160px', height:'1px', background:'#0F4C9E', opacity:0.6 }} />
    <div style={{ position:'absolute', top:'78px', right:'78px', width:'5px', height:'5px', background:'#3A7FE0' }} />

    <div style={{ maxWidth:'1280px', margin:'0 auto', width:'100%', position:'relative' }}>
      <div style={{
        fontFamily:"'JetBrains Mono',monospace", fontSize:'11px',
        color:'#3A7FE0', marginBottom:'32px', letterSpacing:'0.04em',
      }}>// QIL · Quant Innovation Lab</div>

      <h1 style={{
        fontFamily:"'Space Mono',monospace",
        fontSize:'clamp(40px, 6vw, 80px)',
        lineHeight:1.05, letterSpacing:'-0.03em',
        color:'#F0F4FF', maxWidth:'780px',
        marginBottom:'12px', fontWeight:700,
      }}>De la mente<br />al mundo.</h1>

      <div style={{
        fontFamily:"'Space Mono',monospace",
        fontSize:'clamp(18px, 2.5vw, 28px)',
        lineHeight:1.1, color:'#3A7FE0',
        marginBottom:'36px', fontStyle:'italic',
      }}>Exploramos, probamos, compartimos_</div>

      <p style={{
        fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:'17px', lineHeight:1.65, color:'#5A6A8A',
        maxWidth:'480px', marginBottom:'48px',
      }}>
        Transformamos potencial en impacto — con ejecución rigurosa y visión de largo plazo. Sin atajos.
      </p>

      <div style={{ display:'flex', gap:'14px', alignItems:'center', flexWrap:'wrap' }}>
        <button onClick={() => navigate('research')} style={{
          background:'#F0F4FF', color:'#07080A',
          border:'none', padding:'13px 28px',
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'14px', fontWeight:800,
          cursor:'pointer',
        }}>Explorar investigación</button>
        <button onClick={() => navigate('about')} style={{
          background:'transparent', color:'#F0F4FF',
          border:'1px solid rgba(255,255,255,0.15)', padding:'13px 28px',
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'14px', fontWeight:500,
          cursor:'pointer',
        }}>Acerca de QIL</button>
      </div>
    </div>
  </section>
);
Object.assign(window, { Hero });
