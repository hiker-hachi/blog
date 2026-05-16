// Section header — small caps + numerical marker + rule
function SectionHead({ no, kana, en, action, scheme, T }) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      display: "flex",
      alignItems: "baseline",
      gap: isMobile ? 10 : T.gap2,
      paddingBottom: T.gap1,
      borderBottom: `0.5px solid ${scheme.rule}`,
      marginBottom: T.gap2,
      flexWrap: "nowrap",
    }}>
      <span style={{
        fontFamily: "ui-monospace, monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        color: scheme.muted,
        whiteSpace: "nowrap",
      }}>§ {no}</span>
      <h2 style={{
        fontFamily: T.serif,
        fontSize: isMobile ? 18 : 22,
        fontWeight: 500,
        margin: 0,
        color: scheme.fg,
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}>{kana}</h2>
      <span style={{
        fontFamily: T.sans,
        fontSize: 11,
        letterSpacing: isMobile ? "0.1em" : "0.24em",
        color: scheme.muted,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}>{en}</span>
      <span style={{ flex: 1 }} />
      {action && <a href="#" style={{
        fontFamily: T.sans,
        fontSize: 11,
        letterSpacing: "0.16em",
        color: scheme.fg,
        textTransform: "uppercase",
        borderBottom: `0.5px solid ${scheme.fg}`,
        textDecoration: "none",
        paddingBottom: 2,
        whiteSpace: "nowrap",
      }}>{action} →</a>}
    </div>
  );
}

// Simple date + category + title text list
function PostsSection({ posts, scheme, T }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ paddingTop: T.gap3 }}>
      <SectionHead no="01" kana="記事" en="Field Notes" action="一覧を見る" scheme={scheme} T={T} />

      <div style={{ marginBottom: T.gap3 }}>
        {posts.map((p, i) => (
          <a key={i} href={p.url} style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "3em 1fr" : "7em 6em 1fr",
            gap: isMobile ? 8 : T.gap1,
            alignItems: "baseline",
            padding: `${T.gap1}px 0`,
            borderBottom: `0.5px solid ${scheme.rule}`,
            textDecoration: "none",
            color: "inherit",
          }}>
            <span style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: scheme.muted,
              whiteSpace: "nowrap",
            }}>{isMobile ? p.date.slice(5) : p.date}</span>
            {!isMobile && (
              <span style={{
                fontFamily: T.sans,
                fontSize: 11,
                letterSpacing: "0.06em",
                color: scheme.accent,
              }}>{p.cat}</span>
            )}
            <div style={{ minWidth: 0 }}>
              {isMobile && (
                <div style={{
                  fontFamily: T.sans,
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  color: scheme.accent,
                  marginBottom: 2,
                }}>{p.cat}</div>
              )}
              <span style={{
                fontFamily: T.serif,
                fontSize: isMobile ? 13 : 16,
                fontWeight: 500,
                color: scheme.fg,
                lineHeight: 1.5,
              }} dangerouslySetInnerHTML={{ __html: p.title }} />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

window.SectionHead = SectionHead;
window.PostsSection = PostsSection;
