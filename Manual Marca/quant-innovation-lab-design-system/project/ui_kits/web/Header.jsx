// Header.jsx v2 — QIL · dark-first · Space Mono
const Header = ({ currentScreen, navigate }) => {
  const navLinks = [
    { label: 'Explorar', screen: 'research' },
    { label: 'Proyectos', screen: 'projects' },
    { label: 'Acerca', screen: 'about' },
  ];

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      background:'rgba(7,8,10,0.95)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid rgba(255,255,255,0.07)',
      height:'58px', display:'flex', alignItems:'center',
    }}>
      <div style={{
        maxWidth:'1280px', margin:'0 auto', padding:'0 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%',
      }}>
        {/* Logo */}
        <button onClick={() => navigate('home')} style={{
          display:'flex', alignItems:'center', gap:'10px',
          background:'none', border:'none', cursor:'pointer', padding:0,
        }}>
          <div style={{
            width:'30px', height:'30px', background:'#0F4C9E',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'15px', fontWeight:700, color:'#F0F4FF', lineHeight:1 }}>Q</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column' }}>
            <div style={{ display:'flex', alignItems:'baseline' }}>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'13px', fontWeight:700, color:'#F0F4FF', letterSpacing:'-0.01em' }}>QIL</span>
              <span style={{ fontFamily:"'Space Mono',monospace", fontSize:'13px', color:'#0F4C9E' }}>_</span>
            </div>
            <div style={{ height:'1px', background:'#0F4C9E', width:'100%', marginTop:'2px' }} />
          </div>
        </button>

        {/* Nav */}
        <nav style={{ display:'flex', alignItems:'center', gap:'2px' }}>
          {navLinks.map(({ label, screen }) => (
            <button key={screen} onClick={() => navigate(screen)} style={{
              background:'none', border:'none', cursor:'pointer',
              fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'13px', fontWeight:500,
              color: currentScreen === screen ? '#F0F4FF' : '#5A6A8A',
              padding:'6px 14px',
              borderBottom: currentScreen === screen ? '1px solid #3A7FE0' : '1px solid transparent',
              transition:'color 0.15s',
            }}>{label}</button>
          ))}
          <button onClick={() => navigate('contact')} style={{
            marginLeft:'12px', background:'#0F4C9E', color:'#F0F4FF',
            border:'none', padding:'7px 16px',
            fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:700,
            cursor:'pointer', letterSpacing:'0.01em',
          }}>Conectar →</button>
        </nav>
      </div>
    </header>
  );
};
Object.assign(window, { Header });
