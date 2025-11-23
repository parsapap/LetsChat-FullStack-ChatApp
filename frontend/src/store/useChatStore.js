import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUsers: new Set(), // Track which users are typing

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  editMessage: async (messageId, newText) => {
    const { messages } = get();
    try {
      const res = await axiosInstance.put(`/messages/edit/${messageId}`, { text: newText });
      const updatedMessages = messages.map(msg =>
        msg._id === messageId ? res.data : msg
      );
      set({ messages: updatedMessages });
      toast.success("Message edited");
    } catch (error) {
      toast.error(error.response?.data?.error || "خطا در ویرایش پیام");
    }
  },

  deleteMessage: async (messageId) => {
    const { messages } = get();
    try {
      await axiosInstance.delete(`/messages/delete/${messageId}`);
      const filteredMessages = messages.filter(msg => msg._id !== messageId);
      set({ messages: filteredMessages });
      toast.success("Message deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "خطا در حذف پیام");
    }
  },

  setTyping: (userId, isTyping) => {
    const { typingUsers } = get();
    const newTypingUsers = new Set(typingUsers);

    if (isTyping) {
      newTypingUsers.add(userId);
    } else {
      newTypingUsers.delete(userId);
    }

    set({ typingUsers: newTypingUsers });
  },

  startTyping: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.emit("typing", {
      chatId: selectedUser._id,
      userId: useAuthStore.getState().authUser._id
    });
  },

  stopTyping: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.emit("stopTyping", {
      chatId: selectedUser._id,
      userId: useAuthStore.getState().authUser._id
    });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });

    // Handle message edits
    socket.on("messageEdited", (editedMessage) => {
      const { messages } = get();
      const updatedMessages = messages.map(msg =>
        msg._id === editedMessage._id ? editedMessage : msg
      );
      set({ messages: updatedMessages });
    });

    // Handle message deletions
    socket.on("messageDeleted", (messageId) => {
      const { messages } = get();
      const filteredMessages = messages.filter(msg => msg._id !== messageId);
      set({ messages: filteredMessages });
    });

    // Handle typing indicators
    socket.on("userTyping", ({ chatId, userId }) => {
      const authUserId = useAuthStore.getState().authUser?._id;
      // Check if the typing user is the selected user (not us)
      if (userId === selectedUser._id && userId !== authUserId) {
        get().setTyping(userId, true);
      }
    });

    socket.on("userStopTyping", ({ chatId, userId }) => {
      if (userId === selectedUser._id) {
        get().setTyping(userId, false);
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageEdited");
    socket.off("messageDeleted");
    socket.off("userTyping");
    socket.off("userStopTyping");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, typingUsers: new Set() }),
}));