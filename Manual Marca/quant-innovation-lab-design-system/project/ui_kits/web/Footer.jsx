// Footer.jsx v2
const Footer = ({ navigate }) => {
  const cols = [
    { title: 'Investigación', links: ['Todos los proyectos', 'Publicaciones', 'Datasets', 'Metodologías'] },
    { title: 'Laboratorio', links: ['Acerca de QIL', 'Equipo', 'Aliados', 'Únete'] },
    { title: 'Conectar', links: ['Newsletter', 'Eventos', 'Contacto', 'Prensa'] },
  ];
  return (
    <footer style={{ background:'#07080A', borderTop:'1px solid rgba(255,255,255,0.06)', padding:'64px 32px 40px' }}>
      <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'48px', marginBottom:'56px' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
              <div style={{ width:'28px', height:'28px', background:'#0F4C9E', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'13px', fontWeight:700, color:'#F0F4FF' }}>Q</span>
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'baseline' }}>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'12px', fontWeight:700, color:'#F0F4FF' }}>QIL</span>
                  <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'12px', color:'#0F4C9E' }}>_</span>
                </div>
                <div style={{ height:'1px', background:'#0F4C9E', marginTop:'2px' }} />
              </div>
            </div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', lineHeight:1.65, color:'#2E3850', maxWidth:'180px' }}>
              De la mente al mundo — juntos.
            </p>
          </div>
          {cols.map(({ title, links }) => (
            <div key={title}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', color:'#2E3850', marginBottom:'16px' }}>{title}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'10px' }}>
                {links.map(link => (
                  <li key={link}><button style={{ background:'none', border:'none', padding:0, cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', color:'#5A6A8A' }}>{link}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'#2E3850' }}>© 2026 Quant Innovation Lab</span>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'11px', color:'#2E3850', fontStyle:'italic' }}>build it, together_</span>
        </div>
      </div>
    </footer>
  );
};
Object.assign(window, { Footer });
