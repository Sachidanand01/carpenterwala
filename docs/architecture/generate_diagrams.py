#!/usr/bin/env python3
"""
Carpenterwala — Visual Architecture & Journey Flow Diagram Generator
Powered by diagrams (https://github.com/mingrammer/diagrams)

Prerequisites:
  1. Install Graphviz on your system (e.g. `winget install graphviz` on Windows, or `brew install graphviz` on Mac)
  2. Install the diagrams python package:
     pip install diagrams

Usage:
  python generate_diagrams.py

Generated Output:
  1. system_architecture_overview.png
  2. journey_customer_booking.png
  3. journey_pro_onboarding_audit.png
  4. journey_pro_reviews.png
  5. journey_warranty_lifecycle.png
"""

import os
from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.client import User, Client, Users
from diagrams.onprem.compute import Server
from diagrams.programming.framework import React
from diagrams.onprem.database import PostgreSQL
from diagrams.saas.alerting import Opsgenie
from diagrams.generic.blank import Blank

def build_system_architecture():
    """Generates the overall system component architecture."""
    with Diagram("Carpenterwala — System Architecture Overview", 
                 filename="system_architecture_overview", 
                 show=False, 
                 direction="TB"):
        
        with Cluster("Client Layer"):
            customer = User("Homeowner / Customer")
            pro = User("Handyman / Professional")
            admin = User("Platform Administrator")

        with Cluster("Next.js 16 App Router (Vercel Edge / Node Runtime)"):
            with Cluster("Frontend UI Components"):
                landing = React("SEO Landing Pages (123+ SSG)")
                lead_modal = React("LeadCaptureModal / DirectCall")
                onboarding_ui = React("4-Step Pro Onboarding Wizard")
                booking_hub = React("Customer Bookings & Warranty Hub")
                admin_console = React("Admin Audit & Rejection Console")

            with Cluster("REST API Route Handlers (/api/*)"):
                customer_api = Server("Customer APIs\n/customer/otp, /leads, /warranties")
                pro_api = Server("Pro APIs\n/pro/otp, /profile, /verify-doc")
                admin_api = Server("Admin APIs\n/admin/login, /profiles, /verify")
                reviews_api = Server("Reviews & Geo APIs\n/reviews, /geo, /comments")

        with Cluster("Data & External Cloud Services"):
            with Cluster("Supabase PostgreSQL Database"):
                db_profiles = PostgreSQL("profiles\n(Docs, Verification, Bio)")
                db_leads = PostgreSQL("leads\n(Task, Routing Status)")
                db_customers = PostgreSQL("customers\n(Contacts, Addresses)")
                db_warranties = PostgreSQL("warranties\n(90-Day Coverage, Claims)")
                db_reviews = PostgreSQL("reviews\n(Ratings & Feedback)")

            resend = Blank("Resend Email Service\n(HTML Notifications)")
            storage = Blank("Browser Storage\n(localStorage / cookies)")

        # Client to UI Connections
        customer >> Edge(label="Book Service") >> lead_modal
        customer >> Edge(label="Track & Claim") >> booking_hub
        pro >> Edge(label="Register & Upload") >> onboarding_ui
        admin >> Edge(label="Audit Documents") >> admin_console

        # UI to API Connections
        lead_modal >> Edge(label="POST /leads") >> customer_api
        booking_hub >> Edge(label="GET/POST /warranties") >> customer_api
        onboarding_ui >> Edge(label="PUT /pro/profile") >> pro_api
        admin_console >> Edge(label="POST /admin/verify") >> admin_api

        # API to Database Connections
        customer_api >> Edge(label="Insert Lead") >> db_leads
        customer_api >> Edge(label="Auto Warranty") >> db_warranties
        customer_api >> Edge(label="Register") >> db_customers
        pro_api >> Edge(label="Update Docs") >> db_profiles
        admin_api >> Edge(label="Verify / Reject") >> db_profiles
        reviews_api >> Edge(label="Recalculate Rating") >> db_reviews

        # External Integrations
        customer_api >> Edge(label="Lead Alert") >> resend
        admin_api >> Edge(label="Rejection Notice") >> resend
        pro >> Edge(label="Session Token") >> storage


