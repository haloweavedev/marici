# Marici: Cosmic Moon Dashboard

**Marici** (named after the Buddhist goddess of light and the dawn) is a lightweight, single-page "Moon Dashboard" built with pure, vanilla web technologies. It provides real-time astrological and astronomical data about the moon, visualized with a dynamic, phase-accurate rendering.

![Moon Dashboard Preview](https://via.placeholder.com/800x400?text=Marici+Moon+Dashboard+Preview)

## ✨ Features

*   **Real-Time Moon Phase**: precise calculation of the current lunar phase using `astronomy-engine`.
*   **Dynamic Visuals**: A custom SVG representation that updates dynamically to show the correct shadow terminator and illumination angle.
*   **Astrological Insights**: Displays the Moon's current Tropical Zodiac sign and exact degree (e.g., "Moon in Cancer at 24°").
*   **Geolocation-Aware**: Automatically detects the user's latitude and longitude to provide topocentric accuracy for the observer, with a graceful fallback to Greenwich.
*   **Zero Dependencies**: Runs entirely in the browser with no build step, no Node.js, and no bundlers required.

## 🚀 How to Run

Since this is a static HTML file with no build requirements, you can run it in two ways:

1.  **Directly**: Simply double-click `index.html` to open it in your default web browser.
2.  **Local Server** (Optional): If you prefer, you can serve it using Python or any static host:
    ```bash
    # Python 3
    python3 -m http.server
    ```

## 🛠️ Technology Stack

*   **HTML5 & CSS3**: Custom layout using CSS Variables, Flexbox, and Glassmorphism design principles.
*   **Vanilla JavaScript (ES6+)**: Logic for DOM manipulation and data binding.
*   **[Astronomy Engine](https://github.com/cosinekitty/astronomy)**: A rigorous C++/JS library for astronomical calculations.

## 🔮 Astrological Note

The dashboard uses the **Tropical Zodiac** system for sign calculations, aligning with standard Western astrology. The moon phase visuals are geocentric but adjusted for the observer's location (topocentric) when available.

## 📄 License

MIT © [haloweavedev](https://github.com/haloweavedev)
