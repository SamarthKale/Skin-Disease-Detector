# 🏥 VedaralaAI - Intelligent Skin Health Platform

**VedaralaAI** is a full-stack healthcare platform that leverages AI to analyze skin conditions, explain their severity, and assist patients in finding nearby dermatologists.

## 📌 Key Features

- 🧠 **AI-Powered Skin Analysis** using EfficientNetB0 + Tensor Cores
- ⚖️ **Severity Classification** (Mild, Moderate, Severe)
- 🧬 **Detailed Disease Explanation** via local JSON (offline-capable)
- 🌍 **Doctor Locator** using Google Maps API
- 🔐 **Secure User Authentication** (Register/Login)
- 📜 **Patient History** with Saved Reports
- 📄 **PDF Export** of Analysis Results
- 📷 **Live Camera Scan + Image Upload**
- 🌐 **Modern Responsive UI** using React

## 🧱 Project Stack

| Layer | Tech |
|-------|------|
| 🧠 ML Model | EfficientNetB0 (TensorFlow 2.10+) |
| 🐍 Backend | Flask 2.3.3 + MySQL |
| ⚛️ Frontend | React 18 + Tailwind + Vanilla CSS |
| 🧾 PDF Export | jsPDF + html2canvas |
| 🔐 Auth | Flask session-based login with bcrypt |
| 🌐 API Keys | Managed securely with `python-dotenv` |

## 🔧 System Requirements

| Tool | Version |
|------|---------|
| Python | 3.9 |
| Node.js | 14+ |
| MySQL | 8.0+ |
| TensorFlow | 2.10.0 (uses Tensor Cores if GPU is available) |
| React | 18+ |

## 📁 Folder Structure

### 📂 Backend (`/backend`)
| File | Purpose |
|------|--------|
| `app.py` | Flask server & all API routes |
| `setup_database.py` | Create all MySQL tables + default users |
| `requirements.txt` | Python libraries list |
| `disease_explanations.json` | Explanation per severity |
| `train_model.py` | EfficientNet training script |
| `testmysql.py` | Add/List/Delete users |

### 📂 Frontend (`/frontend/src`)
| File | Description |
|------|-------------|
| `App.js` | Routing logic |
| `LoginPage.jsx` | Login/Signup form |
| `HomePage.jsx` | Dashboard |
| `ScanPage.jsx` | Image upload, AI scan, PDF export |
| `ResourcesPage.jsx` | Info cards |
| `AboutPage.jsx` / `ContactPage.jsx` | Informational |
| `style.css` | App-wide styling |
| `AuthContext.jsx` | React Auth session manager |

### 📂 Model (`/model-2`)
| File | Purpose |
|------|--------|
| `model_weights.h5` | Trained EfficientNetB0 model |
| `class_labels.txt` | Output class mappings (Benign, Melanoma, Nevus) |

## ⚙️ Environment Variables (`.env`)

Place this in your `/backend` folder as `.env`:

```
GOOGLE_API_KEY=your_google_api_key
GOOGLE_MAPS_EMBED_KEY=your_embed_key
```

## 📄 Backend Setup

```bash
cd backend
pip install -r requirements.txt
python setup_database.py
python app.py
```

📌 Runs on `http://localhost:5000`

## 💻 Frontend Setup

```bash
cd frontend
npm install
npm start
```

📌 React app on `http://localhost:3000`

## 🧪 Default Users

| Role | Username | Password |
|------|----------|----------|
| Admin | admin@vedaralaai.com | admin123 |
| Test User | test@vedaralaai.com | test123 |

## 📦 Backend Dependencies

Here's what's included in `requirements.txt`:

```
flask==2.3.3
flask-cors==4.0.0
mysql-connector-python==8.1.0
bcrypt==4.0.1
numpy==1.24.3
tensorflow==2.10.0
Pillow==10.0.0
python-dotenv==1.0.0
```

## 📦 Frontend Dependencies (via npm)

```bash
npm install jspdf html2canvas
```

These are used for exporting reports as PDF from the browser.

## 🧠 AI Model

- **EfficientNetB0** with custom classifier
- **Input**: 224x224 RGB images
- **Output**: `Benign`, `Melanoma`, `Nevus`
- **Severity estimation** based on confidence thresholds
- **Explanation** fetched from `disease_explanations.json`

## 🌍 Google Maps Integration

- `GET /api/get-map-key` - Retrieves frontend embed key
- `POST /api/search-doctors` - Searches dermatologists near your geolocation

## 🧠 Prediction + Explanation Flow

1. Upload/capture image in Scan Page
2. `/api/predict` returns `prediction`, `confidence`, `severity`
3. `/api/explain-disease` returns matching explanation
4. Frontend renders animated explanation + nearby dermatologists

## 🛡️ Security Notes

- ✅ Passwords hashed with `bcrypt`
- ✅ Sessions managed via Flask with `secure` cookies
- ✅ Secret key stored in `app.secret_key` (change it in production)
- ✅ Uses `.env` to store sensitive keys

## 📊 Database Tables

### `users`
Stores login credentials

### `skin_analysis`
Stores scan results, severity, image path

### `patient_records`
(Placeholder) for future patient medical history

## 📄 Report PDF Export

- `ScanPage.jsx` uses `html2canvas` + `jsPDF`
- User can download diagnosis as a styled PDF
- Includes image, prediction, severity, timestamp

## 🧪 Testing the Model

```bash
python test_model.py
```

Optional CLI test:

```bash
python predict.py path/to/image.jpg
```

## ✨ Future Enhancements

- 👨‍⚕️ Doctor profiles + booking
- 🧾 Report export to email / cloud
- 📈 Model performance dashboard
- 🗂️ Multi-disease classification

## 📄 License

MIT License – Free to use and modify  
© 2025 **VedaralaAI**

## 📞 Support

- 📧 Email: [support@vedaralaai.com](mailto:support@vedaralaai.com)
- 🐛 Issues: GitHub Issue Tracker
- 📚 Docs: This `README.md`
