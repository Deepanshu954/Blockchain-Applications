# Blockchain Applications Research Platform

A comprehensive interactive research platform exploring blockchain technology, from technical foundations to enterprise applications and future innovations. This Next.js application leverages scrollytelling, 3D visualizations, and interactive data widgets to present a deep dive into distributed ledger technology.

## 🚀 Key Features

*   **Interactive Scrollytelling**: Seamless narrative flow covering Introduction, Background, Architecture, Platforms, Applications, Case Studies, Security, Scalability, and Future Directions.
*   **3D Visualizations**:
    *   Ethereum Sharding & Beacon Chain Animation
    *   Metaverse Architecture
*   **Interactive Widgets**:
    *   Consensus Mechanism Simulators (PoW, PoS)
    *   Cryptography Primitives Explorer
    *   Platform Comparisons (Public vs Private)
    *   Layer 2 Solution Visualizers
*   **Data Dashboards**:
    *   DeFi Protocol Tables & Choice Metrics
    *   CBDC Adoption Maps
    *   Supply Chain Simulations
    *   Real-time style Metric Cards and Grids

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Directory)
*   **UI Library**: [React 19](https://react.dev/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with `tailwindcss-animate`
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) & [Drei](https://github.com/pmndrs/drei)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts & Maps**: [Recharts](https://recharts.org/), [React Simple Maps](https://www.react-simple-maps.io/)
*   **Components**: Radix UI primitives via [shadcn/ui](https://ui.shadcn.com/) patterns.

## 🏁 Getting Started

### Prerequisites

*   Node.js 18.17 or later
*   npm (comes with Node.js) or yarn/pnpm

### Quick Launch

We provide automated launch scripts for your convenience:

**macOS / Linux:**
```bash
./launch.sh
```

**Windows:**
```cmd
launch.bat
```

### Manual Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/blockchain-applications.git
    cd blockchain-applications
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # If you encounter peer dependency issues (common with some React 19 betas), try:
    npm install --legacy-peer-deps
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Project Structure

```bash
├── app/                  # Next.js App Router pages and layouts
├── components/           # React components
│   ├── scrolly/          # Scrollytelling section components
│   ├── visualizations/   # Complex 3D and Data visualizations
│   └── ui/               # Reusable UI primitives (buttons, cards, etc.)
├── public/               # Static assets
└── ...config files
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📚 References

This project aggregates research from over 40+ academic and industry sources, formatted in IEEE style within the References section of the application.
