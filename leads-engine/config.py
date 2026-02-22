"""Vantix Leads Engine — Configuration"""
import os

# Apollo.io
APOLLO_API_KEY = os.getenv("APOLLO_API_KEY", "TU4WRlbPfswcfLDWqC-i_w")
APOLLO_BASE_URL = "https://api.apollo.io/api/v1"

# Resend (Email)
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "re_TJNHAFRB_A66nrWk5st1W4RAFyn2z4eQs")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Aidan from Vantix <hello@usevantix.com>")
EMAIL_FROM_FALLBACK = "onboarding@resend.dev"

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://obprrtqyzpaudfeyftyd.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ")

# ICP (Ideal Customer Profile)
TARGET_EMPLOYEE_RANGE = ["5,100"]
TARGET_INDUSTRIES = [
    "restaurants", "retail", "real estate", "medical", "dental",
    "law firms", "fitness", "e-commerce", "agencies", "construction",
    "auto dealers"
]
TARGET_TITLES = [
    "Owner", "CEO", "Founder", "President",
    "Director of Operations", "General Manager"
]
TARGET_LOCATIONS = ["United States"]

# Lead sourcing
LEADS_PER_RUN = 50

# Email sequence
MAX_EMAILS_PER_DAY = 30
DELAY_BETWEEN_EMAILS_SEC = 60
EMAIL_SEQUENCE_DAYS = {1: 0, 2: 3, 3: 7}  # email_number: days_after_first

# Scoring
SCORE_NO_WEBSITE = -3
SCORE_EMPLOYEE_SWEET_SPOT = 2  # 5-50 employees
SCORE_TITLE_OWNER_CEO = 2
SCORE_TITLE_DIRECTOR = 1
SCORE_EMAIL_VERIFIED = 1
SCORE_INDUSTRY_FIT = 1
SCORE_BASE = 5  # Starting score

# Cal.com booking link
BOOKING_URL = "https://cal.com/vantix/ai-consultation"

# Logging
LOG_FILE = "leads-engine.log"
