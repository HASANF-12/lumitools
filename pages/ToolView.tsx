import React, { useEffect, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import { ChevronLeft } from 'lucide-react';
import { storage } from '../utils/storage';
import { Skeleton } from '../components/ui/Skeleton';
import { Tooltip } from '../components/ui/Tooltip';

// Lazy load tool components for better performance
const WordCounter = lazy(() => import('../tools/TextTools').then(m => ({ default: m.WordCounter })));
const CaseConverter = lazy(() => import('../tools/TextTools').then(m => ({ default: m.CaseConverter })));
const RemoveDuplicates = lazy(() => import('../tools/TextTools').then(m => ({ default: m.RemoveDuplicates })));
const MarkdownPreview = lazy(() => import('../tools/TextTools').then(m => ({ default: m.MarkdownPreview })));
const DiffChecker = lazy(() => import('../tools/TextTools').then(m => ({ default: m.DiffChecker })));
const LoremIpsum = lazy(() => import('../tools/TextTools').then(m => ({ default: m.LoremIpsum })));

const UuidGenerator = lazy(() => import('../tools/DevTools').then(m => ({ default: m.UuidGenerator })));
const JsonFormatter = lazy(() => import('../tools/DevTools').then(m => ({ default: m.JsonFormatter })));
const HashGenerator = lazy(() => import('../tools/DevTools').then(m => ({ default: m.HashGenerator })));
const QrGenerator = lazy(() => import('../tools/DevTools').then(m => ({ default: m.QrGenerator })));
const Base64Converter = lazy(() => import('../tools/DevTools').then(m => ({ default: m.Base64Converter })));
const RegexTester = lazy(() => import('../tools/DevTools').then(m => ({ default: m.RegexTester })));
const UrlEncoder = lazy(() => import('../tools/DevTools').then(m => ({ default: m.UrlEncoder })));
const PasswordGenerator = lazy(() => import('../tools/DevTools').then(m => ({ default: m.PasswordGenerator })));
const UnixTimestamp = lazy(() => import('../tools/DevTools').then(m => ({ default: m.UnixTimestamp })));
const JwtDebugger = lazy(() => import('../tools/DevTools').then(m => ({ default: m.JwtDebugger })));
const SqlFormatter = lazy(() => import('../tools/DevTools').then(m => ({ default: m.SqlFormatter })));

const ImageConverter = lazy(() => import('../tools/ImageTools').then(m => ({ default: m.ImageConverter })));
const ImagesToPdf = lazy(() => import('../tools/ImageTools').then(m => ({ default: m.ImagesToPdf })));
const ImageCompressor = lazy(() => import('../tools/ImageTools').then(m => ({ default: m.ImageCompressor })));
const ImageResizer = lazy(() => import('../tools/ImageTools').then(m => ({ default: m.ImageResizer })));

const ColorConverter = lazy(() => import('../tools/DesignTools').then(m => ({ default: m.ColorConverter })));

const PdfMerger = lazy(() => import('../tools/PdfTools').then(m => ({ default: m.PdfMerger })));

const CsvToJson = lazy(() => import('../tools/DataTools').then(m => ({ default: m.CsvToJson })));
const JsonToCsv = lazy(() => import('../tools/DataTools').then(m => ({ default: m.JsonToCsv })));
const UnitConverter = lazy(() => import('../tools/DataTools').then(m => ({ default: m.UnitConverter })));

const ToolLoadingSkeleton = () => (
  <div className="space-y-6">
    <Skeleton height={200} />
    <div className="grid md:grid-cols-2 gap-4">
      <Skeleton height={150} />
      <Skeleton height={150} />
    </div>
  </div>
);

export const ToolView: React.FC = () => {
  const { id } = useParams();
  const tool = TOOLS.find(t => t.path === `/tool/${id}`);

  // Track recent tool usage
  useEffect(() => {
    if (tool) {
      storage.addRecentTool({
        id: tool.id,
        name: tool.name,
        path: tool.path,
      });
    }
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-5xl mx-auto p-12 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-2">Tool Not Found</h1>
          <p className="text-red-700 dark:text-red-300 mb-6">
            The tool you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const renderTool = () => {
    switch(tool.id) {
      // Text
      case 'word-counter': return <WordCounter />;
      case 'case-converter': return <CaseConverter />;
      case 'remove-duplicates': return <RemoveDuplicates />;
      case 'markdown-preview': return <MarkdownPreview />;
      case 'diff-checker': return <DiffChecker />;
      case 'lorem-ipsum': return <LoremIpsum />;
      
      // Dev
      case 'uuid-generator': return <UuidGenerator />;
      case 'json-formatter': return <JsonFormatter />;
      case 'hash-generator': return <HashGenerator />;
      case 'base64': return <Base64Converter />;
      case 'qr-generator': return <QrGenerator />;
      case 'regex-tester': return <RegexTester />;
      case 'url-encoder': return <UrlEncoder />;
      case 'password-generator': return <PasswordGenerator />;
      case 'unix-timestamp': return <UnixTimestamp />;
      case 'jwt-debugger': return <JwtDebugger />;
      case 'sql-formatter': return <SqlFormatter />;
      
      // Image
      case 'image-converter': return <ImageConverter />;
      case 'image-compressor': return <ImageCompressor />;
      case 'image-resize': return <ImageResizer />;
      case 'color-converter': return <ColorConverter />;
      
      // PDF
      case 'images-to-pdf': return <ImagesToPdf />;
      case 'pdf-merger': return <PdfMerger />;
      
      // Data
      case 'csv-json': return <CsvToJson />;
      case 'json-csv': return <JsonToCsv />;
      case 'unit-converter': return <UnitConverter />;
      
      default: return (
        <div className="p-12 text-center text-zinc-500 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
          <p className="text-lg font-medium mb-2">This tool is coming soon.</p>
          <p className="text-sm">We're working on adding this feature.</p>
        </div>
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tooltip content="Go back to home">
            <Link 
              to="/" 
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Go back to home"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </Link>
          </Tooltip>
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center gap-3">
               <tool.icon className="w-8 h-8 text-brand-500" aria-hidden="true" />
               {tool.name}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">{tool.description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card border border-zinc-200 dark:border-dark-border rounded-2xl shadow-sm p-6 md:p-8 min-h-[400px]">
        <Suspense fallback={<ToolLoadingSkeleton />}>
          {renderTool()}
        </Suspense>
      </div>

      <div className="prose dark:prose-invert max-w-none pt-8">
        <h3>How to use {tool.name}</h3>
        <p>
          This {tool.name.toLowerCase()} runs entirely in your browser using modern web technologies. 
          Your data is never sent to any server, ensuring 100% privacy and blazing fast performance.
        </p>
        <ul>
          <li>Secure processing</li>
          <li>No data leaves your device</li>
          <li>Completely free to use</li>
          <li>Blazing fast local execution</li>
        </ul>
      </div>
    </div>
  );
};
