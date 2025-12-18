import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { initializeBodyScrollMotionBlur } from "./bodyScroll";

// * Blur effect timing constants
const BLUR_TIMING = {
  INITIALIZATION_DELAY_MS: 100, // Small delay to prevent blur effect conflicts during Matrix modal transition
};

/**
 * BlurSection wraps content and applies a scroll-speed-based blur effect.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to blur.
 * @param {string} [props.className] - Optional class name.
 * @param {object} [props.style] - Optional style object.
 * @param {string|React.ElementType} [props.as] - Element type to render as.
 * @param {boolean} [props.disabled] - Disable blur effect.
 * @param {number} [props.blurCap=10] - Maximum blur value.
 * @param {"x"|"y"|"both"} [props.blurAxis="y"] - Which axis to blur.
 * @returns {JSX.Element}
 */
interface BlurSectionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  disabled?: boolean;
  blurCap?: number;
  blurAxis?: "x" | "y" | "both";
  [key: string]: any;
}

const BlurSection = ({
  children,
  className,
  style = {},
  as: Component = "div",
  disabled = false,
  blurCap = 10,
  blurAxis = "y",
  ...props
}: BlurSectionProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!disabled && containerRef.current) {
      // Small delay to prevent blur effect initialization during Matrix modal transition
      // This prevents conflicts when authentication state changes while modal is closing
      const timer = setTimeout(() => {
        // Double-check that component is still mounted and not disabled
        if (containerRef.current && !disabled) {
          if (cleanupRef.current) {
            cleanupRef.current();
            cleanupRef.current = null;
          }
          cleanupRef.current = initializeBodyScrollMotionBlur(
            containerRef.current,
            { blurCap, blurAxis },
          );
        }
      }, BLUR_TIMING.INITIALIZATION_DELAY_MS);

      return () => {
        clearTimeout(timer);
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };
    }

    // Cleanup when disabled or component unmounts
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [disabled, blurCap, blurAxis]);

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        willChange: !disabled ? "filter" : "auto",
        transition: "filter 0.15s ease-out",
        ...style,
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

BlurSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  disabled: PropTypes.bool,
  blurCap: PropTypes.number,
  blurAxis: PropTypes.oneOf(["x", "y", "both"]),
};

BlurSection.defaultProps = {
  className: undefined,
  style: {},
  as: "div",
  disabled: false,
  blurCap: 10,
  blurAxis: "y",
};

export default React.memo(BlurSection);
