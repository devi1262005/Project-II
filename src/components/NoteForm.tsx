import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2, Sparkles, PenTool } from 'lucide-react';
import { fixGrammar, correctScribbled } from '@/services/geminiApi';
import { toast } from '@/hooks/use-toast';
import { DrawingCanvas } from './DrawingCanvas';

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialIsPublic?: boolean;
  initialShouldEncrypt?: boolean;
  initialLabel?: string;
  onSubmit: (title: string, content: string, isPublic: boolean, shouldEncrypt: boolean, label?: string) => Promise<void>;
  submitLabel?: string;
}

export const NoteForm = ({ 
  initialTitle = '', 
  initialContent = '', 
  initialIsPublic = false,
  initialShouldEncrypt = false,
  initialLabel = '',
  onSubmit, 
  submitLabel = 'Create Note' 
}: NoteFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [shouldEncrypt, setShouldEncrypt] = useState(initialShouldEncrypt);
  const [label, setLabel] = useState(initialLabel);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingGrammar, setIsProcessingGrammar] = useState(false);
  const [isProcessingCorrection, setIsProcessingCorrection] = useState(false);
  const [isDrawingVisible, setIsDrawingVisible] = useState(false);

  const handleFixGrammar = async () => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please add some content to fix grammar",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingGrammar(true);
    try {
      const fixedText = await fixGrammar(content);
      setContent(fixedText);
      toast({
        title: "Grammar Fixed",
        description: "Your text has been corrected"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fix grammar. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingGrammar(false);
    }
  };

  const handleComments = async () => {
    if (!content.trim()) {
      toast({
        title: "No content",
        description: "Please add some content to generate comments",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingCorrection(true);
    try {
      const commentedText = await correctScribbled(content);
      setContent(commentedText);
      toast({
        title: "Comments Added",
        description: "Comments have been generated for your text"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate comments. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingCorrection(false);
    }
  };

  const handleTextExtracted = async (extractedText: string) => {
    try {
      // Send the extracted text to AI for correction
      const correctedText = await correctScribbled(extractedText);
      setContent(correctedText);
      setIsDrawingVisible(false);
      toast({
        title: "Drawing Processed",
        description: "Your drawing has been converted and corrected"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process drawing. Please check your API key.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(title.trim(), content.trim(), isPublic, shouldEncrypt, label.trim() || undefined);
      if (submitLabel === 'Create Note') {
        setTitle('');
        setContent('');
        setIsPublic(false);
        setShouldEncrypt(false);
        setLabel('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="label">Label (optional)</Label>
        <Input
          id="label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Enter a label for this note..."
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
          rows={6}
          disabled={isLoading}
        />
        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleFixGrammar}
            disabled={isLoading || isProcessingGrammar || !content.trim()}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isProcessingGrammar ? 'Fixing...' : 'Fix Grammar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleComments}
            disabled={isLoading || isProcessingCorrection || !content.trim()}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isProcessingCorrection ? 'Generating...' : 'Comments'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsDrawingVisible(!isDrawingVisible)}
          >
            <PenTool className="w-4 h-4 mr-2" />
            {isDrawingVisible ? 'Hide Drawing' : 'Draw Text'}
          </Button>
        </div>
      </div>

      {isDrawingVisible && (
        <div className="space-y-2">
          <Label>Draw Your Text</Label>
          <DrawingCanvas
            onTextExtracted={handleTextExtracted}
            isProcessing={isLoading || isProcessingGrammar || isProcessingCorrection}
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="public"
            checked={isPublic}
            onCheckedChange={(checked) => setIsPublic(checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="public" className="text-sm">
            Make this note public (accessible via shareable link)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="encrypt"
            checked={shouldEncrypt}
            onCheckedChange={(checked) => setShouldEncrypt(checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="encrypt" className="text-sm">
            Encrypt note content for extra security
          </Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading || !title.trim()}>
        {isLoading ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
};