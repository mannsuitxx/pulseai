
import os
from dotenv import load_dotenv # New import
from flask import Flask
from flask_cors import CORS
from config.db import init_db, mongo
from routes.main import main_bp
from routes.admin import admin_bp
from routes.game import game_bp
from routes.stats import stats_bp
from routes.leaderboard import leaderboard_bp
from routes.emergency import emergency_bp
from routes.live_demos import live_demos_bp
from routes.chatbot import chatbot_bp

load_dotenv() # Load environment variables

def create_app():
    app = Flask(__name__)
    CORS(app)
    init_db(app)

    # Ensure TTL index for temporary_disaster_analyses collection
    def setup_db_indexes():
        if 'temporary_disaster_analyses' not in mongo.db.list_collection_names():
            mongo.db.create_collection('temporary_disaster_analyses')
        mongo.db.temporary_disaster_analyses.create_index("generated_at", expireAfterSeconds=30)
    setup_db_indexes() # Call it directly

    # SMTP Configuration
    app.config['EMAIL_ADDRESS'] = os.getenv('EMAIL_ADDRESS')
    app.config['EMAIL_APP_PASSWORD'] = os.getenv('EMAIL_APP_PASSWORD')

    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(game_bp, url_prefix='/game')
    app.register_blueprint(stats_bp, url_prefix='/stats')
    app.register_blueprint(leaderboard_bp, url_prefix='/leaderboard')
    app.register_blueprint(emergency_bp, url_prefix='/emergency')
    app.register_blueprint(live_demos_bp, url_prefix='/admin')
    app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
