import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Copy, RefreshCw, CheckCircle2, Download, Upload, ArrowRightLeft, ShieldCheck, Clock, ShieldAlert } from 'lucide-react';
import { cn } from '../utils/cn';
import { useToast } from '../components/ui/Toast';

// --- JWT Debugger ---
export const JwtDebugger: React.FC = () => {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!token.trim()) {
        setHeader('');
        setPayload('');
        setError(null);
        return;
      }

      const parts = token.split('.');
      if (parts.length < 2) {
        throw new Error('Invalid JWT: Missing components.');
      }

      const decode = (str: string) => {
        try {
          const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          return JSON.parse(atob(base64));
        } catch(e) { return { error: "Could not decode part" }; }
      };

      setHeader(JSON.stringify(decode(parts[0]), null, 2));
      setPayload(JSON.stringify(decode(parts[1]), null, 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
      setHeader('');
      setPayload('');
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-zinc-500 uppercase">Encoded Token</label>
        <textarea
          className="w-full h-32 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm break-all"
          placeholder="Paste your JWT (header.payload.signature) here..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/30 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
           <label className="text-sm font-bold text-red-500 uppercase">Header</label>
           <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-auto h-64 whitespace-pre-wrap">
              {header || <span className="text-zinc-400 italic">Waiting for input...</span>}
           </pre>
        </div>
        <div className="space-y-2">
           <label className="text-sm font-bold text-purple-500 uppercase">Payload</label>
           <pre className="p-4 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 text-xs font-mono overflow-auto h-64 whitespace-pre-wrap">
              {payload || <span className="text-zinc-400 italic">Waiting for input...</span>}
           </pre>
        </div>
      </div>
    </div>
  );
};

// --- SQL Formatter (Enhanced) ---
export const SqlFormatter: React.FC = () => {
  const [sql, setSql] = useState('');

  const format = () => {
    if (!sql.trim()) return;
    
    // Improved regex-based formatting logic
    let formatted = sql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ', ')
      .replace(/\b(SELECT|FROM|WHERE|LEFT JOIN|RIGHT JOIN|INNER JOIN|JOIN|GROUP BY|ORDER BY|HAVING|LIMIT|AND|OR|ON|AS|INSERT INTO|UPDATE|DELETE|SET|VALUES|UNION|ALL|CREATE TABLE|DROP|ALTER)\b/gi, (match) => `\n${match.toUpperCase()}`)
      .replace(/\b(ASC|DESC|IN|LIKE|IS|NULL|BETWEEN|EXISTS)\b/gi, (match) => ` ${match.toUpperCase()} `)
      .trim();

    // Basic indentation for keywords starting on new lines
    const lines = formatted.split('\n');
    const indented = lines.map(line => {
        if (line.match(/^(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/)) return line;
        return '  ' + line;
    }).join('\n');

    setSql(indented);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
         <span className="text-sm text-zinc-500">Formats queries for readability.</span>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSql('')}>Clear</Button>
            <Button size="sm" onClick={format}>Prettify SQL</Button>
         </div>
      </div>
      <textarea
        className="w-full h-96 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-brand-500 outline-none resize-none font-mono text-sm leading-relaxed"
        placeholder="SELECT * FROM users JOIN orders ON users.id = orders.user_id WHERE active = 1 ORDER BY date DESC"
        value={sql}
        onChange={(e) => setSql(e.target.value)}
      />
    </div>
  );
};

// --- Password Generator ---
export const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [strength, setStrength] = useState<'Weak'|'Medium'|'Strong'>('Weak');

  const generate = () => {
    let charset = '';
    if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    if (!charset) { setPassword('Select options!'); return; }

    let retVal = '';
    for (let i = 0; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(retVal);
    calculateStrength(retVal);
  };

  const calculateStrength = (pwd: string) => {
    let s = 0;
    if (pwd.length > 8) s++;
    if (pwd.length > 12) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    
    if (s < 3) setStrength('Weak');
    else if (s < 5) setStrength('Medium');
    else setStrength('Strong');
  };

  useEffect(() => { generate(); }, []);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="relative">
        <input 
          readOnly 
          value={password}
          className="w-full text-center text-3xl md:text-4xl font-mono p-8 rounded-2xl bg-zinc-100 dark:bg-black border-2 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 outline-none focus:border-brand-500 transition-colors"
        />
        <Button 
          variant="ghost" 
          className="absolute right-4 top-1/2 -translate-y-1/2"
          onClick={() => navigator.clipboard.writeText(password)}
        >
          <Copy className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center justify-between px-2">
         <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Strength:</span>
            <span className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full", strength === 'Weak' ? 'bg-red-100 text-red-600' : strength === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600')}>
                {strength}
            </span>
         </div>
         <Button onClick={generate} size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Generate</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800">
         <div className="space-y-4">
            <label className="block">
               <span className="text-sm font-medium mb-2 block">Length: {length}</span>
               <input type="range" min="8" max="64" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-brand-600" />
            </label>
         </div>
         <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className="rounded text-brand-600" /> Upper</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className="rounded text-brand-600" /> Lower</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} className="rounded text-brand-600" /> Numbers</label>
            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="rounded text-brand-600" /> Symbols</label>
         </div>
      </div>
    </div>
  );
};

