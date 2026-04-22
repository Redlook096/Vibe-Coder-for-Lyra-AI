/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

//Vibe coded by ammaar@google.com

import { GoogleGenAI } from '@google/genai';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Artifact, Session, ComponentVariation, LayoutOption, FileNode } from './types';
import { INITIAL_PLACEHOLDERS } from './constants';
import { generateId } from './utils';

import { VibeIDE } from './components/VibeIDE';
import { ArtifactViewer } from './components/ArtifactViewer';
import { LivePreview } from './components/LivePreview';
import SideDrawer from './components/SideDrawer';
import { ThoughtProcess } from './components/ThoughtProcess';
import { TextEffect } from './components/TextEffect';
import { TextShimmer } from '@/components/core/text-shimmer';
import { ShiningText } from './components/ShiningText';
import { 
    ThinkingIcon, 
    CodeIcon, 
    SparklesIcon, 
    ArrowLeftIcon, 
    ArrowRightIcon, 
    ArrowUpIcon, 
    GridIcon,
    BrainIcon
} from './components/Icons';

const MOCK_OUT_OF_CREDITS_FILES: FileNode[] = [
  {
    id: 'mock-html',
    name: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background: #09090b; color: white; font-family: sans-serif; overflow: hidden; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; position: relative; }
        .bg-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; background: rgba(59,130,246,0.1); filter: blur(140px); border-radius: 50%; pointer-events: none; }
        .bg-gradient { position: absolute; bottom: 0; left: 0; width: 100%; height: 500px; background: linear-gradient(to top, #09090b, transparent); pointer-events: none; }
        .grid-bg { position: absolute; inset: 0; opacity: 0.2; pointer-events: none; background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px; z-index: 0; }
        .content { z-index: 10; text-align: center; animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; transform: translateY(30px); }
        .icon-container { display: flex; justify-content: center; margin-bottom: 2.5rem; }
        
        .core-icon { 
            padding: 1.5rem; border-radius: 2.5rem; background: rgba(24,24,27,0.5); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(24px); 
            animation: pulse-shadow 4s infinite ease-in-out, spin 30s linear infinite;
        }
        .core-icon svg { width: 4rem; height: 4rem; color: #60a5fa; }
        h1 { font-size: 4.5rem; font-weight: bold; letter-spacing: -0.025em; margin-bottom: 1.5rem; background: linear-gradient(to bottom, #ffffff, #ffffff, #52525b); -webkit-background-clip: text; color: transparent; font-style: italic; }
        p { color: #a1a1aa; font-size: 1.25rem; max-width: 32rem; margin: 0 auto 4rem auto; font-weight: 300; line-height: 1.6; }
        .modules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; max-width: 48rem; margin: 0 auto; }
        .module { padding: 2rem; border-radius: 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(4px); transition: all 0.3s; cursor: default; opacity: 0; transform: scale(0.9); animation: popIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .module:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); transform: scale(1.02); }
        .module svg { width: 2rem; height: 2rem; margin: 0 auto 1rem auto; transition: transform 0.3s; }
        .module:hover svg { transform: scale(1.1); }
        .module-label { font-weight: 600; color: #f4f4f5; margin-bottom: 0.25rem; }
        .module-sub { font-size: 0.75rem; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em; }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-shadow { 0%, 100% { box-shadow: 0 0 20px rgba(59,130,246,0.2); } 50% { box-shadow: 0 0 60px rgba(59,130,246,0.4); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn { to { opacity: 1; transform: scale(1); } }
        
        .mod-1 { animation-delay: 0.8s; }
        .mod-2 { animation-delay: 0.9s; }
        .mod-3 { animation-delay: 1.0s; }
    </style>
</head>
<body>
    <div class="grid-bg"></div>
    <div class="bg-glow"></div>
    <div class="bg-gradient"></div>
    
    <div class="content">
        <div class="icon-container">
            <div class="core-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            </div>
        </div>
        
        <h1>VIBE SYSTEM</h1>
        <p>High-performance neural architecture initialized. Your creative vision is being transpiled in real-time.</p>
        
        <div class="modules">
            <div class="module mod-1">
                <svg style="color: #60a5fa;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6.5 2a1 1 0 0 1 1 1z"/></svg>
                <div class="module-label">Encrypted</div>
                <div class="module-sub">Static Analysis</div>
            </div>
            <div class="module mod-2">
                <svg style="color: #fbbf24;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <div class="module-label">Inertial</div>
                <div class="module-sub">0ms Latency</div>
            </div>
            <div class="module mod-3">
                <svg style="color: #c084fc;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>
                <div class="module-label">Synaptic</div>
                <div class="module-sub">AI Optimized</div>
            </div>
        </div>
    </div>
</body>
</html>`
  },
  {
    id: 'mock-tsx',
    name: 'src/App.tsx',
    language: 'typescript',
    content: `import React from 'react';
import { motion } from 'motion/react';
import { Globe, Shield, Zap, Sparkles, Code2, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="z-10 text-center"
      >
        <div className="flex justify-center mb-10">
          <motion.div
            animate={{ 
              rotate: 360,
              boxShadow: ["0 0 20px rgba(59,130,246,0.2)", "0 0 60px rgba(59,130,246,0.4)", "0 0 20px rgba(59,130,246,0.2)"]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="p-6 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 backdrop-blur-2xl"
          >
            <Cpu className="w-16 h-16 text-blue-400" />
          </motion.div>
        </div>

        <h1 className="text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white via-white to-zinc-600 bg-clip-text text-transparent italic">
          VIBE SYSTEM
        </h1>
        
        <p className="text-zinc-400 text-xl max-w-lg mx-auto mb-16 font-light leading-relaxed">
          High-performance neural architecture initialized. Your creative vision is being transpiled in real-time.
        </p>

        <div className="grid grid-cols-3 gap-8 max-w-3xl">
          {[
            { icon: Shield, label: "Encrypted", sub: "Static Analysis", color: "text-blue-400" },
            { icon: Zap, label: "Inertial", sub: "0ms Latency", color: "text-amber-400" },
            { icon: Sparkles, label: "Synaptic", sub: "AI Optimized", color: "text-purple-400" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              className="group p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-default"
            >
              <item.icon className={\`w-8 h-8 mb-4 mx-auto \${item.color} group-hover:scale-110 transition-transform\`} />
              <div className="block font-semibold text-zinc-100 mb-1">{item.label}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest">{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ambient Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
    `.trim()
  }
];

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(-1);
  const [focusedArtifactIndex, setFocusedArtifactIndex] = useState<number | null>(null);
  
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholders, setPlaceholders] = useState<string[]>(INITIAL_PLACEHOLDERS);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  
  const [drawerState, setDrawerState] = useState<{
      isOpen: boolean;
      mode: 'code' | 'variations' | null;
      title: string;
      data: any; 
  }>({ isOpen: false, mode: null, title: '', data: null });

  const [componentVariations, setComponentVariations] = useState<ComponentVariation[]>([]);
  const [thoughtResolver, setThoughtResolver] = useState<(() => void) | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      inputRef.current?.focus();
  }, []);

  // Fix for mobile: reset scroll when focusing an item to prevent "overscroll" state
  useEffect(() => {
    if (focusedArtifactIndex !== null && window.innerWidth <= 1024) {
        if (gridScrollRef.current) {
            gridScrollRef.current.scrollTop = 0;
        }
        window.scrollTo(0, 0);
    }
  }, [focusedArtifactIndex]);

  // Cycle placeholders
  useEffect(() => {
      if (!isAnimationFinished) return;
      
      const timer = setTimeout(() => {
          setIsAnimationFinished(false); // Reset for next item
          setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
      }, 1000); // 1 second rest
      return () => clearTimeout(timer);
  }, [isAnimationFinished, placeholders.length]);

  // Dynamic placeholder generation on load
  useEffect(() => {
      const fetchDynamicPlaceholders = async () => {
          try {
              const apiKey = process.env.API_KEY;
              if (!apiKey) return;
              const ai = new GoogleGenAI({ apiKey });
              const response = await ai.models.generateContent({
                  model: 'gemini-3-flash-preview',
                  contents: { 
                      role: 'user', 
                      parts: [{ 
                          text: 'Generate 20 creative, short, diverse UI component prompts (e.g. "bioluminescent task list"). Return ONLY a raw JSON array of strings. IP SAFEGUARD: Avoid referencing specific famous artists, movies, or brands.' 
                      }] 
                  }
              });
              const text = response.text || '[]';
              const jsonMatch = text.match(/\[[\s\S]*\]/);
              if (jsonMatch) {
                  const newPlaceholders = JSON.parse(jsonMatch[0]);
                  if (Array.isArray(newPlaceholders) && newPlaceholders.length > 0) {
                      const shuffled = newPlaceholders.sort(() => 0.5 - Math.random()).slice(0, 10);
                      setPlaceholders(prev => [...prev, ...shuffled]);
                  }
              }
          } catch (e) {
              console.warn("Silently failed to fetch dynamic placeholders", e);
          }
      };
      setTimeout(fetchDynamicPlaceholders, 1000);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const parseJsonStream = async function* (responseStream: AsyncGenerator<{ text: string }>) {
      let buffer = '';
      for await (const chunk of responseStream) {
          const text = chunk.text;
          if (typeof text !== 'string') continue;
          buffer += text;
          let braceCount = 0;
          let start = buffer.indexOf('{');
          while (start !== -1) {
              braceCount = 0;
              let end = -1;
              for (let i = start; i < buffer.length; i++) {
                  if (buffer[i] === '{') braceCount++;
                  else if (buffer[i] === '}') braceCount--;
                  if (braceCount === 0 && i > start) {
                      end = i;
                      break;
                  }
              }
              if (end !== -1) {
                  const jsonString = buffer.substring(start, end + 1);
                  try {
                      yield JSON.parse(jsonString);
                      buffer = buffer.substring(end + 1);
                      start = buffer.indexOf('{');
                  } catch (e) {
                      start = buffer.indexOf('{', start + 1);
                  }
              } else {
                  break; 
              }
          }
      }
  };

  const handleSendMessage = useCallback(async (manualPrompt?: string) => {
    const promptToUse = manualPrompt || inputValue;
    const trimmedInput = promptToUse.trim();
    if (!trimmedInput || isLoading) return;
    if (!manualPrompt) setInputValue('');

    setIsLoading(true);
    setIsThinking(true);
    const baseTime = Date.now();
    const sessionId = generateId();

    const singleArtifact: Artifact = {
        id: `${sessionId}_0`,
        files: [],
        status: 'streaming',
    };

    const newSession: Session = {
        id: sessionId,
        prompt: trimmedInput,
        timestamp: baseTime,
        artifact: singleArtifact,
        thoughtProcess: '',
        thoughtStreamComplete: false,
        isGeneratingArtifacts: false
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionIndex(sessions.length); 
    setFocusedArtifactIndex(0); 
    
    // Create coordination promise
    let resolver: () => void;
    const typingCoordination = new Promise<void>(res => { resolver = res; });
    setThoughtResolver(() => resolver);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) throw new Error("API_KEY is not configured.");
        const ai = new GoogleGenAI({ apiKey });

        let isFallbackMode = false;

        // Phase 1: Stream thought process
        const thoughtPrompt = `You are Vibe Coder. You must respond following EXACTLY this structure for the user prompt: "${trimmedInput}":

The user wants <1 sentence summary of prompt>. I need to think about <main function 1>. <Then do function two>. <Then function 3>. <1 sentence about the design>.

Constraint: Do NOT include any markdown markup, bullet points, asterisks, or introductory words. Just output the exact text filling in those brackets. ABSOLUTE STRICT LIMIT: Around 200 words. Output between 150 and 200 words. Make it detailed.`;
        
        try {
            const thoughtStream = await ai.models.generateContentStream({
                model: 'gemini-3.1-pro-preview',
                contents: [{ role: 'user', parts: [{ text: thoughtPrompt }] }]
            });

            let accumulatedThought = '';
            for await (const chunk of thoughtStream) {
                if (chunk.text) {
                    accumulatedThought += chunk.text;
                    setSessions(prev => prev.map(s => 
                        s.id === sessionId ? { ...s, thoughtProcess: accumulatedThought } : s
                    ));
                }
            }
        } catch (thoughtError) {
            console.warn("Thought stream failed, checking credits...", thoughtError);
            isFallbackMode = true;
            setSessions(prev => prev.map(s => 
                s.id === sessionId ? { ...s, thoughtProcess: "[Out of credits]" } : s
            ));
        }
        
        // Mark stream complete to let typewriter finish and trigger collapse
        setSessions(prev => prev.map(s => 
            s.id === sessionId ? { ...s, thoughtStreamComplete: true } : s
        ));

        // Await typewriter to naturally finish writing, sit for 1s, and run collapse animation
        await typingCoordination;
        setIsThinking(false);
        setThoughtResolver(null);
        
        // Begin phase 2: Actually rendering
        setSessions(prev => prev.map(s => 
            s.id === sessionId ? { ...s, isGeneratingArtifacts: true } : s
        ));

        if (isFallbackMode) {
            // Simulated delay for "satisfaction"
            await new Promise(r => setTimeout(r, 2000));
            setSessions(prev => prev.map(sess => 
                sess.id === sessionId && sess.artifact ? {
                    ...sess,
                    artifact: { ...sess.artifact, files: MOCK_OUT_OF_CREDITS_FILES, status: 'complete' }
                } : sess
            ));
            return;
        }

        const prompt = `
You are an expert software engineer AI Assistant called Lyra. You have a high-performance VFS (Virtual File System) execution engine that can resolve dependencies between files (HTML, CSS, JS, TS, JSX, TSX).

When given a coding task, always scaffold a proper project structure with multiple files and folders.

TASK: "${trimmedInput}"

System Capabilities:
- Full VFS Support: If index.html references <link href="style.css">, the engine will find style.css in your output.
- React Support: You can write .tsx or .jsx files. The engine will transpile them on the fly and mount them to a <div id="root">.
- Modern Module Support: Use ES6 imports. External libraries like 'lucide-react' and 'motion/react' are available via ESM.
- Tailwind Support: The engine automatically injects a Tailwind CDN in HTML files for rapid styling.

Rules:
- NEVER output a single file if the task is complex. Split logic, styles, and markup.
- For React apps, provide: index.html (with #root div), App.tsx (component logic), and style.css.
- Use 'lucide-react' for icons and 'motion/react' for animations.

Output format:
Output the full folder tree first, then output EACH file using markdown code blocks prefixed with 'Path: folder/filename.ext' like so:

Path: index.html
\`\`\`html
<!-- ... -->
\`\`\`

Path: src/App.tsx
\`\`\`tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
// ...
\`\`\`
          `.trim();
          
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3.1-pro-preview',
            contents: [{ parts: [{ text: prompt }], role: "user" }],
        });

        let currentPath = '';
        let currentContent = '';
        let insideCodeBlock = false;
        let files: FileNode[] = [];

        for await (const chunk of responseStream) {
            const text = chunk.text;
            if (typeof text === 'string') {
                const lines = text.split('\n');
                for(let i=0; i<lines.length; i++){
                    const line = lines[i];
                    
                    if (line.trim().startsWith('Path: ')) {
                        // Flush previous if exists without closing backticks
                        if (currentPath && currentContent.trim()) {
                            // Already handled mostly by closing backticks, but just in case
                        }
                        currentPath = line.replace('Path:', '').trim();
                        currentContent = '';
                    } else if (line.trim().startsWith('```')) {
                        if (!insideCodeBlock) {
                            insideCodeBlock = true;
                            // Language is the rest of the line
                        } else {
                            insideCodeBlock = false;
                            if (currentPath && currentContent) {
                                // Add/Update file
                                const ext = currentPath.split('.').pop() || 'txt';
                                const langMap: Record<string,string> = {
                                    'js': 'javascript', 'ts': 'typescript', 'jsx': 'javascript', 'tsx': 'typescript',
                                    'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown'
                                };
                                const file: FileNode = {
                                    id: generateId(),
                                    name: currentPath,
                                    language: langMap[ext] || 'plaintext',
                                    content: currentContent.trim()
                                };
                                files = [...files.filter(f => f.name !== file.name), file];
                                
                                setSessions(prev => prev.map(sess => 
                                    sess.id === sessionId && sess.artifact ? {
                                        ...sess,
                                        artifact: { ...sess.artifact, files }
                                    } : sess
                                ));
                                currentPath = '';
                                currentContent = '';
                            }
                        }
                    } else if (insideCodeBlock) {
                        currentContent += line + '\n';
                        if (currentPath) {
                            // Realtime update while streaming
                            const ext = currentPath.split('.').pop() || 'txt';
                            const langMap: Record<string,string> = {
                                'js': 'javascript', 'ts': 'typescript', 'jsx': 'javascript', 'tsx': 'typescript',
                                'html': 'html', 'css': 'css', 'json': 'json', 'md': 'markdown'
                            };
                            const file: FileNode = {
                                id: generateId(),
                                name: currentPath,
                                language: langMap[ext] || 'plaintext',
                                content: currentContent
                            };
                            const existingFiles = files.filter(f => f.name !== file.name);
                            setSessions(prev => prev.map(sess => 
                                sess.id === sessionId && sess.artifact ? {
                                    ...sess,
                                    artifact: { ...sess.artifact, files: [...existingFiles, file] }
                                } : sess
                            ));
                        }
                    }
                }
            }
        }
        
        setSessions(prev => prev.map(sess => 
            sess.id === sessionId && sess.artifact ? {
                ...sess,
                artifact: { ...sess.artifact, status: 'complete' }
            } : sess
        ));

    } catch (e: any) {
        console.error('Error generating artifact:', e);
        // Fallback to mock data even if phase 2 fails mid-stream or at start
        setSessions(prev => prev.map(sess => 
            sess.id === sessionId && sess.artifact ? {
                ...sess,
                artifact: { 
                    ...sess.artifact, 
                    files: MOCK_OUT_OF_CREDITS_FILES,
                    status: 'complete' 
                }
            } : sess
        ));
    } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [inputValue, isLoading, sessions.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      event.preventDefault();
      handleSendMessage();
    } else if (event.key === 'Tab' && !inputValue && !isLoading) {
        event.preventDefault();
        setInputValue(placeholders[placeholderIndex]);
    }
  };

  const nextItem = useCallback(() => {
      if (currentSessionIndex < sessions.length - 1) setCurrentSessionIndex(currentSessionIndex + 1);
  }, [currentSessionIndex, sessions.length]);

  const prevItem = useCallback(() => {
      if (currentSessionIndex > 0) setCurrentSessionIndex(currentSessionIndex - 1);
  }, [currentSessionIndex]);

  const isLoadingDrawer = isLoading && drawerState.mode === 'variations' && componentVariations.length === 0;

  const hasStarted = sessions.length > 0 || isLoading;
  const currentSession = sessions[currentSessionIndex];

  let canGoBack = false;
  let canGoForward = false;

  if (hasStarted) {
      if (focusedArtifactIndex !== null) {
          canGoBack = false;
          canGoForward = false;
      } else {
          canGoBack = currentSessionIndex > 0;
          canGoForward = currentSessionIndex < sessions.length - 1;
      }
  }

  return (
    <>
      {/* removed creator credit */}

        <SideDrawer 
            isOpen={drawerState.isOpen} 
            onClose={() => setDrawerState(s => ({...s, isOpen: false}))} 
            title={drawerState.title}
        >
            {isLoadingDrawer && (
                 <div className="loading-state">
                     <ThinkingIcon /> 
                     Designing variations...
                 </div>
            )}

            {drawerState.mode === 'code' && (
                <pre className="code-block"><code>{drawerState.data}</code></pre>
            )}
        </SideDrawer>

        <div className="immersive-app">
            {/* removed DottedGlowBackground */}

            <div className={`stage-container ${focusedArtifactIndex !== null ? 'mode-focus' : 'mode-split'}`}>
                 <div className={`empty-state ${hasStarted ? 'fade-out' : ''}`}>
                     <div className="empty-content">
                         <h1>Vibe Coder</h1>
                         <p>Build your next million dollar SaaS with Vibe Coder</p>
                         {/* removed surprise button */}
                     </div>
                 </div>

                {sessions.map((session, sIndex) => {
                    let positionClass = 'hidden';
                    if (sIndex === currentSessionIndex) positionClass = 'active-session';
                    else if (sIndex < currentSessionIndex) positionClass = 'past-session';
                    else if (sIndex > currentSessionIndex) positionClass = 'future-session';
                    
                    return (
                        <div key={session.id} className={`session-group ${positionClass}`}>
                            {!session.isGeneratingArtifacts && (
                                <div className="chat-thread">
                                    <div className="user-message-bubble">
                                        {session.prompt}
                                    </div>
                                    {(isThinking && sIndex === currentSessionIndex) && (
                                        <ThoughtProcess 
                                            text={session.thoughtProcess || ''} 
                                            streamComplete={session.thoughtStreamComplete || false}
                                            onComplete={() => {
                                                if (thoughtResolver) thoughtResolver();
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            
                            {session.isGeneratingArtifacts && sIndex === currentSessionIndex && session.artifact && (
                                <div className="absolute inset-0 z-50 overflow-hidden bg-zinc-950 transition-all duration-700">
                                    <ArtifactViewer artifact={session.artifact} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

             {canGoBack && (
                <button className="nav-handle left" onClick={prevItem} aria-label="Previous">
                    <ArrowLeftIcon />
                </button>
             )}
             {canGoForward && (
                <button className="nav-handle right" onClick={nextItem} aria-label="Next">
                    <ArrowRightIcon />
                </button>
             )}

            <div className="floating-input-container">
                <div className={`input-wrapper ${isLoading ? 'loading' : ''}`}>
                    {(!inputValue && !isLoading) && (
                        <div className="animated-placeholder">
                            <TextEffect
                                preset="blur"
                                per="char"
                                className="placeholder-text"
                                onAnimationComplete={() => setIsAnimationFinished(true)}
                                onAnimationStart={() => setIsAnimationFinished(false)}
                            >
                                {placeholders[placeholderIndex]}
                            </TextEffect>
                            {isAnimationFinished && <span className="tab-hint">Tab</span>}
                        </div>
                    )}
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={isLoading ? "" : inputValue} 
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown} 
                        disabled={isLoading} 
                        className={isLoading ? "hidden" : "flex-1 bg-transparent border-none outline-none text-white text-base z-[2]"}
                    />
                    {!isLoading && (
                        <button className="send-button" onClick={() => handleSendMessage()} disabled={!inputValue.trim()}>
                            <ArrowUpIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    </>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<React.StrictMode><App /></React.StrictMode>);
}