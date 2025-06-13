import type React from 'react';

const AppLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="150"
    height="40"
    viewBox="0 0 150 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text
      x="5"
      y="28"
      fontFamily="Playfair Display, serif"
      fontSize="20"
      fill="hsl(var(--primary))"
      className="font-headline"
    >
      Mimir's Echo
    </text>
    {/* Optional: Add a small thematic icon like a stylized rune or eye */}
    {/* Example: A simple stylized eye */}
    <path d="M130 20 Q135 15 140 20 Q135 25 130 20 Z" fill="hsl(var(--accent))" />
    <circle cx="135" cy="20" r="2" fill="hsl(var(--primary-foreground))" />
  </svg>
);

export default AppLogo;
