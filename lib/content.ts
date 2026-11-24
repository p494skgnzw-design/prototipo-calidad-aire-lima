import { site } from "./site";

export const team = [
  {
    role: "Coordinador",
    focus: "Mediciones y Modelamiento Atmosférico",
    status: "Dr. Steven P. Chávez",
  },
  {
    role: "Instrumentación y vuelos",
    focus: "Diseño de elementos de montaje y despegue de drones, planes de vuelo.",
    status: "Rafael Salmavides",
  },
    {
    role: "Meteorología con drones y química atmosférica",
    focus: "Perfiles atmosféricos y análisis químico de partículas finas.",
    status: "Leonarddo Lopez",
  },
  {
    role: "Gestor de Datos de drones",
    focus: "Control de calidad, procesamiento y visualización de datos y manejo de repositorios.",
    status: "Joaquin Lopez",
  },
  {
    role: "Red meteorologíca en superficie",
    focus: "Manejo de red, procesamiento y visualización de datos.",
    status: "Lucero Bocanegra",
  },  
  {
    role: "Operación de campo",
    focus: "Vuelo del dron.",
    status: "Will",
  },
];

export const lines = [
  {
    id: "drones",
    numeral: "01",
    title: "Perfiles atmosféricos con Drones",
    summary:
      "Sensamos la atmosfera metro a metro.",
    body: "Medimos la temperatura, presión, humedad relativa y vector de vientos. La velocidad que se ve en el mapa está acelerada, para que el movimiento sea visible; un multirrotor de campaña iría cerca de 12 m/s.",
  },
  {
    id: "quimica",
    numeral: "02",
    title: "Química de partículas finas",
    summary:
      "Caracterización fisico-química de las partículas finas capturadas con drones",
    body: "Se analizan las partículas finas con metodos químicos en busca de contaminantes ambientales, entre ellos metales pesados.",
  },
  {
    id: "aire",
    numeral: "03",
    title: "Modelamiento de la Calidad del Aire",
    summary:
      "Un modelo atmosférico con información de las mediciones para determinar la calidad del aire",
    body: "La meteorología y las partículas son introducidas a un modelo atmosférico de alta resolución para determinar la calidad del aire a nivel de edificios",
  },
];

export const projects = [
  {
    title: "Red piloto de ocho estaciones",
    status: "En este prototipo",
    summary:
      "Estaciones fijas en Centro de Lima, Miraflores, San Borja, Ate, Callao, San Juan de Lurigancho, Villa María del Triunfo y Carabayllo. Cada una reporta seis variables y un índice orientativo.",
  },
  {
    title: "Transecto con dron costa–este",
    status: "En este prototipo",
    summary:
      "Vuelo simulado sobre el gradiente entre el Pacífico y Ate, con el trayecto reciente coloreado según PM2.5 y la altitud a la vista.",
  },
  {
    title: "Ingesta para sensores reales",
    status: "Listo para conectar",
    summary: `El mismo mapa puede dejar de simular una estación cuando llegan lecturas a POST /api/ingest. El puente MQTT de ejemplo publica en ese contrato. El nombre del grupo, cuando se decida, se cambia solo en la configuración de ${site.shortName}.`,
  },
  {
    title: "Comparación con un método de referencia",
    status: "Paso siguiente",
    summary:
      "Colocar un sensor junto a una estación de referencia, durante varias semanas, y corregir el sesgo. Este sitio no hace esa corrección y no debe leerse como dato validado.",
  },
];

export const publications = [
  {
    title: "Simulating Stratiform Precipitation With Embedded Convection in High‐Elevation Valleys Using LES: The Role of Topographic Detail",
    authors: "Steven Paul Chavez ; Jose Luis Flores Rojas ; Ken Takahashi ; and Fey Yamina Silva",
    venue: "Journal of Geophysical Research: Atmospheres",
    year: 2025,
    doi: "10.1029/2025JD043696",
    example: true,
  },
  {
    title: "Gradiente costa–este de partículas en una red piloto de bajo costo",
    authors: "Autor/a, C.; Autor/a, D.; Autor/a, E.",
    venue: "Congreso por confirmar",
    year: 2026,
    doi: "10.0000/gia.ejemplo.0002",
    example: true,
  },
  {
    title: "Notas de red de monitoreo en Lima durante El Niño 2026-2027",
    authors: "Autor/a, F.",
    venue: "Informe técnico interno",
    year: 2026,
    doi: "10.0000/gia.ejemplo.0003",
    example: true,
  },
];

export const parameters = [
  { name: "PM2.5", unit: "µg/m³", why: "Partículas finas, las que más pesan en el índice." },
  { name: "PM10", unit: "µg/m³", why: "Incluye polvo más grueso, frecuente al este y al norte." },
  { name: "O3", unit: "µg/m³", why: "Ozono. En el modelo sube hacia el mediodía." },
  { name: "NO2", unit: "µg/m³", why: "Dióxido de nitrógeno, ligado al tráfico." },
  { name: "Temperatura", unit: "°C", why: "Marca el ciclo diurno y baja con la altitud del dron." },
  { name: "Humedad relativa", unit: "%", why: "Alta en la costa y de noche; relevante para el sensor." },
];
