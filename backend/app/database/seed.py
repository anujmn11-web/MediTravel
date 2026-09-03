import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlalchemy.orm import Session
from app.database.session import SessionLocal
from app.models.location import Location
from app.models.hospital import Hospital
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.medical_record import MedicalRecord
from app.models.appointment import Appointment

# 1. Location Seeds (INDIA_LOCATIONS)
INDIA_LOCATIONS = [
    # Tier-1 metros / tier-2 / tier-3
    {"state": "Delhi",               "city": "New Delhi",       "pincode": "110001", "tier": 1, "lat": 28.6139, "lng": 77.2090},
    {"state": "Maharashtra",         "city": "Mumbai",          "pincode": "400001", "tier": 1, "lat": 19.0760, "lng": 72.8777},
    {"state": "Maharashtra",         "city": "Pune",            "pincode": "411001", "tier": 2, "lat": 18.5204, "lng": 73.8567},
    {"state": "Maharashtra",         "city": "Nagpur",          "pincode": "440001", "tier": 2, "lat": 21.1458, "lng": 79.0882},
    {"state": "Maharashtra",         "city": "Nashik",          "pincode": "422001", "tier": 2, "lat": 19.9975, "lng": 73.7898},
    {"state": "Karnataka",           "city": "Bengaluru",       "pincode": "560001", "tier": 1, "lat": 12.9716, "lng": 77.5946},
    {"state": "Karnataka",           "city": "Mysuru",          "pincode": "570001", "tier": 2, "lat": 12.2958, "lng": 76.6394},
    {"state": "Karnataka",           "city": "Mangaluru",       "pincode": "575001", "tier": 2, "lat": 12.9141, "lng": 74.8560},
    {"state": "Tamil Nadu",          "city": "Chennai",         "pincode": "600001", "tier": 1, "lat": 13.0827, "lng": 80.2707},
    {"state": "Tamil Nadu",          "city": "Coimbatore",      "pincode": "641001", "tier": 2, "lat": 11.0168, "lng": 76.9558},
    {"state": "Tamil Nadu",          "city": "Madurai",         "pincode": "625001", "tier": 2, "lat": 9.9252, "lng": 78.1198},
    {"state": "Telangana",           "city": "Hyderabad",       "pincode": "500001", "tier": 1, "lat": 17.3850, "lng": 78.4867},
    {"state": "Telangana",           "city": "Warangal",        "pincode": "506001", "tier": 2, "lat": 17.9689, "lng": 79.5941},
    {"state": "West Bengal",         "city": "Kolkata",         "pincode": "700001", "tier": 1, "lat": 22.5726, "lng": 88.3639},
    {"state": "West Bengal",         "city": "Siliguri",        "pincode": "734001", "tier": 2, "lat": 26.7271, "lng": 88.3953},
    {"state": "Gujarat",             "city": "Ahmedabad",       "pincode": "380001", "tier": 1, "lat": 23.0225, "lng": 72.5714},
    {"state": "Gujarat",             "city": "Surat",           "pincode": "395001", "tier": 2, "lat": 21.1702, "lng": 72.8311},
    {"state": "Gujarat",             "city": "Vadodara",        "pincode": "390001", "tier": 2, "lat": 22.3072, "lng": 73.1812},
    {"state": "Rajasthan",           "city": "Jaipur",          "pincode": "302001", "tier": 1, "lat": 26.9124, "lng": 75.7873},
    {"state": "Rajasthan",           "city": "Jodhpur",         "pincode": "342001", "tier": 2, "lat": 26.2389, "lng": 73.0243},
    {"state": "Rajasthan",           "city": "Udaipur",         "pincode": "313001", "tier": 2, "lat": 24.5854, "lng": 73.7125},
    {"state": "Uttar Pradesh",       "city": "Lucknow",         "pincode": "226001", "tier": 1, "lat": 26.8467, "lng": 80.9462},
    {"state": "Uttar Pradesh",       "city": "Kanpur",          "pincode": "208001", "tier": 2, "lat": 26.4499, "lng": 80.3319},
    {"state": "Uttar Pradesh",       "city": "Agra",            "pincode": "282001", "tier": 2, "lat": 27.1767, "lng": 78.0081},
    {"state": "Uttar Pradesh",       "city": "Varanasi",        "pincode": "221001", "tier": 2, "lat": 25.3176, "lng": 82.9739},
    {"state": "Madhya Pradesh",      "city": "Bhopal",          "pincode": "462001", "tier": 1, "lat": 23.2599, "lng": 77.4126},
    {"state": "Madhya Pradesh",      "city": "Indore",          "pincode": "452001", "tier": 2, "lat": 22.7196, "lng": 75.8577},
    {"state": "Madhya Pradesh",      "city": "Jabalpur",        "pincode": "482001", "tier": 2, "lat": 23.1815, "lng": 79.9864},
    {"state": "Punjab",              "city": "Chandigarh",      "pincode": "160001", "tier": 1, "lat": 30.7333, "lng": 76.7794},
    {"state": "Punjab",              "city": "Ludhiana",        "pincode": "141001", "tier": 2, "lat": 30.9010, "lng": 75.8573},
    {"state": "Punjab",              "city": "Amritsar",        "pincode": "143001", "tier": 2, "lat": 31.6340, "lng": 74.8723},
    {"state": "Haryana",             "city": "Gurugram",        "pincode": "122001", "tier": 1, "lat": 28.4595, "lng": 77.0266},
    {"state": "Haryana",             "city": "Faridabad",       "pincode": "121001", "tier": 2, "lat": 28.4089, "lng": 77.3178},
    {"state": "Bihar",               "city": "Patna",           "pincode": "800001", "tier": 1, "lat": 25.5941, "lng": 85.1376},
    {"state": "Bihar",               "city": "Gaya",            "pincode": "823001", "tier": 2, "lat": 24.7914, "lng": 84.9994},
    {"state": "Odisha",              "city": "Bhubaneswar",     "pincode": "751001", "tier": 1, "lat": 20.2961, "lng": 85.8245},
    {"state": "Odisha",              "city": "Cuttack",         "pincode": "753001", "tier": 2, "lat": 20.4625, "lng": 85.8830},
    {"state": "Kerala",              "city": "Thiruvananthapuram", "pincode": "695001", "tier": 1, "lat": 8.5241, "lng": 76.9366},
    {"state": "Kerala",              "city": "Kochi",           "pincode": "682001", "tier": 1, "lat": 9.9312, "lng": 76.2673},
    {"state": "Kerala",              "city": "Kozhikode",       "pincode": "673001", "tier": 2, "lat": 11.2588, "lng": 75.7804},
    {"state": "Andhra Pradesh",      "city": "Visakhapatnam",   "pincode": "530001", "tier": 1, "lat": 17.6868, "lng": 83.2185},
    {"state": "Andhra Pradesh",      "city": "Vijayawada",      "pincode": "520001", "tier": 2, "lat": 16.5062, "lng": 80.6480},
    {"state": "Andhra Pradesh",      "city": "Tirupati",        "pincode": "517501", "tier": 2, "lat": 13.6288, "lng": 79.4192},
    {"state": "Assam",               "city": "Guwahati",        "pincode": "781001", "tier": 1, "lat": 26.1445, "lng": 91.7362},
    {"state": "Assam",               "city": "Dibrugarh",       "pincode": "786001", "tier": 2, "lat": 27.4728, "lng": 94.9120},
    {"state": "Jharkhand",           "city": "Ranchi",          "pincode": "834001", "tier": 1, "lat": 23.3441, "lng": 85.3096},
    {"state": "Jharkhand",           "city": "Jamshedpur",      "pincode": "831001", "tier": 2, "lat": 22.8046, "lng": 86.2029},
    {"state": "Chhattisgarh",        "city": "Raipur",          "pincode": "492001", "tier": 1, "lat": 21.2514, "lng": 81.6296},
    {"state": "Chhattisgarh",        "city": "Bilaspur",        "pincode": "495001", "tier": 2, "lat": 22.0790, "lng": 82.1391},
    {"state": "Himachal Pradesh",    "city": "Shimla",          "pincode": "171001", "tier": 2, "lat": 31.1048, "lng": 77.1734},
    {"state": "Himachal Pradesh",    "city": "Dharamsala",      "pincode": "176215", "tier": 3, "lat": 32.2190, "lng": 76.3234},
    {"state": "Uttarakhand",         "city": "Dehradun",        "pincode": "248001", "tier": 2, "lat": 30.3165, "lng": 78.0322},
    {"state": "Uttarakhand",         "city": "Haridwar",        "pincode": "249401", "tier": 2, "lat": 29.9457, "lng": 78.1642},
    {"state": "Goa",                 "city": "Panaji",          "pincode": "403001", "tier": 2, "lat": 15.4909, "lng": 73.8278},
    {"state": "Goa",                 "city": "Margao",          "pincode": "403601", "tier": 2, "lat": 15.2736, "lng": 73.9582},
    {"state": "Tripura",             "city": "Agartala",        "pincode": "799001", "tier": 2, "lat": 23.8315, "lng": 91.2868},
    {"state": "Meghalaya",           "city": "Shillong",        "pincode": "793001", "tier": 2, "lat": 25.5788, "lng": 91.8933},
    {"state": "Manipur",             "city": "Imphal",          "pincode": "795001", "tier": 2, "lat": 24.8170, "lng": 93.9368},
    {"state": "Nagaland",            "city": "Kohima",          "pincode": "797001", "tier": 2, "lat": 25.6751, "lng": 94.1086},
    {"state": "Mizoram",             "city": "Aizawl",          "pincode": "796001", "tier": 2, "lat": 23.7307, "lng": 92.7173},
    {"state": "Arunachal Pradesh",   "city": "Itanagar",        "pincode": "791111", "tier": 2, "lat": 27.0844, "lng": 93.6053},
    {"state": "Sikkim",              "city": "Gangtok",         "pincode": "737101", "tier": 2, "lat": 27.3389, "lng": 88.6065},
    {"state": "Jammu & Kashmir",     "city": "Srinagar",        "pincode": "190001", "tier": 2, "lat": 34.0837, "lng": 74.7973},
    {"state": "Jammu & Kashmir",     "city": "Jammu",           "pincode": "180001", "tier": 2, "lat": 32.7266, "lng": 74.8570},
    {"state": "Ladakh",              "city": "Leh",             "pincode": "194101", "tier": 3, "lat": 34.1526, "lng": 77.5771},
    {"state": "Puducherry",          "city": "Puducherry",      "pincode": "605001", "tier": 2, "lat": 11.9416, "lng": 79.8083},
    {"state": "Chandigarh (UT)",     "city": "Chandigarh",      "pincode": "160017", "tier": 2, "lat": 30.7333, "lng": 76.7794},
    {"state": "Andaman & Nicobar",   "city": "Port Blair",      "pincode": "744101", "tier": 3, "lat": 11.6234, "lng": 92.7265},
    {"state": "Dadra & Nagar Haveli", "city": "Silvassa",       "pincode": "396230", "tier": 3, "lat": 20.2766, "lng": 73.0022},
    {"state": "Lakshadweep",         "city": "Kavaratti",       "pincode": "682555", "tier": 3, "lat": 10.5667, "lng": 72.6417},
]

