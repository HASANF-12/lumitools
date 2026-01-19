import React, { useState, ChangeEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Upload, FileText, X, Download } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { useToast } from '../components/ui/Toast';
import { Tooltip } from '../components/ui/Tooltip';

export const PdfMerger: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const toast = useToast();

  // Fix: Explicitly type the File objects from Array.from to avoid 'unknown' type errors
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      const timestamp = new Date().getTime();
      link.href = url;
      link.download = `lumitools-merged-${timestamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up object URL after download
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast.success('PDFs merged successfully!');
    } catch (error) {
      console.error('Error merging PDFs:', error);
      toast.error('Failed to merge PDFs. Ensure files are not corrupted.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <p className="text-zinc-500">Combine multiple PDF files into one.</p>
           <p className="text-xs text-zinc-400 mt-1">Order matters. Drag and drop features coming soon.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept="application/pdf" 
            multiple 
            className="hidden" 
            id="pdf-upload" 
            onChange={handleUpload} 
          />
          <Button variant="secondary" onClick={() => document.getElementById('pdf-upload')?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Add Files
          </Button>
          <Button onClick={mergePdfs} disabled={files.length < 2} isLoading={isMerging}>
            <Download className="w-4 h-4 mr-2" /> Merge & Download
          </Button>
        </div>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl p-6 min-h-[300px]">
         {files.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-zinc-400 py-12">
             <FileText className="w-12 h-12 mb-4 opacity-50" />
             <p>No PDF files added yet</p>
           </div>
         ) : (
           <div className="grid gap-3">
             {files.map((file, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm animate-fade-in">
                  <div className="flex items-center gap-4">
                     <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center font-bold text-xs">
                       {i + 1}
                     </span>
                     <div>
                       <div className="font-medium text-sm truncate max-w-[200px] md:max-w-md">{file.name}</div>
                       <div className="text-xs text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                     </div>
                  </div>
                  <Tooltip content="Remove file">
                    <button 
                      onClick={() => removeFile(i)} 
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Tooltip>
               </div>
             ))}
           </div>
         )}
      </div>
    </div>
  );
};