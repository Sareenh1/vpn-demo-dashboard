const http = require("http");
const SERVICES = [
  { id:1, name:"HR Portal",         url:"http://hr.internal",       status:"online"   },
  { id:2, name:"Finance Dashboard", url:"http://finance.internal",  status:"online"   },
  { id:3, name:"Dev Tools",         url:"http://devtools.internal", status:"online"   },
  { id:4, name:"Monitoring",        url:"http://monitor.internal",  status:"degraded" },
];
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const p = new URL(req.url, "http://localhost").pathname;
  if (p === "/health")   return res.end(JSON.stringify({ status:"ok", ts: new Date().toISOString() }));
  if (p === "/services") return res.end(JSON.stringify(SERVICES));
  if (p === "/metrics")  return res.end(JSON.stringify({
    activeConnections: Math.floor(Math.random()*20)+5,
    totalBandwidth: "1.2 GB", uptime: "99.98%"
  }));
  res.statusCode = 404;
  res.end(JSON.stringify({ error:"not found" }));
});
server.listen(4000, () => console.log("Internal API running on :4000"));
