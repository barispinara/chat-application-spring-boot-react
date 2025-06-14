import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

const PulseIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 24 24"
      sx={{
        ...props.sx,
        '& .pulse-wave': {
          animation: 'pulse 2s infinite',
          transformOrigin: 'center',
        },
        '& .pulse-dot': {
          animation: 'glow 2s infinite',
        },
        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 0.5,
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: 0.2,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 0.5,
          },
        },
        '@keyframes glow': {
          '0%': {
            opacity: 0.7,
          },
          '50%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0.7,
          },
        },
      }}
    >
      <g>
        {/* Modern chat bubble with rounded corners */}
        <path
          d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L8 22L10 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Pulse wave circles */}
        <circle
          className="pulse-wave"
          cx="12"
          cy="10"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
        
        {/* Center dot */}
        <circle
          className="pulse-dot"
          cx="12"
          cy="10"
          r="2"
          fill="currentColor"
        />
        
        {/* Decorative elements */}
        <path
          d="M7 8H9M15 8H17M7 12H9M15 12H17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>
    </SvgIcon>
  );
};

export default PulseIcon; 