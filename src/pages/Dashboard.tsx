import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, LogOut, FileText, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotes } from '@/hooks/useNotes';
import { ReorderableNotes } from '@/components/ReorderableNotes';
import { NoteForm } from '@/components/NoteForm';
import { Note } from '@/hooks/useNotes';

const Dashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'time'>('date');
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const { user, signOut } = useAuth();
  const { notes, loading, createNote, updateNote, deleteNote, reorderNotes } = useNotes();

  // Update local notes when notes from API change (but not during reordering)
  useEffect(() => {
    if (notes.length > 0 && localNotes.length === 0) {
      setLocalNotes(notes);
    }
  }, [notes, localNotes.length]);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const filteredNotes = localNotes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = filterType === 'all' || 
                           (filterType === 'public' && note.is_public) ||
                           (filterType === 'private' && !note.is_public);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else {
        // Sort by time (most recent first)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const handleCreateNote = async (title: string, content: string, isPublic: boolean, shouldEncrypt: boolean, label?: string) => {
    await createNote(title, content, isPublic, shouldEncrypt, label);
    setIsCreateDialogOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleReorder = async (reorderedNotes: Note[]) => {
    setLocalNotes(reorderedNotes);
    await reorderNotes(reorderedNotes);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              <h1 className="text-2xl font-bold">My Notes</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filter Controls */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterType} onValueChange={(value: 'all' | 'public' | 'private') => setFilterType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Notes</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: 'date' | 'time') => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="time">By Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <NoteForm onSubmit={handleCreateNote} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">Loading notes...</div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search query'
                : 'Create your first note to get started'
              }
            </p>
            {!searchQuery && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                  </DialogHeader>
                  <NoteForm onSubmit={handleCreateNote} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm text-muted-foreground">
              💡 Drag and drop notes to reorder them
            </div>
            <ReorderableNotes
              notes={filteredNotes}
              onEdit={updateNote}
              onDelete={deleteNote}
              onReorder={handleReorder}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;