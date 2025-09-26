
from app import create_app
from config.db import mongo
from werkzeug.security import generate_password_hash

def seed_data():
    app = create_app()
    with app.app_context():
        admin_email = 'mannsuitx@gmail.com'
        admin_username = 'mannsuitx'
        admin_password = 'Man@1123'

        if not mongo.db.users.find_one({'email': admin_email}):
            hashed_password = generate_password_hash(admin_password)
            mongo.db.users.insert_one({
                'username': admin_username,
                'email': admin_email,
                'password': hashed_password,
                'role': 'admin'
            })
            print(f'Admin user {admin_username} created.')
        else:
            print(f'Admin user {admin_username} already exists.')

        if mongo.db.questions.count_documents({}) == 0:
            questions = [
                {
                    "question": "What is the first thing to do in case of an earthquake?",
                    "options": ["Run out of the building", "Drop, Cover, and Hold On", "Stand under a tree", "Scream"],
                    "answer": "Drop, Cover, and Hold On"
                },
                {
                    "question": "What is the emergency number for fire brigade in India? (Updated)",
                    "options": ["100", "101", "102", "108"],
                    "answer": "101"
                },
                {
                    "question": "What should you do if you see a person who has fainted?",
                    "options": ["Leave them alone", "Sprinkle water on their face", "Check for breathing and call for help", "Try to make them stand up"],
                    "answer": "Check for breathing and call for help"
                },
                {
                    "question": "What is the universal emergency number?",
                    "options": ["911", "112", "999", "100"],
                    "answer": "112"
                },
                {
                    "question": "What is the first aid for a minor burn?",
                    "options": ["Apply ice directly", "Apply butter", "Run under cool water", "Pop blisters"],
                    "answer": "Run under cool water"
                },
                {
                    "question": "What is the Heimlich maneuver used for?",
                    "options": ["Heart attack", "Stroke", "Choking", "Fainting"],
                    "answer": "Choking"
                }
            ]
            mongo.db.questions.insert_many(questions)
            print('Game questions created.')

        if mongo.db.resources.count_documents({}) == 0:
            resources = [
                {
                    "name": "National Disaster Management Authority (NDMA), India",
                    "description": "The apex body for Disaster Management in India, with the responsibility for laying down policies, plans and guidelines for Disaster Management to ensure timely and effective response to disasters.",
                    "url": "https://www.ndma.gov.in/"
                },
                {
                    "name": "State Disaster Management Authority (SDMA), Punjab",
                    "description": "The apex body for disaster management at the state level in Punjab.",
                    "url": "https://www.punjab.gov.in/?q=sdma"
                },
                {
                    "name": "National Disaster Response Force (NDRF)",
                    "description": "A specialized force constituted for the purpose of special response to a threatening disaster situation or disaster.",
                    "url": "https://www.ndrf.gov.in/"
                }
            ]
            mongo.db.resources.insert_many(resources)
            print('Emergency resources created.')

        if mongo.db.emergency_contacts.count_documents({}) == 0:
            contacts = [
                {
                    "name": "National Emergency Number",
                    "phone": "112",
                    "contact_type": "General",
                    "location": "Nationwide"
                },
                {
                    "name": "Police",
                    "phone": "100",
                    "contact_type": "Police",
                    "location": "Nationwide"
                },
                {
                    "name": "Fire",
                    "phone": "101",
                    "contact_type": "Fire Brigade",
                    "location": "Nationwide"
                },
                {
                    "name": "Ambulance",
                    "phone": "102",
                    "contact_type": "Ambulance",
                    "location": "Nationwide"
                }
            ]
            mongo.db.emergency_contacts.insert_many(contacts)
            print('Emergency contacts created.')

if __name__ == '__main__':
    seed_data()
