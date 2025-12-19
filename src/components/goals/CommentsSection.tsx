import { useState } from "react";
import { format } from "date-fns";
import { Send, Search, ArrowUpDown, Pencil, Trash2, StickyNote } from "lucide-react";
import { Comment, Target } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGoalsContext } from "@/context/GoalsContext";
import { cn } from "@/lib/utils";

interface CommentsSectionProps {
  goalId: string;
  comments: Comment[];
  targets: Target[];
}

export const CommentsSection = ({ goalId, comments, targets }: CommentsSectionProps) => {
  const { addComment, updateComment, deleteComment } = useGoalsContext();
  
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(goalId, newComment.trim());
    setNewComment("");
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (id: string) => {
    if (editContent.trim()) {
      updateComment(id, editContent.trim());
    }
    setEditingId(null);
    setEditContent("");
  };

  // Filter and sort comments
  let filteredComments = [...comments];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredComments = filteredComments.filter(c => 
      c.content.toLowerCase().includes(query) ||
      c.author.toLowerCase().includes(query)
    );
  }

  filteredComments.sort((a, b) => {
    const diff = a.createdAt.getTime() - b.createdAt.getTime();
    return sortOrder === "desc" ? -diff : diff;
  });

  const displayedComments = showAll ? filteredComments : filteredComments.slice(0, 5);
  const hasMore = filteredComments.length > 5;

  return (
    <div className="space-y-4">
      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[60px] resize-none"
        />
        <Button type="submit" variant="nature" size="icon" className="flex-shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {comments.length > 0 && (
        <>
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "desc" | "asc")}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comments list */}
          <div className="space-y-3">
            {displayedComments.map((comment) => (
              <div 
                key={comment.id}
                className={cn(
                  "p-4 rounded-lg border animate-fade-in",
                  comment.isNote 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-card"
                )}
              >
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleSaveEdit(comment.id)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {comment.isNote && (
                          <StickyNote className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium text-sm">
                          {comment.author}
                        </span>
                        {comment.isNote && (
                          <Badge variant="muted" className="text-[10px]">Note</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {format(comment.createdAt, "MMM d, yyyy 'at' HH:mm")}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          className="h-6 w-6"
                          onClick={() => handleEdit(comment)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon-sm" 
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => deleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                  </>
                )}
              </div>
            ))}
          </div>

          {hasMore && (
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : `Show ${filteredComments.length - 5} more comments`}
            </Button>
          )}
        </>
      )}

      {comments.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          No comments yet. Add your first comment above!
        </p>
      )}
    </div>
  );
};
