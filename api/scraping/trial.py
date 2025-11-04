from models import Company
companies = Company.query.all()
print(companies)
