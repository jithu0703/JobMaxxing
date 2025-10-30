import requests
from bs4 import BeautifulSoup
import csv
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

BASE_URL = "https://internshala.com"

# More realistic browser headers
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Cache-Control': 'max-age=0',
}

def create_session():
    """Create a session with retry logic"""
    session = requests.Session()
    
    # Retry strategy
    retry = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    return session

def scrape_internshala(pages=3):
    all_jobs = []
    session = create_session()
    
    for page in range(1, pages + 1):
        url = f"{BASE_URL}/internships/software-development-internship/page-{page}/"
        print(f"Scraping page {page}...")
        
        try:
            # Add timeout and verify SSL
            response = session.get(url, headers=HEADERS, timeout=15, verify=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            cards = soup.find_all('div', class_='individual_internship')
            print(f"Found {len(cards)} job cards on page {page}")
            
            for card in cards:
                try:
                    job = {}
                    
                    # Company
                    company = card.find('h4', class_='company_name')
                    job['company'] = company.text.strip() if company else 'N/A'
                    
                    # Title
                    title = card.find('h3')
                    job['title'] = title.text.strip() if title else 'N/A'
                    
                    # Location
                    location = card.find('a', id=lambda x: x and 'location' in x)
                    job['location'] = location.text.strip() if location else 'N/A'
                    
                    # Stipend
                    stipend = card.find('span', class_='stipend')
                    job['stipend'] = stipend.text.strip() if stipend else 'N/A'
                    
                    # URL
                    link = card.find('a', class_='view_detail_button')
                    if link and link.get('href'):
                        job['url'] = BASE_URL + link['href']
                    else:
                        job['url'] = 'N/A'
                    
                    all_jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing card: {e}")
                    continue
            
            print(f"✓ Scraped {len(all_jobs)} jobs so far\n")
            
            # Important: Wait longer between pages
            if page < pages:
                wait_time = 5
                print(f"Waiting {wait_time} seconds before next page...")
                time.sleep(wait_time)
        
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection error on page {page}: {e}")
            print("Website may be blocking requests. Try:")
            print("1. Using a VPN")
            print("2. Running from a different network")
            print("3. Increasing delays between requests")
            break
        
        except requests.exceptions.Timeout:
            print(f"❌ Timeout on page {page}")
            continue
        
        except requests.exceptions.HTTPError as e:
            print(f"❌ HTTP error on page {page}: {e}")
            if e.response.status_code == 403:
                print("Access forbidden - website is blocking automated access")
            break
        
        except Exception as e:
            print(f"❌ Unexpected error on page {page}: {e}")
            continue
    
    return all_jobs

def save_to_csv(jobs, filename='jobs.csv'):
    """Save jobs to CSV"""
    if not jobs:
        print("No jobs to save!")
        return
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['company', 'title', 'location', 'stipend', 'url']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(jobs)
    
    print(f"\n✓ Saved {len(jobs)} jobs to {filename}")

def print_jobs(jobs):
    """Print jobs to console"""
    if not jobs:
        print("No jobs found!")
        return
    
    print("\n" + "="*80)
    print(f"FOUND {len(jobs)} SOFTWARE DEVELOPMENT JOBS")
    print("="*80)
    
    for i, job in enumerate(jobs, 1):
        print(f"\n{i}. {job['title']}")
        print(f"   Company: {job['company']}")
        print(f"   Location: {job['location']}")
        print(f"   Stipend: {job['stipend']}")
        print(f"   URL: {job['url']}")

# Run it
if __name__ == "__main__":
    print("Starting Internshala scraper...\n")
    
    jobs = scrape_internshala(pages=2)  # Start with 2 pages
    
    if jobs:
        print_jobs(jobs)
        save_to_csv(jobs)
    else:
        print("\n❌ No jobs were scraped. Website may be blocking access.")
        print("\nAlternative solutions:")
        print("1. Use Selenium (more browser-like)")
        print("2. Use a proxy service")
        print("3. Check if Internshala has an official API")
