import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Upload, Download, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const ImageConverter: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ src: string; width: number; height: number } | null>(null);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // Draw image to canvas when imageData changes
  useEffect(() => {
    if (imageData && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0);
          }
        }
      };
      img.src = imageData.src;
    }
  }, [imageData]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      if (e.target) e.target.value = '';
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Image file is too large. Maximum size is 50MB');
      if (e.target) e.target.value = '';
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onerror = () => {
      toast.error('Failed to read image file');
      setIsLoading(false);
      if (e.target) e.target.value = '';
    };

    reader.onload = (event) => {
      if (!event.target?.result) {
        toast.error('Failed to read file data');
        setIsLoading(false);
        return;
      }

      const img = new Image();
      
      img.onerror = () => {
        toast.error('Failed to load image. Please try a different file.');
        setIsLoading(false);
      };

      img.onload = () => {
        try {
          const imgSrc = event.target?.result as string;
          // Set image state first so canvas is rendered
          setImage(imgSrc);
          // Then set image data which triggers useEffect to draw
          setImageData({ src: imgSrc, width: img.width, height: img.height });
          toast.success('Image loaded successfully!');
        } catch (error) {
          toast.error('Error processing image: ' + (error as Error).message);
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      img.src = event.target.result as string;
    };

    reader.readAsDataURL(file);
    // Reset input value after reading starts
    if (e.target) e.target.value = '';
  };

  const download = () => {
    if (!canvasRef.current || !image) {
      toast.error('No image to download');
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = canvasRef.current.toDataURL(format, 0.9);
      const link = document.createElement('a');
      const ext = format.split('/')[1];
      const timestamp = new Date().getTime();
      link.download = `converted-image-${timestamp}.${ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Image downloaded as ${ext.toUpperCase()}!`);
    } catch (error) {
      toast.error('Failed to download image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageData(null);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
       {!image ? (
         <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-brand-500 transition-colors bg-zinc-50 dark:bg-zinc-900/50">
            <ImageIcon className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">Drag and drop or click to upload</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              className="hidden" 
              id="img-upload"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} isLoading={isLoading}>
              {isLoading ? 'Loading...' : 'Select Image'}
            </Button>
            <p className="text-xs text-zinc-400 mt-4">Supports: PNG, JPG, WEBP, GIF (Max 50MB)</p>
         </div>
       ) : (
         <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-zinc-100 dark:bg-black rounded-xl p-4 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
               <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
            </div>
            <div className="w-full md:w-64 space-y-4">
              <div className="p-4 bg-white dark:bg-dark-card rounded-xl border border-zinc-200 dark:border-zinc-800">
                <label className="block text-sm font-medium mb-2">Target Format</label>
                <select 
                  className="w-full p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                >
                  <option value="image/png">PNG</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/webp">WEBP</option>
                </select>
              </div>
              <Button className="w-full" onClick={download} disabled={isProcessing} isLoading={isProcessing}>
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleReset}>Reset</Button>
            </div>
         </div>
       )}
    </div>
  );
};

