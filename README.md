# Grupo de Investigación Atmosférica (nombre provisional)

Prototipo web de un grupo en Lima que estudia la calidad del aire con estaciones fijas y un dron. Toda la interfaz está en español. Los datos del mapa son simulados.

El nombre público vive solo en [`lib/site.ts`](lib/site.ts) (`name` y `shortName`). El resto del sitio lo importa.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:3847](http://127.0.0.1:3847). El servidor escucha en `0.0.0.0:3847`.

Producción local:

```bash
npm run build
npm run start
```

Copie [`.env.example`](.env.example) a `.env.local` si quiere un token de ingesta o otro intervalo.

## Qué hay en el sitio

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio: misión, líneas y la red |
| `/equipo` | Plazas por designar |
| `/lineas` | Drones, sensores y calidad del aire |
| `/proyectos` | Red piloto, transecto, ingesta, calibración futura |
| `/publicaciones` | Fichas de ejemplo con campo DOI |
| `/datos` | Mapa en vivo, estaciones, dron y series |
| `/contacto` | Formulario que valida y no reenvía correo |

En **Datos en vivo** hay un mapa Leaflet con teselas de OpenStreetMap, centrado en Lima. Ocho estaciones (Centro de Lima, Miraflores, San Borja, Ate, Callao, San Juan de Lurigancho, Villa María del Triunfo y Carabayllo) reportan PM2.5, PM10, O3, NO2, temperatura y humedad relativa. El color sigue un índice orientativo de PM2.5 y PM10. No es el ICA oficial de 24 h.

El dron recorre un circuito Costa Verde → Miraflores → San Isidro → Surquillo → San Borja → La Molina → Ate y vuelve por Surco y Barranco. La altitud sube y baja entre unos 55 m y 200 m. El tramo reciente se colorea según PM2.5. La velocidad del prototipo es 65 m/s para que el movimiento se note; un vuelo real iría cerca de 12 m/s.

Villa María del Triunfo deja de reportar unos 22 segundos de cada 80, para ver el estado «Sin reporte».

Un aviso fijo dice: **Datos simulados / preliminares, sin validar**.

## Cómo se mueven los datos

```
simulador (lib/model.ts, función del reloj de Lima)
        o
POST /api/ingest  ──►  MemoryStore (lib/store.ts)
                              │
                              ▼
                    GET /api/live     SSE, cada 4 s
                    GET /api/series   últimas horas, para Chart.js
                    GET /api/snapshot una foto JSON
```

El simulador no guarda cada tick: calcula la lectura a partir de la hora. Así el proceso puede reiniciarse y la serie sigue siendo coherente. Las lecturas externas sí se guardan en memoria (un solo proceso de Node, se pierden al reiniciar).

Si llega una lectura externa de una estación conocida, el simulador de esa estación se pausa durante `externalHoldMs` (120 s por defecto, se renueva con cada POST). Pasado ese plazo sin datos, vuelve la simulación. Una estación nueva, con `name`, `lat` y `lon`, aparece en el mapa.

### Ingesta HTTP

`GET /api/ingest` describe el contrato. Ejemplo:

```bash
curl -s -X POST http://127.0.0.1:3847/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "station",
    "stationId": "miraflores",
    "timestamp": "2026-11-22T18:00:00-05:00",
    "pm25": 18.2,
    "pm10": 27.4,
    "o3": 31,
    "no2": 12.5,
    "temperature": 21,
    "humidity": 78
  }'
```

Varias lecturas: el mismo objeto con `"readings": [ { "timestamp", "pm25", ... }, ... ]` (máximo 500).

Dron (`droneId` fijo: `gia-d1`):

```bash
curl -s -X POST http://127.0.0.1:3847/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "drone",
    "droneId": "gia-d1",
    "lat": -12.12,
    "lon": -77.03,
    "altitude": 120,
    "pm25": 14,
    "pm10": 22,
    "o3": 28,
    "no2": 11,
    "temperature": 20.4,
    "humidity": 76
  }'
```

Si `INGEST_TOKEN` está definido, envíe `Authorization: Bearer <token>`.

Identificadores de estación: minúsculas, números y guiones. Las ocho del catálogo están en `lib/model.ts` (`STATIONS`). Coordenadas nuevas deben caer en el área de `site.serviceArea`.

## Conectar sensores de verdad

El punto de extensión es la interfaz `TimeSeriesStore` en [`lib/store.ts`](lib/store.ts). Hoy la implementa `MemoryStore`. La ingesta (`lib/ingest.ts`) y las rutas `/api/live` y `/api/series` no deberían cambiar.

### 1. MQTT hacia esta API

Temas sugeridos:

```
gia/stations/{stationId}/reading
gia/drones/gia-d1/reading
```

El payload es el mismo JSON de arriba. [`scripts/mqtt-bridge.mjs`](scripts/mqtt-bridge.mjs) se suscribe y hace `POST /api/ingest`. Requiere `npm install mqtt` y un broker (por ejemplo Mosquitto). No se instala con el sitio para mantener el arranque en un solo `npm install`.

### 2. Retención: InfluxDB o TimescaleDB

Sustituya `MemoryStore` por un adaptador con los mismos métodos (`appendStation`, `appendDrone`, `stationReadings`, `droneReadings`, `knownExternalStationIds`).

InfluxDB, measurement `air_quality`:

```
air_quality,station_id=miraflores,source=sensor pm25=18.2,pm10=27.4,o3=31,no2=12.5,temperature=21,humidity=78
```

Para el dron, tags `drone_id` y fields `lat`, `lon`, `altitude`.

TimescaleDB:

```sql
CREATE TABLE readings (
  time        timestamptz      NOT NULL,
  station_id  text             NOT NULL,
  source      text             NOT NULL,
  pm25        double precision,
  pm10        double precision,
  o3          double precision,
  no2         double precision,
  temperature double precision,
  humidity    double precision,
  lat         double precision,
  lon         double precision,
  altitude    double precision
);

SELECT create_hypertable('readings', 'time');
```

Otra opción es no pasar por esta API: Telegraf o un consumidor MQTT escriben directo en InfluxDB, y el adaptador solo lee. El mapa sigue pidiendo `GET /api/live` y `GET /api/series`.

### 3. Dejar de simular

Cuando una estación tenga flujo real estable, se puede quitar su generación en `lib/model.ts` o alargar `externalHoldMs` para que no reaparezca el valor simulado entre mensajes. El aviso de datos simulados en `lib/site.ts` (`disclaimer`) debería cambiar cuando el grupo publique mediciones validadas.

## Límites de este prototipo

- Un proceso. El almacén en memoria no se comparte entre réplicas y se borra al reiniciar.
- El índice es orientativo, sobre la lectura reciente, no un ICA normativo.
- La velocidad del dron está acelerada.
- El formulario de contacto no envía correo.
- Las publicaciones y el equipo son marcadores de posición.
