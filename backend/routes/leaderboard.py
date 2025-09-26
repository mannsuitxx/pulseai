from flask import Blueprint, jsonify
from config.db import mongo

leaderboard_bp = Blueprint('leaderboard_bp', __name__)

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    pipeline = [
        {
            '$group': {
                '_id': '$user_id',
                'high_score': { '$max': '$score' }
            }
        },
        {
            '$sort': { 'high_score': -1 }
        },
        {
            '$limit': 10
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'user_info'
            }
        },
        {
            '$unwind': '$user_info'
        },
        {
            '$project': {
                'username': '$user_info.username',
                'high_score': '$high_score'
            }
        }
    ]
    leaderboard = list(mongo.db.game_results.aggregate(pipeline))
    return jsonify(leaderboard)