# Agrivita Frontend — React + Vite

Modern, responsive frontend for the Agrivita smart agriculture platform. Built with **React 18**, **Vite**, **TypeScript** (partial), and designed for mobile-first agricultural use in Ethiopia.

## Features

- 📱 **Responsive Design** - Mobile-first approach for farmers in the field
- 🔐 **Phone-based Auth** - Register/login using phone number
- 📸 **Image Capture** - Camera capture, drag-and-drop, file upload
- 🤖 **AI Analysis** - Real-time disease and pest identification
- 📊 **Dashboard** - Weather data, scan history, profile management
- 🌍 **Weather Integration** - Ethiopian weather forecasts
- 📈 **Profit Tracker** - AgriProfit calculator for farmers
- 💬 **AI Chat** - Real-time chat with Groq AI for farming advice
- 📱 **Progressive Web App Ready** - Works offline and on mobile

## Tech Stack

- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Styling**: CSS 3 (with utility-first approach)
- **State**: React Hooks & Context API
- **API Communication**: Fetch API / Axios
- **Deployment**: Netlify/Vercel ready

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

## Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Create `.env` file:**
```env
VITE_API_URL=http://localhost:8000
VITE_GROQ_API_KEY=your-groq-api-key
VITE_WEATHER_API_KEY=your-weather-api-key
```

## Development

### Start development server:
```bash
npm run dev
```

Server runs at `http://localhost:5173`

### Build for production:
```bash
npm run build
```

### Preview production build locally:
```bash
npm run preview
```

### Lint code:
```bash
npm run lint
```

---

## Project Structure

```
src/
├── assets/              # Images, icons, static files
├── components/          # Reusable React components
│   ├── ChatGroq.tsx    # AI chat with Groq
│   ├── ScanComp.jsx    # Scan interface component
│   └── DashboardPage-components/
│       ├── mainDashboard.jsx
│       └── SideBar.jsx
├── contexts/            # React Context for state management
├── pages/               # Page components (routes)
│   ├── LandingPage.jsx  # Home/landing page
│   ├── AgriVitaAuth.jsx # Authentication page
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Scan.jsx         # Disease/Pest scan page
│   ├── DiseaseScan.jsx  # Disease-specific scan
│   ├── PestScan.jsx     # Pest-specific scan
│   ├── Weather.jsx      # Weather page
│   ├── Profile.jsx      # User profile page
│   ├── History.jsx      # Scan history
│   ├── AgriProfit.jsx   # Profit calculator
│   └── fertilizer_expert.jsx # Fertilizer guide
├── utils/               # Helper functions & APIs
├── App.jsx              # Main app component
├── main.jsx             # Entry point
└── index.css            # Global styles
```

---

## Pages & Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | LandingPage | Home page with features and CTA |
| `/auth` | AgriVitaAuth | Login/Register with phone number |
| `/dashboard` | Dashboard | Main app dashboard |
| `/dashboard/scan/disease` | DiseaseScan | Crop disease identification |
| `/dashboard/scan/pest` | PestScan | Crop pest identification |
| `/dashboard/weather` | Weather | Weather forecasts for Ethiopia |
| `/dashboard/profile` | Profile | User profile and settings |
| `/dashboard/history` | History | Scan history and results |
| `/dashboard/agriprofit` | AgriProfit | Farm profit calculator |
| `/dashboard/fertilizer` | fertilizer_expert | Fertilizer recommendations |
| `/chat` | ChatGroq | AI chat with Groq |

---

## Key Components

### Authentication (AgriVitaAuth.jsx)
- Phone number and password fields
- Register and login modes
- Form validation
- JWT token storage in localStorage
- Auto-redirect to dashboard on success

### Scan Component (Scan.jsx / ScanComp.jsx)
- **Multiple upload methods:**
  - File input
  - Drag-and-drop
  - Camera capture (mobile)
- **Image preview** before analysis
- **AI analysis** with Groq
- **Confidence scores**
- **Save results** to localStorage
- **Offline support** (cached results)

### Dashboard (Dashboard.jsx)
- Fixed left sidebar (200px)
- Navigation between pages
- Quick stats and overview
- Recent scan results

### Chat (ChatGroq.tsx)
- Real-time AI chat with Groq
- Farming-specific questions
- Conversation history

---

## State Management

Using **React Context API** for:
- User authentication status
- User profile data
- Scan history
- UI theme/preferences

```javascript
// Example: Using auth context
const { user, login, logout } = useAuthContext();
```

---

## API Integration

