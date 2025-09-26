
import random
from flask import Blueprint, request, jsonify
from config.db import mongo
from auth.auth import token_required
from datetime import datetime
from bson.objectid import ObjectId

game_bp = Blueprint('game_bp', __name__)

@game_bp.route('/questions', methods=['GET'])
def get_questions():
    all_questions = list(mongo.db.questions.find())
    for q in all_questions:
        q['_id'] = str(q['_id'])
    
    # Return all questions
    return jsonify(all_questions)

@game_bp.route('/submit-single', methods=['POST'])
@token_required
def submit_single_answer(current_user):
    data = request.get_json()
    question_id = data.get('question_id')
    selected_answer = data.get('selected_answer')

    if not question_id or not selected_answer:
        return jsonify({'message': 'Missing question_id or selected_answer'}), 400

    question_doc = mongo.db.questions.find_one({'_id': ObjectId(question_id)})

    if not question_doc:
        return jsonify({'message': 'Question not found'}), 404

    is_correct = (question_doc['answer'] == selected_answer)

    # Store the user's answer and its correctness
    mongo.db.user_quiz_answers.update_one(
        {'user_id': current_user['_id'], 'question_id': ObjectId(question_id)},
        {'$set': {
            'selected_answer': selected_answer,
            'is_correct': is_correct,
            'timestamp': datetime.utcnow()
        }},
        upsert=True
    )

    # Recalculate total score for the user based on all their submitted answers
    all_user_answers = mongo.db.user_quiz_answers.find({'user_id': current_user['_id']})
    total_score = sum(1 for answer in all_user_answers if answer.get('is_correct'))

    # Update or insert the user's total quiz score in game_results
    mongo.db.game_results.update_one(
        {'user_id': current_user['_id'], 'game_type': 'quiz'}, # Assuming 'quiz' as a game_type
        {'$set': {
            'score': total_score,
            'timestamp': datetime.utcnow()
        }},
        upsert=True
    )

    return jsonify({'is_correct': is_correct, 'correct_answer': question_doc['answer']})

@game_bp.route('/watch-demo-points', methods=['POST'])
@token_required
def watch_demo_points(current_user):
    data = request.get_json()
    demo_id = data.get('demo_id')

    if not demo_id:
        return jsonify({'message': 'Missing demo_id'}), 400

    user_id = current_user['_id']

    # Check if user has already received points for this demo
    existing_record = mongo.db.watched_demos.find_one({
        'user_id': user_id,
        'demo_id': demo_id
    })

    if existing_record:
        return jsonify({'message': 'Points already awarded for this demo'}), 200

    # Award random points (2 or 3)
    points_awarded = random.randint(2, 3)

    # Update user's total score in game_results
    mongo.db.game_results.update_one(
        {'user_id': user_id, 'game_type': 'total_points'}, # Using 'total_points' as a game_type for overall score
        {'$inc': {'score': points_awarded}, '$set': {'timestamp': datetime.utcnow()}},
        upsert=True
    )

    # Record that points have been awarded for this demo
    mongo.db.watched_demos.insert_one({
        'user_id': user_id,
        'demo_id': demo_id,
        'points_awarded': points_awarded,
        'timestamp': datetime.utcnow()
    })

    return jsonify({'message': f'Successfully awarded {points_awarded} points for watching demo!', 'points': points_awarded}), 200

@game_bp.route('/user-answers', methods=['GET'])
@token_required
def get_user_answers(current_user):
    user_answers = list(mongo.db.user_quiz_answers.find({'user_id': current_user['_id']}))
    for ua in user_answers:
        ua['_id'] = str(ua['_id'])
        ua['question_id'] = str(ua['question_id'])
    return jsonify(user_answers)

@game_bp.route('/submit', methods=['POST'])
@token_required
def submit_answers(current_user):
    data = request.get_json()
    submitted_answers = data.get('answers', [])
    
    score = 0
    for submitted_answer in submitted_answers:
        question_id = submitted_answer.get('question_id')
        selected_answer = submitted_answer.get('selected_answer')
        
        if question_id and selected_answer:
            question_doc = mongo.db.questions.find_one({'_id': ObjectId(question_id)})
            if question_doc and question_doc['answer'] == selected_answer:
                score += 1
    
    user_id = current_user['_id']
    mongo.db.game_results.insert_one({
        'user_id': user_id,
        'score': score,
        'timestamp': datetime.utcnow()
    })
    
    return jsonify({'message': 'Game submitted successfully!', 'score': score})
