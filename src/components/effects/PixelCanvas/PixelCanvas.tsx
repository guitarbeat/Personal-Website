import PropTypes from "prop-types";
import { useEffect, useMemo, useRef } from "react";
import { debounce } from "../../../utils/commonUtils";

class Pixel {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  color: string;
  speed: number;
  size: number;
  sizeStep: number;
  minSize: number;
  maxSizeInteger: number;
  maxSize: number;
  alpha: number;
  delay: number;
  counter: number;
  counterStep: number;
  isIdle: boolean;
  isReverse: boolean;
  isShimmer: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
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
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
  }

  static getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    );
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

const clampGap = (value: number) => {
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

const normalizeSpeed = (value: number, reducedMotion: boolean) => {
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

interface PixelCanvasProps {
  className?: string;
  style?: React.CSSProperties;
  colors?: string[];
  gap?: number;
  speed?: number;
  noFocus?: boolean;
}

const PixelCanvas = ({
  className = "",
  style,
  colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"],
  gap = 5,
  speed = 35,
  noFocus = false,
}: PixelCanvasProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    let pixels: Pixel[] = [];
    let animationFrameId: number | undefined;
    const getNow = () =>
      typeof performance !== "undefined" && performance.now
        ? performance.now()
        : Date.now();

    let timePrevious = getNow();
    const timeInterval = 1000 / 60;

    const clearAnimation = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
      }
    };

    const getDistanceToCanvasCenter = (x: number, y: number) => {
      if (!canvas) return 0;
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

    const animate = (fnName: "appear" | "disappear") => {
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

    const handleAnimation = (name: "appear" | "disappear") => {
      clearAnimation();
      animate(name);
    };

    const handleMouseEnter = () => handleAnimation("appear");
    const handleMouseLeave = () => handleAnimation("disappear");

    const handleFocusIn = (event: FocusEvent) => {
      if (
        (event.currentTarget as HTMLElement | null)?.contains(
          event.relatedTarget as Node | null,
        )
      ) {
        return;
      }

      handleAnimation("appear");
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (
        (event.currentTarget as HTMLElement | null)?.contains(
          event.relatedTarget as Node | null,
        )
      ) {
        return;
      }

      handleAnimation("disappear");
    };

    init();
    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver === "function") {
      const debouncedInit = debounce(init, 200);

      resizeObserver = new ResizeObserver(() => {
        debouncedInit();
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
    <div
      className={`pixel-canvas ${className}`.trim()}
      ref={wrapperRef}
      style={style}
    >
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
