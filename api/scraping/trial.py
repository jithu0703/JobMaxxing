import requests
from bs4 import BeautifulSoup


def scrape_internshala(keyword="python", max_pages=1):
    """Scrape Internshala internships using updated 2025 HTML structure."""
    base_url = "https://internshala.com/internships"
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
            print(f"❌ Failed to fetch page {page}")
            continue

        soup = BeautifulSoup(resp.text, "html.parser")
        cards = soup.find_all("div", class_="individual_internship")

        for card in cards:
            # extract from data-href (full job link)
            data_href = card.get("data-href", "")
            link = f"https://internshala.com{data_href}" if data_href else "N/A"

            # job title
            title_tag = card.find("a", class_="job-title-href")
            title = title_tag.text.strip() if title_tag else "N/A"

            # company
            company_tag = card.find("p", class_="company-name")
            company = company_tag.text.strip() if company_tag else "N/A"

            # location
            location_tag = card.find("div", class_="row-1-item locations")
            location = location_tag.get_text(strip=True).split("(")[0] if location_tag else "N/A"

            # stipend
            stipend_tag = card.find("span", class_="stipend")
            stipend = stipend_tag.text.strip() if stipend_tag else "N/A"

            # duration
            duration_tag = card.find("div", class_="row-1-item")
            duration = duration_tag.text.strip() if duration_tag else "N/A"

            all_jobs.append({
                "Title": title,
                "Company": company,
                "Location": location,
                "Stipend": stipend,
                "Link": link
            })

    return all_jobs


if __name__ == "__main__":
    keyword = input("Enter internship keyword (e.g. python, data science): ").strip() or "python"
    jobs = scrape_internshala(keyword, max_pages=1)

    if not jobs:
        print("⚠️ No results found.")
    else:
        for i, job in enumerate(jobs, 1):
            print(f"\n{i}. {job['Title']} - {job['Company']}")
            print(f"   📍 {job['Location']}")
            print(f"   💰 {job['Stipend']}")
            print(f"   🔗 {job['Link']}")
