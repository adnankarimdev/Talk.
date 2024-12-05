interface VeroLogoProps {
  size?: number;
  color?: string;
}

export default function Logo({ size = 50, color = "black" }: VeroLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 143 143"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M65.2 105C64.9333 105 64.7667 104.833 64.7 104.5L50.9 35.8C50.8333 35.5333 50.9667 35.4 51.3 35.4H62.6C62.8667 35.4 63.0333 35.5333 63.1 35.8L71.3 81.6L79.3 35.8C79.3667 35.5333 79.5333 35.4 79.8 35.4H91C91.3333 35.4 91.4667 35.5333 91.4 35.8L77.8 104.5C77.7333 104.833 77.5667 105 77.3 105H65.2Z"
        fill={color}
      />
      <g filter="url(#filter0_d_0_1)">
        <circle
          cx="71.5"
          cy="67.5"
          r="62.5"
          stroke={color}
          strokeWidth="10"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_0_1"
          x="0"
          y="0"
          width="143"
          height="143"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_0_1"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_0_1"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