def build_customer_journey():
    """Generates the Customer Lead Booking & Warranty Journey."""
    with Diagram("Journey 1: Customer Lead Booking & 90-Day Warranty Flow", 
                 filename="journey_customer_booking", 
                 show=False, 
                 direction="LR"):
        
        customer = User("Homeowner")
        
        with Cluster("Step 1 & 2: Discovery & OTP"):
            ui_modal = React("LeadCaptureModal")
            otp_api = Server("POST /api/customer/otp\n(Send & Verify 6-digit OTP)")

        with Cluster("Step 3: Registration & Lead Routing"):
            lead_api = Server("POST /api/leads\n(Task, Location, Pro ID)")
            db_customers = PostgreSQL("customers table")
            db_leads = PostgreSQL("leads table\n(status: 'pending')")

        with Cluster("Step 4: Warranty & Notifications"):
            db_warranties = PostgreSQL("warranties table\n(valid_until: +90 days)")
            resend = Blank("Resend Email API")
            pro = User("Assigned Pro")

        customer >> Edge(label="1. Selects Service & Phone") >> ui_modal
        ui_modal >> Edge(label="2. Dispatches OTP") >> otp_api
        otp_api >> Edge(label="3. Verified") >> ui_modal
        ui_modal >> Edge(label="4. Submits Task") >> lead_api
        lead_api >> Edge(label="5. Save Customer") >> db_customers
        lead_api >> Edge(label="6. Create Lead") >> db_leads
        lead_api >> Edge(label="7. Auto-issue Warranty") >> db_warranties
        lead_api >> Edge(label="8. Send Alert") >> resend
        resend >> Edge(label="9. Booking Email") >> pro


def build_pro_onboarding_journey():
    """Generates the Service Professional Onboarding & Admin Audit Loop Journey."""
    with Diagram("Journey 2: Professional Onboarding & Admin Audit Loop", 
                 filename="journey_pro_onboarding_audit", 
                 show=False, 
                 direction="TB"):
        
        pro = User("Handyman / Pro")
        admin = User("Administrator")

        with Cluster("Pro 4-Step Onboarding Wizard (/pro/dashboard)"):
            step1 = React("Step 1: Contact, Trade, Address")
            step2 = React("Step 2: Aadhaar & PAN Scans")
            step3 = React("Step 3: Portrait, Voter ID, Police Cert")
            step4 = React("Step 4: Review & Final Submit")

        with Cluster("Backend Verification API"):
            doc_scanner = Server("POST /api/pro/verify-doc\n(Clarity & Dimensions Check)")
            profile_api = Server("PUT /api/pro/profile\n(Saves Onboarding Steps)")
            db_profiles = PostgreSQL("profiles table\n(onboarding_completed: true)")

        with Cluster("Admin Audit Console (/admin/dashboard)"):
            admin_ui = React("Document Audit Modal")
            admin_verify_api = Server("POST /api/admin/verify")
            resend = Blank("Resend Email Service")

        # Pro flow
        pro >> Edge(label="1. Fills Basic Details") >> step1
        step1 >> Edge(label="2. Next") >> step2
        step2 >> Edge(label="3. Document Scans") >> doc_scanner
        doc_scanner >> Edge(label="4. Validated") >> step3
        step3 >> Edge(label="5. Portrait & Police Cert") >> step4
        step4 >> Edge(label="6. Submit Application") >> profile_api
        profile_api >> Edge(label="7. Persist Pending Profile") >> db_profiles

        # Admin Flow
        admin >> Edge(label="8. Inspects Government IDs") >> admin_ui
        admin_ui >> Edge(label="9. Approve OR Reject") >> admin_verify_api
        
        # Decision branches
        admin_verify_api >> Edge(label="Approve: verified = true") >> db_profiles
        admin_verify_api >> Edge(label="Reject: reset step & reason") >> db_profiles
        admin_verify_api >> Edge(label="Dispatches Rejection Email") >> resend
        resend >> Edge(label="Action Required Notice") >> pro
        db_profiles >> Edge(label="Re-opens Wizard at Target Step") >> step2