# 2. Hospital Seeds (hospitals list from content.js)
HOSPITALS = [
    {
        "id": 1,
        "name": "All India Institute of Medical Sciences",
        "state": "Delhi",
        "city": "New Delhi",
        "pincode": "110029",
        "type": "Government Institute",
        "address": "Ansari Nagar East, New Delhi, Delhi – 110029",
        "phone": "+91 11 2658 8500",
        "description": "India's premier government medical institution offering world-class care across all specialties.",
        "services": ["Cardiology", "Neurology", "Oncology", "Trauma", "ICU"],
        "accreditation": "NABH",
        "lat": 28.5672,
        "lng": 77.21,
    },
    {
        "id": 2,
        "name": "Kokilaben Dhirubhai Ambani Hospital",
        "state": "Maharashtra",
        "city": "Mumbai",
        "pincode": "400053",
        "type": "Multi-specialty",
        "address": "Four Bungalows, Andheri West, Mumbai, Maharashtra – 400053",
        "phone": "+91 22 3099 9999",
        "description": "State-of-the-art tertiary care hospital with robotic surgery and advanced diagnostics.",
        "services": ["Robotic Surgery", "Cardiology", "Oncology", "Neurology"],
        "accreditation": "JCI, NABH",
        "lat": 19.1186,
        "lng": 72.8366,
    },
    {
        "id": 3,
        "name": "Narayana Health City",
        "state": "Karnataka",
        "city": "Bengaluru",
        "pincode": "560099",
        "type": "Multi-specialty",
        "address": "Bommasandra Health Campus, Anekal Taluk, Bengaluru – 560099",
        "phone": "+91 80 7122 2200",
        "description": "High-capacity hospital network with critical care, cardiac and surgical excellence.",
        "services": ["Cardiac Surgery", "Oncology", "Intensive Care", "Pediatrics"],
        "accreditation": "JCI, NABH",
        "lat": 12.8399,
        "lng": 77.6765,
    },
    {
        "id": 4,
        "name": "Apollo Hospitals",
        "state": "Tamil Nadu",
        "city": "Chennai",
        "pincode": "600006",
        "type": "Multi-specialty",
        "address": "Greams Road, Chennai, Tamil Nadu – 600006",
        "phone": "+91 44 2829 0200",
        "description": "Asia's largest integrated healthcare group with end-to-end medical services.",
        "services": ["Liver Transplant", "Cardiology", "Orthopedics", "Neurology"],
        "accreditation": "JCI, NABH",
        "lat": 13.0627,
        "lng": 80.2454,
    },
    {
        "id": 5,
        "name": "Continental Hospital",
        "state": "Telangana",
        "city": "Hyderabad",
        "pincode": "500032",
        "type": "Multi-specialty",
        "address": "Financial District, Nanakramguda, Hyderabad – 500032",
        "phone": "+91 40 6700 0000",
        "description": "International-standard care with integrated emergency and advanced diagnostic services.",
        "services": ["Pulmonology", "General Medicine", "Trauma", "Oncology"],
        "accreditation": "JCI, NABH",
        "lat": 17.4126,
        "lng": 78.3563,
    },
    {
        "id": 6,
        "name": "Medica Superspecialty Hospital",
        "state": "West Bengal",
        "city": "Kolkata",
        "pincode": "700099",
        "type": "Super-specialty",
        "address": "127 Eastern Metropolitan Bypass, Kolkata – 700099",
        "phone": "+91 33 6652 0000",
        "description": "Eastern India's leading multi-organ transplant and critical care hospital.",
        "services": ["Kidney Transplant", "Cardiac Surgery", "Neurology", "ICU"],
        "accreditation": "NABH",
        "lat": 22.5161,
        "lng": 88.3939,
    },
    {
        "id": 7,
        "name": "Sterling Hospital",
        "state": "Gujarat",
        "city": "Ahmedabad",
        "pincode": "380052",
        "type": "Multi-specialty",
        "address": "Gurukul Road, Memnagar, Ahmedabad – 380052",
        "phone": "+91 79 4001 5000",
        "description": "Leading tertiary care hospital known for cardiac, neuro and oncology programs.",
        "services": ["Cardiology", "Neurology", "Oncology", "Orthopedics"],
        "accreditation": "NABH",
        "lat": 23.0541,
        "lng": 72.5299,
    },
    {
        "id": 8,
        "name": "Fortis Escorts Hospital",
        "state": "Rajasthan",
        "city": "Jaipur",
        "pincode": "302017",
        "type": "Cardiac Care",
        "address": "Jawahar Lal Nehru Marg, Malviya Nagar, Jaipur – 302017",
        "phone": "+91 141 254 7000",
        "description": "Renowned cardiac care centre serving patients from across Rajasthan and neighboring states.",
        "services": ["Cardiology", "Cardiac Surgery", "ICU", "Emergency"],
        "accreditation": "NABH",
        "lat": 26.8554,
        "lng": 75.8022,
    },
    {
        "id": 9,
        "name": "Medanta — The Medicity",
        "state": "Haryana",
        "city": "Gurugram",
        "pincode": "122001",
        "type": "Multi-specialty",
        "address": "CH Baktawar Singh Road, Sector 38, Gurugram – 122001",
        "phone": "+91 124 414 1414",
        "description": "One of India's largest private hospitals with 1600 beds and 45 specialties.",
        "services": ["Heart Institute", "Kidney & Urology", "Liver Transplant", "Oncology"],
        "accreditation": "JCI, NABH",
        "lat": 28.4498,
        "lng": 77.0413,
    },
    {
        "id": 10,
        "name": "King George's Medical University",
        "state": "Uttar Pradesh",
        "city": "Lucknow",
        "pincode": "226003",
        "type": "Government Medical University",
        "address": "Shah Mina Road, Chowk, Lucknow – 226003",
        "phone": "+91 522 225 7540",
        "description": "Century-old government medical university providing affordable tertiary care to crores in UP.",
        "services": ["General Medicine", "Surgery", "Orthopedics", "Pediatrics", "Trauma"],
        "accreditation": "NABH",
        "lat": 26.8601,
        "lng": 80.9212,
    },
    {
        "id": 11,
        "name": "Choithram Hospital",
        "state": "Madhya Pradesh",
        "city": "Indore",
        "pincode": "452001",
        "type": "Multi-specialty",
        "address": "Manik Bagh Road, Indore – 452001",
        "phone": "+91 731 404 0000",
        "description": "Trusted multispecialty hospital in central India serving MP and neighboring regions.",
        "services": ["Cardiology", "Neurology", "Oncology", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 22.7218,
        "lng": 75.8576,
    },
    {
        "id": 12,
        "name": "Dayanand Medical College & Hospital",
        "state": "Punjab",
        "city": "Ludhiana",
        "pincode": "141001",
        "type": "Teaching Hospital",
        "address": "Tagore Nagar, Ludhiana, Punjab – 141001",
        "phone": "+91 161 530 1000",
        "description": "Premier teaching hospital serving Punjab and Himachal Pradesh with all specialties.",
        "services": ["Cardiology", "Orthopedics", "Neurology", "Oncology"],
        "accreditation": "NABH",
        "lat": 30.9001,
        "lng": 75.8422,
    },
    {
        "id": 13,
        "name": "Patna AIIMS",
        "state": "Bihar",
        "city": "Patna",
        "pincode": "801507",
        "type": "Government Institute",
        "address": "Phulwari Sharif, Patna, Bihar – 801507",
        "phone": "+91 612 245 1070",
        "description": "AIIMS Patna provides advanced tertiary care to patients from Bihar, Jharkhand and UP.",
        "services": ["Emergency", "Cardiology", "Oncology", "Neurology", "Trauma"],
        "accreditation": "NABH",
        "lat": 25.5621,
        "lng": 85.0601,
    },
    {
        "id": 14,
        "name": "AIIMS Bhubaneswar",
        "state": "Odisha",
        "city": "Bhubaneswar",
        "pincode": "751019",
        "type": "Government Institute",
        "address": "Sijua, Patrapada, Bhubaneswar – 751019",
        "phone": "+91 674 247 6789",
        "description": "AIIMS Bhubaneswar delivers world-class government healthcare to eastern India.",
        "services": ["Cardiology", "Trauma", "Oncology", "General Surgery", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 20.1562,
        "lng": 85.7767,
    },
    {
        "id": 15,
        "name": "Amrita Institute of Medical Sciences",
        "state": "Kerala",
        "city": "Kochi",
        "pincode": "682041",
        "type": "Multi-specialty",
        "address": "AIMS Ponekkara P.O., Kochi, Kerala – 682041",
        "phone": "+91 484 285 8136",
        "description": "JCI-accredited hospital known globally for organ transplant and minimally invasive surgery.",
        "services": ["Organ Transplant", "Cardiac Surgery", "Neurology", "Oncology"],
        "accreditation": "JCI, NABH",
        "lat": 9.9614,
        "lng": 76.3015,
    },
    {
        "id": 16,
        "name": "Care Hospital",
        "state": "Andhra Pradesh",
        "city": "Visakhapatnam",
        "pincode": "530002",
        "type": "Multi-specialty",
        "address": "Ramnagar, Visakhapatnam, Andhra Pradesh – 530002",
        "phone": "+91 891 661 1111",
        "description": "AP's leading hospital chain providing comprehensive care across 30+ specialties.",
        "services": ["Cardiology", "Neurology", "Oncology", "Orthopedics", "ICU"],
        "accreditation": "NABH",
        "lat": 17.7166,
        "lng": 83.3054,
    },
    {
        "id": 17,
        "name": "Gauhati Medical College & Hospital",
        "state": "Assam",
        "city": "Guwahati",
        "pincode": "781032",
        "type": "Government Teaching Hospital",
        "address": "Bhangagarh, Guwahati, Assam – 781032",
        "phone": "+91 361 252 9457",
        "description": "North-east India's oldest and largest government hospital serving 8 states.",
        "services": ["Trauma", "General Surgery", "Oncology", "Neurology", "ICU"],
        "accreditation": "NABH",
        "lat": 26.1771,
        "lng": 91.7625,
    },
    {
        "id": 18,
        "name": "Rajendra Institute of Medical Sciences",
        "state": "Jharkhand",
        "city": "Ranchi",
        "pincode": "834009",
        "type": "Government Institute",
        "address": "Bariatu Road, Ranchi, Jharkhand – 834009",
        "phone": "+91 651 254 6191",
        "description": "Primary government referral hospital for Jharkhand and neighbouring tribal regions.",
        "services": ["General Medicine", "Surgery", "Orthopedics", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 23.3587,
        "lng": 85.2868,
    },
    {
        "id": 19,
        "name": "Apollo BSR Hospital",
        "state": "Chhattisgarh",
        "city": "Raipur",
        "pincode": "492001",
        "type": "Multi-specialty",
        "address": "G.E. Road, Raipur, Chhattisgarh – 492001",
        "phone": "+91 771 4041 000",
        "description": "Apollo's flagship hospital for central India with 24/7 emergency and trauma care.",
        "services": ["Cardiology", "Neurology", "Emergency", "Trauma", "Oncology"],
        "accreditation": "JCI, NABH",
        "lat": 21.2514,
        "lng": 81.6296,
    },
    {
        "id": 20,
        "name": "Indira Gandhi Medical College",
        "state": "Himachal Pradesh",
        "city": "Shimla",
        "pincode": "171001",
        "type": "Government Teaching Hospital",
        "address": "Circular Road, Shimla, Himachal Pradesh – 171001",
        "phone": "+91 177 265 4977",
        "description": "HP's leading government hospital serving the hill districts with specialist care.",
        "services": ["General Medicine", "Orthopedics", "Pediatrics", "Emergency"],
        "accreditation": "NABH",
        "lat": 31.1048,
        "lng": 77.1734,
    },
    {
        "id": 21,
        "name": "Synergy Institute of Medical Sciences",
        "state": "Uttarakhand",
        "city": "Dehradun",
        "pincode": "248001",
        "type": "Multi-specialty",
        "address": "Balawala, Dehradun, Uttarakhand – 248001",
        "phone": "+91 135 277 1100",
        "description": "Multi-specialty hospital providing quality care for the Himalayan region.",
        "services": ["Cardiology", "Orthopedics", "Neurology", "General Surgery"],
        "accreditation": "NABH",
        "lat": 30.316,
        "lng": 78.0322,
    },
    {
        "id": 22,
        "name": "Goa Medical College & Hospital",
        "state": "Goa",
        "city": "Panaji",
        "pincode": "403202",
        "type": "Government Teaching Hospital",
        "address": "NH-17, Bambolim, Panaji, Goa – 403202",
        "phone": "+91 832 245 8727",
        "description": "Goa's only medical college hospital providing tertiary care to the coastal state.",
        "services": ["Cardiology", "Oncology", "Emergency", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 15.4622,
        "lng": 73.8408,
    },
    {
        "id": 23,
        "name": "Agartala Government Medical College",
        "state": "Tripura",
        "city": "Agartala",
        "pincode": "799006",
        "type": "Government Teaching Hospital",
        "address": "Kunjaban, Agartala, Tripura – 799006",
        "phone": "+91 381 232 4973",
        "description": "North-east Tripura's principal government hospital providing affordable specialist care.",
        "services": ["General Surgery", "Pediatrics", "Orthopedics", "Gynecology"],
        "accreditation": "NABH",
        "lat": 23.8315,
        "lng": 91.2868,
    },
    {
        "id": 24,
        "name": "Civil Hospital Shillong",
        "state": "Meghalaya",
        "city": "Shillong",
        "pincode": "793001",
        "type": "Government Hospital",
        "address": "Laitumkhrah, Shillong, Meghalaya – 793001",
        "phone": "+91 364 222 2676",
        "description": "Meghalaya's government hospital serving hill districts of north-east India.",
        "services": ["Emergency", "General Medicine", "Orthopedics", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 25.5788,
        "lng": 91.8933,
    },
    {
        "id": 25,
        "name": "RIMS Imphal",
        "state": "Manipur",
        "city": "Imphal",
        "pincode": "795004",
        "type": "Government Institute",
        "address": "Lamphelpat, Imphal West, Manipur – 795004",
        "phone": "+91 385 241 5101",
        "description": "Regional Institute providing advanced care across Manipur and adjacent north-east states.",
        "services": ["General Medicine", "Surgery", "Orthopedics", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 24.8072,
        "lng": 93.9368,
    },
    {
        "id": 26,
        "name": "NEIGRIHMS",
        "state": "Meghalaya",
        "city": "Shillong",
        "pincode": "793018",
        "type": "Government Referral Institute",
        "address": "Mawdiangdiang, Shillong – 793018",
        "phone": "+91 364 253 8025",
        "description": "NEIGRIHMS is the apex referral hospital for the entire north-east India region.",
        "services": ["Cardiology", "Oncology", "Neurology", "Trauma"],
        "accreditation": "NABH",
        "lat": 25.6189,
        "lng": 91.8955,
    },
    {
        "id": 27,
        "name": "Nagaland State Hospital",
        "state": "Nagaland",
        "city": "Kohima",
        "pincode": "797001",
        "type": "Government Hospital",
        "address": "State Hospital Road, Kohima, Nagaland – 797001",
        "phone": "+91 370 229 0611",
        "description": "Nagaland's primary government hospital serving the mountainous eastern state.",
        "services": ["General Medicine", "Pediatrics", "Surgery", "Emergency"],
        "accreditation": "NABH",
        "lat": 25.6667,
        "lng": 94.1167,
    },
    {
        "id": 28,
        "name": "Zoram Medical College",
        "state": "Mizoram",
        "city": "Aizawl",
        "pincode": "796017",
        "type": "Government Medical College",
        "address": "Falkawn, Aizawl, Mizoram – 796017",
        "phone": "+91 389 234 5678",
        "description": "Mizoram's government medical college with specialist services for the remote hill state.",
        "services": ["General Medicine", "Surgery", "Pediatrics", "Gynecology"],
        "accreditation": "NABH",
        "lat": 23.7333,
        "lng": 92.7167,
    },
    {
        "id": 29,
        "name": "TRIHMS",
        "state": "Arunachal Pradesh",
        "city": "Itanagar",
        "pincode": "791111",
        "type": "Government Hospital",
        "address": "Naharlagun, Itanagar, Arunachal Pradesh – 791111",
        "phone": "+91 360 229 0789",
        "description": "Tomo Riba Institute providing healthcare to India's easternmost frontier state.",
        "services": ["General Medicine", "Surgery", "Emergency", "Pediatrics"],
        "accreditation": "NABH",
        "lat": 27.1043,
        "lng": 93.6053,
    },
    {
        "id": 30,
        "name": "STNM Hospital",
        "state": "Sikkim",
        "city": "Gangtok",
        "pincode": "737101",
        "type": "Government Hospital",
        "address": "Syari, Gangtok, Sikkim – 737101",
        "phone": "+91 359 220 2059",
        "description": "Sikkim's largest government hospital providing care to the Himalayan state.",
        "services": ["General Medicine", "Orthopedics", "Pediatrics", "Emergency"],
        "accreditation": "NABH",
        "lat": 27.3319,
        "lng": 88.6138,
    },
    {
        "id": 31,
        "name": "SMHS Hospital",
        "state": "Jammu & Kashmir",
        "city": "Srinagar",
        "pincode": "190001",
        "type": "Government Teaching Hospital",
        "address": "Karan Nagar, Srinagar, J&K – 190001",
        "phone": "+91 194 246 2200",
        "description": "Sher-i-Kashmir Hospital provides comprehensive care to the Kashmir Valley.",
        "services": ["Cardiology", "Orthopedics", "General Surgery", "Trauma"],
        "accreditation": "NABH",
        "lat": 34.0837,
        "lng": 74.7973,
    },
    {
        "id": 32,
        "name": "SNM Hospital",
        "state": "Ladakh",
        "city": "Leh",
        "pincode": "194101",
        "type": "Government District Hospital",
        "address": "Main Town, Leh, Ladakh – 194101",
        "phone": "+91 982 235 2015",
        "description": "High-altitude district hospital serving Leh at 3,500m — nearest major hospital in Srinagar.",
        "services": ["Emergency", "High Altitude Medicine", "Trauma", "General Medicine"],
        "accreditation": "NABH",
        "lat": 34.1526,
        "lng": 77.5771,
    },
    {
        "id": 33,
        "name": "JIPMER",
        "state": "Puducherry",
        "city": "Puducherry",
        "pincode": "605006",
        "type": "National Importance Institute",
        "address": "Dhanvantari Nagar, Puducherry – 605006",
        "phone": "+91 413 229 8866",
        "description": "Jawaharlal Institute of Postgraduate Medical Education — a premier national institute.",
        "services": ["Oncology", "Cardiology", "Neurology", "Organ Transplant"],
        "accreditation": "NABH",
        "lat": 11.9416,
        "lng": 79.8083,
    },
    {
        "id": 34,
        "name": "Government General Hospital",
        "state": "Andaman & Nicobar",
        "city": "Port Blair",
        "pincode": "744101",
        "type": "Government Hospital",
        "address": "Atlanta Point, Port Blair, A&N Islands – 744101",
        "phone": "+91 3192 232 102",
        "description": "The islands' primary hospital — complex cases are typically referred to Chennai.",
        "services": ["Emergency", "General Surgery", "Pediatrics", "Orthopedics"],
        "accreditation": "NABH",
        "lat": 11.6234,
        "lng": 92.7265,
    },
    {
        "id": 35,
        "name": "Aster MedCity",
        "state": "Maharashtra",
        "city": "Nagpur",
        "pincode": "440012",
        "type": "Multi-specialty",
        "address": "Wardha Road Medical District, Nagpur, Maharashtra – 440012",
        "phone": "+91 712 240 4400",
        "description": "Advanced diagnostics and trauma support with 24/7 emergency services in Vidarbha.",
        "services": ["Emergency", "ICU", "Cardiology", "Orthopedics"],
        "accreditation": "NABH",
        "lat": 21.1458,
        "lng": 79.0882,
    },
    {
        "id": 36,
        "name": "Lilavati Hospital",
        "state": "Maharashtra",
        "city": "Mumbai",
        "pincode": "400050",
        "type": "Comprehensive",
        "address": "Bandra Reclamation, Bandra West, Mumbai – 400050",
        "phone": "+91 22 2675 1000",
        "description": "Trusted multi-specialty hospital for planned care, cardiac services, and complex surgeries.",
        "services": ["Orthopedics", "Pediatrics", "Maternity", "Neurology"],
        "accreditation": "JCI, NABH",
        "lat": 19.0542,
        "lng": 72.8228,
    },
    {
        "id": 37,
        "name": "Manipal Hospital",
        "state": "Karnataka",
        "city": "Mangaluru",
        "pincode": "575002",
        "type": "Multi-specialty",
        "address": "KMC Attavar, Mangaluru, Karnataka – 575002",
        "phone": "+91 824 242 5399",
        "description": "Coastal Karnataka's leading hospital serving Dakshina Kannada and Udupi districts.",
        "services": ["Cardiology", "Orthopedics", "Oncology", "Neurology"],
        "accreditation": "JCI, NABH",
        "lat": 12.8672,
        "lng": 74.8427,
    },
    {
        "id": 38,
        "name": "PSG Hospitals",
        "state": "Tamil Nadu",
        "city": "Coimbatore",
        "pincode": "641004",
        "type": "Multi-specialty",
        "address": "Peelamedu, Coimbatore, Tamil Nadu – 641004",
        "phone": "+91 422 257 0170",
        "description": "PSG Hospitals serves western Tamil Nadu with specialty care and telemedicine outreach.",
        "services": ["Cardiology", "Neurology", "Orthopedics", "Oncology"],
        "accreditation": "NABH",
        "lat": 11.0168,
        "lng": 77.0116,
    },
]

# 3. Doctor Generation Lists
FIRST_NAMES = [
    'Aarav', 'Aditi', 'Ananya', 'Arjun', 'Asha', 'Bhargav', 'Chetan', 'Deepa',
    'Divya', 'Gaurav', 'Harini', 'Ishaan', 'Jaya', 'Kavya', 'Kunal', 'Meera',
    'Naina', 'Nikhil', 'Pallavi', 'Pranav', 'Priya', 'Rahul', 'Riya', 'Sanjay',
    'Sayali', 'Shreya', 'Siddharth', 'Sneha', 'Tanvi', 'Tejas', 'Uma', 'Varun',
    'Veda', 'Vikram', 'Vivek', 'Yash', 'Zara', 'Kiran', 'Suresh', 'Lakshmi'
]

LAST_NAMES = [
    'Rao', 'Sharma', 'Verma', 'Iyer', 'Menon', 'Joshi', 'Patel', 'Bhatia',
    'Reddy', 'Singh', 'Kapoor', 'Nair', 'Kumar', 'Desai', 'Chopra', 'Malhotra',
    'Seth', 'Das', 'Gupta', 'Kulkarni', 'Dixit', 'Pillai', 'Bharadwaj', 'Srinivasan',
    'Chatterjee', 'Mukherjee', 'Banerjee', 'Dutta', 'Ghosh', 'Bose'
]

DESIGNATIONS = [
    {"designation": "Cardiologist",         "specialty": "Cardiology"},
    {"designation": "Neurologist",          "specialty": "Neurology"},
    {"designation": "Orthopedic Surgeon",   "specialty": "Orthopedics"},
    {"designation": "Pediatrician",         "specialty": "Pediatrics"},
    {"designation": "Dermatologist",        "specialty": "Dermatology"},
    {"designation": "General Physician",    "specialty": "General Medicine"},
    {"designation": "Gynecologist",         "specialty": "Gynecology"},
    {"designation": "Pulmonologist",        "specialty": "Pulmonology"},
    {"designation": "Gastroenterologist",   "specialty": "Gastroenterology"},
    {"designation": "Endocrinologist",      "specialty": "Endocrinology"},
    {"designation": "Oncologist",           "specialty": "Oncology"},
    {"designation": "Urologist",            "specialty": "Urology"},
    {"designation": "Nephrologist",         "specialty": "Nephrology"},
    {"designation": "ENT Specialist",       "specialty": "ENT"},
    {"designation": "Psychiatrist",         "specialty": "Psychiatry"},
    {"designation": "Ophthalmologist",      "specialty": "Ophthalmology"},
    {"designation": "Rheumatologist",       "specialty": "Rheumatology"},
    {"designation": "Diabetologist",        "specialty": "Diabetology"},
]

HOSPITAL_SEEDS = [
    'Apollo Clinic', 'Fortis Healthcare', 'Manipal Hospital', 'AIIMS Centre',
    'Max Healthcare', 'Medanta Clinic', 'HCG Cancer Centre', 'Care Hospital',
    'Kokilaben Dhirubhai Hospital', 'Rainbow Children Hospital', 'Aster Clinic',
    'Narayana Health', 'Lifespan Multispecialty', 'SRL Diagnostics Hospital',
    'KIMS Hospital', 'Wockhardt Clinic', 'Global Hospitals', 'Yashoda Hospital'
]

AVAILABILITY_SLOTS = [
    'Mon–Fri • 9 AM – 6 PM',
    'Daily • 8 AM – 7 PM',
    'Mon–Sat • 10 AM – 5 PM',
    'Daily • 9 AM – 8 PM',
    'Tue–Sun • 10 AM – 6 PM',
    'Mon–Fri • 8 AM – 4 PM',
    'Daily • 10 AM – 7 PM',
    'Mon–Sat • 9 AM – 5 PM'
]


def seed_db(db: Session):
    print("Clearing existing data...")
    db.query(Appointment).delete()
    db.query(MedicalRecord).delete()
    db.query(Doctor).delete()
    db.query(Hospital).delete()
    db.query(Patient).delete()
    db.query(Location).delete()
    db.commit()

    print("Seeding locations...")
    loc_instances = []
    loc_map = {}  # maps (state, city) -> Location instance
    for loc_data in INDIA_LOCATIONS:
        loc = Location(
            state=loc_data["state"],
            city=loc_data["city"],
            pincode=loc_data["pincode"],
            tier=loc_data["tier"],
            latitude=loc_data["lat"],
            longitude=loc_data["lng"]
        )
        db.add(loc)
        loc_instances.append(loc)
        loc_map[(loc_data["state"], loc_data["city"])] = loc
    db.commit()
    print(f"Seeded {len(loc_instances)} locations.")

    print("Seeding hospitals...")
    hosp_instances = []
    hosp_map = {}  # maps hospital name -> Hospital instance
    for hosp_data in HOSPITALS:
        # Find matching location in DB
        loc = loc_map.get((hosp_data["state"], hosp_data["city"]))
        if not loc:
            # Fallback / create location if not seeded
            loc = Location(state=hosp_data["state"], city=hosp_data["city"], pincode=hosp_data["pincode"], tier=hosp_data["tier"], latitude=hosp_data["lat"], longitude=hosp_data["lng"])
            db.add(loc)
            db.commit()
            loc_map[(hosp_data["state"], hosp_data["city"])] = loc

        hosp = Hospital(
            name=hosp_data["name"],
            location_id=loc.id,
            type=hosp_data["type"],
            address=hosp_data["address"],
            phone=hosp_data["phone"],
            description=hosp_data["description"],
            services=hosp_data["services"],
            accreditation=hosp_data["accreditation"],
            latitude=hosp_data["lat"],
            longitude=hosp_data["lng"]
        )
        db.add(hosp)
        hosp_instances.append(hosp)
        hosp_map[hosp_data["name"]] = hosp
    db.commit()
    print(f"Seeded {len(hosp_instances)} hospitals.")

    print("Seeding doctors...")
    doc_count = 0
    # Generate 5 doctors per location seed
    for loc_idx, loc_data in enumerate(INDIA_LOCATIONS):
        loc = loc_map[(loc_data["state"], loc_data["city"])]
        for i in range(5):
            base = DESIGNATIONS[(loc_idx + i) % len(DESIGNATIONS)]
            first_name = FIRST_NAMES[(loc_idx * 3 + i) % len(FIRST_NAMES)]
            last_name = LAST_NAMES[(loc_idx * 2 + i) % len(LAST_NAMES)]
            availability = AVAILABILITY_SLOTS[(loc_idx + i) % len(AVAILABILITY_SLOTS)]
            exp_years = 5 + ((loc_idx + i) % 15)
            rating = round(4.0 + ((loc_idx + i) % 10) * 0.1, 1)
            price = 400 + ((loc_idx + i) % 7) * 100  # Consult fee: 400 - 1000 INR

            # Find matching hospital seed or map to None
            hosp_seed_name = HOSPITAL_SEEDS[(loc_idx + i) % len(HOSPITAL_SEEDS)]
            # Check if this state/city has any of our 38 structured hospitals
            # If so, link to the real hospital in the DB! Otherwise, link to None (acts as private clinic)
            hosp = None
            for h in hosp_instances:
                if h.location_id == loc.id and (hosp_seed_name.split()[0] in h.name or h.name.split()[0] in hosp_seed_name):
                    hosp = h
                    break
            # Fallback: link to the first hospital in the city if available, to make filtering end-to-end more interesting
            if not hosp:
                city_hospitals = [h for h in hosp_instances if h.location_id == loc.id]
                if city_hospitals:
                    hosp = city_hospitals[0]

            doc = Doctor(
                full_name=f"Dr. {first_name} {last_name}",
                designation=base["designation"],
                specialty=base["specialty"],
                rating=rating,
                price=price,
                experience=f"{exp_years} years",
                availability=availability,
                location_id=loc.id,
                hospital_id=hosp.id if hosp else None
            )
            db.add(doc)
            doc_count += 1
    db.commit()
    print(f"Seeded {doc_count} doctors.")

    print("Database seeding completed successfully!")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
