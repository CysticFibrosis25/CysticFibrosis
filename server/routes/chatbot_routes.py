from flask import Blueprint, request, jsonify
from database.db import db
from datetime import datetime
import google.generativeai as genai
import os

chatbot = Blueprint("chatbot", __name__)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
chat_collection = db["chatbot_conversations"]


        
@chatbot.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user = data.get("user")
        history = data.get("history", [])

        # Format conversation
        messages = []
        for msg in history:
            role = "user" if msg["sender"] == "user" else "model"
            messages.append({"role": role, "parts": [msg["text"]]})
            

  

        # Start a Gemini chat model
        model = genai.GenerativeModel("gemini-2.5-flash")  # Ensure this model is available
        chat = model.start_chat(history=messages)

        # Send latest user message
        latest_user_message = history[-1]["text"]
        response = chat.send_message(latest_user_message)

        reply = response.text.strip()

        # Save chat to MongoDB
        chat_collection.update_one(
            {"email": user["email"]},
            {
                "$push": {
                    "chats": {
                        "$each": [
                            {"sender": "user", "text": latest_user_message, "timestamp": datetime.utcnow()},
                            {"sender": "bot", "text": reply, "timestamp": datetime.utcnow()},
                        ]
                    }
                }
            },
            upsert=True
        )

        return jsonify({"reply": reply})

    except Exception as e:
        print("Gemini API Error:", e)
        return jsonify({"error": "Chatbot failed. Try again."}), 500


@chatbot.route("/chat/history", methods=["POST"])
def chat_history():
    email = request.json.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    doc = chat_collection.find_one({ "email": email })
    return jsonify({ "history": doc["chats"] if doc and "chats" in doc else [] })
