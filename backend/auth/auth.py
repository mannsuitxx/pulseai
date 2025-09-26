
import jwt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from config.db import mongo
from bson.objectid import ObjectId

def create_token(user):
    payload = {
        'user_id': str(user['_id']),
        'username': user['username'],
        'role': user['role'],
        'full_name': user.get('full_name'),
        'email': user.get('email'),
        'pfp_url': user.get('pfp_url'),
        'exp': datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm='HS256')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=['HS256'])
            current_user = mongo.db.users.find_one({'_id': ObjectId(data['user_id'])})
            # Add full_name, email, pfp_url to current_user if they exist
            if current_user:
                current_user['full_name'] = current_user.get('full_name')
                current_user['email'] = current_user.get('email')
                current_user['pfp_url'] = current_user.get('pfp_url')
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = args[0]
        if not current_user or current_user['role'] != 'admin':
            return jsonify({'message': 'Cannot perform that function!'}), 403
        return f(*args, **kwargs)
    return decorated
