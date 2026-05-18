const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "fontFamily": "mincho",
  "theme": "cream",
  "density": "comfy",
  "heroVariant": "editorial",
  "vertical": false,
  "readable": true,
  "logo": "snowblossom"
}/*EDITMODE-END*/;

// Theme schemes
const SCHEMES = {
  cream: {
    bg: "#efe9df",
    fg: "#2a201a",
    muted: "#5e4f3e",
    accent: "#9a6a36",
    rule: "rgba(42,32,26,0.32)",
    imgA: "#d8cfbf",
    imgB: "#cdc4b3",
    imgText: "#5a4a3a",
  },
  sepia: {
    bg: "#e8dcc4",
    fg: "#2a1c0e",
    muted: "#6e5634",
    accent: "#8a4520",
    rule: "rgba(42,28,14,0.34)",
    imgA: "#d4c2a0",
    imgB: "#c8b591",
    imgText: "#5a3e22",
  },
  dark: {
    bg: "#1c1814",
    fg: "#f0e8d8",
    muted: "#bdae96",
    accent: "#d8a878",
    rule: "rgba(240,232,216,0.32)",
    imgA: "#332b22",
    imgB: "#3d3328",
    imgText: "#a89880",
  },
};

const FONTS = {
  mincho: { serif: "'Noto Serif JP', serif", sans: "'Noto Sans JP', sans-serif" },
  gothic: { serif: "'Noto Sans JP', sans-serif", sans: "'Noto Sans JP', sans-serif" },
};

const DENSITY = {
  tight: { gap1: 14, gap2: 24, gap3: 40, side: 32, maxw: 1320 },
  regular: { gap1: 18, gap2: 32, gap3: 56, side: 48, maxw: 1320 },
  comfy: { gap1: 22, gap2: 44, gap3: 72, side: 64, maxw: 1320 },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const scheme = SCHEMES[t.theme] || SCHEMES.cream;
  const fonts = FONTS[t.fontFamily] || FONTS.mincho;
  const dens = DENSITY[t.density] || DENSITY.comfy;
  const T = { ...dens, ...fonts, readable: !!t.readable };

  React.useEffect(() => {
    document.body.style.background = scheme.bg;
    document.body.style.color = scheme.fg;
    document.body.style.fontFamily = fonts.sans;
  }, [scheme, fonts]);

  const data = window.BLOG_DATA;

  return (
    <div style={{
      maxWidth: T.maxw,
      margin: "0 auto",
      padding: `0 ${T.side}px`,
      background: scheme.bg,
      minHeight: "100vh",
    }}>
      <TopNav scheme={scheme} T={T} categories={data.categories} logoVariant={t.logo} />
      <Hero variant={t.heroVariant} profile={data.profile} vertical={t.vertical}
            scheme={scheme} T={T} />
      <AboutSection profile={data.profile} scheme={scheme} T={T} />
      <PostsSection posts={data.posts} scheme={scheme} T={T} />
      <CategoryStrip categories={data.categories} scheme={scheme} T={T} />
      <Footer scheme={scheme} T={T} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio label="カラー" value={t.theme}
          options={[
            { value: "cream", label: "明" },
            { value: "sepia", label: "セピア" },
            { value: "dark", label: "暗" },
          ]}
          onChange={(v) => setTweak('theme', v)} />
        <TweakRadio label="書体" value={t.fontFamily}
          options={[
            { value: "mincho", label: "明朝" },
            { value: "gothic", label: "ゴシック" },
          ]}
          onChange={(v) => setTweak('fontFamily', v)} />

        <TweakSection label="Layout" />
        <TweakRadio label="情報密度" value={t.density}
          options={[
            { value: "tight", label: "詰める" },
            { value: "regular", label: "標準" },
            { value: "comfy", label: "ゆったり" },
          ]}
          onChange={(v) => setTweak('density', v)} />
        <TweakSelect label="ヒーロー" value={t.heroVariant}
          options={[
            { value: "editorial", label: "エディトリアル (大見出し+写真)" },
            { value: "centered", label: "センタード (静謐)" },
            { value: "split", label: "三分割スプリット" },
          ]}
          onChange={(v) => setTweak('heroVariant', v)} />
        <TweakToggle label="縦書き(ヒーロー)" value={t.vertical}
          onChange={(v) => setTweak('vertical', v)} />

        <TweakSection label="Accessibility" />
        <TweakToggle label="読みやすさ優先" value={t.readable}
          onChange={(v) => setTweak('readable', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
