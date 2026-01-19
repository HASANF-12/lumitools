import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Copy, Trash2, CheckCircle2, Eye, Code, GitCompare } from 'lucide-react';
import { cn } from '../utils/cn';
import { marked } from 'marked';
import { CopyButton } from '../components/ui/CopyButton';
import { useUndoRedo } from '../hooks/useUndoRedo';

// --- Text Diff Checker ---
export const DiffChecker: React.FC = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [results, setResults] = useState<{ type: 'same' | 'added' | 'removed', val: string }[]>([]);

  const compare = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const diff: any[] = [];
    
    const max = Math.max(lines1.length, lines2.length);
    for (let i = 0; i < max; i++) {
      if (lines1[i] === lines2[i]) {
        diff.push({ type: 'same', val: lines1[i] || '' });
      } else {
        if (lines1[i]) diff.push({ type: 'removed', val: lines1[i] });
        if (lines2[i]) diff.push({ type: 'added', val: lines2[i] });
      }
    }
    setResults(diff);
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <textarea 
          className="h-64 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none font-mono text-sm"
          placeholder="Original text..."
          value={text1}
          onChange={e => setText1(e.target.value)}
        />
        <textarea 
          className="h-64 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none font-mono text-sm"
          placeholder="New text..."
          value={text2}
          onChange={e => setText2(e.target.value)}
        />
      </div>
      <Button onClick={compare} className="w-full">Compare Text</Button>
      
      {results.length > 0 && (
        <div className="p-4 bg-zinc-100 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs overflow-auto max-h-96">
          {results.map((line, i) => (
            <div key={i} className={cn(
              "px-2 py-0.5 whitespace-pre-wrap",
              line.type === 'added' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
              line.type === 'removed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
              'opacity-60'
            )}>
              {line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  '}{line.val}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Lorem Ipsum Generator ---
export const LoremIpsum: React.FC = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";
    setOutput(Array(paragraphs).fill(text).join('\n\n'));
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <label className="text-sm font-medium">Paragraphs:</label>
        <input 
          type="number" min="1" max="20" value={paragraphs} 
          onChange={e => setParagraphs(Number(e.target.value))}
          className="w-20 px-2 py-1 rounded bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700"
        />
        <Button onClick={generate} size="sm">Generate</Button>
      </div>
      <textarea 
        readOnly 
        className="w-full h-80 p-4 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 font-mono text-sm"
        value={output}
      />
    </div>
  );
};

// --- Markdown Preview ---
export const MarkdownPreview: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Hello World\n\nStart typing **markdown** here.');
  const [html, setHtml] = useState('');

  useEffect(() => {
    const rawHtml = marked.parse(markdown);
    if (rawHtml instanceof Promise) {
        rawHtml.then(h => setHtml(h));
    } else {
        setHtml(rawHtml as string);
    }
  }, [markdown]);

  return (
    <div className="grid md:grid-cols-2 gap-4 h-[600px]">
       <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
            <Code className="w-4 h-4" /> Source
         </div>
         <textarea
           className="flex-1 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm"
           value={markdown}
           onChange={(e) => setMarkdown(e.target.value)}
           placeholder="# Type your markdown here..."
         />
       </div>
       <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 text-zinc-500 font-medium text-sm">
            <Eye className="w-4 h-4" /> Preview
         </div>
         <div 
           className="flex-1 p-6 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 overflow-y-auto prose dark:prose-invert max-w-none"
           dangerouslySetInnerHTML={{ __html: html }}
         />
       </div>
    </div>
  );
};

// --- Word Counter ---
export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0, sentences: 0, paragraphs: 0 });

  useEffect(() => {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const chars = text.length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n+/).filter(Boolean).length;
    setStats({ words, chars, sentences, paragraphs });
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-xl text-center border border-brand-100 dark:border-brand-500/20">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">{value}</div>
            <div className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium">{key}</div>
          </div>
        ))}
      </div>
      <textarea
        className="w-full h-64 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none font-mono text-sm"
        placeholder="Type or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setText('')} disabled={!text}>Clear</Button>
      </div>
    </div>
  );
};

// --- Case Converter ---
export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');
  const undoRedo = useUndoRedo(text);

  // Sync undo/redo with text state (but avoid infinite loops)
  const isUndoRedoRef = React.useRef(false);
  
  useEffect(() => {
    if (!isUndoRedoRef.current && text !== undoRedo.current) {
      undoRedo.setValue(text);
    }
    isUndoRedoRef.current = false;
  }, [text]);

  const transform = (type: 'upper' | 'lower' | 'title' | 'sentence' | 'alternating') => {
    let newText = '';
    try {
      switch (type) {
        case 'upper': newText = text.toUpperCase(); break;
        case 'lower': newText = text.toLowerCase(); break;
        case 'title': newText = text.replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase())); break;
        case 'sentence': newText = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()); break;
        case 'alternating': 
          newText = text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''); 
          break;
      }
      setText(newText);
    } catch (error) {
      console.error('Error transforming text:', error);
    }
  };

  const handleUndo = () => {
    if (undoRedo.canUndo) {
      isUndoRedoRef.current = true;
      undoRedo.undo();
      setText(undoRedo.current);
    }
  };

  const handleRedo = () => {
    if (undoRedo.canRedo) {
      isUndoRedoRef.current = true;
      undoRedo.redo();
      setText(undoRedo.current);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 pb-2">
        <Button size="sm" variant="secondary" onClick={() => transform('upper')}>UPPERCASE</Button>
        <Button size="sm" variant="secondary" onClick={() => transform('lower')}>lowercase</Button>
        <Button size="sm" variant="secondary" onClick={() => transform('title')}>Title Case</Button>
        <Button size="sm" variant="secondary" onClick={() => transform('sentence')}>Sentence case</Button>
        <Button size="sm" variant="secondary" onClick={() => transform('alternating')}>aLtErNaTiNg</Button>
      </div>
      <div className="relative">
        <textarea
          className="w-full h-64 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm"
          placeholder="Type text to convert..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Text input for case conversion"
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <CopyButton text={text} size="sm" variant="outline" />
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleUndo}
            disabled={!undoRedo.canUndo}
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleRedo}
            disabled={!undoRedo.canRedo}
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setText('')}
            aria-label="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Remove Duplicates ---
export const RemoveDuplicates: React.FC = () => {
  const [text, setText] = useState('');

  const process = () => {
    const lines = text.split('\n');
    const unique = [...new Set(lines.map(l => l.trim()))];
    setText(unique.join('\n'));
  };

  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
         <p className="text-sm text-zinc-500">Removes identical lines from your text.</p>
         <Button onClick={process}>Remove Duplicates</Button>
       </div>
       <textarea
          className="w-full h-80 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm"
          placeholder="Paste list here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
    </div>
  );
}