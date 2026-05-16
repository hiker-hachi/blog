// Gear cabinet — list of trusted gear, monospace specs
function GearSection({ gear, scheme, T }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ paddingTop: T.gap3 }}>
      <SectionHead no="02" kana="信頼の道具" en="Trusted Gear" action="全装備を見る" scheme={scheme} T={T} />
      <div style={{
        fontFamily: T.serif, fontSize: 16, lineHeight: 1.95,
        color: scheme.muted, maxWidth: 580, marginBottom: T.gap2,
        textWrap: "pretty",
      }}>
        三年で六十座を共に歩いた道具たち。買い替えなかった理由を、一つずつ書いている。
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "repeat(3, 1fr)",
        borderTop: `0.5px solid ${scheme.rule}`,
      }}>
        {gear.map((g, i) => (
          <div key={g.name} style={{
            padding: `${T.gap2}px ${T.gap1}px`,
            borderBottom: `0.5px solid ${scheme.rule}`,
            borderRight: (i % 3 !== 2) ? `0.5px solid ${scheme.rule}` : "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            position: "relative",
          }}>
            <div style={{
              fontFamily: "ui-monospace, monospace", fontSize: 9,
              letterSpacing: "0.18em", color: scheme.muted,
              textTransform: "uppercase",
            }}>
              № {String(i + 1).padStart(2, "0")} / {g.role}
            </div>
            <div style={{
              fontFamily: T.serif, fontSize: 13, color: scheme.muted,
              letterSpacing: "0.04em",
            }}>{g.brand}</div>
            <h4 style={{
              fontFamily: T.serif, fontSize: 22, fontWeight: 500,
              margin: 0, color: scheme.fg, lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}>{g.name}</h4>
            <div style={{
              fontFamily: "ui-monospace, monospace", fontSize: 11,
              color: scheme.fg, marginTop: 4,
              fontVariantNumeric: "tabular-nums",
            }}>
              {g.spec}
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: "auto", paddingTop: T.gap1,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: `0.5px solid ${scheme.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: T.serif, fontSize: 12, color: scheme.accent,
                fontVariantNumeric: "tabular-nums",
              }}>{g.years}</div>
              <span style={{
                fontFamily: T.sans, fontSize: 10,
                letterSpacing: "0.16em", color: scheme.muted,
                textTransform: "uppercase",
              }}>years in use</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Mountain count — 60 of 100
function SummitSection({ summits, mountains, scheme, T }) {
  const isMobile = useIsMobile();
  const target = 100;
  const pct = (summits / target) * 100;
  return (
    <section style={{ paddingTop: T.gap3 }}>
      <SectionHead no="03" kana="山の記録" en="Summit Log" action="全座を見る" scheme={scheme} T={T} />

      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "1fr 1.4fr",
        gap: T.gap3, alignItems: "start",
      }}>
        <div>
          <div style={{
            fontFamily: T.serif, fontSize: "clamp(96px, 12vw, 180px)",
            fontWeight: 500, lineHeight: 0.85,
            color: scheme.fg, letterSpacing: "-0.02em",
            fontVariantNumeric: "tabular-nums",
          }}>
            {summits}<span style={{ fontSize: "0.45em", color: scheme.accent }}>座</span>
          </div>
          <div style={{
            fontFamily: "ui-monospace, monospace", fontSize: 11,
            letterSpacing: "0.2em", color: scheme.muted,
            marginTop: T.gap1,
          }}>
            36 MONTHS · SINCE 2023.06
          </div>

          {/* Bar */}
          <div style={{
            marginTop: T.gap2, height: 4,
            background: scheme.rule, position: "relative",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: "100%",
              width: `${pct}%`, background: scheme.accent,
            }} />
            <div style={{
              position: "absolute", top: -2, height: 8, width: 1,
              left: `${pct}%`, background: scheme.fg,
            }} />
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: "ui-monospace, monospace", fontSize: 10,
            letterSpacing: "0.18em", color: scheme.muted, marginTop: 6,
          }}>
            <span>0</span>
            <span style={{ color: scheme.accent }}>↑ {summits}</span>
            <span>目標 100</span>
          </div>

          <p style={{
            fontFamily: T.serif, fontSize: 15, lineHeight: 1.95,
            color: scheme.muted, marginTop: T.gap2, maxWidth: 360,
            textWrap: "pretty",
          }}>
            数を追うことが目的ではないけれど、節目として書き残しておきたい。
            次は北アルプスへ。
          </p>
        </div>

        {/* Mountain list — dense column */}
        <div style={{
          columnCount: isMobile ? 2 : 3,
          columnGap: T.gap2,
          columnRule: `0.5px solid ${scheme.rule}`,
          fontFamily: T.serif, fontSize: 12,
          lineHeight: 1.9, color: scheme.fg,
        }}>
          {mountains.map((m, i) => (
            <div key={i} style={{
              display: "flex", gap: 8,
              breakInside: "avoid",
              paddingBottom: 2,
            }}>
              <span style={{
                fontFamily: "ui-monospace, monospace", fontSize: 9,
                color: scheme.muted, width: 22,
                fontVariantNumeric: "tabular-nums",
              }}>{String(i + 1).padStart(3, "0")}</span>
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// About / quote block
function AboutSection({ profile, scheme, T }) {
  const isMobile = useIsMobile();
  const bodySize = T.readable ? 19 : 16;
  const bodyLine = T.readable ? 2.2 : 2.1;
  return (
    <section style={{
      paddingTop: T.gap3, paddingBottom: T.gap3,
      display: "grid", gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "1fr 1.6fr", gap: T.gap3,
    }}>
      <div>
        <div style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: T.readable ? 12 : 10,
          letterSpacing: "0.2em", color: scheme.muted,
          textTransform: "uppercase", marginBottom: T.gap1,
        }}>About the writer</div>
        <div style={{ display: "flex", flexDirection: "column", gap: T.gap1 }}>
          <div style={{
            position: "relative", width: "100%", aspectRatio: "4/3",
            overflow: "hidden", background: scheme.imgA,
          }}>
            <img src="images/miyamakirishima.jpg"
                 alt="ミヤマキリシマ咲く山"
                 style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{
            position: "relative", width: "100%", aspectRatio: "4/3",
            overflow: "hidden", background: scheme.imgA,
          }}>
            <img src="images/snow-mountain.jpg"
                 alt="雪山と氷の池"
                 style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          fontFamily: T.serif,
          fontSize: "clamp(28px, 3.6vw, 44px)",
          fontWeight: 500, lineHeight: 1.55,
          color: scheme.fg, letterSpacing: "0.02em",
          textWrap: "balance",
        }}>
          「自分にとっての<br />
          <span style={{ color: scheme.accent }}>心地よさ</span>」を<br />
          追求する日々の軌跡。
        </div>
        <div style={{
          fontFamily: T.serif, fontSize: bodySize, lineHeight: bodyLine,
          color: scheme.fg, marginTop: T.gap2, maxWidth: 620,
          textWrap: "pretty",
        }}>
          <p style={{ margin: 0 }}>
            <span style={{ whiteSpace: "nowrap" }}>50代、162.5cm。九州を拠点とするハイカー。</span><br />2023年6月に登山を始め、3年で60座の山を越えてきました。乳がんの手術を経験し、一度立ち止まったからこそ見えた景色があります。
          </p>
          <p style={{ margin: `${T.gap1}px 0 0`, color: T.readable ? scheme.fg : scheme.muted }}>
            私を支えてくれる相棒たち。その道具と共に歩む、登山や旅の軌跡をここに綴っていきます。
          </p>
        </div>
      </div>
    </section>
  );
}

window.GearSection = GearSection;
window.SummitSection = SummitSection;
window.AboutSection = AboutSection;
