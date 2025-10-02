import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

type IconName = 'trophy' | 'gauge' | 'spark' | 'antenna' | 'trendUp' | 'shield' | 'bolt';

const iconPaths: Record<IconName, string> = {
  trophy: 'M8.21 3H15.8a1 1 0 0 1 1 1.11L16.2 8.7a4 4 0 0 1-3.2 3.38L13 12.16V14a1 1 0 0 1-.25.66l-.54.6a1 1 0 0 1-.74.34h-1.94a1 1 0 0 1-.74-.34l-.54-.6A1 1 0 0 1 7.99 14v-1.84l-.02-.13A4 4 0 0 1 4.8 8.7L4 4.11A1 1 0 0 1 5 3h1M9 14h6M6 4H4a2 2 0 0 0 0 4h1M16 4h1a2 2 0 0 1 0 4h-1',
  gauge: 'M12 15a3 3 0 1 0-2.12-.88l-4.95 4.95a1.5 1.5 0 1 0 2.12 2.12L12 15Zm0-9a9 9 0 1 1-8.94 7.89A9 9 0 0 1 12 6Z',
  spark: 'M12 3v6l3 3-3 3v6M6 9l-3 3 3 3M18 9l3 3-3 3',
  antenna: 'M12 3a6 6 0 0 1 5.2 8.9M12 9a3 3 0 0 1 2.6 4.45M12 9a3 3 0 0 0-2.6 4.45M12 3a6 6 0 0 0-5.2 8.9M12 21v-6',
  trendUp: 'M3 17l6-6 4 4 8-8M21 7h-5M21 7v5',
  shield: 'M12 3 5 6v6c0 4.5 3.3 7.5 7 9 3.7-1.5 7-4.5 7-9V6l-7-3Z',
  bolt: 'M13 3v5h5l-6 13v-6H7l6-12Z',
};

export const Icon: React.FC<{ name: IconName } & IconProps> = ({ name, className, ...props }) => {
  const path = iconPaths[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d={path} />
    </svg>
  );
};
