import os
import google.generativeai as genai
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from config.db import mongo
from auth.auth import create_token, token_required, admin_required
from datetime import datetime
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from utils.email import send_email
import random
import time # New import
import json # Import json

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

UPLOAD_FOLDER = 'uploads/profile_pics' # Define upload folder
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

from flask import Blueprint, jsonify
from config.db import mongo
from bson.objectid import ObjectId

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/')
def index():
    return "Welcome to PulseAI Backend!"

@main_bp.route('/status')
def status():
    return jsonify({'status': 'ok'})

@main_bp.route('/live-demos', methods=['GET'])
def get_live_demos():
    live_demos = list(mongo.db.live_demos.find({}))
    for demo in live_demos:
        demo['_id'] = str(demo['_id'])
    return jsonify(live_demos)
def send_login_alert(email, username):
    email_body = f"""
Hello {username},

This is an alert to inform you that a login to your PulseAI account occurred just now.

If this was you, you can safely ignore this email.

If you do not recognize this activity, please secure your account immediately by changing your password and contacting our support.

---
Powered by Quantum Thinkers Team
"""
    send_email(email, "PulseAI Security Alert: New Login", email_body)

@main_bp.route('/request_signup_otp', methods=['POST'])
def request_signup_otp():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')

    if not email or not username:
        return jsonify({'message': 'Email and username are required'}), 400

    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'Email already registered'}), 409
    
    if mongo.db.users.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 409

    otp = str(random.randint(100000, 999999))
    otp_expires_at = time.time() + 300 # OTP valid for 5 minutes

    # Store OTP in a temporary collection
    mongo.db.otp_codes.update_one(
        {'email': email, 'type': 'signup'},
        {'$set': {'otp': otp, 'expires_at': otp_expires_at, 'username': username}},
        upsert=True
    )

    email_body = f"""
Hello,

Welcome to PulseAI! We are excited to have you on board.

Your One-Time Password (OTP) for signup is: {otp}
This OTP is valid for 5 minutes.

Thank you for joining our community.

---
Powered by Quantum Thinkers Team
"""
    success, message = send_email(email, "Welcome to PulseAI - Your Signup OTP", email_body)

    if success:
        return jsonify({'message': 'OTP sent to your email'}), 200
    else:
        return jsonify({'message': 'Failed to send OTP.', 'error': message}), 500

@main_bp.route('/verify_signup_otp', methods=['POST'])
def verify_signup_otp():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    full_name = data.get('full_name')
    email = data.get('email')
    otp = data.get('otp')
    role = data.get('role', 'student') # Get role, default to 'student' if not provided

    if not username or not password or not full_name or not email or not otp:
        return jsonify({'message': 'Missing required fields'}), 400

    otp_record = mongo.db.otp_codes.find_one({'email': email, 'type': 'signup', 'username': username})

    if not otp_record or otp_record['otp'] != otp or otp_record['expires_at'] < time.time():
        return jsonify({'message': 'Invalid or expired OTP'}), 401

    # OTP is valid, create user
    hashed_password = generate_password_hash(password)
    user_id = mongo.db.users.insert_one({
        'username': username,
        'password': hashed_password,
        'full_name': full_name,
        'email': email,
        'role': role # Use the selected role
    }).inserted_id

    # Delete OTP record after successful signup
    mongo.db.otp_codes.delete_one({'_id': otp_record['_id']})

    return jsonify({'message': 'Registered successfully!', 'user_id': str(user_id)}), 201

