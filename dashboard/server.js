const express = require("express");
const fetch   = require("node-fetch");
const cors    = require("cors");
const path    = require("path");

const app      = express();
const INTERNAL = process.env.INTERNAL_API_URL || "http://localhost:4000";

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res) => {
  const r = { dashboard: "ok", internalApi: "unreachable" };
  try { const x = await fetch(INTERNAL + "/health"); if (x.ok) r.internalApi = "ok"; } catch {}
  res.json(r);
});

app.get("/api/services", async (req, res) => {
  try {
    const x = await fetch(INTERNAL + "/services");
    res.json({ success: true, data: await x.json() });
  } catch {
    res.json({ success: false, error: "Internal API unreachable", data: [] });
  }
});

app.get("/api/metrics", async (req, res) => {
  try {
    const x = await fetch(INTERNAL + "/metrics");
    res.json({ success: true, data: await x.json() });
  } catch {
    res.json({ success: false, data: {} });
  }
});

app.get("/api/vpn/peers", (_req, res) => {
  res.json({ success: true, data: [
    { name:"Alice Laptop",  ip:"10.8.0.2", connected:true,  rx:"45 MB",  tx:"12 MB" },
    { name:"Bob Phone",     ip:"10.8.0.3", connected:false, rx:"8 MB",   tx:"2 MB"  },
    { name:"CI Server",     ip:"10.8.0.4", connected:true,  rx:"102 MB", tx:"55 MB" },
  ]});
});

app.listen(3000, () => console.log("Dashboard running on :3000"));
