from models import db, Company, Job, JobSource
import requests
from bs4 import BeautifulSoup


def scrape_internshala(keyword="internships", max_pages=1):
    base_url = f"https://internshala.com/{keyword}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    all_jobs = []

    for page in range(1, max_pages + 1):
        url = f"{base_url}/page-{page}/"
        params = {"q": keyword}
        resp = requests.get(url, headers=headers, params=params)
        if resp.status_code != 200:
            continue
        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.find_all("div", class_="individual_internship")

        for card in cards:
            data_href = card.get("data-href", "")
            link = f"https://internshala.com{data_href}" if data_href else None
            title_tag = card.find("a", class_="job-title-href")
            title = title_tag.text.strip() if title_tag else None
            company_tag = card.find("p", class_="company-name")
            company_name = company_tag.text.strip() if company_tag else None
            location_tag = card.find("div", class_="row-1-item locations")
            location = location_tag.get_text(strip=True).split("(")[0] if location_tag else None
            stipend_tag = card.find("span", class_="stipend")
            stipend = stipend_tag.text.strip() if stipend_tag else None
            duration_tag = card.find("div", class_="row-1-item")
            duration = duration_tag.text.strip() if duration_tag else None

            if not title or not company_name:
                # Skip incomplete entries
                continue

            # Handle Company
            company = Company.query.filter_by(company_name=company_name).first()
            if not company:
                company = Company(company_name=company_name)
                db.session.add(company)
                db.session.flush()  # Ensures company_id is generated

            # Handle JobSource (unique per company and source url for Internshala)
            job_source = JobSource.query.filter_by(
                company_id=company.company_id,
                source_type="internshala",
                source_url=url
            ).first()

            if not job_source:
                job_source = JobSource(
                    company_id=company.company_id,
                    source_type="internshala",
                    source_url=url
                )
                db.session.add(job_source)
                db.session.flush()  # Ensures source_id is generated

            # Handle Job (unique by title, company, and link)
            job = Job.query.filter_by(
                title=title,
                company_id=company.company_id
            ).first()

            if job:
                # Update job details if exists
                job.location = location
                job.salary = stipend
                job.description = duration
                job.source_id = job_source.source_id
                job.is_active = True
            else:
                job = Job(
                    title=title,
                    company_id=company.company_id,
                    source_id=job_source.source_id,
                    location=location,
                    salary=stipend,
                    description=duration,
                    apply_url=link,
                    is_active=True
                )
                db.session.add(job)

            all_jobs.append({
                "Title": title,
                "Company": company_name,
                "Location": location,
                "Stipend": stipend,
                "Duration": duration,
                "Link": link
            })

    db.session.commit()

    return {"scraped_count": len(all_jobs), "jobs": all_jobs}


# Example CLI usage
if __name__ == "__main__":
    from flask import Flask
    app = Flask(__name__)
    with app.app_context():
        jobs = scrape_internshala("python", 1)
        print(f"Scraped {jobs['scraped_count']} jobs.")
