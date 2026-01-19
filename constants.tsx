import { 
  FileText, Image as ImageIcon, Type, Database, Code, 
  Files, Crop, RotateCw, Trash2, Shield, Lock, 
  FileJson, FileDigit, Hash, QrCode, Palette,
  Pipette, Split, Merge, Scissors, Minimize2,
  FileSpreadsheet, ScanLine, Regex, Smartphone,
  Link, Clock, Eye, FileOutput, Key, GitCompare, ShieldAlert, Binary, Layers, Ruler
} from 'lucide-react';
import { ToolCategory, ToolDefinition } from './types';

export const APP_NAME = "Lumitools";

export const TOOLS: ToolDefinition[] = [
  // Text Tools
  { id: 'word-counter', name: 'Word & Char Counter', description: 'Count words, characters, and sentences in real-time.', category: ToolCategory.TEXT, path: '/tool/word-counter', icon: Type, popular: true },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to Uppercase, Lowercase, Title Case, and more.', category: ToolCategory.TEXT, path: '/tool/case-converter', icon: Type },
  { id: 'diff-checker', name: 'Text Diff Checker', description: 'Compare two text snippets and see the differences.', category: ToolCategory.TEXT, path: '/tool/diff-checker', icon: GitCompare, popular: true },
  { id: 'remove-duplicates', name: 'Remove Duplicates', description: 'Clean up your text lists by removing duplicate entries.', category: ToolCategory.TEXT, path: '/tool/remove-duplicates', icon: Scissors },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text for your designs.', category: ToolCategory.TEXT, path: '/tool/lorem-ipsum', icon: FileText },
  { id: 'markdown-preview', name: 'Markdown Preview', description: 'Write Markdown and visualize it as HTML instantly.', category: ToolCategory.TEXT, path: '/tool/markdown-preview', icon: Eye },
  
  // Dev Tools
  { id: 'jwt-debugger', name: 'JWT Debugger', description: 'Decode and inspect JSON Web Tokens safely.', category: ToolCategory.DEV, path: '/tool/jwt-debugger', icon: ShieldAlert, popular: true },
  { id: 'sql-formatter', name: 'SQL Formatter', description: 'Prettify and format SQL queries instantly.', category: ToolCategory.DEV, path: '/tool/sql-formatter', icon: Database },
  { id: 'password-generator', name: 'Password Generator', description: 'Create secure, random passwords locally.', category: ToolCategory.DEV, path: '/tool/password-generator', icon: Key, popular: true },
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Prettify or minify JSON data with error validation.', category: ToolCategory.DEV, path: '/tool/json-formatter', icon: FileJson, popular: true },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate robust UUIDs (v4) instantly.', category: ToolCategory.DEV, path: '/tool/uuid-generator', icon: FileDigit },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Calculate MD5, SHA-1, SHA-256 hashes securely.', category: ToolCategory.DEV, path: '/tool/hash-generator', icon: Hash },
  { id: 'base64', name: 'Base64 Encoder/Decoder', description: 'Convert text or files to Base64 and back.', category: ToolCategory.DEV, path: '/tool/base64', icon: Code },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode or decode URLs to handle special characters.', category: ToolCategory.DEV, path: '/tool/url-encoder', icon: Link },
  { id: 'unix-timestamp', name: 'Unix Timestamp', description: 'Convert between Epoch timestamps and human dates.', category: ToolCategory.DEV, path: '/tool/unix-timestamp', icon: Clock },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create customizable QR codes for links and text.', category: ToolCategory.DEV, path: '/tool/qr-generator', icon: QrCode },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test regular expressions against text in real-time.', category: ToolCategory.DEV, path: '/tool/regex-tester', icon: Regex },
  
  // Image Tools
  { id: 'image-converter', name: 'Image Converter', description: 'Convert images to PNG, JPG, or WEBP formats.', category: ToolCategory.IMAGE, path: '/tool/image-converter', icon: ImageIcon, popular: true },
  { id: 'image-compressor', name: 'Image Compressor', description: 'Reduce image file size while maintaining quality.', category: ToolCategory.IMAGE, path: '/tool/image-compressor', icon: Minimize2 },
  { id: 'image-resize', name: 'Resize Image', description: 'Resize images by pixel dimensions or percentage.', category: ToolCategory.IMAGE, path: '/tool/image-resize', icon: Crop },
  { id: 'color-converter', name: 'Color Converter', description: 'Convert between HEX, RGB, and HSL color formats.', category: ToolCategory.IMAGE, path: '/tool/color-converter', icon: Palette },
  
  // PDF Tools
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Combine multiple images into a single PDF document.', category: ToolCategory.PDF, path: '/tool/images-to-pdf', icon: Files, popular: true },
  { id: 'pdf-merger', name: 'Merge PDFs', description: 'Combine multiple PDF files into a single document.', category: ToolCategory.PDF, path: '/tool/pdf-merger', icon: Merge },
  
  // Data Tools
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between Length, Weight, Temp, and Area.', category: ToolCategory.DATA, path: '/tool/unit-converter', icon: Ruler },
  { id: 'csv-json', name: 'CSV to JSON', description: 'Convert CSV data to JSON array objects.', category: ToolCategory.DATA, path: '/tool/csv-json', icon: Database },
  { id: 'json-csv', name: 'JSON to CSV', description: 'Convert JSON data back to CSV format.', category: ToolCategory.DATA, path: '/tool/json-csv', icon: FileSpreadsheet },
];

export const CATEGORIES = Object.values(ToolCategory);