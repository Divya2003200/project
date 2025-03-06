import { create } from "zustand";

interface CommentState {
  comments: any[];
  addComment: (comment: any) => void;
  setComments: (comments: any[]) => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
  setComments: (comments) => set({ comments }),
}));
