// Placeholder image — subtle striped SVG with monospace label, themed
function PlaceholderImage({ label, ratio = "4/5", scheme = {}, accent }) {
  const { stripeA = "#d8cfbf", stripeB = "#cdc4b3", text = "#5a4a3a" } = scheme;
  const id = React.useId();
  return (
    <div style={{
      position: "relative",
      width: "100%",
      aspectRatio: ratio,
      overflow: "hidden",
      background: stripeA,
    }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
           viewBox="0 0 400 500" style={{ display: "block" }}>
        <defs>
          <pattern id={`p-${id}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <rect width="14" height="14" fill={stripeA} />
            <rect width="7" height="14" fill={stripeB} />
          </pattern>
        </defs>
        <rect width="400" height="500" fill={`url(#p-${id})`} />
        {accent && (
          <circle cx="200" cy="250" r="62" fill="none" stroke={text} strokeWidth="0.5" opacity="0.4" />
        )}
      </svg>
      {label ? (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          padding: "14px 16px",
          fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
          fontSize: 10,
          letterSpacing: "0.08em",
          color: text,
          opacity: 0.7,
          textTransform: "uppercase",
        }}>
          <span style={{ borderTop: `0.5px solid ${text}`, paddingTop: 4 }}>
            [ image · {label} ]
          </span>
        </div>
      ) : null}
    </div>
  );
}

window.PlaceholderImage = PlaceholderImage;
