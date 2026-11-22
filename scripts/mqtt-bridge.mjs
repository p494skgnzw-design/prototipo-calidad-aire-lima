/**
 * Puente de ejemplo: MQTT -> POST /api/ingest
 *
 * No forma parte del arranque del sitio. Instálelo aparte:
 *   npm install mqtt
 *
 *   MQTT_URL=mqtt://localhost:1883 \
 *   INGEST_URL=http://127.0.0.1:3847/api/ingest \
 *   INGEST_TOKEN=un-secreto \
 *   node scripts/mqtt-bridge.mjs
 *
 * Temas esperados (payload = el mismo JSON que documenta el README):
 *   gia/stations/{stationId}/reading
 *   gia/drones/{droneId}/reading
 */

const mqttUrl = process.env.MQTT_URL ?? "mqtt://localhost:1883";
const ingestUrl = process.env.INGEST_URL ?? "http://127.0.0.1:3847/api/ingest";
const token = process.env.INGEST_TOKEN ?? "";

const imported = await import("mqtt").catch(() => {
  console.error("Instale el cliente con: npm install mqtt");
  process.exit(1);
});
const mqtt = imported.default ?? imported;
const client = mqtt.connect(mqttUrl);
client.on("connect", () => {
  client.subscribe(["gia/stations/+/reading", "gia/drones/+/reading"]);
  console.log(`Suscrito. Reenvío a ${ingestUrl}`);
});

client.on("message", async (topic, payload) => {
  let body;
  try {
    body = JSON.parse(payload.toString("utf8"));
  } catch {
    console.error("JSON inválido en", topic);
    return;
  }
  const parts = topic.split("/");
  if (parts[1] === "stations" && !body.stationId) body.stationId = parts[2];
  if (parts[1] === "drones") {
    body.type = "drone";
    if (!body.droneId) body.droneId = parts[2];
  } else if (!body.type) {
    body.type = "station";
  }
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(ingestUrl, { method: "POST", headers, body: JSON.stringify(body) });
  if (!response.ok) {
    console.error(topic, response.status, await response.text());
  }
});
