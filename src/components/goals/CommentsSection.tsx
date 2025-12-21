import { useState } from "react";
import { format } from "date-fns";
import { Send, Search, ArrowUpDown, Pencil, Trash2, StickyNote, Reply, ChevronDown, ChevronUp, Filter } from "lucide-react";
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

// Generate a color based on target id for consistent coloring
const getTargetColor = (targetId: string, targets: Target[]): string => {
  const colors = [
    "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700",
    "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700",
    "bg-pink-100 border-pink-300 dark:bg-pink-900/30 dark:border-pink-700",
    "bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
    "bg-teal-100 border-teal-300 dark:bg-teal-900/30 dark:border-teal-700",
    "bg-cyan-100 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700",
    "bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700",
    "bg-rose-100 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700",
  ];
  const index = targets.findIndex(t => t.id === targetId);
  return colors[index % colors.length];
};

export const CommentsSection = ({ goalId, comments, targets }: CommentsSectionProps) => {
  const { addComment, updateComment, deleteComment } = useGoalsContext();
  
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [filterByTarget, setFilterByTarget] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(goalId, newComment.trim());
    setNewComment("");
  };

  const handleReply = (parentId: string) => {
    if (!replyContent.trim()) return;
    addComment(goalId, replyContent.trim(), undefined, parentId);
    setReplyContent("");
    setReplyingTo(null);
    // Auto-expand the thread
    setExpandedThreads(prev => new Set([...prev, parentId]));
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

  const toggleThread = (commentId: string) => {
    setExpandedThreads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Separate root comments from replies
  const rootComments = comments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  // Filter and sort comments
  let filteredComments = [...rootComments];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredComments = filteredComments.filter(c => 
      c.content.toLowerCase().includes(query) ||
      c.author.toLowerCase().includes(query)
    );
  }

  if (filterByTarget !== "all") {
    if (filterByTarget === "notes") {
      filteredComments = filteredComments.filter(c => c.isNote);
    } else if (filterByTarget === "comments") {
      filteredComments = filteredComments.filter(c => !c.isNote);
    } else {
      filteredComments = filteredComments.filter(c => c.targetId === filterByTarget);
    }
  }

  filteredComments.sort((a, b) => {
    const diff = a.createdAt.getTime() - b.createdAt.getTime();
    return sortOrder === "desc" ? -diff : diff;
  });

  const displayedComments = showAll ? filteredComments : filteredComments.slice(0, 5);
  const hasMore = filteredComments.length > 5;

  const renderComment = (comment: Comment, isReply = false) => {
    const replies = getReplies(comment.id);
    const hasReplies = replies.length > 0;
    const isExpanded = expandedThreads.has(comment.id);
    const targetName = comment.targetId ? targets.find(t => t.id === comment.targetId)?.name : null;
    
    return (
      <div key={comment.id} className={cn("animate-fade-in", isReply && "ml-6 mt-2")}>
        <div 
          className={cn(
            "p-4 rounded-lg border transition-all",
            comment.isNote && comment.targetId
              ? getTargetColor(comment.targetId, targets)
              : comment.isNote 
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
                <div className="flex items-center gap-2 flex-wrap">
                  {comment.isNote && (
                    <StickyNote className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                  <span className="font-medium text-sm">
                    {comment.author}
                  </span>
                  {comment.isNote && (
                    <Badge variant="muted" className="text-[10px]">Note</Badge>
                  )}
                  {targetName && (
                    <Badge variant="secondary" className="text-[10px]">
                      {targetName}
                    </Badge>
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
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    title="Reply"
                  >
                    <Reply className="h-3 w-3" />
                  </Button>
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
              
              {/* Reply form */}
              {replyingTo === comment.id && (
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReply(comment.id);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={() => handleReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              )}
              
              {/* Show replies toggle */}
              {hasReplies && (
                <button
                  onClick={() => toggleThread(comment.id)}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </button>
              )}
            </>
          )}
        </div>
        
        {/* Render replies */}
        {hasReplies && isExpanded && (
          <div className="border-l-2 border-muted pl-2">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

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
            <Select value={filterByTarget} onValueChange={setFilterByTarget}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="comments">Comments only</SelectItem>
                <SelectItem value="notes">Notes only</SelectItem>
                {targets.map(target => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name.substring(0, 20)}{target.name.length > 20 ? "..." : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {displayedComments.map((comment) => renderComment(comment))}
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