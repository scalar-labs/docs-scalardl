import React, { useEffect, useRef, useState } from 'react';

interface GlossaryTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({ term, definition, children }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  const handleMouseEnter = (event: React.MouseEvent) => {
    const target = event.currentTarget;

    // Get the bounding rectangle of the target element.
    const rect = target.getBoundingClientRect();

    // Calculate tooltip position.
    const tooltipTop = rect.bottom + window.scrollY; // Position below the term.
    const tooltipLeft = rect.left + window.scrollX; // Align with the left edge of the term.

    setTooltipPosition({ top: tooltipTop, left: tooltipLeft });
  };

  const handleMouseLeave = () => {
    setTooltipPosition(null);
  };

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="glossary-term"
      >
        {children}
      </span>

      {tooltipPosition && (
        <div
          ref={tooltipRef}
          className="tooltip-glossary"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            position: 'absolute',
          }}
        >
          {definition}
        </div>
      )}
    </>
  );
};

export default GlossaryTooltip;
