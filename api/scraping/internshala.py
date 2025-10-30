import requests
from bs4 import BeautifulSoup
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from models import db, Job, Company, JobSource

BASE_URL = "https://internshala.com/internships/software-development-internship"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
}

def scrape_jobs(page=1):
    url = f"{BASE_URL}/page-{page}"
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, "html.parser")
    
    job_cards = soup.find_all("div", class_="individual_internship")
    
    jobs_list = []
    
    for job in job_cards:
        title_tag = job.find("a", class_="profile")
        company_tag = job.find("a", class_="company_name")
        location_tag = job.find("a", class_="location_link")
        stipend_tag = job.find("span", class_="stipend")
        link_tag = job.find("a", class_="profile")
        
        title = title_tag.text.strip() if title_tag else "N/A"
        company_name = company_tag.text.strip() if company_tag else "N/A"
        location = location_tag.text.strip() if location_tag else "N/A"
        salary = stipend_tag.text.strip() if stipend_tag else None
        job_url = "https://internshala.com" + link_tag['href'] if link_tag else None

        jobs_list.append({
            "title": title,
            "company_name": company_name,
            "location": location,
            "salary": salary,
            "job_url": job_url
        })
    
    return jobs_list

def insert_jobs(jobs_list):
    for j in jobs_list:
        # check company
        company = Company.query.filter_by(company_name=j["company_name"]).first()
        if not company:
            company = Company(company_name=j["company_name"])
            db.session.add(company)
            db.session.commit()
        
        # optional: create JobSource for Internshala
        source = JobSource.query.filter_by(source_url=j["job_url"]).first()
        if not source:
            source = JobSource(
                company_id=company.company_id,
                source_type="Internshala",
                source_url=j["job_url"]
            )
            db.session.add(source)
            db.session.commit()
        
        # check if job exists
        existing_job = Job.query.filter_by(title=j["title"], company_id=company.company_id).first()
        if not existing_job:
            job = Job(
                title=j["title"],
                company_id=company.company_id,
                source_id=source.source_id,
                location=j["location"],
                salary=j["salary"],
                posted_date=datetime.utcnow(),
                is_active=True
            )
            db.session.add(job)
    
    db.session.commit()

def scrape_internshala():
    for page in range(1, 5):  # scrape first 4 pages
        jobs = scrape_jobs(page)
        insert_jobs(jobs)
        print(f"Page {page} done, {len(jobs)} jobs added")