@main_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username_or_email')
    password = data.get('password')

    if not username_or_email or not password:
        return jsonify({'message': 'Username/email and password are required'}), 400

    user = mongo.db.users.find_one({'$or': [{'username': username_or_email}, {'email': username_or_email}]})

    if not user:
        return jsonify({'message': 'User not found'}), 404

    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    # Password is correct, now generate and send OTP
    otp = str(random.randint(100000, 999999))
    otp_expires_at = time.time() + 300  # OTP valid for 5 minutes

    mongo.db.otp_codes.update_one(
        {'user_id': str(user['_id']), 'type': 'login'},
        {'$set': {'otp': otp, 'expires_at': otp_expires_at}},
        upsert=True
    )

    email_body = f"""Your One-Time Password (OTP) for login is: {otp}. It is valid for 5 minutes.

---
Powered by Quantum Thinkers Team"""
    success, message = send_email(user['email'], "PulseAI Login OTP", email_body)

    if success:
        return jsonify({'message': 'OTP sent to your email. Please verify to complete login.', 'username_or_email': username_or_email}), 200
    else:
        return jsonify({'message': 'Failed to send OTP. Please try again.', 'error': message}), 500

@main_bp.route('/request_login_otp', methods=['POST'])
def request_login_otp():
    data = request.get_json()
    username_or_email = data.get('username_or_email')

    if not username_or_email:
        return jsonify({'message': 'Username or email is required'}), 400

    user = mongo.db.users.find_one({'$or': [{'username': username_or_email}, {'email': username_or_email}]})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    otp = str(random.randint(100000, 999999))
    otp_expires_at = time.time() + 300 # OTP valid for 5 minutes

    mongo.db.otp_codes.update_one(
        {'user_id': str(user['_id']), 'type': 'login'},
        {'$set': {'otp': otp, 'expires_at': otp_expires_at}},
        upsert=True
    )

    email_body = f"""Your OTP for login is: {otp}. It is valid for 5 minutes.

---
Powered by Quantum Thinkers Team"""
    success, message = send_email(user['email'], "PulseAI Login OTP", email_body)

    if success:
        return jsonify({'message': 'OTP sent to your email'}), 200
    else:
        return jsonify({'message': 'Failed to send OTP.', 'error': message}), 500

@main_bp.route('/verify_login_otp', methods=['POST'])
def verify_login_otp():
    data = request.get_json()
    username_or_email = data.get('username_or_email')
    otp = data.get('otp')

    if not username_or_email or not otp:
        return jsonify({'message': 'Username/email and OTP are required'}), 400

    user = mongo.db.users.find_one({'$or': [{'username': username_or_email}, {'email': username_or_email}]})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    otp_record = mongo.db.otp_codes.find_one({'user_id': str(user['_id']), 'type': 'login'})

    if not otp_record or otp_record['otp'] != otp or otp_record['expires_at'] < time.time():
        return jsonify({'message': 'Invalid or expired OTP'}), 401

    # OTP is valid, create token
    token = create_token(user)

    # Delete OTP record after successful login
    mongo.db.otp_codes.delete_one({'_id': otp_record['_id']})

    send_login_alert(user['email'], user['username']) # Send login alert after successful OTP verification

    return jsonify({'token': token, 'user': {'username': user['username'], 'email': user['email'], 'role': user['role'], 'full_name': user.get('full_name'), 'pfp_url': user.get('pfp_url')}}), 200

@main_bp.route('/request_password_reset_otp', methods=['POST'])
def request_password_reset_otp():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({'message': 'Email is required'}), 400

    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'message': 'User with this email does not exist'}), 404

    otp = str(random.randint(100000, 999999))
    otp_expires_at = time.time() + 300  # OTP valid for 5 minutes

    mongo.db.otp_codes.update_one(
        {'email': email, 'type': 'password_reset'},
        {'$set': {'otp': otp, 'expires_at': otp_expires_at}},
        upsert=True
    )

    email_body = f"""Your One-Time Password (OTP) for password reset is: {otp}. It is valid for 5 minutes.

---
Powered by Quantum Thinkers Team"""
    success, message = send_email(email, "PulseAI Password Reset OTP", email_body)

    if success:
        return jsonify({'message': 'OTP sent to your email'}), 200
    else:
        return jsonify({'message': 'Failed to send OTP.', 'error': message}), 500

