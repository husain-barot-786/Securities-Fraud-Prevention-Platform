Securities Fraud Prevention Platform
│
├── backend/                         # Python backend application source
│   ├── .pytest_cache/               # Pytest caching files (auto-hidden)
│   │   ├── v/
│   │   │   └── cache/
│   │   ├── .gitignore
│   │   ├── CACHEDIR.TAG
│   │   └── README.md
│   │
│   ├── alembic/                     # Database migrations managed by Alembic
│   │   ├── __pycache__/             (auto-hidden)
│   │   ├── versions/                # Migration scripts
│   │   │   ├── __pycache__/         (auto-hidden)
│   │   │   └── a8eca0f29002_init.py
│   │   ├── README
│   │   ├── env.py
│   │   └── script.py.mako
│   │
│   ├── app/                         # Core backend application modules
│   │   ├── __pycache__/             (auto-hidden)
│   │   ├── db/                      # Database models and schemas
│   │   │   ├── __pycache__/         (auto-hidden)
│   │   │   ├── database.py
│   │   │   ├── pydantic_schemas.py
│   │   │   └── schemas.py
│   │   ├── router/                  # API endpoint handlers
│   │   │   ├── __pycache__/         (auto-hidden)
│   │   │   ├── alerts.py
│   │   │   ├── announcements.py
│   │   │   ├── fraud_detection.py
│   │   │   ├── fraud_rules.py
│   │   │   ├── user.py
│   │   │   └── verification.py
│   │   ├── rules/                   # Fraud and verification business logic rules
│   │   │   ├── __pycache__/         (auto-hidden)
│   │   │   ├── fraud_rules.py
│   │   │   └── verification_rules.py
│   │   ├── utils/                   # Utility modules (scraper, notifier)
│   │   │   ├── __pycache__/         (auto-hidden)
│   │   │   ├── notifier.py
│   │   │   ├── scraper.py
│   │   │   └── ws_manager.py
│   │   ├── venv/                    (auto-hidden)
│   │   ├── config.py                # Application configuration
│   │   ├── main.db                  # SQLite persistent database
│   │   ├── main.py                  # FastAPI app main entry point
│   │   └── requirements.txt         # Python dependencies
│   │
│   ├── tests/                       # Automated tests
│   │   ├── __pycache__/             (auto-hidden)
│   │   ├── test_alerts.py
│   │   ├── test_announcements.py
│   │   ├── test_fraud.py
│   │   ├── test_user.py
│   │   └── test_verification.py
│   │
│   ├── alembic.ini                  # Alembic migration config
│   ├── package-lock.json
│   └── test.db
│
├── frontend/                        # React frontend application
│   ├── node_modules/                (auto-hidden)
│   ├── public/                      # Public web assets and index.html
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── requests/                    # API testing file
│   │   └── alerts.http
│   │
│   ├── src/                         # React source code
│   │   ├── components/              # Shared UI components
│   │   │   ├── AlertsPage.js
│   │   │   ├── Navbar.js
│   │   │   ├── Sidebar.js
│   │   │   └── ThemeToggle.js
│   │   │
│   │   ├── hooks/                   # Reusable React hook
│   │   │   └── useAlertNotifications.js
│   │   │
│   │   ├── pages/                   # Views and pages
│   │   │   ├── AlertsPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── FraudDetection.js
│   │   │   ├── Login.js
│   │   │   └── VerificationTool.js
│   │   │
│   │   ├── services/                # API clients and service modules
│   │   │   └── api.js
│   │   │
│   │   ├── styles/                  # CSS stylesheets for components and pages
│   │   │   ├── AlertsPage.css
│   │   │   ├── App.css
│   │   │   ├── Dark-Theme-Toggle.css
│   │   │   ├── Dashboard.css
│   │   │   ├── FraudDetection.css
│   │   │   └── VerificationTool.css
│   │   │
│   │   ├── App.css
│   │   ├── App.js                   # Root React app component with routing
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js                 # ReactDOM render entry
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js            # Frontend testing setup
│   │
│   ├── .gitignore
│   ├── README.md
│   ├── package.json                 # Node dependencies and scripts
│   └── package-lock.json            # Exact Node dependency versions
│
├── api.js                           # Shared API client module (if any)
├── App.js                           # App root component (sometimes duplicated, ensure single source)
├── Navbar.js                        # Navigation bar component
├── Project Structure.md             # Annotated project directory explanation
├── README.md                        # Project documentation and setup guide
├── Roadmap.md                       # Project current and planned milestones
└── .gitignore                       # Files and directories to exclude from version control
