import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";

class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = Pixel.getRandomValue(0.05, 0.6) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.2;
    this.minSize = 0.3;
    this.maxSizeInteger = 1.4;
    this.maxSize = Pixel.getRandomValue(this.minSize, this.maxSizeInteger);
    this.alpha = Pixel.getRandomValue(0.08, 0.25);
    this.delay = delay;
    this.counter = 0;
    this.counterStep =
      Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  static getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    this.ctx.save();
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    );
    this.ctx.restore();
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }

    this.size -= 0.06;
    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

const clampGap = (value) => {
  const min = 4;
  const max = 50;

  if (value <= min) {
    return min;
  }

  if (value >= max) {
    return max;
  }

  return Math.floor(value);
};

const normalizeSpeed = (value, reducedMotion) => {
  const min = 0;
  const max = 100;
  const throttle = 0.001;

  if (reducedMotion || value <= min) {
    return min;
  }

  if (value >= max) {
    return max * throttle;
  }

  return value * throttle;
};

const PixelCanvas = ({
  className = "",
  style,
  colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"],
  gap = 5,
  speed = 35,
  noFocus = false,
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  const colorPalette = useMemo(() => {
    if (!colors || colors.length === 0) {
      return ["#f8fafc", "#f1f5f9", "#cbd5e1"];
    }

    return colors;
  }, [colors]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;

    if (!wrapper || !canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    const parentElement = wrapper.parentElement ?? wrapper;

    const reducedMotion =
      typeof window !== "undefined" && typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;

    const parsedGap = clampGap(gap);
    const parsedSpeed = normalizeSpeed(speed, reducedMotion);

    let pixels = [];
    let animationFrameId;
    const getNow = () =>
      (typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now());

    let timePrevious = getNow();
    const timeInterval = 1000 / 60;

    const clearAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    };

    const getDistanceToCanvasCenter = (x, y) => {
      const dx = x - canvas.width / 2;
      const dy = y - canvas.height / 2;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const createPixels = () => {
      pixels = [];
      for (let x = 0; x < canvas.width; x += parsedGap) {
        for (let y = 0; y < canvas.height; y += parsedGap) {
          const color =
            colorPalette[Math.floor(Math.random() * colorPalette.length)];
          const delay = reducedMotion ? 0 : getDistanceToCanvasCenter(x, y);

          pixels.push(
            new Pixel(canvas, context, x, y, color, parsedSpeed, delay),
          );
        }
      }
    };

    const init = () => {
      const rect = wrapper.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      createPixels();
    };

    const animate = (fnName) => {
      animationFrameId = requestAnimationFrame(() => animate(fnName));

      const timeNow = getNow();
      const timePassed = timeNow - timePrevious;

      if (timePassed < timeInterval) {
        return;
      }

      timePrevious = timeNow - (timePassed % timeInterval);
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < pixels.length; i += 1) {
        pixels[i][fnName]();
      }

      if (pixels.every((pixel) => pixel.isIdle)) {
        clearAnimation();
      }
    };

    const handleAnimation = (name) => {
      clearAnimation();
      animate(name);
    };

    const handleMouseEnter = () => handleAnimation("appear");
    const handleMouseLeave = () => handleAnimation("disappear");

    const handleFocusIn = (event) => {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      handleAnimation("appear");
    };

    const handleFocusOut = (event) => {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      handleAnimation("disappear");
    };

    init();
    let resizeObserver;

    if (typeof ResizeObserver === "function") {
      resizeObserver = new ResizeObserver(() => {
        init();
      });

      resizeObserver.observe(wrapper);
    }

    parentElement.addEventListener("mouseenter", handleMouseEnter);
    parentElement.addEventListener("mouseleave", handleMouseLeave);

    if (!noFocus) {
      parentElement.addEventListener("focusin", handleFocusIn);
      parentElement.addEventListener("focusout", handleFocusOut);
    }

    return () => {
      clearAnimation();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      parentElement.removeEventListener("mouseenter", handleMouseEnter);
      parentElement.removeEventListener("mouseleave", handleMouseLeave);

      if (!noFocus) {
        parentElement.removeEventListener("focusin", handleFocusIn);
        parentElement.removeEventListener("focusout", handleFocusOut);
      }
    };
  }, [colorPalette, gap, speed, noFocus]);

  return (
    <div className={`pixel-canvas ${className}`.trim()} ref={wrapperRef} style={style}>
      <canvas ref={canvasRef} />
    </div>
  );
};

PixelCanvas.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  colors: PropTypes.arrayOf(PropTypes.string),
  gap: PropTypes.number,
  speed: PropTypes.number,
  noFocus: PropTypes.bool,
};

export default PixelCanvas;
