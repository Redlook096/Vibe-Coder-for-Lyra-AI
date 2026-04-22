import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Artifact, FileNode } from '../types';
import * as Sucrase from 'sucrase';

export const getPreviewContent = (files: FileNode[], entryFile: FileNode | undefined) => {
    if (!entryFile) return '';
    
    // If it's pure HTML, we still want to inject React scripts if it has a root and there are tsx/jsx files
    const hasReactFiles = files.some(f => f.name.endsWith('.tsx') || f.name.endsWith('.jsx'));
    
    if (entryFile.language === 'html' && !hasReactFiles) {
        return entryFile.content;
    }

    if (entryFile.language === 'html' || hasReactFiles) {
        let htmlContent = entryFile.language === 'html' ? entryFile.content : `<!DOCTYPE html>
<html>
<head>
  <style>body { margin: 0; padding: 0; background: #fff; font-family: sans-serif; }</style>
</head>
<body><div id="root"></div></body>
</html>`;

        // Create a basic bundling/resolution script
        const scripts = `
<script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.2.0?dev",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0/client?dev",
      "lucide-react": "https://esm.sh/lucide-react@0.344.0?dev"
    }
  }
</script>
<script type="module">
  import * as React from 'react';
  import * as ReactDOMClient from 'react-dom/client';
  import * as LucideReact from 'lucide-react';
  
  window.React = React.default || React;
  window.ReactDOMClient = ReactDOMClient;
  window.LucideReact = LucideReact;
</script>
<script src="https://cdn.tailwindcss.com"></script>
<script>
  window.addEventListener('load', () => {
  ${files.filter(f => ['typescript', 'javascript', 'css'].includes(f.language) || f.name.endsWith('.tsx') || f.name.endsWith('.jsx')).map(f => {
      if (f.name.endsWith('.css')) {
          return `
          const style_${f.id} = document.createElement('style');
          style_${f.id}.innerHTML = ${JSON.stringify(f.content)};
          document.head.appendChild(style_${f.id});
          `;
      }
      
      try {
          const compiled = Sucrase.transform(f.content, {
              transforms: ['typescript', 'jsx'],
              filePath: f.name
          }).code;
          
          // Execute script directly and export to window via an immediate function
          return `
          (function() {
              window.__modules = window.__modules || {};
              // Set up fake require
              const require = (dep) => {
                  if (dep === 'react') return window.React;
                  if (dep === 'lucide-react') return window.LucideReact;
                  if (dep === 'react-dom/client') return window.ReactDOMClient;
                  if (dep === 'react-dom') return window.ReactDOMClient;
                  
                  // Local resolution
                  if (dep.startsWith('.')) {
                      const cleanPath = dep.replace('./', '').replace('src/', '');
                      if (window.__modules[cleanPath + '.tsx']) return window.__modules[cleanPath + '.tsx'];
                      if (window.__modules[cleanPath + '.ts']) return window.__modules[cleanPath + '.ts'];
                      if (window.__modules[cleanPath + '.jsx']) return window.__modules[cleanPath + '.jsx'];
                      if (window.__modules[cleanPath + '.js']) return window.__modules[cleanPath + '.js'];
                      if (window.__modules[cleanPath]) return window.__modules[cleanPath];
                      
                      // Handle index fallback
                      if (window.__modules[cleanPath + '/index.tsx']) return window.__modules[cleanPath + '/index.tsx'];
                  }
                  console.warn('Missing dep: ', dep);
                  return {};
              };
              
              const module = { exports: {} };
              const exports = module.exports;
              
              try {
                  ${compiled.replace(/export\s+default\s+([A-Za-z0-9_]+)/g, 'exports.default = $1').replace(/export\s+const\s+([A-Za-z0-9_]+)\s*=/g, 'exports.$1 = const $1 =').replace(/import\s+(.*?)\s+from\s+['"](.*?)['"]/g, "const $1 = require('$2')").replace(/import\s+\{\s*(.*?)\s*\}\s+from\s+['"](.*?)['"]/g, "const { $1 } = require('$2')")}
                  
                  window.__modules['${f.name.replace('./', '').replace('src/', '')}'] = module.exports;
              } catch (e) {
                  console.error("Exec error in ${f.name}", e);
              }
          })();
          `;
      } catch (e) {
          console.error("Compile error in " + f.name, e);
          return '';
      }
  }).join('\n')}
  
  // Find entry point and run
  const runReact = () => {
      try {
          const appModule = window.__modules['App.tsx'] || window.__modules['main.tsx'] || window.__modules['index.tsx'] || window.__modules['App.js'];
          if (appModule) {
              let App = appModule.default || appModule.App;
              if (App) {
                  const root = window.ReactDOMClient.createRoot(document.getElementById('root'));
                  root.render(window.React.createElement(App));
              } else {
                 console.error("Could not find default export or App export in main module");
              }
          } else {
             console.error("Could not find entry point module (App.tsx, main.tsx, etc)");
          }
      } catch(e) {
          document.body.innerHTML += '<div style="padding: 20px; color: red;">Error mounting: ' + e.message + '</div>';
          console.error(e);
      }
  };
  
  // Wait a small tick to ensure module registration finishes
  setTimeout(runReact, 100);
  });
</script>
        `;
        
        if (htmlContent.includes('</body>')) {
            return htmlContent.replace('</body>', `${scripts}</body>`);
        } else {
            return htmlContent + scripts;
        }
    }

    if (entryFile.language === 'markdown') {
      return `<html><body style="font-family: system-ui, sans-serif; padding: 20px; line-height: 1.5; color: #333;">
        <h2>Markdown Preview</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${entryFile.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </body></html>`;
    }
    if (entryFile.language === 'javascript' || entryFile.language === 'typescript') {
      return `<html><body style="font-family: system-ui, sans-serif; padding: 20px; background: #1e1e1e; color: #fff;">
        <h3 style="color: #4ade80; margin-top: 0;">Console Output</h3>
        <pre id="out" style="font-family: monospace; white-space: pre-wrap;"></pre>
        <script>
          const out = document.getElementById('out');
          const originalLog = console.log;
          const originalError = console.error;
          console.log = (...args) => {
            out.textContent += args.join(' ') + '\\n';
            originalLog(...args);
          };
          console.error = (...args) => {
            out.innerHTML += '<span style="color: #f87171;">' + args.join(' ') + '</span>\\n';
            originalError(...args);
          };
          try {
            ${entryFile.content}
          } catch(e) {
            console.error(e.message);
          }
        </script>
      </body></html>`;
    }
    if (entryFile.language === 'json') {
      try {
        const parsed = JSON.parse(entryFile.content);
        return `<html><body style="font-family: system-ui, sans-serif; padding: 20px; background: #1e1e1e; color: #fff;">
          <pre style="font-family: monospace;">${JSON.stringify(parsed, null, 2)}</pre>
        </body></html>`;
      } catch(e) {
        return `<html><body style="font-family: system-ui, sans-serif; padding: 20px; background: #1e1e1e; color: #fff;">
          <h3 style="color: #f87171;">Invalid JSON</h3>
          <pre>${entryFile.content}</pre>
        </body></html>`;
      }
    }
    return `<html><body style="font-family: system-ui, sans-serif; padding: 20px; color: #333;">
      <p>Preview not available for ${entryFile.language} files.</p>
    </body></html>`;
};

export interface LivePreviewProps {
    artifact: Artifact;
    className?: string;
}

export function LivePreview({ artifact, className = '' }: LivePreviewProps) {
    const htmlFile = useMemo(() => {
        return artifact.files?.find(f => f.name.endsWith('index.html')) || artifact.files?.[0];
    }, [artifact.files]);

    return (
        <div className={`w-full h-full bg-white ${className}`}>
           <iframe 
                srcDoc={getPreviewContent(artifact.files || [], htmlFile)} 
                className="w-full h-full border-none"
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
        </div>
    );
}
