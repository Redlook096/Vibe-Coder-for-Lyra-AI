/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface FileNode {
  id: string;
  name: string;
  content: string;
  language: string;
}

export interface Artifact {
  id: string;
  files: FileNode[];
  status: 'streaming' | 'complete' | 'error';
}

export interface Session {
    id: string;
    prompt: string;
    timestamp: number;
    artifact?: Artifact;
    thoughtProcess?: string;
    thoughtStreamComplete?: boolean;
    isGeneratingArtifacts?: boolean;
}

export interface ComponentVariation { name: string; html: string; }
export interface LayoutOption { name: string; css: string; previewHtml: string; }