@main_bp.route('/reset_password_with_otp', methods=['POST'])
def reset_password_with_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('new_password')

    if not email or not otp or not new_password:
        return jsonify({'message': 'Email, OTP, and new password are required'}), 400

    otp_record = mongo.db.otp_codes.find_one({'email': email, 'type': 'password_reset'})

    if not otp_record or otp_record['otp'] != otp or otp_record['expires_at'] < time.time():
        return jsonify({'message': 'Invalid or expired OTP'}), 401

    hashed_password = generate_password_hash(new_password)
    mongo.db.users.update_one(
        {'email': email},
        {'$set': {'password': hashed_password}}
    )

    mongo.db.otp_codes.delete_one({'_id': otp_record['_id']})

    return jsonify({'message': 'Password updated successfully'}), 200

@main_bp.route('/resources', methods=['GET'])
def get_resources():
    resources = list(mongo.db.resources.find())
    for resource in resources:
        resource['_id'] = str(resource['_id'])
    return jsonify(resources)

@main_bp.route('/generate_daily_report', methods=['POST'])
@token_required
@admin_required # Only admin can trigger this for now
def generate_daily_report(current_user):
    data = request.get_json()
    location = data.get('location', 'India') # Default location
    disaster_type = data.get('disaster_type', 'General') # Default to 'General' if not provided
    report_date = datetime.utcnow().strftime('%Y-%m-%d')

    try:
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-2.5-flash"))
        prompt = f"Generate a concise news report about a past {disaster_type} disaster in {location} that occurred around {report_date}. Write in a natural, journalistic tone, as if written by a human reporter. Avoid robotic or repetitive phrasing. Include date, location, type, impact, and any lessons learned. Format the output as a JSON object with two keys: 'title' (string) and 'report_text' (string). Example: {{'title': '...', 'report_text': '...'}}"
        
        response = model.generate_content(prompt)
        generated_content = response.text

        # Remove the disclaimer from Gemini's response
        disclaimer = "Please note: This news report is a fictional scenario created to fulfill the prompt's requirements, as the specified date is in the future. It describes a hypothetical past event from that future date."
        generated_content = generated_content.replace(disclaimer, '').strip()

        # Clean generated_content: remove markdown code block if present
        if generated_content.startswith('```json') and generated_content.endswith('```'):
            generated_content = generated_content[7:-3].strip()
        elif generated_content.startswith('```') and generated_content.endswith('```'):
            generated_content = generated_content[3:-3].strip()

        # Attempt to parse the generated text as JSON
        try:
            parsed_content = json.loads(generated_content)
            report_title = parsed_content.get('title', f"{location} - {disaster_type or 'General'} Disaster Report")
            report_text = parsed_content.get('report_text', generated_content) # Fallback to full content if report_text not found
        except json.JSONDecodeError:
            print(f"JSONDecodeError: Could not parse Gemini output as JSON. Raw content: {generated_content}")
            report_title = f"{location} - {disaster_type or 'General'} Disaster Report (Parsing Error)"
            report_text = "Could not generate report in expected format. Please try again or check the input parameters." # Store a fallback message

        mongo.db.daily_disaster_reports.insert_one({
            'date': report_date,
            'location': location,
            'disaster_type': disaster_type,
            'title': report_title, # Store the generated title
            'report': report_text,
            'generated_at': datetime.utcnow()
        })

        return jsonify({'message': 'Daily report generated and saved successfully!', 'report': report_text, 'title': report_title}), 201

    except Exception as e:
        print(f"Error generating daily daily report: {e}")
        return jsonify({'message': 'Error generating daily report', 'error': str(e)}), 500

