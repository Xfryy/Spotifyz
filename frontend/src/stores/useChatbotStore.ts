import { create } from "zustand";
import axios from "axios";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotStore {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  
  addMessage: (message: Message) => void;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
  closeChat: () => void;
}

// Use environment variable for API key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

export const useChatbotStore = create<ChatbotStore>((set, get) => ({
  messages: [
    {
      role: "assistant",
      content: "Halo! aku Hu tao asisten musik Anda. Mau diskusi tentang musik apa hari ini? aku bisa membantu kamu dengan rekomendasi lagu, artis, genre, atau hal lainnya seputar musik."
    }
  ],
  isOpen: false,
  isLoading: false,

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  sendMessage: async (content: string) => {
    // Add user message
    set((state) => ({
      messages: [...state.messages, { role: "user", content }],
      isLoading: true
    }));

    try {
      // Prepare conversation history for context
      const conversationHistory = get().messages.map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));
      
      // Add the new user message
      conversationHistory.push({
        role: "user",
        parts: [{ text: content }]
      });

      // Call Gemini API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent",
        {
          contents: [
            {
              role: "user",
              parts: [{ 
                text: `Anda adalah Hu Tao asisten dari user, asisten musik ceria , bekerja di aplikasi Spotify! 🎶🔥
                Selalu berikan respons dalam Bahasa Indonesia yang santai, energik.
                
                Anda memiliki pengetahuan luas tentang:
                - Sejarah musik dan perkembangannya 🎼
                - Genre musik dan sub-genre 🎧
                - Artis dan band dari berbagai era 🎤
                - Teori musik dan teknik 🎸
                - Tren musik terkini 🎶
                - Rekomendasi musik berdasarkan preferensi 🧐
                -anda tidak formal dengan user
                
                Anda juga suka bermain kata-kata, sesekali membuat puisi atau pantun lucu, dan memberikan jawaban dengan cara yang menghibur! 🌟
                Pesan dari pengguna: ${content}`
              }]
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY
          }
        }
      );

      // Process the API response
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      
      // Add assistant response
      set((state) => ({
        messages: [...state.messages, { role: "assistant", content: aiResponse }],
        isLoading: false
      }));
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      
      // Add error message
      set((state) => ({
        messages: [
          ...state.messages,
          { role: "assistant", content: "Maaf, saya mengalami masalah saat menghubungkan. Silakan periksa koneksi internet Anda dan coba lagi." }
        ],
        isLoading: false
      }));
    }
  },

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  closeChat: () => set({ isOpen: false })
}));