import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BrainIconShining } from './Icons';
import { ShiningText } from './ShiningText';

export function ThoughtProcess({ text, streamComplete, onComplete }: { text: string, streamComplete: boolean, onComplete: () => void }) {
    const [displayed, setDisplayed] = useState('');
    const [collapsed, setCollapsed] = useState(false);
    const [showText, setShowText] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const textBaseIndex = useRef(0);
    
    useEffect(() => {
        // Wait 1 second before beginning to render the thought process text
        const timer = setTimeout(() => {
            setShowText(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    
    useEffect(() => {
        if (!showText) return;
        
        let timeout: any;
        if (displayed.length < text.length) {
            timeout = setTimeout(() => {
                setDisplayed(text.slice(0, displayed.length + 3));
                if (containerRef.current) {
                    containerRef.current.scrollTo({
                        top: containerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 10); // Faster typing speed
        } else if (streamComplete) {
            // Text caught up and stream is completely done
            timeout = setTimeout(() => {
                setCollapsed(true);
                setTimeout(onComplete, 500); // Wait 500ms for visually smooth collapse
            }, 1000); // 1 second read buffer
        }
        return () => clearTimeout(timeout);
    }, [text, displayed, streamComplete, onComplete, showText]);

    return (
        <div className="thought-container flex flex-col items-start w-full">
            <div className={`thinking-indicator flex items-center gap-2 mt-2 ${collapsed ? 'done' : ''}`}>
                <div className="brain-wrapper flex items-center justify-center">
                    <BrainIconShining />
                </div>
                <ShiningText text="Thinking" />
            </div>
               
            <motion.div 
                className="thought-process-wrapper w-full overflow-hidden"
                initial={{ height: 'auto', opacity: 1, marginTop: 8 }}
                animate={collapsed ? { height: 0, opacity: 0, marginTop: 0 } : { height: 'auto', opacity: 1, marginTop: 8 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                {showText && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        ref={containerRef}
                        className="mt-2 text-sm italic text-zinc-400 overflow-y-hidden bg-transparent border-none text-left"
                        style={{ lineHeight: '1.5rem', maxHeight: '4.5rem', alignSelf: 'flex-start' }}
                    >
                        {displayed}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
