import type { ComponentType } from 'react';

// Export all tool components
// Note: These imports will be updated as we refactor each component
export { default as BingoGame } from './Bingo/BingoGame.js'; 
export { default as ToolsSection } from './ToolsSection/ToolsSection.js';
export { FullscreenWrapper } from './ToolsSection/FullscreenWrapper.js';

// Re-export individual tools for direct imports
export { default as Snake } from './Snake/SnakeGame.js';
export { default as ConflictMediation } from './ConflictMediation/ConflictMediation.js';
export { NeedsAssessment } from './ConflictMediation';

// Export types
export type ToolId = 'bingo' | 'snake' | 'conflict-mediation';

export interface ToolDefinition {
  id: ToolId;
  title: string;
  icon: string;
  component: ComponentType<Record<string, unknown>>;
  description: string;
  keywords: string[];
}
