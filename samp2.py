from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()
driver.get("https://internshala.com/internships/software-development-internship/")
time.sleep(5)

# Get first card and print all its text
card = driver.find_element(By.CLASS_NAME, "individual_internship")
print("=== FULL CARD TEXT ===")
print(card.text)
print("\n=== CARD HTML ===")
print(card.get_attribute('innerHTML'))

driver.quit()
