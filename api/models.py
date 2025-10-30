from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# ====================================================
# USERS
# ====================================================
class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(50), default="user")  # e.g. "user" or "admin"
    resume_link = db.Column(db.String(255), nullable=True)

    # Relationship to admin (optional)
    admin = db.relationship('Admin', backref='user', uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username} ({self.email})>"


# ====================================================
# ADMINS
# ====================================================
class Admin(db.Model):
    __tablename__ = 'admin'

    admin_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), unique=True, nullable=False)

    def __repr__(self):
        return f"<Admin user_id={self.user_id}>"


# ====================================================
# COMPANY
# ====================================================
class Company(db.Model):
    __tablename__ = 'company'

    company_id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(150), nullable=False)
    website = db.Column(db.String(255), nullable=True)
    location = db.Column(db.String(150), nullable=True)
    industry = db.Column(db.String(100), nullable=True)
    source_type = db.Column(db.String(50), nullable=True)  # internal or external source

    # Relationships
    job_sources = db.relationship('JobSource', backref='company', lazy=True)
    jobs = db.relationship('Job', backref='company', lazy=True)

    def __repr__(self):
        return f"<Company {self.company_name}>"


# ====================================================
# JOB SOURCE
# ====================================================
class JobSource(db.Model):
    __tablename__ = 'job_source'

    source_id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.company_id'), nullable=False)
    source_type = db.Column(db.String(50), nullable=False)
    source_url = db.Column(db.String(255), nullable=False)
    api_key = db.Column(db.String(255), nullable=True)
    last_fetched = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    jobs = db.relationship('Job', backref='source', lazy=True)

    def __repr__(self):
        return f"<JobSource {self.source_type} ({self.source_url})>"


# ====================================================
# JOBS
# ====================================================
class Job(db.Model):
    __tablename__ = 'jobs'

    job_id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company.company_id'), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey('job_source.source_id'), nullable=True)
    
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    salary = db.Column(db.String(50), nullable=True)
    location = db.Column(db.String(150), nullable=True)
    type = db.Column(db.String(50), nullable=True)  # e.g. Full-time, Part-time
    posted_date = db.Column(db.DateTime, default=datetime.utcnow)
    deadline = db.Column(db.DateTime, nullable=True)
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f"<Job {self.title} @ {self.company_id}>"
