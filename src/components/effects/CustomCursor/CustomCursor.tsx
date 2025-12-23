/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

import "./custom-cursor.scss";

const springConfig = { damping: 20, stiffness: 350, mass: 0.1 };

type CustomCursorProps = {
  /**
   * Text shown in the cursor when hovering "clickable" elements (buttons/links or `[data-hover="true"]`).
   * Defaults to "View".
   */
  label?: string;
};

const CustomCursor = ({ label: defaultLabel = "View" }: CustomCursorProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState(defaultLabel);

  // Initialize off-screen to prevent flash
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring animation
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target;
      const element = target instanceof Element ? target : null;

      const clickable =
        element?.closest("button") ??
        element?.closest("a") ??
        element?.closest('[data-hover="true"]');

      const customTextElement = element?.closest("[data-cursor-text]");

      if (customTextElement) {
        const text = customTextElement.getAttribute("data-cursor-text");
        if (text) {
          setCursorText(text);
          setIsHovering(true);
          return;
        }
      }

      if (clickable) {
        setCursorText(defaultLabel);
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, {
      passive: true,
    });
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, [mouseX, mouseY, defaultLabel]);

  return (
    <motion.div
      className="custom-cursor"
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
    >
      {/* This div is the actual cursor "body" and will handle the scaling and text centering */}
      <motion.div
        className="custom-cursor__body"
        // Style width/height removed here as handled in CSS, but animating scale is fine to keep here or move to CSS if basic
        // Actually, frame-motion constraints are easier in JS for 'scale'
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Text directly inside the scalable cursor body, centered by flex parent */}
        <motion.span
          className="custom-cursor__label"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          {cursorText}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