// --- URL Encoder/Decoder ---
export const UrlEncoder: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const encode = () => setOutput(encodeURIComponent(input));
  const decode = () => { try { setOutput(decodeURIComponent(input)); } catch(e) { setOutput('Invalid URL encoding'); } };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <textarea className="h-40 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none font-mono text-sm" placeholder="Paste text or URL here..." value={input} onChange={e => setInput(e.target.value)} />
        <textarea readOnly className="h-40 p-4 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 font-mono text-sm text-zinc-500" value={output} placeholder="Result will appear here..." />
      </div>
      <div className="flex gap-4 justify-center">
         <Button onClick={encode}>Encode</Button>
         <Button onClick={decode} variant="secondary">Decode</Button>
      </div>
    </div>
  );
};

// --- Unix Timestamp ---
export const UnixTimestamp: React.FC = () => {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [inputTs, setInputTs] = useState('');
  const [convertedDate, setConvertedDate] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const convertTs = () => {
     if (!inputTs) return;
     const ts = Number(inputTs);
     const date = new Date(ts * (ts < 10000000000 ? 1000 : 1));
     setConvertedDate(date.toLocaleString());
  };

  return (
    <div className="space-y-8 text-center max-w-xl mx-auto">
      <div className="bg-brand-600 text-white p-8 rounded-2xl shadow-lg shadow-brand-500/20">
         <div className="text-sm opacity-80 uppercase tracking-widest font-bold">Current Unix Epoch</div>
         <div className="text-5xl font-mono font-bold mt-2">{now}</div>
      </div>
      <div className="space-y-4">
         <div className="flex gap-2">
            <input className="flex-1 p-3 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono" placeholder="Enter timestamp..." value={inputTs} onChange={e => setInputTs(e.target.value)} />
            <Button onClick={convertTs}>Convert</Button>
         </div>
         {convertedDate && (
            <div className="p-6 bg-zinc-100 dark:bg-black rounded-2xl font-mono text-brand-600 border border-brand-500/10">
               {convertedDate}
            </div>
         )}
      </div>
    </div>
  );
};

// --- UUID Generator ---
export const UuidGenerator: React.FC = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const generate = () => setUuids(Array.from({ length: 5 }, () => crypto.randomUUID()));
  useEffect(() => { generate(); }, []);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
         <span className="text-sm text-zinc-500">Secure V4 UUIDs</span>
         <Button onClick={generate} size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
      </div>
      {uuids.map(u => (
        <div key={u} className="flex gap-2 group">
          <input readOnly value={u} className="flex-1 p-3 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 font-mono text-sm transition-all focus:ring-1 ring-brand-500" />
          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(u)}><Copy className="w-4 h-4" /></Button>
        </div>
      ))}
    </div>
  );
};

// --- JSON Formatter ---
export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState('');
  const toast = useToast();
  const format = (pretty: boolean) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, pretty ? 2 : 0));
      toast.success(pretty ? 'JSON prettified!' : 'JSON minified!');
    } catch (e) { 
      toast.error('Invalid JSON: ' + (e as Error).message);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button size="sm" onClick={() => format(true)}>Prettify</Button>
        <Button size="sm" onClick={() => format(false)} variant="secondary">Minify</Button>
        <Button size="sm" variant="ghost" onClick={() => setInput('')}>Clear</Button>
      </div>
      <textarea className="w-full h-96 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 font-mono text-xs leading-relaxed" value={input} onChange={e => setInput(e.target.value)} placeholder='{"paste": "json here"}' />
    </div>
  );
};

