import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lock, FileText } from 'lucide-react';
import { useNotes, Note } from '@/hooks/useNotes';
import { formatDistanceToNow } from 'date-fns';

const PublicNote = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPublicNote } = useNotes();

  useEffect(() => {
    const fetchNote = async () => {
      if (!publicId) {
        setError('Invalid note ID');
        setLoading(false);
        return;
      }

      try {
        const fetchedNote = await getPublicNote(publicId);
        if (fetchedNote) {
          setNote(fetchedNote);
        } else {
          setError('Note not found or not public');
        }
      } catch (err) {
        setError('Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [publicId, getPublicNote]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading note...</div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">Note Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'This note does not exist or is not publicly accessible.'}
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Public Note</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{note.title}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>
                      Published {formatDistanceToNow(new Date(note.created_at))} ago
                    </span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">Public</Badge>
                      {note.is_encrypted && (
                        <Badge variant="outline">
                          <Lock className="w-3 h-3 mr-1" />
                          Encrypted
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {note.content || 'This note has no content.'}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              This is a read-only public note. Want to create your own notes?
            </p>
            <Button asChild>
              <Link to="/auth">Get Started with Notes App</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNote;