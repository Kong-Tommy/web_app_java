export default function Logo({ height = 32, variant = 'onOrange' }) {
  const bagFill = variant === 'onOrange' ? '#ffffff' : '#EE4D2D';
  const bagDot = variant === 'onOrange' ? '#EE4D2D' : '#ffffff';
  const shopFill = variant === 'onOrange' ? '#ffffff' : '#EE4D2D';
  const vnFill = variant === 'onOrange' ? '#FFE27A' : '#d7411f';

  return (
    <svg
      height={height}
      viewBox="0 0 220 60"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="shopVN"
    >
      <g transform="translate(0,6)">
        <rect x="2" y="10" width="40" height="34" rx="8" fill={bagFill} />
        <path
          d="M12 10 V6 a10 10 0 0 1 20 0 V10"
          fill="none"
          stroke={bagFill}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="27" r="3.4" fill={bagDot} />
        <circle cx="28" cy="27" r="3.4" fill={bagDot} />
      </g>
      <text
        x="54"
        y="40"
        fontFamily="-apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        fontWeight="800"
        fontSize="32"
        fill={shopFill}
        letterSpacing="0.5"
      >
        shop
        <tspan fill={vnFill}>VN</tspan>
      </text>
    </svg>
  );
}