### Authentication Flow
```javascript
// Register
POST /register
{
  "phone_number": "+251912345678",
  "password": "secure_password"
}

// Login
POST /login
{
  "phone_number": "+251912345678",
  "password": "secure_password"
}

// Response
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Protected API Calls
```javascript
// Always include token in Authorization header
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json'
};

fetch('http://localhost:8000/profile', { headers })
```

### Image Analysis
```javascript
// POST /analyze with image
const formData = new FormData();
formData.append('type', 'disease'); // or 'insect'
formData.append('file', imageFile);

fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
})
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |
| `VITE_GROQ_API_KEY` | Groq API key for chat | `<your_groq_api_key>` |
| `VITE_WEATHER_API_KEY` | Weather API key | `...` |

---

## Feature Details

### 📸 Image Scanning
- **Drag & Drop**: Drag images directly to the scan area
- **File Upload**: Click to browse and select image
- **Camera**: On mobile devices, tap camera icon to capture directly
- **Preview**: Image preview before sending to backend
- **Supported Formats**: JPG, PNG, WebP, GIF

### 🤖 AI Analysis
- Integrates with Groq AI (llama-3.1-8b)
- Gets disease/insect identification from Kindwise APIs
- Provides treatment recommendations
- Shows confidence scores

### 📊 Dashboard
- **Quick Stats**: Total scans, successful diagnoses
- **Recent Results**: Last 5 scan results
- **Quick Actions**: Links to common features
- **Weather Widget**: Current weather overview

### 💬 Chat
- Real-time chat with AI
- Farming-specific knowledge
- Support for multiple languages
- Offline message drafting

---

## Styling

### Color Scheme
- **Primary Green**: `#10b981` (Agriculture)
- **Dark Background**: `#111827` (Accessibility)
- **Text**: `#ffffff` / `#f3f4f6`
- **Accent**: `#f59e0b` (Warnings)
- **Danger**: `#ef4444` (Errors)

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## Development Tips

### Local Testing with Backend
1. Start backend: `cd back-end && python main.py`
2. Start frontend: `cd frontend && npm run dev`
3. Frontend will proxy API calls to `http://localhost:8000`

### Browser DevTools
- React DevTools extension for debugging components
- Network tab to monitor API calls
- Application/Storage tab to check localStorage tokens

### Testing Authentication Locally
```javascript
// In browser console
localStorage.setItem('access_token', 'your-test-token');
localStorage.setItem('phone_number', '+251912345678');
// Refresh page to test
```

### Debugging API Issues
```javascript
// Add this to utils/api.js for verbose logging
const apiCall = (endpoint, options) => {
  console.log(`[API] ${options.method} ${endpoint}`);
  return fetch(endpoint, options)
    .then(res => {
      console.log(`[API] Response: ${res.status}`);
      return res.json();
    });
};
```

---

## Performance Optimization

- **Code Splitting**: Lazy loading pages with React.lazy()
- **Image Optimization**: Compressed images in assets/
- **Caching**: Browser caching for API responses
- **MinificationRuntime**: Automatic with Vite production build

---

## Build & Deployment

### Build for Production
```bash
npm run build
```

Creates optimized build in `dist/` folder

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production
Set these in your hosting platform:
- `VITE_API_URL` → Your production backend URL
- `VITE_GROQ_API_KEY` → Your Groq API key
- `VITE_WEATHER_API_KEY` → Your weather service API key

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Android)

---

## Troubleshooting

### "Cannot POST /register" error
- Ensure backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in `.env`
- Backend CORS must allow `http://localhost:5173`

### "Image upload fails"
- Check file size (should be < 10MB)
- Verify file format is JPG/PNG/WebP
- Check backend `/analyze` endpoint status

### "Token expired" error
- Refresh the page
- Use refresh token to get new access token
- Re-login if necessary

### "Context is undefined" error
- Ensure context provider wraps the component
- Check `App.jsx` has context provider setup

---

## Contributing

1. Create a new branch for features: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## License

MIT License - See LICENSE file

## Support

For issues or questions, please open a GitHub issue or contact the development team.

---

## Changelog

### Version 1.0.0 (May 2024)
- Initial release
- Authentication with phone number
- Disease and pest scanning
- Weather integration
- User profiles
- Scan history
- AI chat support
	- Drag-and-drop works.
	- Clicking Camera triggers device camera on supported mobile browsers.
	- Analysis result appears (simulated) and `Save to History` persists to `localStorage`.

Where to go next
- Wire `Scan` uploads to the backend API (ask me and I can add a sample `fetch` and `.env` usage).
- Add a `History` page to list saved scans from `localStorage`.

License
- MIT (project-level license should be managed at repository root)

Happy hacking — open an issue or ask me to implement the backend upload integration.