@main_bp.route('/get_daily_reports', methods=['GET'])
@token_required
def get_daily_reports(current_user):
    # Optional: filter by date or location
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')
    location = request.args.get('location')

    query = {}
    if start_date_str:
        query['date'] = {'$gte': start_date_str}
    if end_date_str:
        if 'date' in query:
            query['date']['$lte'] = end_date_str
        else:
            query['date'] = {'$lte': end_date_str}
    if location:
        query['location'] = location

    reports = list(mongo.db.daily_disaster_reports.find(query).sort('date', -1).limit(30)) # Get last 30 reports
    for report in reports:
        report['_id'] = str(report['_id'])
        if 'disaster_type' not in report:
            report['disaster_type'] = 'N/A' # Default for old entries
    
    return jsonify(reports)

@main_bp.route('/disaster_analysis', methods=['POST'])
@token_required
def disaster_analysis(current_user):
    data = request.get_json()
    location = data.get('location')
    disaster_type = data.get('disaster_type')

    if not location:
        return jsonify({'message': 'Location is required'}), 400

    # Implement daily rate limit for non-admin users
    if current_user['role'] != 'admin':
        last_analysis_time = current_user.get('last_analysis_at')
        if last_analysis_time:
            time_since_last_analysis = datetime.utcnow() - last_analysis_time
            if time_since_last_analysis.total_seconds() < 86400: # 24 hours * 60 minutes * 60 seconds
                return jsonify({'message': 'You can only generate one analysis per day.'}), 429 # 429 Too Many Requests

    try:
        model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))
        prompt = f"Provide a detailed analysis of the potential for a {disaster_type} disaster in {location}. Include historical data, geological factors, and potential impact."
        
        response = model.generate_content(prompt)
        analysis = response.text

        # Update last_analysis_at for non-admin users
        if current_user['role'] != 'admin':
            mongo.db.users.update_one(
                {'_id': current_user['_id']},
                {'$set': {'last_analysis_at': datetime.utcnow()}}
            )

        # Store the analysis in a temporary collection with a TTL
        temp_analysis_id = mongo.db.temporary_disaster_analyses.insert_one({
            'user_id': str(current_user['_id']),
            'analysis_content': analysis,
            'generated_at': datetime.utcnow()
        }).inserted_id

        # Store a persistent record of the analysis generation for history/stats
        mongo.db.analysis_history.insert_one({
            'user_id': str(current_user['_id']),
            'location': location,
            'disaster_type': disaster_type,
            'generated_at': datetime.utcnow()
        })

        return jsonify({'analysis_id': str(temp_analysis_id)})

    except Exception as e:
        print(f"Error generating disaster analysis: {e}")
        return jsonify({'message': 'Error generating disaster analysis', 'error': str(e)}), 500

@main_bp.route('/get_temporary_analysis/<analysis_id>', methods=['GET'])
@token_required
def get_temporary_analysis(current_user, analysis_id):
    try:
        analysis_doc = mongo.db.temporary_disaster_analyses.find_one({'_id': ObjectId(analysis_id)})

        if not analysis_doc:
            return jsonify({'message': 'Analysis not found or expired.'}), 404

        if analysis_doc['user_id'] != str(current_user['_id']):
            return jsonify({'message': 'Unauthorized access to analysis.'}), 403
        
        return jsonify({'analysis': analysis_doc['analysis_content']}), 200

    except Exception as e:
        print(f"Error retrieving temporary analysis: {e}")
        return jsonify({'message': 'Error retrieving temporary analysis', 'error': str(e)}), 500

@main_bp.route('/download_analysis/<analysis_id>', methods=['GET'])
@token_required
def download_analysis(current_user, analysis_id):
    try:
        analysis_doc = mongo.db.temporary_disaster_analyses.find_one({'_id': ObjectId(analysis_id)})

        if not analysis_doc:
            return jsonify({'message': 'Analysis not found or expired.'}), 404

        if analysis_doc['user_id'] != str(current_user['_id']):
            return jsonify({'message': 'Unauthorized access to analysis.'}), 403
        
        analysis_content = analysis_doc['analysis_content']
        response = current_app.make_response(analysis_content)
        response.headers["Content-Disposition"] = f"attachment; filename=disaster_analysis_{analysis_id}.txt"
        response.headers["Content-type"] = "text/plain"
        return response

    except Exception as e:
        print(f"Error downloading analysis: {e}")
        return jsonify({'message': 'Error downloading analysis', 'error': str(e)}), 500