export const ImageCompressor: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ src: string; width: number; height: number } | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  // Draw image to canvas when imageData changes
  useEffect(() => {
    if (imageData && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            canvasRef.current.width = img.width;
            canvasRef.current.height = img.height;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0);
            updatePreview(quality / 100);
          }
        }
      };
      img.src = imageData.src;
    }
  }, [imageData, quality]);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }

    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      if (e.target) e.target.value = '';
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Image file is too large. Maximum size is 50MB');
      if (e.target) e.target.value = '';
      return;
    }

    setIsLoading(true);
    setOriginalSize(file.size);
    const reader = new FileReader();
    
    reader.onerror = () => {
      toast.error('Failed to read image file');
      setIsLoading(false);
      if (e.target) e.target.value = '';
    };

    reader.onload = (event) => {
      if (!event.target?.result) {
        toast.error('Failed to read file data');
        setIsLoading(false);
        return;
      }

      const img = new Image();
      
      img.onerror = () => {
        toast.error('Failed to load image. Please try a different file.');
        setIsLoading(false);
      };

      img.onload = () => {
        try {
          const imgSrc = event.target?.result as string;
          // Set image state first so canvas is rendered
          setImage(imgSrc);
          // Then set image data which triggers useEffect to draw
          setImageData({ src: imgSrc, width: img.width, height: img.height });
          toast.success('Image loaded successfully!');
        } catch (error) {
          toast.error('Error processing image: ' + (error as Error).message);
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      img.src = event.target.result as string;
    };

    reader.readAsDataURL(file);
    // Reset input value after reading starts
    if (e.target) e.target.value = '';
  };

  const updatePreview = (q: number) => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) setCompressedSize(blob.size);
      }, 'image/jpeg', q);
    }
  };


  const download = () => {
    if (!canvasRef.current || !image) {
      toast.error('No image to download');
      return;
    }

    try {
      setIsProcessing(true);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg', quality / 100);
      const link = document.createElement('a');
      const timestamp = new Date().getTime();
      link.download = `compressed-image-${timestamp}.jpg`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Compressed image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleReset = () => {
    setImage(null);
    setImageData(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
       {!image ? (
         <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-brand-500 transition-colors bg-zinc-50 dark:bg-zinc-900/50">
            <Minimize2 className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
            <p className="mb-4 text-zinc-600 dark:text-zinc-400">Select an image to compress</p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleUpload} 
              className="hidden" 
              id="comp-upload"
            />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} isLoading={isLoading}>
              {isLoading ? 'Loading...' : 'Select Image'}
            </Button>
            <p className="text-xs text-zinc-400 mt-4">Supports: PNG, JPG, WEBP, GIF (Max 50MB)</p>
         </div>
       ) : (
         <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-zinc-100 dark:bg-black rounded-xl p-4 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
               <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
            </div>
            <div className="w-full md:w-72 space-y-6">
              <div className="p-4 bg-white dark:bg-dark-card rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div>
                   <label className="block text-sm font-medium mb-2">Quality: {quality}%</label>
                   <input 
                     type="range" min="1" max="100" value={quality} 
                     onChange={(e) => setQuality(Number(e.target.value))}
                     className="w-full accent-brand-600" 
                   />
                </div>
                <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-zinc-500">Original:</span>
                     <span>{formatSize(originalSize)}</span>
                   </div>
                   <div className="flex justify-between font-bold text-green-600">
                     <span>Compressed:</span>
                     <span>{formatSize(compressedSize)}</span>
                   </div>
                   <div className="flex justify-between text-xs text-zinc-400">
                     <span>Saved:</span>
                     <span>{originalSize > 0 ? Math.round((1 - compressedSize/originalSize) * 100) : 0}%</span>
                   </div>
                </div>
              </div>
              <Button className="w-full" onClick={download} disabled={isProcessing} isLoading={isProcessing}>
                <Download className="w-4 h-4 mr-2" /> Download JPG
              </Button>
              <Button variant="ghost" className="w-full" onClick={handleReset}>Reset</Button>
            </div>
         </div>
       )}
    </div>
  );
};

