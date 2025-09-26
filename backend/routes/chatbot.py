
import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify

chatbot_bp = Blueprint('chatbot_bp', __name__)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        print(f"Received message: {message}")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(message)

        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
