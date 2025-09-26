
from flask import Blueprint, request, jsonify
from config.db import mongo
from auth.auth import token_required, admin_required
from bson.objectid import ObjectId

emergency_bp = Blueprint('emergency_bp', __name__)

# Get all emergency contacts
@emergency_bp.route('/emergency_contacts', methods=['GET'])
def get_emergency_contacts():
    contacts = list(mongo.db.emergency_contacts.find())
    for contact in contacts:
        contact['_id'] = str(contact['_id'])
    return jsonify(contacts)

# Create a new emergency contact
@emergency_bp.route('/emergency_contacts', methods=['POST'])
@token_required
@admin_required
def add_emergency_contact(current_user):
    data = request.get_json()
    contact_id = mongo.db.emergency_contacts.insert_one(data).inserted_id
    new_contact = mongo.db.emergency_contacts.find_one({'_id': contact_id})
    new_contact['_id'] = str(new_contact['_id'])
    return jsonify({'message': 'Emergency contact added successfully!', 'contact': new_contact}), 201

# Update an emergency contact
@emergency_bp.route('/emergency_contacts/<contact_id>', methods=['PUT'])
@token_required
@admin_required
def update_emergency_contact(current_user, contact_id):
    data = request.get_json()
    mongo.db.emergency_contacts.update_one({'_id': ObjectId(contact_id)}, {'$set': data})
    return jsonify({'message': 'Emergency contact updated successfully!'})

# Delete an emergency contact
@emergency_bp.route('/emergency_contacts/<contact_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_emergency_contact(current_user, contact_id):
    mongo.db.emergency_contacts.delete_one({'_id': ObjectId(contact_id)})
    return jsonify({'message': 'Emergency contact deleted successfully!'})