export const ImageResizer: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [lockAspect, setLockAspect] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const originalImg = useRef<HTMLImageElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    // Draw image to canvas when dimensions change
    useEffect(() => {
      if (image && originalImg.current && canvasRef.current && width > 0 && height > 0) {
        draw(width, height);
      }
    }, [width, height, image]);
  
    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) {
        if (e.target) e.target.value = '';
        return;
      }

      const file = e.target.files[0];

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        if (e.target) e.target.value = '';
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error('Image file is too large. Maximum size is 50MB');
        if (e.target) e.target.value = '';
        return;
      }

      setIsLoading(true);
      const reader = new FileReader();
      
      reader.onerror = () => {
        toast.error('Failed to read image file');
        setIsLoading(false);
        if (e.target) e.target.value = '';
      };

      reader.onload = (event) => {
        if (!event.target?.result) {
          toast.error('Failed to read file data');
          setIsLoading(false);
          return;
        }

        const img = new Image();
        
        img.onerror = () => {
          toast.error('Failed to load image. Please try a different file.');
          setIsLoading(false);
        };

        img.onload = () => {
          try {
            const imgSrc = event.target?.result as string;
            originalImg.current = img;
            const imgWidth = img.width;
            const imgHeight = img.height;
            setAspectRatio(imgWidth / imgHeight);
            // Set image state first so canvas is rendered
            setImage(imgSrc);
            // Then set dimensions which triggers useEffect to draw
            setWidth(imgWidth);
            setHeight(imgHeight);
            toast.success('Image loaded successfully!');
          } catch (error) {
            toast.error('Error processing image: ' + (error as Error).message);
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        };

        img.src = event.target.result as string;
      };

      reader.readAsDataURL(file);
      // Reset input value after reading starts
      if (e.target) e.target.value = '';
    };
  
    const draw = (w: number, h: number) => {
        if (canvasRef.current && originalImg.current) {
           const ctx = canvasRef.current.getContext('2d');
           if (!ctx) return;
           canvasRef.current.width = w;
           canvasRef.current.height = h;
           ctx.drawImage(originalImg.current, 0, 0, w, h);
        }
    };
  
    const handleWidthChange = (val: number) => {
        if (val < 1) val = 1;
        setWidth(val);
        if (lockAspect && aspectRatio > 0) {
            const h = Math.round(val / aspectRatio);
            setHeight(h);
            draw(val, h);
        } else {
            draw(val, height);
        }
    };
  
    const handleHeightChange = (val: number) => {
        if (val < 1) val = 1;
        setHeight(val);
        if (lockAspect && aspectRatio > 0) {
            const w = Math.round(val * aspectRatio);
            setWidth(w);
            draw(w, val);
        } else {
            draw(width, val);
        }
    };
  
    const download = () => {
      if (!canvasRef.current || !image) {
        toast.error('No image to download');
        return;
      }

      try {
        setIsProcessing(true);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const link = document.createElement('a');
        const timestamp = new Date().getTime();
        link.download = `resized-image-${timestamp}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Resized image downloaded!');
      } catch (error) {
        toast.error('Failed to download image');
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const handleReset = () => {
      setImage(null);
      setWidth(0);
      setHeight(0);
      setAspectRatio(1);
      originalImg.current = null;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  
    return (
      <div className="space-y-6">
         {!image ? (
           <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl p-12 text-center hover:border-brand-500 transition-colors bg-zinc-50 dark:bg-zinc-900/50">
              <Maximize2 className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
              <p className="mb-4 text-zinc-600 dark:text-zinc-400">Select an image to resize</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleUpload} 
                className="hidden" 
                id="resize-upload"
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isLoading} isLoading={isLoading}>
                {isLoading ? 'Loading...' : 'Select Image'}
              </Button>
              <p className="text-xs text-zinc-400 mt-4">Supports: PNG, JPG, WEBP, GIF (Max 50MB)</p>
           </div>
         ) : (
           <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 bg-zinc-100 dark:bg-black rounded-xl p-4 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-800 relative">
                 <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
                 <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                    {width} x {height} px
                 </div>
              </div>
              <div className="w-full md:w-72 space-y-6">
                <div className="p-4 bg-white dark:bg-dark-card rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <div>
                     <label className="block text-sm font-medium mb-2">Width (px)</label>
                     <input 
                       type="number" 
                       value={width} 
                       min="1"
                       onChange={(e) => handleWidthChange(Number(e.target.value))}
                       className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" 
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-2">Height (px)</label>
                     <input 
                       type="number" 
                       value={height} 
                       min="1"
                       onChange={(e) => handleHeightChange(Number(e.target.value))}
                       className="w-full p-2 rounded-lg border bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700" 
                     />
                  </div>
                  <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={lockAspect} 
                        onChange={(e) => setLockAspect(e.target.checked)} 
                        id="aspect"
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <label htmlFor="aspect" className="text-sm">Lock Aspect Ratio</label>
                  </div>
                </div>
                <Button className="w-full" onClick={download} disabled={isProcessing} isLoading={isProcessing}>
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleReset}>Reset</Button>
              </div>
           </div>
         )}
      </div>
    );
  };

// --- Images to PDF ---
declare const jspdf: any; // From CDN

export const ImagesToPdf: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      if (e.target) e.target.value = '';
      return;
    }

    const files = Array.from(e.target.files) as File[];
    const maxSize = 50 * 1024 * 1024; // 50MB

    // Validate all files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        if (e.target) e.target.value = '';
        return;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        if (e.target) e.target.value = '';
        return;
      }
    }
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onerror = () => {
        toast.error(`Failed to read ${file.name}`);
      };
      reader.onload = (ev) => {
        if(ev.target?.result) {
          setImages(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) {
      toast.warning('Please add at least one image');
      return;
    }

    setLoading(true);
    
    // Check if jsPDF is loaded
    const jsPDF = (window as any).jspdf ? (window as any).jspdf.jsPDF : null;
    
    if (!jsPDF) {
      toast.warning("PDF library is initializing, please try again in a moment.");
      setLoading(false);
      return;
    }

    try {
      const doc = new jsPDF();
      
      for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        const img = new Image();
        img.src = imgData;
        await new Promise((resolve, reject) => { 
          img.onload = resolve;
          img.onerror = reject;
          // Timeout after 10 seconds
          setTimeout(() => reject(new Error('Image load timeout')), 10000);
        });
        
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      }
      
      const timestamp = new Date().getTime();
      doc.save(`lumitools-images-${timestamp}.pdf`);
      toast.success('PDF generated successfully!');
    } catch (e) {
      console.error(e);
      toast.error("Error generating PDF. Please ensure images are valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-zinc-500">Combine multiple images into a PDF document.</p>
        <div className="space-x-2">
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            id="pdf-imgs" 
            onChange={handleUpload} 
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Add Images
          </Button>
          <Button onClick={generatePdf} disabled={images.length === 0} isLoading={loading}>
            Generate PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[200px] p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-[3/4] bg-white dark:bg-black rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
            <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
            <button 
              onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Remove image ${i + 1}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-zinc-400">
             <Upload className="w-8 h-8 mb-2 opacity-50" />
             <span>No images added yet</span>
          </div>
        )}
      </div>
    </div>
  );
};
