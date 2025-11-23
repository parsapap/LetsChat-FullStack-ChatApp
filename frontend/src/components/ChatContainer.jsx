import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Edit3, Trash2, Check, X, MoreVertical } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
    editMessage,
    deleteMessage,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [showActionsFor, setShowActionsFor] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowActionsFor(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEditMessage = (messageId, currentText) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
    setShowActionsFor(null);
  };

  const handleSaveEdit = async () => {
    if (editingText.trim() && editingMessageId) {
      await editMessage(editingMessageId, editingText.trim());
      setEditingMessageId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteMessage(messageId);
    }
    setShowActionsFor(null);
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat group ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1 flex items-center gap-2">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
              {message.edited && (
                <span className="text-xs opacity-50">(edited)</span>
              )}
              {message.senderId === authUser._id && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionsFor(showActionsFor === message._id ? null : message._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-base-200 rounded"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {showActionsFor === message._id && (
                    <div className="absolute top-full mt-1 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditMessage(message._id, message.text);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-base-200 flex items-center gap-2 text-sm"
                      >
                        <Edit3 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message._id);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-base-200 flex items-center gap-2 text-sm text-red-500"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {editingMessageId === message._id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="text-green-500 hover:text-green-600"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                message.text && <p>{message.text}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {typingUsers.size > 0 && (
          <div className="chat chat-start">
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={selectedUser.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-bubble">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-base-content rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-base-content rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-base-content rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm opacity-70">typing...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
