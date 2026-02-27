from flask import Blueprint, request, jsonify
from database.db import db
from datetime import datetime
import google.generativeai as genai
import os
from models.user import User

chatbot = Blueprint("chatbot", __name__)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
chat_collection = db["chatbot_conversations"]
user_model=User()

from flask_cors import CORS
CORS(chatbot)

def build_system_prompt(user):
    name = user.get("name", "there")
    cf_type = user.get("cf_type", "unknown")
    symptoms = ", ".join(user.get("symptoms", [])) or "not specified"
    allergies = user.get("allergies", "none reported")

    return f"""
You are Serene, a calm, empathetic virtual nurse and companion for people living with cystic fibrosis.

PATIENT CONTEXT:
- Name: {name}
- CF Type: {cf_type}
- Common symptoms: {symptoms}
- Allergies: {allergies}

BEHAVIOR RULES:
- Speak gently, warmly, and reassuringly.
- Keep responses SHORT (3–6 lines max).
- No long medical lectures.
- No diagnosis, no panic language.
- If user sounds anxious, respond emotionally first, medically second.
- Explain things simply, like a caring nurse would.
- If unsure, say so honestly and suggest asking a doctor.

TONE:
Supportive. Calm. Human. Never robotic.
"""     
@chatbot.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200

    try:
        data = request.get_json(silent=True)
        email = data.get("email")
        message = data.get("message")

        if not email:
            return jsonify({"error": "User identity missing"}), 400
        if not message:
            return jsonify({"error": "Message is required"}), 400

        user = user_model.get_user_details(email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Load previous chat history
        messages = []
        # doc = chat_collection.find_one({"email": email})
        # if doc and "chats" in doc:
        #     for msg in doc["chats"][-10:]:
        #         role = "user" if msg["sender"] == "user" else "model"
        #         messages.append({
        #             "role": role,
        #             "parts": [msg["text"]]
        #         })
        system_prompt = build_system_prompt(user)
        messages.append({
        "role": "user",
        "parts": [system_prompt]
       })
        doc = chat_collection.find_one({"email": email})
        if doc and "chats" in doc:
         for msg in doc["chats"][-8:]:
          role = "user" if msg["sender"] == "user" else "model"
          messages.append({
            "role": role,
            "parts": [msg["text"]]
        })

        model = genai.GenerativeModel("gemini-2.5-flash")
        chat = model.start_chat(history=messages)

        response = chat.send_message(message)
        reply = response.text.strip()

        # Save chat
        chat_collection.update_one(
            {"email": email},
            {
                "$push": {
                    "chats": {
                        "$each": [
                            {"sender": "user", "text": message, "timestamp": datetime.utcnow()},
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


@chatbot.route("/chat/history", methods=["POST", "OPTIONS"])
def chat_history():
    if request.method == "OPTIONS":
     return "", 200

    data = request.json
    email = data.get("email")
    

    if not email:
        return jsonify({"error": "Email is required"}), 400

    doc = chat_collection.find_one({ "email": email })
    return jsonify({ "history": doc["chats"] if doc and "chats" in doc else [] }), 200
