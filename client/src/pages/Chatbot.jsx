import React, { useState, useRef, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { sender: "user", text: input },
      // Simulate
      { sender: "bot", text: "I'm here to support you! (Demo reply)" },
    ]);
    setInput("");
  };

  return (
    <>
      <Navbar />
      <div className="h-full relative font-dm-sans flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center pt-2 pb-4">
          <div className="w-full md:max-w-2xl flex flex-col h-[75vh] md:h-[90vh]">
            {/* <div className="flex items-center justify-center gap-1 px-6 py-4 ">
              <img src="/home/chatbot.png" alt="Chatbot" className="w-6 h-6 " />

              <span className="md:text-md text-md font-medium px-1 py-2 rounded-full text-[#0A7CFF] tracking-tight">
                CF Chatbot
              </span>
            </div> */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm md:text-base font-medium tracking-tight "
                    ${
                      msg.sender === "user"
                        ? "bg-[#0A7CFF] text-white rounded-br-none"
                        : "bg-white/90 text-[#000]  "
                    }`}
                  >
                    <div className="flex flex-row items-center gap-3">
                      {msg.sender === "bot" ? (
                        <div className="bg-blue-400 h-4 w-4 rounded-full "></div>
                      ) : null}
                      <div className="max-w-[150px]">{msg.text}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-4 py-3 border-t border-[#0A7CFF]/10 bg-white/60 rounded-b-2xl"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A7CFF] bg-white/80 placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                className="bg-[#0A7CFF] hover:bg-[#095ec2] text-white font-semibold px-5 py-2 rounded-full shadow transition-all duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
