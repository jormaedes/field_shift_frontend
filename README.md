# 🌱 Field Shift — Frontend

An interactive decision-support web application for smallholder farmers, built for the **NASA Space Apps Challenge 2026** (Challenge 7: *Field Shift*).

The application assists smallholder farmers and agricultural extension workers in Angola (and the Global South) in evaluating and comparing crop rotation strategies by combining local farming context with NASA Earth observation data and verified agronomic benchmarks.

---

## 🔗 Backend Repository & Integration

The frontend operates in close coordination with the team's backend service:

* 📦 **Backend Repository:** [https://github.com/OAlicio/Nasa_Space](https://github.com/OAlicio/Nasa_Space)
* 📡 **Decoupled Architecture:** The frontend **never** makes direct requests to external satellite or weather APIs (such as NASA POWER, MODIS, etc.). All data ingestion, aggregation, and agronomic scoring models are processed by the backend through the `/api/analises` REST endpoint.
* 🧪 **Autonomous Development & Demo (Mock Mode):** The frontend includes built-in mock support (`NEXT_PUBLIC_USE_MOCK=true`), allowing full testing and demonstration of the interface and workflows without requiring a live backend instance.

---

## 🎯 Key Features

1. **Geospatial Mapping & Plot Delineation:**
   * Interactive boundary drawing using polygon tools (`leaflet-draw`).
   * Real-time plot area calculation in hectares and km² via `@turf/area`.
   * User geolocation centering (`navigator.geolocation`).
   * High-resolution **Sentinel-2 Cloudless (EOX)** basemap with compliant attribution.
   * Overlay-ready for NASA GIBS (*Global Imagery Browse Services*).

2. **Accessible, Mobile-First Agroclimatic Wizard:**
   * Step-by-step assessment of current conditions (standing crop, planting date, typical crop, irrigation access, and soil texture).
   * Prioritization of agricultural goals (soil health, water conservation, erosion control, and yield improvement).
   * Customizable planning horizon (1 to 3 agricultural seasons).

3. **Evidence-Based Strategy Recommendations:**
   * **Strategy A (Reference):** The farmer's current or regionally typical crop rotation sequence.
   * **Strategies B & C (Optimized Alternatives):** Tailored sequences aimed at the selected agronomic targets.
   * Each strategy clearly presents:
     * **Why** the sequence was selected;
     * **Data Evidence** from Earth observation datasets;
     * **Expected Benefits** for soil and crop yield;
     * **Information Gaps**;
     * **Risks to Validate Locally**.

4. **Rainfall & Soil Condition Visualizations:**
   * Monthly precipitation comparison charts (historical baseline vs. current season) using Recharts.
   * Current soil moisture relative to typical baseline levels.
   * Slope and bare-soil indicators.

5. **Local Assumption Validation & Recalculation:**
   * Interactive panel allowing users to adjust baseline assumptions (soil type, irrigation, planting dates) and recalculate recommendations instantly without triggering redundant satellite API requests.

6. **Internationalization (i18n) & Accessibility:**
   * Bilingual support with **English (`en`)** as the primary default language and **Portuguese (`pt-PT`)**.
   * Responsive layout optimized for mobile screens, touch interaction, and low-bandwidth environments.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Mapping & GIS:** [Leaflet](https://leafletjs.com/), [React-Leaflet](https://react-leaflet.js.org/), [Leaflet-Draw](https://github.com/Leaflet/Leaflet.draw)
* **Geospatial Calculations:** [Turf.js](https://turfjs.org/) (`@turf/area`, `@turf/centroid`, `@turf/bbox`)
* **Charts & Data Visualization:** [Recharts](https://recharts.org/)
* **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v20.x or higher recommended.
* **npm** (or your preferred package manager).

### 1. Clone the repository
```bash
git clone https://github.com/jluis/field_shift_frontend.git
cd field_shift_frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory by copying the example template:

```bash
cp .env.example .env.local
```

Available environment variables:
```env
# Backend API address (https://github.com/OAlicio/Nasa_Space)
NEXT_PUBLIC_API_URL="http://localhost:4000"

# Toggle between local mock data and real backend:
# true  -> Uses sample data from src/mocks/analise.v1.json (ideal for UI testing without the backend)
# false -> Sends live requests to NEXT_PUBLIC_API_URL
NEXT_PUBLIC_USE_MOCK=true
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Available Scripts
* `npm run dev`: Starts the Next.js development server with Turbopack.
* `npm run build`: Generates an optimized production build.
* `npm run start`: Runs the built production server.
* `npm run lint`: Runs ESLint to verify code quality.

---

## 📁 Directory Structure

```text
src/
├── app/                      # Application routes (Next.js App Router)
│   ├── dashboard/            # Interactive dashboard with map and analysis flow
│   ├── layout.tsx            # Global layout, fonts, and language context provider
│   └── page.tsx              # Landing page
├── components/
│   ├── dashboard/            # Wizard forms, strategy cards, charts, and assumptions panel
│   ├── landing/              # Explanatory sections and hero components for the landing page
│   ├── map/                  # Leaflet-based interactive mapping and drawing canvas
│   └── ui/                   # Reusable interface primitives (buttons, toggles, badges)
├── lib/
│   ├── api.ts                # Unified API client for backend communication and mock handling
│   ├── geo.ts                # Coordinate system conversions and Turf.js calculations
│   └── i18n.ts               # Translation dictionaries and internationalization helpers (EN / PT)
├── mocks/
│   └── analise.v1.json       # Representative mock dataset for offline and demo mode
└── types/
    └── analysis.ts           # TypeScript definitions matching the backend API contract
```

---

## 🛰️ Data Sources & Attributions

* **NASA GIBS** (*Global Imagery Browse Services*): Global satellite visual overlays.
* **NASA POWER**: Meteorological and solar radiation time series (precipitation, surface temperature).
* **MODIS / ORNL DAAC**: Normalized Difference Vegetation Index (NDVI) and land surface dynamics.
* **EOxCloudless**: Cloudless Sentinel-2 imagery by EOX IT Services GmbH (contains modified Copernicus Sentinel data, under CC BY-NC-SA 4.0 license).
* **FAO**: Crop growth cycles, water coefficients, and agronomic thresholds from FAO Crop Information and FAO-56.

---

## ⚠️ Important Disclaimers & Ethics

* **Decision Support, Not Replacement:** This tool is designed to support the farmer's decision-making process. It **does not replace** local indigenous knowledge, field observation, or certified agricultural extension technicians.
* **No Weather Forecasts:** The application does not provide weather forecasts. It displays historical weather patterns and what has already been observed in the current growing season.
* **Spatial Resolution:** Rainfall, temperature, and soil moisture values are regional estimates averaged over grid cells of approximately 50 km. Vegetation values represent an average across the delineated plot.
* **Data Privacy:** Farm boundary coordinates and input data are treated as private. They are not stored persistently in the browser or shared without user consent.

---

## 👥 NASA Space Apps Challenge 2026

* **Challenge:** Challenge 7 — *Field Shift*
* **Frontend:** Developed by Jormaedes Luís ([field_shift_frontend](https://github.com/jluis/field_shift_frontend))
* **Backend & Agronomic Data Modeling:** [OAlicio/Nasa_Space](https://github.com/OAlicio/Nasa_Space)
