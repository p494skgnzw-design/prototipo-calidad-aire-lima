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
      "Un modelo atmosférico de resolución espacial de metros para determinar la calidad del aire",
    body: "La meteorología y las partículas son introducidas a un modelo atmosférico de alta resolución para determinar la calidad del aire a nivel de edificios",
  },
];

export const projects = [
  {
    title: "Calidad del aire en Mi Peru, Callao",
    status: "Prototipo 1",
    summary: "Despliegue del sistema de mediciones Condor 1.",
  },
  {
    title: "Dinámica de los vientos, San Miguel, Lima",
    status: "Prototipo 2",
    summary:
      "Despliegue del sistema de mediciones Condor 2.",
  },
  {
    title: "Incendios Forestales, Paruro, Cusco",
    status: "Prototipo 3",
    summary: "Despliegue del sistema de mediciones Condor 3",
  },
  {
    title: "Cenizas Volcanicas, Yura, Arequipa",
    status: "Prototipo 4",
    summary: "Despliegue del sistema de mediciones Condor 4",
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
  { name: "u,v,w", unit: "m/s", why: "Vector de viento. Los vientos son dinámicos cambian minuto a minuto." },
  { name: "Presión", unit: "Pa", why: "Presión atmosférica a distintas alturas." },
  { name: "Temperatura", unit: "°C", why: "Temperatura a distintas alturas asociada a la estabilidad atmosférica." },
  { name: "Humedad relativa", unit: "%", why: "La humedad relativa a distintas alturas indica el potencial de formación de nubes" },
];
