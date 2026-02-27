import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const email = localStorage.getItem("email");

  const formatResponse = (responseText) => {
    let formattedText = responseText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formattedText = formattedText.replace(/\n/g, "<br/>");
    formattedText = formattedText.replace(/_(.*?)_/g, "<em>$1</em>");
    formattedText = `<p>${formattedText}</p>`;
    return formattedText;
  };

  useEffect(() => {
    if (!isLoggedIn || !email) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/user/details`, {
        params: { email },
      })
      .then((res) => {
        setUser(res.data);
        return axios.post(
          `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/chat/history`,
          { email }
        );
      })
      .then((res) => {
        const formattedHistroy=(res.data.history || []).map((msg) => ({
          ...msg,
          text:
            msg.sender === "bot"
              ? formatResponse(msg.text.trim())
              : msg.text,
        }));
        setMessages(formattedHistroy);
      })
      .catch((err) => {
        console.error("User /chat error:", err);

        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          navigate("/login");
        }
      });
  }, [isLoggedIn, email, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
  e.preventDefault();
  if (!input.trim() || !user) return;

  const updated = [...messages, { sender: "user", text: input }];
  setMessages(updated);
  setInput("");
  setIsTyping(true); // 👈 START typing


  try {
    const res = await axios.post(
      `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/chat`,
      {
        email: email,
        message: input,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const formattedReply = formatResponse(res.data.reply.trim());
    setTimeout(() =>{
       setMessages([...updated, { sender: "bot", text: formattedReply }]);
        setIsTyping(false); 
    },900);   
  } catch (err) {
    console.error("Chat error", err);
    const errorText = err?.response?.data?.error || "Something went wrong.";
    setIsTyping(false);
    setMessages([...updated, { sender: "bot", text: errorText }]);
  }
};

  return (
    <>
      <Navbar />
      <div className="h-full font-dm-sans flex flex-col ">
        <div className="flex-1 flex flex-col items-center justify-center pt-2 pb-4">
          <div className="w-full md:max-w-2xl pt-6 flex flex-col h-[76vh] md:h-[80vh] overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[75%] text-sm font-medium ${
                      msg.sender === "user"
                        ? "bg-[#0A7CFF] text-white rounded-br-none"
                        : "bg-[#D2E3FC] text-black rounded-bl-none"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.text }}
                  />
                </div>
              ))}
              {isTyping && (
              <div className="flex justify-start">
              <div className="bg-[#D2E3FC] text-black rounded-2xl px-4 py-2 text-sm font-medium">
              <div className="flex space-x-1">
              <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
</div>

              </div>
              </div>
        )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-4 py-3 bg-white border-t"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-full border focus:ring-2 focus:ring-[#0A7CFF] bg-white text-sm"
              />
              <button
                type="submit"
                className="bg-[#0A7CFF] text-white font-semibold px-5 py-2 rounded-full"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Chatbot;
