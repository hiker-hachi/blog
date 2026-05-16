// Hero section variants
const HERO_VARIANTS = ["editorial", "centered", "split"];

function useIsMobile(breakpoint = 600) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= breakpoint);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}
window.useIsMobile = useIsMobile;

function HeroEditorial({ profile, vertical, scheme, T }) {
  const isMobile = useIsMobile();
  return (
    <section style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "1fr 1.1fr",
      gap: T.gap2,
      alignItems: "stretch",
      padding: `${T.gap2}px 0 ${T.gap3}px`,
      borderBottom: `0.5px solid ${scheme.rule}`,
    }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: isMobile ? 0 : T.gap1 }}>
        <div>
          <h1 style={{
            fontFamily: T.serif,
            fontSize: isMobile ? "clamp(36px, 9vw, 52px)" : "clamp(56px, 7.4vw, 112px)",
            fontWeight: 500,
            lineHeight: 0.96,
            letterSpacing: "0.01em",
            color: scheme.fg,
            margin: 0,
            writingMode: vertical ? "vertical-rl" : "horizontal-tb",
            textOrientation: vertical ? "upright" : "mixed",
            maxHeight: vertical ? 480 : "none",
          }}>
            一山<br />
            <span style={{ color: scheme.accent }}>一会</span>
          </h1>
          <div style={{
            marginTop: T.gap2,
            fontFamily: T.sans,
            fontSize: isMobile ? 13 : 24,
            letterSpacing: "0.08em",
            color: scheme.muted,
          }}>
            ICHI ZAN ICHI E ─ 50代の山支度
          </div>
        </div>

        <div style={{
          marginTop: T.gap2,
          fontFamily: T.serif,
          fontSize: isMobile ? 18 : 30,
          lineHeight: 1.7,
          color: scheme.fg,
          maxWidth: 460,
          textWrap: "pretty",
          letterSpacing: "0.04em",
        }}>
          信頼できるギアを<br />
          ひとつ選んで、山へ行く。
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <div style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          overflow: "hidden",
          background: scheme.imgA,
        }}>
          <img src="images/hero-yakushima.png"
               alt="屋久島の巨木 ─ 樹洞から差し込む光"
               style={{
                 width: "100%",
                 height: "100%",
                 objectFit: "cover",
                 display: "block",
               }} />
        </div>
      </div>
    </section>
  );
}

function HeroCentered({ profile, vertical, scheme, T }) {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: `${T.gap3}px 0`,
      textAlign: "center",
      borderBottom: `0.5px solid ${scheme.rule}`,
    }}>
      <div style={{
        fontFamily: "ui-monospace, monospace",
        fontSize: 10,
        letterSpacing: "0.32em",
        color: scheme.muted,
        textTransform: "uppercase",
        marginBottom: T.gap2,
      }}>
        ─── A field journal ───
      </div>
      <h1 style={{
        fontFamily: T.serif,
        fontSize: isMobile ? "clamp(56px, 15vw, 96px)" : "clamp(72px, 12vw, 168px)",
        fontWeight: 400,
        lineHeight: 1,
        letterSpacing: "0.04em",
        margin: 0,
        color: scheme.fg,
      }}>
        一山一会
      </h1>
      <div style={{
        fontFamily: T.serif,
        fontSize: isMobile ? 16 : 22,
        marginTop: T.gap1,
        color: scheme.accent,
        letterSpacing: "0.16em",
      }}>
        50代の山支度
      </div>
      <div style={{
        fontFamily: T.sans,
        fontSize: 14,
        letterSpacing: "0.1em",
        color: scheme.muted,
        maxWidth: 520,
        margin: `${T.gap2}px auto 0`,
        lineHeight: 1.9,
      }}>
        信頼できるギアをひとつ選んで山へ行く
      </div>
    </section>
  );
}

function HeroSplit({ profile, vertical, scheme, T }) {
  const isMobile = useIsMobile();
  return (
    <section style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr 1fr",
      borderBottom: `0.5px solid ${scheme.rule}`,
      minHeight: isMobile ? "auto" : 480,
    }}>
      <div style={{
        padding: `${T.gap3}px ${T.gap2}px`,
        borderRight: isMobile ? "none" : `0.5px solid ${scheme.rule}`,
        borderBottom: isMobile ? `0.5px solid ${scheme.rule}` : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: scheme.muted,
          marginBottom: T.gap1,
        }}>
          EST. 2023 · KYUSHU, JP
        </div>
        <h1 style={{
          fontFamily: T.serif,
          fontSize: isMobile ? "clamp(36px, 9vw, 52px)" : "clamp(48px, 5.6vw, 88px)",
          fontWeight: 500,
          lineHeight: 1.05,
          letterSpacing: "0.02em",
          margin: 0,
          color: scheme.fg,
        }}>
          一山<br />一会。
        </h1>
        <div style={{
          fontFamily: T.serif,
          fontSize: 15,
          marginTop: T.gap2,
          color: scheme.muted,
          lineHeight: 1.9,
          maxWidth: 320,
        }}>
          50代、162.5cm。<br />
          手術台の上で決めた小さな約束を、<br />
          一座ずつ、果たしていく記録。
        </div>
      </div>

      {!isMobile && (
        <>
          <div style={{ borderRight: `0.5px solid ${scheme.rule}` }}>
            <PlaceholderImage label="hero a" ratio="auto"
              scheme={{ stripeA: scheme.imgA, stripeB: scheme.imgB, text: scheme.imgText }} />
          </div>
          <div>
            <PlaceholderImage label="hero b" ratio="auto"
              scheme={{ stripeA: scheme.imgB, stripeB: scheme.imgA, text: scheme.imgText }} accent />
          </div>
        </>
      )}
    </section>
  );
}

function Hero({ variant, profile, vertical, scheme, T }) {
  if (variant === "centered") return <HeroCentered {...{ profile, vertical, scheme, T }} />;
  if (variant === "split") return <HeroSplit {...{ profile, vertical, scheme, T }} />;
  return <HeroEditorial {...{ profile, vertical, scheme, T }} />;
}

window.Hero = Hero;
