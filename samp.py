import requests
from bs4 import BeautifulSoup

def scrape_internshala():
    url = "https://internshala.com/internships/"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36'
    }

    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print(f"Failed to fetch page, status code: {resp.status_code}")
        return []

    soup = BeautifulSoup(resp.text, 'html.parser')

    # Each job card container
    job_cards = soup.select('div.internship_meta')

    jobs = []

    for card in job_cards:
        # Title
        title_tag = card.find('a', class_='view_detail_button')
        title = title_tag.get_text(strip=True) if title_tag else "N/A"

        # Company
        company_tag = card.find_previous_sibling('a', class_='link_display_like_text')
        company = company_tag.get_text(strip=True) if company_tag else "N/A"

        # Location
        location_tag = card.find('a', class_='location_link')
        location = location_tag.get_text(strip=True) if location_tag else "N/A"

        # Stipend
        stipend_tag = card.find('span', class_='stipend')
        stipend = stipend_tag.get_text(strip=True) if stipend_tag else "N/A"

        # Duration
        duration_tag = card.find('span', class_='duration')
        duration = duration_tag.get_text(strip=True) if duration_tag else "N/A"

        # Start Date
        start_date_tag = card.find('span', class_='start_immediately_text')
        start_date = start_date_tag.get_text(strip=True) if start_date_tag else "N/A"

        jobs.append({
            "title": title,
            "company": company,
            "location": location,
            "stipend": stipend,
            "duration": duration,
            "start_date": start_date,
        })

    print(f"Found {len(jobs)} jobs on Internshala")

    # Print first 5 jobs as sample
    for job in jobs[:5]:
        print(job)

    return jobs

# Example usage
if __name__ == "__main__":
    scrape_internshala()
