from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def scrape_internshala():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("https://internshala.com/internships", timeout=60000, wait_until="domcontentloaded")
        page.wait_for_timeout(5000)  # wait for JS to render

        html = page.content()
        browser.close()

    soup = BeautifulSoup(html, "html.parser")
    internships = soup.find_all("div", class_="individual_internship")
    results = []

    for card in internships:
            title = card.find("a", class_="job-title-href")
            company = card.find("p", class_="company-name")
            location = card.find("div", class_="locations")
            stipend = card.find("span", class_="stipend")
            duration_divs = card.find_all("div", class_="row-1-item")
            
            description_div = card.find("div", class_="about_job")
            skills_divs = card.find_all("div", class_="job_skill")
            posted_div = card.find("div", class_="status-success")
            ppo_div = card.find("div", class_="ppo_status")

            results.append({
                "title": title.text.strip() if title else None,
                "company": company.text.strip() if company else None,
                "location": location.text.strip() if location else None,
                "stipend": stipend.text.strip() if stipend else None,
                "duration": duration_divs[-1].span.text.strip() if duration_divs else None,
                "description": description_div.text.strip() if description_div else None,
                "skills": [s.text.strip() for s in skills_divs],
                "posted": posted_div.text.strip() if posted_div else None,
                "ppo": ppo_div.text.strip() if ppo_div else None
            })

    return results

#print(scrape_internshala())