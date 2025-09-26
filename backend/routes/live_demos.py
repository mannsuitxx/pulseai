from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from auth.auth import token_required, admin_required
from config.db import mongo

live_demos_bp = Blueprint('live_demos', __name__)

@live_demos_bp.route('/live-demos', methods=['POST'])
@token_required
@admin_required
def add_live_demo():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    youtube_link = data.get('youtube_link')

    if not all([title, description, youtube_link]):
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        new_demo = {
            'title': title,
            'description': description,
            'youtube_link': youtube_link
        }
        result = mongo.db.live_demos.insert_one(new_demo)
        new_demo['_id'] = str(result.inserted_id)
        return jsonify({'message': 'Live demo added successfully', 'demo': new_demo}), 201
    except Exception as e:
        return jsonify({'message': 'Error adding live demo', 'error': str(e)}), 500

@live_demos_bp.route('/live-demos', methods=['GET'])
@token_required
@admin_required
def get_live_demos():
    try:
        demos = list(mongo.db.live_demos.find())
        for demo in demos:
            demo['_id'] = str(demo['_id'])
        return jsonify(demos), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching live demos', 'error': str(e)}), 500

@live_demos_bp.route('/live-demos-public', methods=['GET'])
def get_public_live_demos():
    try:
        demos = list(mongo.db.live_demos.find())
        for demo in demos:
            demo['_id'] = str(demo['_id'])
        return jsonify(demos), 200
    except Exception as e:
        return jsonify({'message': 'Error fetching public live demos', 'error': str(e)}), 500

@live_demos_bp.route('/live-demos/<string:demo_id>', methods=['PUT'])
@token_required
@admin_required
def update_live_demo(demo_id):
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    youtube_link = data.get('youtube_link')

    if not all([title, description, youtube_link]):
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        result = mongo.db.live_demos.update_one(
            {'_id': ObjectId(demo_id)},
            {'$set': {'title': title, 'description': description, 'youtube_link': youtube_link}}
        )
        if result.matched_count == 0:
            return jsonify({'message': 'Live demo not found'}), 404
        return jsonify({'message': 'Live demo updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error updating live demo', 'error': str(e)}), 500

@live_demos_bp.route('/live-demos/<string:demo_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_live_demo(demo_id):
    try:
        result = mongo.db.live_demos.delete_one({'_id': ObjectId(demo_id)})
        if result.deleted_count == 0:
            return jsonify({'message': 'Live demo not found'}), 404
        return jsonify({'message': 'Live demo deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error deleting live demo', 'error': str(e)}), 500
