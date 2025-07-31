import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit, Trash2, Share2, Lock, Unlock, Eye, FileText } from 'lucide-react';
import { Note } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';
import { NoteForm } from './NoteForm';
import { toast } from '@/hooks/use-toast';
import { summarizeText } from '@/services/geminiApi';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string, title: string, content: string, isPublic?: boolean, shouldEncrypt?: boolean, label?: string) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleShare = () => {
    if (note.is_public) {
      const url = `${window.location.origin}/public/${note.public_id}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Public note link copied to clipboard"
      });
    }
  };

  const handleEdit = async (title: string, content: string, isPublic: boolean, shouldEncrypt: boolean, label?: string) => {
    await onEdit(note.id, title, content, isPublic, shouldEncrypt, label);
    setIsEditDialogOpen(false);
  };

  const handleSummarize = async () => {
    if (!note.content.trim()) {
      toast({
        title: "No content",
        description: "This note has no content to summarize",
        variant: "destructive"
      });
      return;
    }

    setIsSummarizing(true);
    try {
      const result = await summarizeText(note.content);
      setSummary(result);
      toast({
        title: "Summarized",
        description: "Note has been summarized"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{note.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>{formatDistanceToNow(new Date(note.updated_at))} ago</span>
                <div className="flex gap-1">
                  {note.is_public && (
                    <Badge variant="secondary" className="text-xs">
                      Public
                    </Badge>
                  )}
                  {note.is_encrypted && (
                    <Badge variant="outline" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      Encrypted
                    </Badge>
                  )}
                  {note.label && (
                    <Badge variant="outline" className="text-xs text-black border-black">
                      {note.label}
                    </Badge>
                  )}
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {note.content || 'No content'}
          </p>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {note.title}
                    {note.is_encrypted && <Lock className="w-4 h-4" />}
                    {note.is_public && <Badge variant="secondary">Public</Badge>}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSummarize}
                      disabled={isSummarizing || !note.content.trim()}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      {isSummarizing ? 'Summarizing...' : 'Summarize'}
                    </Button>
                  </div>
                  
                  {summary && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Summary:</h4>
                      <p className="text-sm text-muted-foreground">{summary}</p>
                    </div>
                  )}
                  
                  <div className="max-h-96 overflow-y-auto">
                    <h4 className="font-medium mb-2">Content:</h4>
                    <p className="whitespace-pre-wrap text-sm">
                      {note.content || 'No content'}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Note</DialogTitle>
                </DialogHeader>
                <NoteForm
                  initialTitle={note.title}
                  initialContent={note.content}
                  initialIsPublic={note.is_public}
                  initialShouldEncrypt={note.is_encrypted}
                  initialLabel={note.label || ''}
                  onSubmit={handleEdit}
                  submitLabel="Update Note"
                />
              </DialogContent>
            </Dialog>

            {note.is_public && (
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            )}

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDelete(note.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};