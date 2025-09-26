from flask import Blueprint, jsonify
from config.db import mongo
from auth.auth import token_required

stats_bp = Blueprint('stats_bp', __name__)

@stats_bp.route('/stats', methods=['GET'])
@token_required
def get_user_stats(current_user):
    user_id = current_user['_id']
    
    games_played = mongo.db.game_results.count_documents({'user_id': user_id})
    
    high_score_cursor = mongo.db.game_results.find({'user_id': user_id}).sort('score', -1).limit(1)
    high_score = high_score_cursor[0]['score'] if games_played > 0 else 0
    
    return jsonify({
        'games_played': games_played,
        'high_score': high_score
    })