# Securities Fraud Prevention Platform

## Overview

**Securities Fraud Prevention** is a cutting-edge platform that integrates real-time monitoring, interactive verification, and actionable alerting to combat fraudulent activities in securities markets. Built with a FastAPI backend and React frontend, it empowers investors, compliance teams, and regulators to identify and respond swiftly to suspicious events, ensuring market integrity and investor protection through dynamic visualizations and comprehensive audit tracking.

---

## Key Features

- **Real-time Fraud Alerts:** Receive immediate, actionable alerts with live status updates.
- **Fraud Tip Management:** Add, review, and manage suspicious tips with admin-level controls.
- **Verification Tool:** Evaluate messages instantly against configurable fraud detection rules.
- **Notification Toasts:** Dynamic popup notifications on all major pages to enhance responsiveness.
- **Audit Logs:** Track all operations transparently for compliance and operational oversight.
- **Interactive Analytics:** Visualize fraud patterns across platforms and time with intuitive charts.
- **User Roles & Permissions:** Secure, role-based access control for investors, admins, and regulators.
- **Responsive UI:** Seamless experience with support for dark mode and multiple devices.

---

## Setup Instructions

### Backend

1. Navigate to backend directory:
   ```
   cd backend/app
   ```

2. Create & activate virtual environment:

- Windows:
  ```
  python -m venv venv
  .\venv\Scripts\activate
  ```
- Mac/Linux:
  ```
  python3 -m venv venv
  source venv/bin/activate
  ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```
   set PYTHONPATH=%cd%
   alembic upgrade head
   ```

5. Start backend server:
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

Backend API available at [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Frontend

1. Navigate to frontend directory:
   ```
   cd frontend
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start React frontend UI:
   ```
   npm start
   ```

Frontend running at [http://localhost:3000](http://localhost:3000)

---

## Running Tests

- Backend tests:
   ```
   pytest backend/tests/
   ```

- Frontend tests (if applicable):
   ```
   npm test
   ```

---

## Usage Instructions

- Access the platform via [http://localhost:3000](http://localhost:3000) after login.
- To test fraud alerts and verifications, utilize the provided `alerts.http` Postman collection or file located in the `requests` folder.
- This file contains pre-configured POST requests for Alert and Verification endpoints (`frontend/requests/alerts`).
- Sending these requests will generate live FraudTip and Verification alerts within the system.
- Alerts will immediately appear in the “Alerts” page and the “Recent Alerts” section on the Dashboard.
- Observe live toast notifications across the app upon new alert or verification detections.
- Use the “Mark as resolved” button on any active FraudTip alert for real-time status updates.
- Demo mode on the Dashboard allows quick population of sample data for demonstration.
- Switch light/dark modes and explore analytics for comprehensive system understanding.

---

## API Endpoints Summary

- `POST /alerts` - Submit new alert; e.g., FraudTip.
- `POST /verification/status-update` - Submit verification status update.
- `GET /alerts` - Retrieve current alerts.
- `PATCH /alerts/{id}/resolve` - Mark alert as resolved.
- `GET /verification/status-update` - Fetch verification events.
- `GET /fraud-tips` - Manage fraud tips.
- Additional endpoints for rules, users, and announcements.

---

## API Reference

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Data Persistence and Management

- The platform uses SQLite (or Postgres in production) with SQLAlchemy ORM.
- Data and system state are persisted for all alerts, tips, users, and rules.
- Alembic manages database migrations ensuring schema consistency.

---

## Important Note on Data Initialization

- To seed data for testing demo and presentation, use the `alerts.http` in the `requests` folder.
- Initiate POST requests to add FraudTip and Verification alerts.
- This approach ensures the judges and users can observe real-time alerts and notification behaviors.
- A clear understanding of this step is essential to effectively demonstrate the solution’s functionality.

## Troubleshooting & Maintenance

### Clearing Data

- To wipe existing data, delete `backend/app/main.db`.
- Recreate the database with migrations:  
  ```
  cd backend
  alembic upgrade head
  ```
- Restart the backend and frontend as per instructions.

**Warning:** Deleting `main.db` **will erase all stored alerts, fraud tips, and related data permanently.**  
Make sure to back up any data you want to keep beforehand.

---

## Integrated Features

1. Database Persistence
- Full ORM integration with SQLite for persistent storage of alerts, tips, users, and rules
- Alembic manages database migrations keeping schema in sync

2. Dynamic UI & Backend Interaction
- Real-time alerts updated via WebSocket API
- Admins can mark alerts as resolved using API and UI action buttons
- Frontend reacts instantly to data and state changes enhancing interactivity

3. Notification Toasts
- Toast notifications appear on all relevant pages (Dashboard, Alerts, Verification, Fraud Detection)
- Automatically display new alert or verification notifications on polling every 10 seconds
- Improves user experience with timely, unobtrusive alerts powered by React Toastify

---

## Extra Future Features

### Phase 1 - Scalability & Internationalization

- Multi-language support.
- Cloud deployment and scalability.
- Advanced security, rate limiting.

### Phase 2 - Analytics & AI

- Time-based fraud prediction.
- Graph and network analytics.
- Integration of external social and market data.

---

## Setup Quick Commands

- Backend setup
   ```
   cd backend/app
   python -m venv venv
   source venv/bin/activate # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   set PYTHONPATH=%cd%
   alembic upgrade head
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

- Frontend setup
   ```
   cd frontend
   npm install
   npm start
   ```

---

## FAQ

**Q:** Is this a real fraud detection system?  
**A:** Uses rule-based backend logic for realistic demo; ML integration planned later.

**Q:** Can fraud tips and rules be updated?  
**A:** Yes, they are dynamic and manageable in the backend/admin interface.

**Q:** Is this scalable?  
**A:** Designed with clean architecture and modularity; future work includes scaling and added analytics.

---

## Contributor & Contacts

- Lead Developer: Husain Barot  
- Email: husain.barot@gmail.com  
- GitHub: https://github.com/husain-barot-786  
- LinkedIn: https://linkedin.com/in/husain-barot

---