import { site } from "./site";

export const team = [
  {
    role: "Dirección científica",
    focus: "Diseño de la red y preguntas sobre la capa límite de Lima.",
    status: "Por designar",
  },
  {
    role: "Calidad del aire",
    focus: "Partículas finas, gases y cómo se comparan los distritos.",
    status: "Por designar",
  },
  {
    role: "Instrumentación y drones",
    focus: "Perfiles verticales, plan de vuelo y bitácora del dron.",
    status: "Por designar",
  },
  {
    role: "Meteorología",
    focus: "Temperatura, humedad y la brisa que entra desde el Pacífico.",
    status: "Por designar",
  },
  {
    role: "Datos",
    focus: "Series de tiempo, control de calidad y el índice orientativo.",
    status: "Por designar",
  },
  {
    role: "Operación de campo",
    focus: "Instalación de estaciones, energía y visitas de mantenimiento.",
    status: "Por designar",
  },
];

export const lines = [
  {
    id: "drones",
    numeral: "01",
    title: "Drones y perfiles verticales",
    summary:
      "Un transecto entre la Costa Verde y Ate, con ascensos y descensos en los primeros 200 metros.",
    body: "La pregunta es si el material particulado se queda debajo de la inversión de la capa marina o si se mezcla al subir. El dron de este prototipo recorre un circuito Miraflores–San Isidro–San Borja–La Molina–Ate y vuelve por Surco y Barranco. La altitud oscila entre unos 55 m y 200 m, dos veces por vuelta, para un perfil vertical a lo largo del mismo recorrido horizontal. La velocidad que se ve en el mapa está acelerada, para que el movimiento sea visible; un multirrotor de campaña iría cerca de 12 m/s.",
  },
  {
    id: "sensores",
    numeral: "02",
    title: "Sensores meteorológicos y de gases",
    summary:
      "Temperatura, humedad, ozono y dióxido de nitrógeno junto a las partículas.",
    body: "El ozono en Lima suele subir hacia el mediodía, cuando hay sol, y el dióxido de nitrógeno acompaña el tráfico de la mañana y de la tarde. La humedad alta de la costa importa porque cambia cómo se comportan los sensores de bajo costo. Este prototipo genera esas variables con un ciclo diurno plausible. No hay calibración contra un instrumento de referencia: eso queda como trabajo de campo, no como un resultado de esta página.",
  },
  {
    id: "aire",
    numeral: "03",
    title: "Calidad del aire urbano",
    summary:
      "Ocho puntos fijos, del Callao a Ate y de Carabayllo a Villa María del Triunfo.",
    body: "La red piloto contrasta la costa, el centro, el puerto y los distritos del este y del norte, donde el polvo y el tráfico pesan más. El color de cada estación es un índice orientativo calculado con PM2.5 y PM10 de los últimos minutos, con los puntos de corte habituales del ICA. No es el índice oficial de 24 horas del Ministerio del Ambiente, ni un aviso sanitario. Sirve para ver, en el mismo reloj, qué distrito está más cargado.",
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
    title: "Perfil vertical de PM2.5 sobre la costa de Lima: ficha de ejemplo",
    authors: "Autor/a, A.; Autor/a, B.",
    venue: "Revista por confirmar",
    year: 2026,
    doi: "10.0000/gia.ejemplo.0001",
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
    title: "Notas de calibración de un sensor de NO2 en humedad alta",
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
