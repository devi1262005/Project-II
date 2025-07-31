import { useState, useEffect } from 'react';
import { Note } from '@/hooks/useNotes';
import { NoteCard } from './NoteCard';
import { GripVertical } from 'lucide-react';

interface ReorderableNotesProps {
  notes: Note[];
  onEdit: (id: string, title: string, content: string, isPublic?: boolean, shouldEncrypt?: boolean, label?: string) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
  onReorder: (reorderedNotes: Note[]) => Promise<void>;
}

export const ReorderableNotes = ({ notes, onEdit, onDelete, onReorder }: ReorderableNotesProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);
  const [hasBeenReordered, setHasBeenReordered] = useState(false);

  // Only sync with parent notes if we haven't reordered yet
  useEffect(() => {
    if (!hasBeenReordered) {
      setLocalNotes(notes);
    }
  }, [notes, hasBeenReordered]);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newNotes = [...localNotes];
    const draggedNote = newNotes[draggedIndex];
    
    // Remove the dragged item
    newNotes.splice(draggedIndex, 1);
    
    // Insert at the new position
    newNotes.splice(dropIndex, 0, draggedNote);
    
    // Update local state immediately for UI
    setLocalNotes(newNotes);
    setDraggedIndex(null);
    setHasBeenReordered(true);
    
    // Update parent state as well
    onReorder(newNotes);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {localNotes.map((note, index) => (
        <div
          key={note.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`group relative transition-all duration-200 ${
            draggedIndex === index ? 'opacity-50 scale-95' : ''
          }`}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="pl-8">
            <NoteCard
              note={note}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
          {/* Drop indicator */}
          {draggedIndex !== null && draggedIndex !== index && (
            <div className="absolute inset-x-0 h-1 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      ))}
    </div>
  );
}; 