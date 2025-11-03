from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="student")
    resume_link = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Company(db.Model):
    __tablename__ = "companies"
    company_id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(120), unique=True, nullable=False)

    # One company has multiple jobs
    jobs = db.relationship("Job", back_populates="company", cascade="all, delete-orphan")


class JobSource(db.Model):
    __tablename__ = "job_sources"
    source_id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey("companies.company_id"), nullable=False)
    source_type = db.Column(db.String(50))
    source_url = db.Column(db.String(256))

    company = db.relationship("Company", backref="sources")


class Job(db.Model):
    __tablename__ = "jobs"
    job_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey("companies.company_id"), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey("job_sources.source_id"))
    location = db.Column(db.String(255))
    salary = db.Column(db.String(255))
    type = db.Column(db.String(50))  # Full-time, Part-time, Internship, etc.
    posted_date = db.Column(db.Date)
    deadline = db.Column(db.Date)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = db.relationship("Company", back_populates="jobs")
    source = db.relationship("JobSource")
