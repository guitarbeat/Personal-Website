import React from 'react';

// Export all tool components
export { default as BingoGame } from './BingoGame'; 
export { default as ToolsSection } from './ToolsSection';
export { FullscreenWrapper, FullscreenToolStyles } from './ToolsSection';

// Re-export individual tools for direct imports
export { default as Needs } from './needs';
export { default as Snake } from './snake';

// Export types
export type ToolId = 'bingo' | 'needs' | 'snake';

export interface ToolDefinition {
  id: ToolId;
  title: string;
  icon: string;
  component: (props: any) => any;
  description: string;
  keywords: string[];
} 