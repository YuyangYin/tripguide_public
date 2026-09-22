import React from 'react';

interface TornEdgeProps {
  position: 'top' | 'bottom';
  cardColor?: string; // Color of the card/drawer background
  bgColor?: string;   // Color of the background it is sitting on (newsprint)
}

export default function TornEdge({ position, cardColor = '#FCFBF7', bgColor = '#F4ECE1' }: TornEdgeProps) {
  // We define a highly irregular, organic jagged path.
  // 50 points of irregular heights to mimic a real manual tear.
  const points = [
    [0, 10], [2, 6], [4, 9], [6, 4], [8, 7], [10, 3], [12, 8], [14, 5], [16, 9], [18, 4],
    [20, 8], [22, 5], [24, 7], [26, 3], [28, 9], [30, 4], [32, 8], [34, 5], [36, 7], [38, 4],
    [40, 8], [42, 3], [44, 9], [46, 5], [48, 8], [50, 4], [52, 7], [54, 3], [56, 8], [58, 4],
    [60, 9], [62, 5], [64, 7], [66, 3], [68, 8], [70, 4], [72, 9], [74, 5], [76, 7], [78, 4],
    [80, 8], [82, 3], [84, 9], [86, 5], [88, 8], [90, 4], [92, 7], [94, 3], [96, 8], [98, 4], [100, 10]
  ];

  // Map points to build a path string
  const pathD = points.map(([x, y]) => `${x},${y}`).join(' L ');

  if (position === 'top') {
    return (
      <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden pointer-events-none z-10 select-none">
        {/* Carves the jagged shape using the background color */}
        <svg 
          viewBox="0 0 100 10" 
          preserveAspectRatio="none" 
          className="w-full h-full"
          style={{ fill: bgColor }}
        >
          <path d={`M 0,0 L 100,0 L 100,10 L ${pathD} L 0,10 Z`} />
        </svg>
        {/* Fibers shadow: adds a subtle darker line underneath to simulate paper thickness and shadow */}
        <svg 
          viewBox="0 0 100 10" 
          preserveAspectRatio="none" 
          className="w-full h-full absolute top-[1px] left-0 opacity-15"
          style={{ fill: '#1B1917' }}
        >
          <path d={`M 0,0 L 100,0 L 100,10 L ${pathD} L 0,10 Z`} />
        </svg>
      </div>
    );
  } else {
    // Bottom edge tear is mirrored vertically
    return (
      <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden pointer-events-none z-10 select-none">
        <svg 
          viewBox="0 0 100 10" 
          preserveAspectRatio="none" 
          className="w-full h-full rotate-180"
          style={{ fill: bgColor }}
        >
          <path d={`M 0,0 L 100,0 L 100,10 L ${pathD} L 0,10 Z`} />
        </svg>
        {/* Fibers shadow */}
        <svg 
          viewBox="0 0 100 10" 
          preserveAspectRatio="none" 
          className="w-full h-full absolute bottom-[1px] left-0 opacity-15 rotate-180"
          style={{ fill: '#1B1917' }}
        >
          <path d={`M 0,0 L 100,0 L 100,10 L ${pathD} L 0,10 Z`} />
        </svg>
      </div>
    );
  }
}
