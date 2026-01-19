import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Ruler, Database, FileSpreadsheet, Copy, Download } from 'lucide-react';

// --- Unit Converter ---
const UNITS: Record<string, Record<string, number>> = {
  Length: { Meters: 1, Kilometers: 0.001, Miles: 0.000621371, Feet: 3.28084 },
  Weight: { Kilograms: 1, Grams: 1000, Pounds: 2.20462, Ounces: 35.274 },
  Area: { 'Sq Meters': 1, 'Sq Kilometers': 0.000001, 'Acres': 0.000247105, 'Sq Feet': 10.7639 }
};

export const UnitConverter: React.FC = () => {
  const [cat, setCat] = useState('Length');
  const [val, setVal] = useState(1);
  const [from, setFrom] = useState('Meters');
  const [to, setTo] = useState('Kilometers');

  const convert = () => {
    const base = val / UNITS[cat][from];
    return (base * UNITS[cat][to]).toFixed(6);
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
        {Object.keys(UNITS).map(c => (
          <button 
            key={c}
            onClick={() => { setCat(c); setFrom(Object.keys(UNITS[c])[0]); setTo(Object.keys(UNITS[c])[1]); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${cat === c ? 'bg-white dark:bg-zinc-800 shadow-sm text-brand-600' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">From</label>
          <div className="flex gap-2">
             <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className="flex-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 font-mono" />
             <select value={from} onChange={e => setFrom(e.target.value)} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
               {Object.keys(UNITS[cat]).map(u => <option key={u} value={u}>{u}</option>)}
             </select>
          </div>
        </div>

        <div className="flex justify-center py-2">
           <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-600">
             <Ruler className="w-5 h-5" />
           </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-500 uppercase">To</label>
          <div className="flex gap-2">
             <input readOnly value={convert()} className="flex-1 p-3 rounded-xl bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-zinc-800 font-mono font-bold text-brand-600" />
             <select value={to} onChange={e => setTo(e.target.value)} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
               {Object.keys(UNITS[cat]).map(u => <option key={u} value={u}>{u}</option>)}
             </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CSV to JSON ---
export const CsvToJson: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const convert = () => {
    try {
      const lines = input.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const result = lines.slice(1).map(line => {
        const data = line.split(',');
        return headers.reduce((obj: any, header, i) => {
          obj[header] = data[i]?.trim();
          return obj;
        }, {});
      });
      setOutput(JSON.stringify(result, null, 2));
    } catch(e) { setOutput('Invalid CSV format'); }
  };
  return (
    <div className="space-y-4">
      <textarea className="w-full h-40 p-4 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono text-sm" placeholder="name,age&#10;John,30" value={input} onChange={e => setInput(e.target.value)} />
      <Button onClick={convert} className="w-full">Convert to JSON</Button>
      <textarea readOnly className="w-full h-40 p-4 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono text-sm" value={output} />
    </div>
  );
};

// --- JSON to CSV ---
export const JsonToCsv: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const convert = () => {
    try {
      const data = JSON.parse(input);
      if(!Array.isArray(data)) throw new Error('Input must be an array');
      const headers = Object.keys(data[0]);
      const csv = [headers.join(','), ...data.map(row => headers.map(h => row[h]).join(','))].join('\n');
      setOutput(csv);
    } catch(e) { setOutput('Invalid JSON format'); }
  };
  return (
    <div className="space-y-4">
      <textarea className="w-full h-40 p-4 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono text-sm" placeholder='[{"name":"John","age":30}]' value={input} onChange={e => setInput(e.target.value)} />
      <Button onClick={convert} className="w-full">Convert to CSV</Button>
      <textarea readOnly className="w-full h-40 p-4 rounded-xl border dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 font-mono text-sm" value={output} />
    </div>
  );
};
