import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Play } from 'lucide-react';
import { Artifact } from '../types';
import { VibeIDE } from './VibeIDE';
import { LivePreview } from './LivePreview';

interface ArtifactViewerProps {
    artifact: Artifact;
}

export function ArtifactViewer({ artifact }: ArtifactViewerProps) {
    const [view, setView] = useState<'preview' | 'code'>('preview');
    const [liveFiles, setLiveFiles] = useState<FileNode[]>(artifact.files);

    // Keep it in sync if parent artifact changes natively (e.g. streaming update)
    React.useEffect(() => {
        setLiveFiles(artifact.files);
    }, [artifact.files]);

    return (
        <div className="absolute inset-0 z-50 bg-zinc-950 flex flex-col p-4 md:p-8 overflow-hidden pointer-events-auto">
            {/* View Toggle */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-6 right-10 z-[100] flex items-center bg-zinc-900 border border-zinc-700/50 rounded-xl p-1 shadow-2xl backdrop-blur"
            >
                <button 
                    onClick={() => setView('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${view === 'preview' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Play className="w-4 h-4" /> Preview
                </button>
                <button 
                    onClick={() => setView('code')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${view === 'code' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                    <Code className="w-4 h-4" /> Code
                </button>
            </motion.div>

            <div className="flex-1 w-full min-h-0 relative mt-16 pb-20">
                <AnimatePresence mode="wait">
                    {view === 'preview' && (
                        <motion.div 
                            key="preview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-full flex items-center justify-center p-2"
                        >
                            <div className="w-full h-full max-w-[1400px] border-[1px] border-white/20 rounded-[2rem] overflow-hidden shadow-2xl relative bg-black ring-1 ring-white/10 flex flex-col">
                                <div className="h-6 w-full shrink-0 bg-zinc-900/40 border-b border-white/10 flex items-center justify-center">
                                    <div className="w-12 h-1 rounded-full bg-white/20" />
                                </div>
                                <div className="flex-1 relative">
                                    <LivePreview artifact={{...artifact, files: liveFiles}} className="absolute inset-0" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === 'code' && (
                        <motion.div 
                            key="code"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full h-full rounded-[2rem] overflow-hidden border border-zinc-800/50 shadow-2xl bg-black"
                        >
                            <VibeIDE artifact={{...artifact, files: liveFiles}} onFilesChange={setLiveFiles} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