// --- Hash Generator ---
export const HashGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [sha256, setSha256] = useState('');
  useEffect(() => {
    if(!text) { setSha256(''); return; }
    const hash = async () => {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      setSha256(Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''));
    };
    hash();
  }, [text]);
  return (
    <div className="space-y-6">
      <textarea className="w-full h-32 p-4 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 outline-none focus:border-brand-500 transition-colors" placeholder="Enter text to generate SHA-256 hash..." value={text} onChange={e => setText(e.target.value)} />
      {sha256 && (
        <div className="p-6 bg-zinc-100 dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 break-all font-mono text-sm shadow-inner">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SHA-256 Output</label>
            <button onClick={() => navigator.clipboard.writeText(sha256)} className="text-brand-500 hover:text-brand-600"><Copy className="w-4 h-4" /></button>
          </div>
          {sha256}
        </div>
      )}
    </div>
  );
};

// --- Base64 Converter ---
export const Base64Converter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const encode = () => { try { setOutput(btoa(input)); } catch(e) { setOutput('Error encoding'); } };
  const decode = () => { try { setOutput(atob(input)); } catch(e) { setOutput('Invalid Base64 string'); } };
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <textarea className="h-48 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 outline-none font-mono text-sm" value={input} onChange={e => setInput(e.target.value)} placeholder="Enter raw text or base64..." />
        <textarea readOnly className="h-48 p-4 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 font-mono text-sm text-zinc-500" value={output} placeholder="Result..." />
      </div>
      <div className="flex gap-4 justify-center">
         <Button onClick={encode}>To Base64</Button>
         <Button onClick={decode} variant="secondary">From Base64</Button>
      </div>
    </div>
  );
};

// --- Regex Tester ---
export const RegexTester: React.FC = () => {
  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');
  const [matches, setMatches] = useState<string[]>([]);
  useEffect(() => {
    try {
      if(!regex || !text) { setMatches([]); return; }
      const re = new RegExp(regex, 'g');
      setMatches(text.match(re) || []);
    } catch(e) { setMatches([]); }
  }, [regex, text]);
  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
         <span className="text-zinc-400 font-mono">/</span>
         <input className="flex-1 p-3 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono" placeholder="regex pattern..." value={regex} onChange={e => setRegex(e.target.value)} />
         <span className="text-zinc-400 font-mono">/g</span>
      </div>
      <textarea className="w-full h-40 p-4 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono text-sm" placeholder="Paste test text here..." value={text} onChange={e => setText(e.target.value)} />
      <div className="p-4 bg-zinc-100 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-800">
         <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-3">Matches Found ({matches.length})</label>
         {matches.length > 0 ? (
            <div className="flex flex-wrap gap-2">
               {matches.map((m, i) => <span key={i} className="px-2 py-1 bg-brand-50 dark:bg-brand-900/20 text-brand-600 rounded text-xs font-mono">{m}</span>)}
            </div>
         ) : <span className="text-sm text-zinc-500 italic">No matches.</span>}
      </div>
    </div>
  );
};

// --- QR Generator ---
declare class QRious { constructor(options: any); }
export const QrGenerator: React.FC = () => {
  const [text, setText] = useState('https://lumitools.app');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const toast = useToast();
  
  useEffect(() => {
    if((window as any).QRious && canvasRef.current) {
      try {
        new (window as any).QRious({ element: canvasRef.current, value: text, size: 200, level: 'H' });
      } catch (error) {
        console.error('Error generating QR code:', error);
        toast.error('Failed to generate QR code');
      }
    }
  }, [text, toast]);

  const download = () => {
    if (!canvasRef.current) {
      toast.error('QR code not ready');
      return;
    }

    try {
      const link = document.createElement('a');
      const timestamp = new Date().getTime();
      link.download = `qrcode-${timestamp}.png`;
      link.href = canvasRef.current.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded!');
    } catch (error) {
      toast.error('Failed to download QR code');
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-md space-y-2">
         <label className="text-xs font-bold text-zinc-400 uppercase">QR Content</label>
         <input className="w-full p-3 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" value={text} onChange={e => setText(e.target.value)} />
      </div>
      <div className="p-8 bg-white rounded-3xl shadow-inner border border-zinc-100"><canvas ref={canvasRef} /></div>
      <Button variant="outline" size="sm" onClick={download}><Download className="w-4 h-4 mr-2" /> Download PNG</Button>
    </div>
  );
};
