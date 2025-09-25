import { AnimatePresence, motion } from "framer-motion";
import React, {
  useState,
  lazy,
  Suspense,
  useCallback,
  memo,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../effects/Matrix/AuthContext";
import { useKeyboardNavigation } from "../shared/hooks";
import { FullscreenWrapper } from "./FullscreenWrapper";
import "./styles/index.scss";

// * Component timing constants
const COMPONENT_TIMING = {
  RENDER_DELAY_MS: 100, // Small delay to prevent abrupt DOM changes during auth transitions
};

// Enhanced loading fallback
const LoadingFallback = memo(() => (
  <div className="loading-wrapper">
    <motion.i
      className="fas fa-spinner"
      animate={{ rotate: 360 }}
      transition={{
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
    <motion.span
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
    >
      Loading...
    </motion.span>
  </div>
));

LoadingFallback.displayName = "LoadingFallback";

// Tool transition hook
const useToolTransition = (initialTool, tools) => {
  const [selectedTool, setSelectedTool] = useState(initialTool);

  const handleToolSelect = useCallback((toolId) => {
    setSelectedTool(toolId);
  }, []);

  useKeyboardNavigation(
    (key) => {
      const currentIndex = tools.findIndex((tool) => tool.id === selectedTool);

      if (key === "ArrowRight") {
        const nextTool = tools[(currentIndex + 1) % tools.length];
        handleToolSelect(nextTool.id);
      } else if (key === "ArrowLeft") {
        const prevTool =
          tools[(currentIndex - 1 + tools.length) % tools.length];
        handleToolSelect(prevTool.id);
      }
    },
    ["ArrowRight", "ArrowLeft"],
  );

  return {
    selectedTool,
    handleToolSelect,
  };
};

// Preload hints for tools
const preloadTools = () => {
  const hints = [
    { rel: "preload", href: "./Bingo/BingoGame.js", as: "script" },
    { rel: "preload", href: "./Snake/SnakeGame.js", as: "script" },
    {
      rel: "preload",
      href: "./ConflictMediation/ConflictMediation.js",
      as: "script",
    },
  ];

  for (const { rel, href, as } of hints) {
    const link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
};

// Error Boundary with retry capability
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Tool error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h3>Something went wrong</h3>
          <p>{this.state.error?.message || "An unexpected error occurred"}</p>
          <button type="button" onClick={this.handleRetry} className="button">
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Tool card component
const ToolCard = memo(({ tool, isSelected, onSelect }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.button
      ref={ref}
      onClick={() => onSelect(tool.id)}
      className={`flex flex-col items-center text-center p-6 rounded-lg shadow-md bg-gray-800/60 hover:-translate-y-1 hover:shadow-lg transition-transform focus:outline-none ${isSelected ? "ring-2 ring-[var(--color-sage)]" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <i className={`${tool.icon} text-3xl text-[var(--color-sage)] mb-2`} />
      <h3 className="text-lg font-semibold text-[var(--color-text)]">
        {tool.title}
      </h3>
      <p className="text-sm text-[var(--color-text-light)]">
        {tool.description}
      </p>
    </motion.button>
  );
});

ToolCard.displayName = "ToolCard";

// Main component
const ToolsSection = () => {
  const { isUnlocked } = useAuth();
  // Make isUnlocked usage more obvious to the linter
  const toolsAccessible = isUnlocked;
  const [shouldRender, setShouldRender] = useState(false);
  const renderTimeoutRef = useRef(null);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Handle authentication state changes gracefully
  useEffect(() => {
    // Clear any existing timeout
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
      renderTimeoutRef.current = null;
    }

    if (toolsAccessible) {
      // Small delay to prevent sudden DOM changes during Matrix modal transition
      // This ensures smooth rendering after authentication state changes
      renderTimeoutRef.current = setTimeout(() => {
        setShouldRender(true);
        renderTimeoutRef.current = null;
      }, COMPONENT_TIMING.RENDER_DELAY_MS);
    } else {
      // Immediate hide for lock transition (no delay needed)
      setShouldRender(false);
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
        renderTimeoutRef.current = null;
      }
    };
  }, [toolsAccessible]);

  // Define available tools
  const tools = useMemo(
    () => [
      {
        id: "bingo",
        title: "Bingo Game",
        icon: "fas fa-th",
        component: lazy(() => import("../Bingo")),
        description: "Create and play custom bingo games",
        keywords: ["game", "bingo", "cards", "multiplayer"],
      },
      {
        id: "snake",
        title: "Snake Game",
        icon: "fas fa-gamepad",
        component: lazy(() => import("../Snake")),
        description: "Classic snake game with modern visuals",
        keywords: ["game", "snake", "arcade", "retro"],
      },
      {
        id: "conflict-mediation",
        title: "Conflict Resolution",
        icon: "fas fa-balance-scale",
        component: lazy(() => import("../ConflictMediation")),
        description: "Tool for resolving interpersonal conflicts",
        keywords: ["conflict", "resolution", "mediation", "relationships"],
      },
    ],
    [],
  );

  // Tool selection state
  const { selectedTool, handleToolSelect } = useToolTransition(
    tools[0]?.id,
    tools,
  );

  // Get the selected tool component
  const SelectedToolComponent = useMemo(() => {
    const tool = tools.find((t) => t.id === selectedTool);
    return tool?.component;
  }, [selectedTool, tools]);

  // Preload tools when section is in view and unlocked
  useEffect(() => {
    if (inView && toolsAccessible) {
      preloadTools();
    }
  }, [inView, toolsAccessible]);

  // Don't render anything if not unlocked
  if (!shouldRender) {
    return null;
  }

  return (
    <section id="tools" className="section" ref={ref}>
      <div className="section-title-container">
        <h2 className="section-title">Interactive Tools</h2>
        <div className="section-subtitle">
          Explore these interactive tools and utilities
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isSelected={selectedTool === tool.id}
            onSelect={handleToolSelect}
          />
        ))}
      </div>

      <div className="tool-content-container mt-8">
        <AnimatePresence mode="wait">
          {SelectedToolComponent && (
            <ErrorBoundary key={selectedTool}>
              <Suspense fallback={<LoadingFallback />}>
                <FullscreenWrapper toolId={selectedTool}>
                  <SelectedToolComponent />
                </FullscreenWrapper>
              </Suspense>
            </ErrorBoundary>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ToolsSection;
