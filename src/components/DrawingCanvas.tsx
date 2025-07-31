import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Pen, Eraser, RotateCcw, Send } from 'lucide-react';

interface DrawingCanvasProps {
  onTextExtracted: (text: string) => void;
  isProcessing?: boolean;
}

export const DrawingCanvas = ({ onTextExtracted, isProcessing = false }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [brushSize, setBrushSize] = useState(2);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Set initial styles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const extractTextFromDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExtracting(true);
    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // For MVP, we'll simulate text extraction
      // In a real implementation, you'd send the image to an OCR service
      const simulatedText = "This is simulated text from your drawing. In a real implementation, this would be extracted using OCR.";
      
      onTextExtracted(simulatedText);
    } catch (error) {
      console.error('Error extracting text:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant={isEraser ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEraser(false)}
        >
          <Pen className="w-4 h-4 mr-2" />
          Pen
        </Button>
        <Button
          variant={isEraser ? "outline" : "default"}
          size="sm"
          onClick={() => setIsEraser(true)}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Eraser
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCanvas}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={extractTextFromDrawing}
          disabled={isProcessing || isExtracting}
        >
          <Send className="w-4 h-4 mr-2" />
          {isExtracting ? 'Extracting...' : 'Extract Text'}
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair border border-gray-300"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Brush Size:</span>
        <input
          type="range"
          min="1"
          max="10"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">{brushSize}</span>
      </div>
    </div>
  );
}; 