"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// local import
import type { CommentCard } from "@/types/commentCard";

function Commentcard({ author, date, content, avatarUrl, id }: CommentCard) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const userName = session?.user?.fullName;
  console.log(author);
  console.log(userName);

  const isAuthor = userName === author || false; // Simplified check - adjust based on your data structure

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/user/comment/delete?commentId=${id}&userEmail=${userEmail}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Refresh the page or update the comment list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/user/comment/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            commentId: id,
            userEmail,
            updatedComment: editedContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update comment");
      }

      setIsEditing(false);
      // Refresh the page or update the comment list
      window.location.reload();
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  return (
    <div className="flex py-4 gap-3 items-start w-full text-base border-b-[1px] border-[#E6E6E6] last:border-[0]">
      <Avatar className="w-9 h-10">
        <AvatarImage src={avatarUrl || undefined} alt={`${author}'s avatar`} />
        <AvatarFallback>{author?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex flex-col grow">
        <div className="flex flex-wrap gap-1.5 items-start w-full font-medium leading-tight text-neutral-700 max-md:max-w-full">
          <div className="text-base font-medium text-[#444444]">{author}</div>
          <div className="text-base font-medium text-[#444444]">•</div>
          <div className="text-sm text-[#9C9C9C] font-normal ">
            {new Date(date).toLocaleString()}
          </div>

          {isAuthor && (
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(content);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpdate}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2 leading-5 text-[#9C9C9C] font-normal max-md:max-w-full">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export default Commentcard;
