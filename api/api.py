from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User
from dotenv import load_dotenv
from routes.jobs import jobs_bp
from routes.auth import auth_bp
from routes.dashboard import dashboard_bp
from routes.scrape import scrape_bp
from routes.companies import company_bp
from flask_jwt_extended import JWTManager

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
jwt = JWTManager(app)


# --- Database Config ---
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+mysqlconnector://velai_user:abhi@localhost/vv_db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"
app.config["JWT_SECRET_KEY"] = "jithendra/abhishek"

# --- Initialize extensions ---
db.init_app(app)
migrate = Migrate(app, db)

# --- Register Blueprints ---
app.register_blueprint(jobs_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(dashboard_bp)
app.register_blueprint(scrape_bp)
app.register_blueprint(company_bp)

# --- Entry point ---
if __name__ == "__main__":
    app.run(debug=True)