@main_bp.route('/get_analysis_history', methods=['GET'])
@token_required
def get_analysis_history(current_user):
    try:
        history = list(mongo.db.analysis_history.find({'user_id': str(current_user['_id'])}).sort('generated_at', -1).limit(10))
        for entry in history:
            entry['_id'] = str(entry['_id'])
        return jsonify(history), 200
    except Exception as e:
        print(f"Error retrieving analysis history: {e}")
        return jsonify({'message': 'Error retrieving analysis history', 'error': str(e)}), 500

@main_bp.route('/game/questions', methods=['GET'])
def get_game_questions():
    questions = list(mongo.db.questions.find({}))
    for question in questions:
        question['_id'] = str(question['_id'])
    return jsonify(questions), 200

@main_bp.route('/game/submit', methods=['POST'])
def submit_game_answers():
    data = request.get_json()
    answers = data.get('answers')

    # For now, just return a dummy score
    score = 0
    if answers:
        # In a real app, you'd verify answers against stored questions
        # For this dummy, let's just give a score based on number of answers
        score = len(answers) * 10 # Dummy scoring

    return jsonify({'score': score}), 200

@main_bp.route('/delete_daily_report/<report_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_daily_report(current_user, report_id):
    try:
        mongo.db.daily_disaster_reports.delete_one({'_id': ObjectId(report_id)})
        return jsonify({'message': 'Report deleted successfully!'}), 200
    except Exception as e:
        print(f"Error deleting report: {e}")
        return jsonify({'message': 'Error deleting report', 'error': str(e)}), 500

@main_bp.route('/upload_pfp', methods=['POST'])
@token_required
def upload_pfp(current_user):
    if 'pfp' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['pfp']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if file:
        filename = secure_filename(file.filename)
        # Ensure the filename is unique to prevent overwriting and cache issues
        unique_filename = f"{current_user['_id']}_{int(datetime.utcnow().timestamp())}_{filename}"
        file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(file_path)
        
        # Update user's PFP path in database
        mongo.db.users.update_one(
            {'_id': current_user['_id']},
            {'$set': {'pfp_url': unique_filename}}
        )
        return jsonify({'message': 'Profile picture uploaded successfully!', 'pfp_url': unique_filename}), 200
    return jsonify({'message': 'File upload failed'}), 500

@main_bp.route('/uploads/profile_pics/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@main_bp.route('/admin/users/<user_id>/role', methods=['PUT'])
@token_required
@admin_required
def update_user_role(current_user, user_id):
    data = request.get_json()
    new_role = data.get('role')

    if not new_role or new_role not in ['admin', 'teacher', 'student']:
        return jsonify({'message': 'Invalid role provided'}), 400

    # Prevent an admin from changing their own role
    if str(user_id) == str(current_user['_id']) and current_user['role'] == 'admin':
        return jsonify({'message': 'Admins cannot change their own role'}), 403

    target_user = mongo.db.users.find_one({'_id': ObjectId(user_id)})
    if not target_user:
        return jsonify({'message': 'Target user not found'}), 404

    # Prevent an admin from changing another admin's role to a non-admin role
    if target_user['role'] == 'admin' and new_role != 'admin':
        return jsonify({'message': "Cannot change an admin's role to a non-admin role"}), 403

    try:
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'role': new_role}}
        )
        return jsonify({'message': 'User role updated successfully!'}), 200

    except Exception as e:
        print(f"Error updating user role: {e}")
        return jsonify({'message': 'Error updating user role', 'error': str(e)}), 500

