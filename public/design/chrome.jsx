// Top nav + footer
function BrandMark({ size = 32, color, accent, variant = "ring" }) {
  const s = size;
  const stroke = Math.max(1, s / 28);
  const props = { width: s, height: s, viewBox: "0 0 40 40",
    style: { display: "block", flexShrink: 0 }, "aria-hidden": "true" };

  // 1. 円+山+点 — 既存（出会いの円・一山・一会の光）
  if (variant === "ring") return (
    <svg {...props}>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke={color} strokeWidth="1" />
      <path d="M8 28 L20 12 L32 28" fill="none" stroke={color}
            strokeWidth={stroke * 1.2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 28 L25 19 L32 28" fill="none" stroke={color}
            strokeWidth={stroke * 0.85} strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <circle cx="20" cy="11.5" r="2" fill={accent} />
      <line x1="6.5" y1="28" x2="33.5" y2="28" stroke={color} strokeWidth="0.6" opacity="0.5" />
    </svg>
  );

  // 2. 三山 — 三つの山並み(三山連峰)、ミニマルなライン
  if (variant === "ridges") return (
    <svg {...props}>
      <path d="M2 30 L11 16 L17 24 L23 14 L29 22 L38 30 Z"
            fill="none" stroke={color} strokeWidth={stroke * 1.3}
            strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="23" cy="9" r="2.2" fill={accent} />
    </svg>
  );

  // 3. 山字判子 — 篆刻風スタンプ：朱の四角に「山」
  if (variant === "stamp") return (
    <svg {...props}>
      <rect x="3" y="3" width="34" height="34" fill={accent} />
      <text x="20" y="29" textAnchor="middle"
            fontFamily="'Noto Serif JP', serif" fontSize="24"
            fontWeight="500" fill="#fff8ec">山</text>
    </svg>
  );

  // 4. ピーク — 単一の鋭い三角だけ。一切の装飾なし。
  if (variant === "peak") return (
    <svg {...props}>
      <path d="M5 32 L20 6 L35 32 Z" fill={color} />
      <path d="M14 22 L20 14 L26 22 Z" fill={accent} opacity="0.92" />
    </svg>
  );

  // 5. 双円 — 一山一会、二つの円が重なる(出会い)
  if (variant === "venn") return (
    <svg {...props}>
      <circle cx="14" cy="20" r="11.5" fill="none" stroke={color} strokeWidth={stroke} />
      <circle cx="26" cy="20" r="11.5" fill="none" stroke={color} strokeWidth={stroke} />
      <path d="M20 9.6 a11.5 11.5 0 0 1 0 20.8 a11.5 11.5 0 0 1 0 -20.8 z"
            fill={accent} opacity="0.65" />
    </svg>
  );

  // 6. 等高線 — 地形図の等高線で山を表現
  if (variant === "contour") return (
    <svg {...props}>
      <path d="M20 6 C28 10, 32 16, 32 22" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <path d="M20 11 C26 14, 29 18, 29 23" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <path d="M20 16 C24 18, 26 21, 26 24" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <path d="M20 6 C12 10, 8 16, 8 22" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <path d="M20 11 C14 14, 11 18, 11 23" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <path d="M20 16 C16 18, 14 21, 14 24" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <circle cx="20" cy="6" r="1.8" fill={accent} />
      <line x1="6" y1="32" x2="34" y2="32" stroke={color} strokeWidth="0.6" />
    </svg>
  );

  // 7. 一の字山 — 漢字「一」と山稜が組み合わさる
  if (variant === "ichi") return (
    <svg {...props}>
      <line x1="6" y1="13" x2="34" y2="13" stroke={color} strokeWidth={stroke * 1.6}
            strokeLinecap="round" />
      <path d="M9 32 L20 18 L31 32" fill="none" stroke={color}
            strokeWidth={stroke * 1.3} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="13" r="2.2" fill={accent} />
    </svg>
  );

  // 8. 朝陽山 — 半円(陽)と二重稜
  if (variant === "sunrise") return (
    <svg {...props}>
      <path d="M4 24 A16 16 0 0 1 36 24" fill="none" stroke={accent} strokeWidth={stroke * 1.1} />
      <path d="M6 30 L14 22 L20 26 L28 18 L34 30" fill="none" stroke={color}
            strokeWidth={stroke * 1.3} strokeLinejoin="round" strokeLinecap="round" />
      <line x1="3" y1="34" x2="37" y2="34" stroke={color} strokeWidth="0.6" />
    </svg>
  );

  // 9. 重ね山 — 円の中に三山、月のクレセント、地平線
  if (variant === "horizon") return (
    <svg {...props}>
      <defs>
        <clipPath id="bm-circ-9">
          <circle cx="20" cy="20" r="17" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="17" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <g clipPath="url(#bm-circ-9)">
        {/* horizon line */}
        <line x1="2" y1="24" x2="38" y2="24" stroke={color} strokeWidth="0.5" opacity="0.5" />
        {/* far ridge */}
        <path d="M2 24 L9 18 L14 21 L20 14 L26 21 L31 17 L38 24"
              fill="none" stroke={color} strokeWidth={stroke * 1.1}
              strokeLinejoin="round" strokeLinecap="round" />
        {/* near ridge — solid filled, lower */}
        <path d="M2 28 L8 23 L14 26 L22 20 L30 26 L38 22 L38 36 L2 36 Z"
              fill={color} opacity="0.16" />
        <path d="M2 28 L8 23 L14 26 L22 20 L30 26 L38 22"
              fill="none" stroke={color} strokeWidth={stroke * 1.1}
              strokeLinejoin="round" strokeLinecap="round" />
        {/* moon crescent */}
        <circle cx="29" cy="11" r="2.6" fill={accent} />
        <circle cx="30.2" cy="10.3" r="2.4" fill={color === "#f0e8d8" ? color : "#efe9df"} />
      </g>
    </svg>
  );

  // 10. 三重山 — 細密な多層稜線、版画風
  if (variant === "layered") return (
    <svg {...props}>
      {/* outer ring with notches */}
      <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="0.6" />
      {/* layer 4 (back) */}
      <path d="M3 28 L10 22 L15 24 L20 19 L25 24 L30 22 L37 28"
            fill="none" stroke={color} strokeWidth={stroke * 0.7}
            strokeLinejoin="round" opacity="0.45" />
      {/* layer 3 */}
      <path d="M4 30 L11 24 L17 26 L22 21 L28 26 L33 24 L36 28"
            fill="none" stroke={color} strokeWidth={stroke * 0.85}
            strokeLinejoin="round" opacity="0.7" />
      {/* layer 2 — main with summit */}
      <path d="M5 32 L13 23 L18 26 L24 18 L30 26 L35 30"
            fill="none" stroke={color} strokeWidth={stroke * 1.4}
            strokeLinejoin="round" strokeLinecap="round" />
      {/* sun */}
      <circle cx="24" cy="11.5" r="2.4" fill={accent} />
      {/* baseline tick marks */}
      <line x1="6" y1="34" x2="34" y2="34" stroke={color} strokeWidth="0.6" />
      <line x1="11" y1="34" x2="11" y2="35.4" stroke={color} strokeWidth="0.6" />
      <line x1="20" y1="34" x2="20" y2="35.4" stroke={color} strokeWidth="0.6" />
      <line x1="29" y1="34" x2="29" y2="35.4" stroke={color} strokeWidth="0.6" />
    </svg>
  );

  // 11. 山と河 — 稜線+渓流の波線、円の中
  if (variant === "river") return (
    <svg {...props}>
      <defs>
        <clipPath id="bm-circ-11">
          <circle cx="20" cy="20" r="17.5" />
        </clipPath>
      </defs>
      <circle cx="20" cy="20" r="17.5" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      <g clipPath="url(#bm-circ-11)">
        {/* twin peaks */}
        <path d="M3 22 L11 12 L17 18 L22 11 L29 19 L37 22"
              fill="none" stroke={color} strokeWidth={stroke * 1.3}
              strokeLinejoin="round" strokeLinecap="round" />
        {/* river — flowing wave */}
        <path d="M3 28 Q10 26 15 28 T27 28 T37 28"
              fill="none" stroke={accent} strokeWidth={stroke * 1.1}
              strokeLinecap="round" />
        <path d="M3 32 Q10 30 15 32 T27 32 T37 32"
              fill="none" stroke={accent} strokeWidth={stroke * 0.8}
              strokeLinecap="round" opacity="0.6" />
      </g>
    </svg>
  );

  // 12. コンパス山 — 方位記号と稜線が組み合わさる
  if (variant === "compass") return (
    <svg {...props}>
      <circle cx="20" cy="20" r="18" fill="none" stroke={color} strokeWidth="0.6" />
      <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth={stroke * 0.9} />
      {/* compass ticks */}
      <line x1="20" y1="2" x2="20" y2="5" stroke={color} strokeWidth="0.8" />
      <line x1="20" y1="35" x2="20" y2="38" stroke={color} strokeWidth="0.8" />
      <line x1="2" y1="20" x2="5" y2="20" stroke={color} strokeWidth="0.8" />
      <line x1="35" y1="20" x2="38" y2="20" stroke={color} strokeWidth="0.8" />
      {/* N marker */}
      <circle cx="20" cy="3.5" r="1.6" fill={accent} />
      {/* mountain ridges inside */}
      <path d="M8 26 L14 18 L19 22 L24 16 L31 26"
            fill="none" stroke={color} strokeWidth={stroke * 1.3}
            strokeLinejoin="round" strokeLinecap="round" />
      <line x1="8" y1="26" x2="32" y2="26" stroke={color} strokeWidth="0.6" />
    </svg>
  );

  // 13. 印章山 — 篆刻+三山、アクセント枠
  if (variant === "seal") return (
    <svg {...props}>
      <rect x="2" y="2" width="36" height="36" fill="none" stroke={color} strokeWidth="1" />
      <rect x="4.5" y="4.5" width="31" height="31" fill="none" stroke={accent} strokeWidth="0.6" />
      {/* three peaks */}
      <path d="M9 28 L15 19 L20 24 L25 17 L31 28 Z"
            fill={color} />
      {/* moon dot */}
      <circle cx="25" cy="10" r="1.8" fill={accent} />
      {/* baseline */}
      <line x1="8" y1="30" x2="32" y2="30" stroke={color} strokeWidth="0.7" />
    </svg>
  );

  // 14. 双峰 + 花 — 二連の山に小さなピンクの花が散る (ミヤマキリシマ)
  if (variant === "blossom") {
    const pink = "#d98aa3"; // soft cherry blossom pink
    return (
      <svg {...props}>
        {/* twin ridge - one continuous line */}
        <path d="M3 30 L13 14 L20 22 L27 12 L37 30"
              fill="none" stroke={color} strokeWidth={stroke * 1.4}
              strokeLinejoin="round" strokeLinecap="round" />
        {/* baseline whisper */}
        <line x1="3" y1="30" x2="37" y2="30" stroke={color} strokeWidth="0.5" opacity="0.5" />
        {/* scattered pink blossoms — each is a 5-petal cluster */}
        {/* big bloom at left slope */}
        <g>
          <circle cx="9.5" cy="22.5" r="1.4" fill={pink} />
          <circle cx="11" cy="22" r="1" fill={pink} opacity="0.85" />
          <circle cx="9" cy="24" r="0.8" fill={pink} opacity="0.7" />
        </g>
        {/* mid valley bloom */}
        <g>
          <circle cx="17" cy="26" r="1.2" fill={pink} />
          <circle cx="18.4" cy="26.6" r="0.85" fill={pink} opacity="0.75" />
        </g>
        {/* right slope */}
        <g>
          <circle cx="30" cy="22" r="1.3" fill={pink} />
          <circle cx="31.5" cy="23.2" r="0.9" fill={pink} opacity="0.8" />
          <circle cx="29" cy="23.6" r="0.7" fill={pink} opacity="0.7" />
        </g>
        {/* tiny far blooms */}
        <circle cx="22" cy="27.5" r="0.6" fill={pink} opacity="0.7" />
        <circle cx="33.5" cy="27" r="0.6" fill={pink} opacity="0.7" />
        <circle cx="6" cy="28" r="0.6" fill={pink} opacity="0.65" />
        {/* sun dot at right peak (kept warm, like the ridges variant) */}
        <circle cx="27" cy="7.5" r="2" fill={accent} />
      </svg>
    );
  }

  // 15. 雪嶺花咲 — サンプルベース：曲線の双峰 + 雪冠 + 麓の花群
  if (variant === "snowblossom") {
    const ridge = "#2f5238";  // deeper forest green
    const pink = "#d94d7a";   // deeper, more saturated pink
    return (
      <svg width={s} height={s} viewBox="0 0 200 120"
           style={{ display: "block", flexShrink: 0 }} aria-hidden="true">
        {/* left mountain — graceful curved peak */}
        <path d="M10,100 Q30,60 60,30 Q65,25 70,30 Q100,65 110,100"
              fill="none" stroke={ridge} strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round" />
        {/* right mountain */}
        <path d="M70,30 Q100,5 120,30 Q150,65 170,100"
              fill="none" stroke={ridge} strokeWidth="4"
              strokeLinecap="round" strokeLinejoin="round" />
        {/* snow caps */}
        <path d="M60,30 Q65,38 70,30 Q75,38 80,33"
              fill="white" stroke={ridge} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M120,30 Q125,38 130,34"
              fill="white" stroke={ridge} strokeWidth="2.5" strokeLinejoin="round" />
        {/* pink blossoms — left cluster */}
        <circle cx="22" cy="98" r="6.5" fill={pink} />
        <circle cx="46" cy="88" r="5.5" fill={pink} opacity="0.92" />
        {/* pink blossoms — right cluster */}
        <circle cx="148" cy="96" r="6.5" fill={pink} />
        <circle cx="173" cy="86" r="5.5" fill={pink} opacity="0.92" />
      </svg>
    );
  }

  return null;
}

function TopNav({ scheme, T, categories, logoVariant }) {
  const isMobile = useIsMobile();
  return (
    <header style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "flex-start" : "center",
      justifyContent: "space-between",
      padding: `${T.gap2}px 0 ${T.gap1}px`,
      borderBottom: `1px solid ${scheme.rule}`,
      gap: isMobile ? 4 : T.gap2,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <BrandMark size={isMobile ? 44 : (T.readable ? 38 : 32)} color={scheme.fg} accent={scheme.accent}
                   variant={logoVariant} />
        <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "baseline" : "flex-start", gap: isMobile ? 6 : 2 }}>
          <div style={{
            fontFamily: T.serif,
            fontSize: isMobile ? 17 : (T.readable ? 26 : 22),
            letterSpacing: "0.1em",
            color: scheme.fg,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}>
            一山一会
          </div>
          <div style={{
            fontFamily: T.serif,
            fontSize: isMobile ? 11 : (T.readable ? 13 : 11),
            letterSpacing: "0.1em",
            color: scheme.muted,
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}>
            50代の山支度
          </div>
        </div>
      </div>
      <div style={{
        fontFamily: "ui-monospace, monospace",
        fontSize: isMobile ? 9 : (T.readable ? 13 : 11),
        letterSpacing: "0.18em",
        color: scheme.muted,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        paddingLeft: isMobile ? 58 : 0,
      }}>
        Since 2023.06 — A Field Journal
      </div>
    </header>
  );
}

function CategoryStrip({ categories, scheme, T }) {
  const isMobile = useIsMobile();
  const total = categories.reduce((s, c) => s + c.count, 0);
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      borderTop: `1px solid ${scheme.rule}`,
      borderBottom: `1px solid ${scheme.rule}`,
      padding: `${T.gap1}px 0`,
    }}>
      <div style={{
        fontFamily: "ui-monospace, monospace", fontSize: T.readable ? 12 : 10,
        letterSpacing: isMobile ? "0.1em" : "0.2em", color: scheme.muted,
        textTransform: "uppercase", paddingRight: isMobile ? 12 : T.gap2,
        borderRight: `1px solid ${scheme.rule}`,
        whiteSpace: "nowrap",
      }}>
        Index
      </div>
      <a href="/blog" style={{
        fontFamily: T.serif, fontSize: isMobile ? 16 : (T.readable ? 19 : 16),
        color: scheme.fg, textDecoration: "none",
        letterSpacing: "0.06em",
        paddingLeft: isMobile ? 0 : T.gap2,
        whiteSpace: "nowrap",
      }}>
        記事一覧
      </a>
      <span style={{ flex: 1 }} />
      <a href="/blog" style={{
        fontFamily: T.sans, fontSize: isMobile ? 11 : (T.readable ? 13 : 11),
        letterSpacing: isMobile ? "0.06em" : "0.18em", color: scheme.fg,
        textTransform: "uppercase", textDecoration: "none",
        borderBottom: `1px solid ${scheme.fg}`, paddingBottom: 2,
        whiteSpace: "nowrap",
      }}>すべての記事を見る →</a>
    </div>
  );
}

