# Men's Fashion Closet

A premium, digital wardrobe manager designed to help you organize your clothes and generate weather-appropriate outfits effortlessly.

![Men's Fashion Closet Preview](./screenshot_preview.png)
*(Note: Screenshot to be added by user)*

## Features

- **Digital Inventory**: Organize your wardrobe into categories (Tops, Bottoms, Outerwear, Footwear) with a sleek, responsive grid layout.
- **Outfit Generator**: Get a "Look of the Day" generated from your closet. The generator smartly pairs items based on category and style.
- **Weather Integration**: 
  - Real-time weather fetching using your location (via [Open-Meteo](https://open-meteo.com/)).
  - Smart Outfit Filtering: Suggests layers for cold weather and avoids heavy fabrics in the heat.
  - Displays temperature in both Celsius (°C) and Fahrenheit (°F) along with rain probability.
- **Add Item Workflow**: 
  - Upload photos of your own clothes.
  - Tag items with customizable "Vibes" (Casual, Formal, Business, etc.).
  - Select item colors to visualize your wardrobe palette.
- **Data Persistence**: Your closet data is saved locally in your browser, so you don't lose your items on refresh.

## Tech Stack

This project is built with a modern, performance-focused stack:

- **Frontend Framework**: [React](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/) - For lightning-fast development and building.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Using the latest engine for zero-runtime overhead and a custom "Dark Slate & Cream" theme.
- **Icons**: [Lucide React](https://lucide.dev/) - Clean, consistent iconography.
- **Weather API**: [Open-Meteo](https://open-meteo.com/) - Free, open-source weather API (no API key required).

## Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AniGP/mens-fashion-closet.git
    cd mens-fashion-closet
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to view the app.

## Project Structure

- `src/components/`: Contains functional components (Inventory, OutfitGenerator, AddItemForm).
- `src/App.jsx`: Main application logic and state management.
- `src/index.css`: Global styles and Tailwind configuration.

## License

MIT