@main_bp.route('/update_profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    full_name = data.get('full_name')
    email = data.get('email')
    otp = data.get('otp')

    update_fields = {}
    if full_name:
        update_fields['full_name'] = full_name

    if email and email != current_user['email']:
        if not otp:
            return jsonify({'message': 'OTP is required to change email'}), 400
        
        otp_record = mongo.db.otp_codes.find_one({'new_email': email, 'type': 'email_change', 'user_id': str(current_user['_id'])})

        if not otp_record or otp_record['otp'] != otp or otp_record['expires_at'] < time.time():
            return jsonify({'message': 'Invalid or expired OTP'}), 401
        
        update_fields['email'] = email
        mongo.db.otp_codes.delete_one({'_id': otp_record['_id']})

    if not update_fields:
        return jsonify({'message': 'No fields to update'}), 400

    mongo.db.users.update_one({'_id': current_user['_id']}, {'$set': update_fields})
    
    updated_user = mongo.db.users.find_one({'_id': current_user['_id']})
    updated_user.pop('password', None) # Don't send password back
    updated_user['_id'] = str(updated_user['_id'])


    return jsonify({'message': 'Profile updated successfully', 'user': updated_user}), 200

@main_bp.route('/request_email_change_otp', methods=['POST'])
@token_required
def request_email_change_otp(current_user):
    data = request.get_json()
    new_email = data.get('new_email')

    if not new_email:
        return jsonify({'message': 'New email is required'}), 400

    if mongo.db.users.find_one({'email': new_email}):
        return jsonify({'message': 'This email is already in use.'}), 409

    otp = str(random.randint(100000, 999999))
    otp_expires_at = time.time() + 300  # 5 minutes

    mongo.db.otp_codes.update_one(
        {'user_id': str(current_user['_id']), 'type': 'email_change'},
        {'$set': {'otp': otp, 'expires_at': otp_expires_at, 'new_email': new_email}},
        upsert=True
    )

    email_body = f"Your OTP to change your email address is: {otp}. It is valid for 5 minutes."
    success, message = send_email(new_email, "PulseAI - Change Email OTP", email_body)

    if success:
        return jsonify({'message': 'OTP sent to your new email address'}), 200
    else:
        return jsonify({'message': 'Failed to send OTP.', 'error': message}), 500

@main_bp.route('/change_password', methods=['POST'])
@token_required
def change_password(current_user):
    data = request.get_json()
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    otp = data.get('otp')

    if not current_password or not new_password or not otp:
        return jsonify({'message': 'Current password, new password, and OTP are required'}), 400

    if not check_password_hash(current_user['password'], current_password):
        return jsonify({'message': 'Invalid current password'}), 401

    otp_record = mongo.db.otp_codes.find_one({'user_id': str(current_user['_id']), 'type': 'password_change'})

    if not otp_record or otp_record['otp'] != otp or otp_record['expires_at'] < time.time():
        return jsonify({'message': 'Invalid or expired OTP'}), 401

    hashed_password = generate_password_hash(new_password)
    mongo.db.users.update_one(
        {'_id': current_user['_id']},
        {'$set': {'password': hashed_password}}
    )

    mongo.db.otp_codes.delete_one({'_id': otp_record['_id']})

    return jsonify({'message': 'Password changed successfully'}), 200

@main_bp.route('/request_password_change_otp', methods=['POST'])
@token_required
def request_password_change_otp(current_user):
    otp = str(random.randint(100000, 999999))
    otp_expires_at = time.time() + 300  # 5 minutes

    mongo.db.otp_codes.update_one(
        {'user_id': str(current_user['_id']), 'type': 'password_change'},
        {'$set': {'otp': otp, 'expires_at': otp_expires_at}},
        upsert=True
    )

    email_body = f"Your OTP for changing your password is: {otp}. It is valid for 5 minutes."
    success, message = send_email(current_user['email'], "PulseAI - Change Password OTP", email_body)

    if success:
        return jsonify({'message': 'OTP sent to your email'}), 200
    else:
        return jsonify({'message': 'Failed to send OTP.', 'error': message}), 500