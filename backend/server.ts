import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes (Step 3) ---
  
  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "HireLocal" });
  });

  // Mocked Search Endpoint (Will be connected to Firestore later)
  app.get("/api/workers/search", (req, res) => {
    const { skill, lat, lng } = req.query;
    // In a real app, we'd use Geofire or Firestore queries here
    res.json({ message: "Searching for " + (skill || "any") + " near " + lat + "," + lng });
  });

  // --- Vite / Static Serving ---
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HireLocal server running at http://localhost:${PORT}`);
  });
}

startServer();
