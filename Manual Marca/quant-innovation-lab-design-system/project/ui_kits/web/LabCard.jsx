// LabCard.jsx v2 — dark-first
const LabCard = ({ tag, title, description, date, accent, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#0D0F14' : '#07080A',
        border:'1px solid rgba(255,255,255,0.07)',
        borderTop: accent ? '2px solid #3A7FE0' : '1px solid rgba(255,255,255,0.07)',
        padding:'28px 24px', cursor: onClick ? 'pointer' : 'default',
        transition:'background 0.15s', display:'flex', flexDirection:'column', height:'100%',
      }}>
      <div style={{
        fontFamily:"'JetBrains Mono',monospace", fontSize:'9px',
        fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
        color: accent ? '#3A7FE0' : '#2E3850', marginBottom:'12px',
      }}>{tag}</div>
      <h3 style={{
        fontFamily:"'Space Mono',monospace", fontSize:'18px',
        lineHeight:1.2, color:'#F0F4FF', marginBottom:'12px', fontWeight:700,
      }}>{title}</h3>
      <p style={{
        fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:'14px', lineHeight:1.65, color:'#5A6A8A', flexGrow:1,
      }}>{description}</p>
      <div style={{
        marginTop:'24px', paddingTop:'14px',
        borderTop:'1px solid rgba(255,255,255,0.05)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'#2E3850' }}>{date}</span>
        {onClick && <span style={{
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'12px', fontWeight:700,
          color: hovered ? '#3A7FE0' : '#2E3850', transition:'color 0.15s',
        }}>Leer →</span>}
      </div>
    </div>
  );
};

const LabCardLight = ({ tag, title, description, date, accent, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#EBF3FF' : '#F0F4FF',
        border:'1px solid rgba(0,0,0,0.08)',
        borderTop: accent ? '2px solid #0F4C9E' : '1px solid rgba(0,0,0,0.08)',
        padding:'28px 24px', cursor: onClick ? 'pointer' : 'default',
        transition:'background 0.15s', display:'flex', flexDirection:'column', height:'100%',
      }}>
      <div style={{
        fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:700,
        letterSpacing:'0.08em', textTransform:'uppercase',
        color: accent ? '#0F4C9E' : '#5A6A8A', marginBottom:'12px',
      }}>{tag}</div>
      <h3 style={{
        fontFamily:"'Space Mono',monospace", fontSize:'17px',
        lineHeight:1.2, color:'#07080A', marginBottom:'10px', fontWeight:700,
      }}>{title}</h3>
      <p style={{
        fontFamily:"'Plus Jakarta Sans',sans-serif",
        fontSize:'14px', lineHeight:1.65, color:'#5A6A8A', flexGrow:1,
      }}>{description}</p>
      <div style={{
        marginTop:'20px', paddingTop:'14px',
        borderTop:'1px solid rgba(0,0,0,0.06)',
        display:'flex', justifyContent:'space-between', alignItems:'center',
      }}>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'10px', color:'#5A6A8A' }}>{date}</span>
        {onClick && <span style={{ fontSize:'12px', fontWeight:700, color: hovered ? '#0F4C9E' : '#5A6A8A', transition:'color 0.15s' }}>Leer →</span>}
      </div>
    </div>
  );
};
Object.assign(window, { LabCard, LabCardLight });
