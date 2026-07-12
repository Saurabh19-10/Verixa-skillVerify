import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";

import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import socket from "../../socket/socket";
import {
  getRecentChats,
  getConversation,
  sendMessage,
  markAsRead,
} from "../../api/chatApi";

import { useAuth } from "../../context/AuthContext";

export default function Chat() {
  const { user } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;

    socket.connect();
    socket.emit("join", user.id);

    socket.on("online-users", setOnlineUsers);

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("typing", (sender) => {
      setTypingUser(sender);
    });

    socket.on("stop-typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("online-users");
      socket.off("receive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const data = await getRecentChats();
        setChats(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChat = async (chat) => {
    try {
      setSelectedChat(chat.user);

      const conversation = await getConversation(chat.user._id);
      setMessages(conversation);

      await markAsRead(chat.user._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTyping = (value) => {
    setText(value);

    if (!selectedChat) return;

    socket.emit("typing", {
      receiver: selectedChat._id,
      sender: user.id,
    });

    setTimeout(() => {
      socket.emit("stop-typing", {
        receiver: selectedChat._id,
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!text.trim() || !selectedChat) return;

    try {
      const payload = {
        receiver: selectedChat._id,
        message: text.trim(),
      };

      const savedMessage = await sendMessage(payload);

      setMessages((prev) => [...prev, savedMessage]);

      socket.emit("send-message", {
        ...savedMessage,
        receiver: selectedChat._id,
      });

      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  const isOnline = (id) => onlineUsers.includes(id);

  return (
    <DashboardLayout title="Messages" subtitle="Chat with recruiters and developers">
      <div className="grid h-[75vh] gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-slate-200 p-5 dark:border-slate-800">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <MessageCircle className="text-blue-500" />
              Chats
            </h2>
          </div>

          <div className="h-full overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                No chats yet.
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat.user._id}
                  onClick={() => openChat(chat)}
                  className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${
                    selectedChat?._id === chat.user._id
                      ? "bg-blue-500/10"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={chat.user.avatar || "https://i.pravatar.cc/150?img=12"}
                        alt={chat.user.name}
                        className="h-11 w-11 rounded-full"
                      />

                      {isOnline(chat.user._id) && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-950" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {chat.user.name}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {chat.lastMessage}
                      </p>
                    </div>

                    {chat.unread > 0 && (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="flex flex-col overflow-hidden p-0">
          {!selectedChat ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageCircle size={56} className="text-slate-400" />
              <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                Select a conversation
              </h2>
              <p className="mt-2 text-slate-500">
                Choose a chat from the left panel.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
                <div className="relative">
                  <img
                    src={selectedChat.avatar || "https://i.pravatar.cc/150?img=12"}
                    alt={selectedChat.name}
                    className="h-11 w-11 rounded-full"
                  />

                  {isOnline(selectedChat._id) && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500 dark:border-slate-950" />
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {selectedChat.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {isOnline(selectedChat._id) ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5 dark:bg-slate-950">
                {messages.map((msg) => {
                  const isMine =
                    msg.sender?._id === user.id || msg.sender === user.id;

                  return (
                    <div
                      key={msg._id || `${msg.createdAt}-${msg.message}`}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                          isMine
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p
                          className={`mt-1 text-[10px] ${
                            isMine ? "text-blue-100" : "text-slate-400"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {typingUser && (
                  <p className="text-xs text-blue-400">Typing...</p>
                )}

                <div ref={bottomRef} />
              </div>

              <div className="flex gap-3 border-t border-slate-200 p-4 dark:border-slate-800">
                <input
                  value={text}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />

                <Button onClick={handleSend}>
                  <Send size={18} />
                  Send
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}