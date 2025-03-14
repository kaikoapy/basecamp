import * as React from "react";
import type { SVGProps } from "react";

export const BasecampLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    fill="none"
    viewBox="0 0 280 44" // Increased width from 200 to 280 to fit full text at fontSize 40
    {...props}
  >
    <mask
      id="mask0_9418_64"
      width={44}
      height={44}
      x={0}
      y={0}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "luminance",
      }}
    >
      <path fill="white" d="M44 0H0V44H44V0Z" />
    </mask>
    <g mask="url(#mask0_9418_64)">
      <path
        fill="#6366F1"
        d="M27.2694 2.12169L23.0486 0.990723L19.4917 14.2654L16.2804 2.28093L12.0595 3.4119L15.5291 16.3602L6.88724 7.71841L3.79738 10.8083L13.2764 20.2874L1.47179 17.1243L0.34082 21.3451L13.2388 24.8011C13.0912 24.1642 13.0131 23.5006 13.0131 22.8187C13.0131 17.992 16.9258 14.0792 21.7525 14.0792C26.5792 14.0792 30.492 17.992 30.492 22.8187C30.492 23.4962 30.4148 24.1557 30.269 24.7889L41.9909 27.9297L43.1218 23.709L30.1725 20.2392L41.9779 17.0759L40.8469 12.8551L27.8981 16.3247L36.54 7.68293L33.4501 4.59307L24.1026 13.9406L27.2694 2.12169Z"
      />
      <path
        fill="#6366F1"
        d="M30.2567 24.8379C29.8948 26.3679 29.1308 27.7423 28.0825 28.8434L36.5745 37.3356L39.6644 34.2457L30.2567 24.8379Z"
      />
      <path
        fill="#6366F1"
        d="M27.997 28.9321C26.9361 30.0157 25.5953 30.8243 24.0918 31.2411L27.1819 42.7733L31.4027 41.6423L27.997 28.9321Z"
      />
      <path
        fill="#6366F1"
        d="M23.9342 31.2835C23.2366 31.4628 22.5055 31.5581 21.752 31.5581C20.9448 31.5581 20.1631 31.4486 19.421 31.2437L16.3281 42.7866L20.5489 43.9175L23.9342 31.2835Z"
      />
      <path
        fill="#6366F1"
        d="M19.2715 31.201C17.791 30.7636 16.4741 29.9446 15.4348 28.8579L6.92188 37.3709L10.0118 40.4607L19.2715 31.201Z"
      />
      <path
        fill="#6366F1"
        d="M15.3647 28.783C14.3432 27.6894 13.5992 26.3334 13.2451 24.8271L1.48486 27.9782L2.61582 32.199L15.3647 28.783Z"
      />
    </g>
    <text
      x="60" // Kept at 60 since it aligns well with the graphic now that viewBox is wider
      y="38" // Restored to 38 for original vertical positioning
      fontFamily="sans-serif"
      fontWeight="bold"
      fontSize="40" // Restored to 40 as per your original preference
      fill="currentColor"
    >
      Basecamp
    </text>
  </svg>
);