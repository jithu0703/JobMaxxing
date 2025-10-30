from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User
from dotenv import load_dotenv
from routes.jobs import jobs_bp
from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.scrape import scrape_bp
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# --- Database Config ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# --- Initialize extensions ---
db.init_app(app)
migrate = Migrate(app, db)

# --- Register Blueprints ---
app.register_blueprint(jobs_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(scrape_bp)

# --- Entry point ---
if __name__ == "__main__":
    app.run(debug=True)
