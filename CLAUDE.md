# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**godrays** (repo name: marici) is a Moon Dashboard web application that displays real-time lunar phase data, zodiac positions, and AI-generated astrological insights. The application consists of a static frontend served by an Express backend that handles API calls securely.

## Commands

### Development
```bash
npm start              # Start Express server on port 3000 (default)
```

### Environment Setup
- Create a `.env` file in the root with `GROQ_API_KEY` for AI wisdom feature
- The `.env` file is gitignored and should never be committed

## Architecture

### Backend (server.js)
- **Express server** serving static files from `public/` directory
- **Single API endpoint**: `POST /api/wisdom` - generates astrological insights using Groq's LLaMA model
- **Environment**: CommonJS (not ES modules)
- **Dependencies**: express, cors, dotenv, groq-sdk

### Frontend (public/index.html)
- **Single-file application**: All HTML, CSS, and JavaScript in one file
- **No build process**: Vanilla JavaScript, no bundlers or transpilation
- **External libraries loaded via CDN**:
  - `astronomy-engine@2.1.19` - Lunar calculations and ephemeris data
  - `three.js r128` - 3D moon rendering with lighting/shadow simulation
- **Textures**: Moon surface textures stored in `public/img/` (moon_texture.jpg, moon_displacement.jpg)

### Key Frontend Components

#### Moon Calculations (Astronomy Engine)
- `Astronomy.Illumination()` - Gets phase angle and illumination percentage
- `Astronomy.GeoVector()` + `Astronomy.Ecliptic()` - Calculates tropical zodiac position
- Uses browser geolocation API for topocentric accuracy (falls back to Greenwich coordinates)

#### 3D Rendering (Three.js)
- `initThreeJS()` - One-time scene setup with sphere geometry, phong material, and 5-layer lighting system
- `updateThreeJSMoon(phaseAngle, lat)` - Positions directional light to match real lunar phase
- **Light architecture**:
  1. Ambient light (deep space base)
  2. Hemisphere light (sky gradient)
  3. Fill light (earthshine simulation)
  4. Rim light (godray edge effect)
  5. Main directional light (sun position, rotates based on phase angle)

#### UI States
- **Loading overlay**: Shows pulsing moon animation while waiting for geolocation and library initialization
- **Main container**: Fades in after data loads, strict 100vh layout with no scroll
- **Responsive design**: Uses viewport units (vh/vmin) and clamp() for mobile-first scaling

### Data Flow
1. Page load → `init()` requests geolocation
2. Geolocation success/timeout → `updateDashboard(lat, lon)`
3. Calculate moon phase, zodiac, illumination using astronomy-engine
4. Initialize Three.js scene and position lights
5. User clicks "Receive Cosmic Wisdom" → `POST /api/wisdom` with phase + sign
6. Server calls Groq API → Returns mystical insight based on celestial data

## Design Principles

- **No over-engineering**: Single HTML file, no abstractions, minimal complexity
- **Glassmorphism aesthetic**: backdrop-filter, subtle shadows, accent color #c4d7ed
- **Mobile-first responsive**: Strict 100vh layout, no body scroll, internal card overflow only
- **Vanilla approach**: No frameworks, no build tools, direct DOM manipulation