def build_reviews_journey():
    """Generates the Review & Reputation Flow."""
    with Diagram("Journey 3: Customer Review & Rating Aggregation", 
                 filename="journey_pro_reviews", 
                 show=False, 
                 direction="LR"):
        
        customer = User("Verified Customer")
        
        with Cluster("Frontend"):
            review_ui = React("Reviews Form\n(/bookings, /[proSlug])")
            public_profile = React("Public Pro Profile\n(Star Rating, Badge)")

        with Cluster("API & Aggregation Engine"):
            reviews_api = Server("POST /api/reviews\n(Validate 1-5 Stars & Text)")
            recalculate = Server("Rating Engine\n(SUM / COUNT)")

        with Cluster("Database & SEO"):
            db_reviews = PostgreSQL("reviews table")
            db_profiles = PostgreSQL("profiles table\n(rating, reviews_count)")
            google_seo = Blank("Google Rich Snippets\n(Schema.org JSON-LD)")

        customer >> Edge(label="1. Submits 5-Star Rating") >> review_ui
        review_ui >> Edge(label="2. POST Payload") >> reviews_api
        reviews_api >> Edge(label="3. Insert Review") >> db_reviews
        reviews_api >> Edge(label="4. Aggregate Ratings") >> recalculate
        recalculate >> Edge(label="5. Update avg_rating") >> db_profiles
        db_profiles >> Edge(label="6. Live Profile Update") >> public_profile
        public_profile >> Edge(label="7. Structured Data") >> google_seo


def build_warranty_journey():
    """Generates the 90-Day Warranty Lifecycle Flow."""
    with Diagram("Journey 4: 90-Day Craftsmanship Warranty Lifecycle", 
                 filename="journey_warranty_lifecycle", 
                 show=False, 
                 direction="TB"):
        
        customer = User("Customer")
        pro = User("Original Pro")

        with Cluster("Phase 1: Automatic Issuance"):
            booking_complete = React("Booking Completed")
            db_warranties = PostgreSQL("warranties table\n(status: 'active', valid_until: +90d)")

        with Cluster("Phase 2: Customer Tracking & Claim"):
            hub = React("Customer Warranty Hub\n(/bookings?tab=warranties)")
            claim_api = Server("POST /api/customer/warranties\n(action: 'claim', description)")

        with Cluster("Phase 3: Defect Rectification"):
            resolution_dispatch = Server("Priority Dispatch Engine\n(status: 'claim_in_review')")
            db_update = PostgreSQL("warranties table\n(status: 'resolved')")

        booking_complete >> Edge(label="1. Lead Booked") >> db_warranties
        customer >> Edge(label="2. Views Active Coverage") >> hub
        hub >> Edge(label="3. Reads Coverage") >> db_warranties
        customer >> Edge(label="4. Files Defect Claim") >> claim_api
        claim_api >> Edge(label="5. Updates Claim Details") >> db_warranties
        claim_api >> Edge(label="6. Triggers Priority Service") >> resolution_dispatch
        resolution_dispatch >> Edge(label="7. Free Rectification Visit") >> pro
        pro >> Edge(label="8. Service Fixed") >> db_update


if __name__ == "__main__":
    print("Generating Carpenterwala Architecture Diagrams via mingrammer/diagrams...")
    try:
        build_system_architecture()
        print("✓ Generated: system_architecture_overview.png")
        build_customer_journey()
        print("✓ Generated: journey_customer_booking.png")
        build_pro_onboarding_journey()
        print("✓ Generated: journey_pro_onboarding_audit.png")
        build_reviews_journey()
        print("✓ Generated: journey_pro_reviews.png")
        build_warranty_journey()
        print("✓ Generated: journey_warranty_lifecycle.png")
        print("\nAll 5 diagrams successfully generated!")
    except Exception as e:
        print(f"\nNote: To render PNG files, please ensure 'graphviz' and 'diagrams' are installed.")
        print(f"Details: {e}")
