import { useState, useEffect, useRef } from "react";
import { X, Send, GripVertical } from "lucide-react";
import { useChatbotStore } from "@/stores/useChatbotStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/clerk-react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import { createPortal } from "react-dom";
import "react-resizable/css/styles.css";

const ChatBubble = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [dimensions, setDimensions] = useState({ width: 320, height: 480 });
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Reset position to 0,0
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { messages, isOpen, isLoading, sendMessage, closeChat } = useChatbotStore();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  if (!isOpen) return null;

  const onResize = (_e: any, { size }: { size: { width: number; height: number } }) => {
    setDimensions({ width: size.width, height: size.height });
  };

  return createPortal(
    <Draggable
      handle=".drag-handle"
      position={position}
      onStop={(_e: any, data) => setPosition({ x: data.x, y: data.y })}
      bounds="window"
    >
      <Resizable
        width={dimensions.width}
        height={dimensions.height}
        minConstraints={[300, 400]}
        maxConstraints={[600, 800]}
        onResize={onResize}
        resizeHandles={["se"]}
      >
        <div 
          className="fixed bg-zinc-800/95 backdrop-blur-sm rounded-xl shadow-2xl 
            flex flex-col overflow-hidden border border-zinc-700/50"
          style={{ 
            width: dimensions.width, 
            height: dimensions.height,
            zIndex: 9999 // Memastikan ChatBubble selalu di atas konten lain
          }}
        >
          {/* Chat header with drag handle */}
          <div className="flex items-center justify-between p-3 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-700/50">
            <div className="flex items-center gap-3">
              <Avatar className="size-9 ring-2 ring-green-500/20">
                <AvatarImage src="/Hu-Tao-outfit.webp" className="object-cover" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div>
                <span className="font-medium">Hu Tao - Music Assistant</span>
                <div className="text-xs text-green-500">AI Powered by Faatih</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="drag-handle cursor-move p-1.5 hover:bg-zinc-700/50 rounded-md">
                <GripVertical size={16} className="text-zinc-400" />
              </div>
              <button
                onClick={closeChat}
                className="p-1.5 hover:bg-zinc-700/50 rounded-md text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages container */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="size-8 shrink-0 ring-2 ring-zinc-700/50">
                  <AvatarImage 
                    src={msg.role === "user" ? user?.imageUrl : "/Hu-Tao-outfit.webp"}
                    alt={msg.role === "user" ? "User" : "AI Assistant"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {msg.role === "user" ? user?.firstName?.[0] : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`${
                    msg.role === "user"
                      ? "bg-green-600/20 text-white"
                      : "bg-zinc-700/50"
                  } rounded-2xl p-3 max-w-[75%] shadow-lg`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="size-8 shrink-0 ring-2 ring-zinc-700/50">
                  <AvatarImage 
                    src="/Hu-Tao-outfit.webp"
                    alt="AI Assistant"
                    className="object-cover"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-zinc-700/50 rounded-2xl p-3 shadow-lg">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-4 border-t border-zinc-700/50 bg-zinc-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                placeholder="Ask to hu taoss..."
                className="flex-1 bg-zinc-800/90 border border-zinc-700/50 rounded-full px-4 py-2.5 
                  text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 placeholder:text-zinc-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-500 rounded-full p-2.5 text-white 
                  disabled:opacity-50 disabled:hover:bg-green-600 transition-colors shadow-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Resize handle indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" />
        </div>
      </Resizable>
    </Draggable>,
    document.getElementById('chat-bubble-portal') || document.body // Update portal target
  );
};

export default ChatBubble;