function Footer({ scheme, T }) {
  return (
    <footer style={{
      marginTop: T.gap3,
      paddingTop: T.gap2,
      borderTop: `0.5px solid ${scheme.rule}`,
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: T.gap2,
      paddingBottom: T.gap2,
    }}>
      <div>
        <div style={{
          fontFamily: T.serif, fontSize: 22,
          letterSpacing: "0.12em", color: scheme.fg,
        }}>一山一会</div>
        <div style={{
          fontFamily: "ui-monospace, monospace", fontSize: 10,
          letterSpacing: "0.18em", color: scheme.muted, marginTop: 6,
        }}>
          ICHI ZAN ICHI E · A FIELD JOURNAL · EST. 2023.06
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <a href="https://instagram.com/hiker_hachi" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: T.sans, fontSize: 12, color: scheme.fg,
          textDecoration: "none", borderBottom: `0.5px solid ${scheme.fg}`,
          paddingBottom: 2,
        }}>Instagram @hiker_hachi</a>
        <p style={{
          fontFamily: T.serif, fontSize: 12, color: scheme.muted,
          lineHeight: 1.85, margin: "12px 0 0 0", maxWidth: 360,
        }}>
          © 2026 一山一会 — このサイトの文章と写真は特記のない限り筆者によるものです。
        </p>
      </div>
    </footer>
  );
}

window.BrandMark = BrandMark;
window.TopNav = TopNav;
window.CategoryStrip = CategoryStrip;
window.Footer = Footer;
