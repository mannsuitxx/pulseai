
import os
import json
import re
import google.generativeai as genai
from datetime import datetime
from flask import Blueprint, request, jsonify
from auth.auth import token_required, admin_required
from config.db import mongo
from bson.objectid import ObjectId

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/users', methods=['GET'])
@token_required
@admin_required
def get_users(current_user):
    users = list(mongo.db.users.find({}, {'password': 0})) # Exclude password field
    for user in users:
        user['_id'] = str(user['_id'])
    return jsonify(users)

@admin_bp.route('/users/<id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user, id):
    if not ObjectId.is_valid(id):
        return jsonify({'message': 'Invalid User ID'}), 400
    
    result = mongo.db.users.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 1:
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404

# Live Demos Management
@admin_bp.route('/live-demos', methods=['POST'])
@token_required
@admin_required
def add_live_demo(current_user):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    youtube_link = data.get('youtube_link')

    if not title or not description or not youtube_link:
        return jsonify({'message': 'Missing title, description, or youtube_link'}), 400

    # Basic validation for YouTube link (can be enhanced)
    if "youtube.com/watch?v=" not in youtube_link and "youtu.be/" not in youtube_link:
        return jsonify({'message': 'Invalid YouTube link format'}), 400

    live_demo = {
        'title': title,
        'description': description,
        'youtube_link': youtube_link,
        'created_at': datetime.utcnow()
    }
    result = mongo.db.live_demos.insert_one(live_demo)
    live_demo['_id'] = str(result.inserted_id)
    return jsonify({'message': 'Live demo added successfully', 'live_demo': live_demo}), 201

@admin_bp.route('/live-demos', methods=['GET'])
@token_required
@admin_required
def get_all_live_demos(current_user):
    live_demos = list(mongo.db.live_demos.find({}))
    for demo in live_demos:
        demo['_id'] = str(demo['_id'])
    return jsonify(live_demos)

@admin_bp.route('/live-demos/<id>', methods=['DELETE'])
@token_required
@admin_required
def delete_live_demo(current_user, id):
    if not ObjectId.is_valid(id):
        return jsonify({'message': 'Invalid Live Demo ID'}), 400

    result = mongo.db.live_demos.delete_one({'_id': ObjectId(id)})
    if result.deleted_count == 1:
        return jsonify({'message': 'Live demo deleted successfully'}), 200
    return jsonify({'message': 'Live demo not found'}), 404

@admin_bp.route('/live-demos/<id>', methods=['PUT'])
@token_required
@admin_required
def update_live_demo(current_user, id):
    if not ObjectId.is_valid(id):
        return jsonify({'message': 'Invalid Live Demo ID'}), 400

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    youtube_link = data.get('youtube_link')

    update_fields = {}
    if title: update_fields['title'] = title
    if description: update_fields['description'] = description
    if youtube_link:
        if "youtube.com/watch?v=" not in youtube_link and "youtu.be/" not in youtube_link:
            return jsonify({'message': 'Invalid YouTube link format'}), 400
        update_fields['youtube_link'] = youtube_link

    if not update_fields:
        return jsonify({'message': 'No fields to update'}), 400

    result = mongo.db.live_demos.update_one(
        {'_id': ObjectId(id)},
        {'$set': update_fields}
    )

    if result.modified_count == 1:
        return jsonify({'message': 'Live demo updated successfully'}), 200
    elif result.matched_count == 1:
        return jsonify({'message': 'No changes made to live demo'}), 200
    return jsonify({'message': 'Live demo not found'}), 404

@admin_bp.route('/resources', methods=['POST'])
@token_required
@admin_required
def add_resource(current_user):
    data = request.get_json()
    resource_id = mongo.db.resources.insert_one(data).inserted_id
    return jsonify({'message': 'Resource added successfully!', 'resource_id': str(resource_id)}), 201

@admin_bp.route('/resources/<resource_id>', methods=['PUT'])
@token_required
@admin_required
def update_resource(current_user, resource_id):
    data = request.get_json()
    mongo.db.resources.update_one({'_id': ObjectId(resource_id)}, {'$set': data})
    return jsonify({'message': 'Resource updated successfully!'})

@admin_bp.route('/resources/<resource_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_resource(current_user, resource_id):
    mongo.db.resources.delete_one({'_id': ObjectId(resource_id)})
    return jsonify({'message': 'Resource deleted successfully!'})

@admin_bp.route('/questions', methods=['POST'])
@token_required
@admin_required
def add_question(current_user):
    data = request.get_json()
    question_id = mongo.db.questions.insert_one(data).inserted_id
    new_question = mongo.db.questions.find_one({'_id': question_id})
    new_question['_id'] = str(new_question['_id'])
    return jsonify({'message': 'Question added successfully!', 'question': new_question}), 201

@admin_bp.route('/questions/<question_id>', methods=['PUT'])
@token_required
@admin_required
def update_question(current_user, question_id):
    data = request.get_json()
    # Ensure options are stored as a list if provided as a comma-separated string
    if 'options' in data and isinstance(data['options'], str):
        data['options'] = [opt.strip() for opt in data['options'].split(',')]
    
    mongo.db.questions.update_one({'_id': ObjectId(question_id)}, {'$set': data})
    return jsonify({'message': 'Question updated successfully!'})

@admin_bp.route('/questions/<question_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_question(current_user, question_id):
    mongo.db.questions.delete_one({'_id': ObjectId(question_id)})
    return jsonify({'message': 'Question deleted successfully!'})

@admin_bp.route('/quizzes/delete-many', methods=['POST'])
@token_required
@admin_required
def delete_many_quizzes(current_user):
    data = request.get_json()
    ids_to_delete = [ObjectId(id) for id in data.get('ids', [])]
    if not ids_to_delete:
        return jsonify({'message': 'No quiz IDs provided for deletion'}), 400
    
    result = mongo.db.questions.delete_many({'_id': {'$in': ids_to_delete}})
    return jsonify({'message': f'{result.deleted_count} quizzes deleted successfully!'})

@admin_bp.route('/disasters/<disaster_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_disaster(current_user, disaster_id):
    mongo.db.disasters.delete_one({'_id': ObjectId(disaster_id)})
    return jsonify({'message': 'Disaster entry deleted successfully!'})

@admin_bp.route('/disasters/delete-many', methods=['POST'])
@token_required
@admin_required
def delete_many_disasters(current_user):
    data = request.get_json()
    ids_to_delete = [ObjectId(id) for id in data.get('ids', [])]
    if not ids_to_delete:
        return jsonify({'message': 'No disaster IDs provided for deletion'}), 400
    
    result = mongo.db.disasters.delete_many({'_id': {'$in': ids_to_delete}})
    return jsonify({'message': f'{result.deleted_count} disaster entries deleted successfully!'})

@admin_bp.route('/generate_quiz', methods=['POST'])
@token_required
@admin_required
def generate_quiz(current_user):
    data = request.get_json()
    topic = data.get('topic')
    num_questions = data.get('num_questions', 5) # Default to 5 questions

    if not topic:
        return jsonify({'message': 'Topic is required for quiz generation'}), 400

    try:
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))
        prompt = f"Generate {num_questions} multiple-choice quiz questions about {topic}. Each question should have 4 options and 1 correct answer. Provide the output as a JSON array of objects, where each object has 'question', 'options' (an array of strings), and 'answer' (the correct option string). Example: [{{'question': '...', 'options': ['...', '...', '...', '...'], 'answer': '...'}}]"
        
        response = model.generate_content(prompt)
        generated_questions = response.text
        
        # Attempt to parse the generated text as JSON
        try:
            quiz_questions = json.loads(generated_questions)
        except json.JSONDecodeError:
            # If direct JSON parsing fails, try to extract JSON from text
            import re
            json_match = re.search(r'\[.*\]', generated_questions, re.DOTALL)
            if json_match:
                quiz_questions = json.loads(json_match.group(0))
            else:
                raise ValueError("Could not parse generated questions as JSON.")

        inserted_ids = []
        for q in quiz_questions:
            # Basic validation for generated questions
            if all(key in q for key in ['question', 'options', 'answer']) and \
               isinstance(q['options'], list) and len(q['options']) == 4 and \
               q['answer'] in q['options']:
                inserted_id = mongo.db.questions.insert_one(q).inserted_id
                inserted_ids.append(str(inserted_id))
            else:
                print(f"Skipping invalid question: {q}")

        return jsonify({'message': f'Generated and added {len(inserted_ids)} questions.', 'inserted_ids': inserted_ids}), 201

    except Exception as e:
        print(f"Error generating quiz: {e}")
        return jsonify({'message': 'Error generating quiz', 'error': str(e)}), 500
