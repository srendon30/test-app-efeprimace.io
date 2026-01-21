const habitosSaludablesFields = [
  {
    type_element: "single-checkbox",
    id: "ingerir_menos_alcohol",
    name: "ingerir_menos_alcohol",
    label:
      "¿Ha sentido alguna vez que debe ingerir menor cantidad de bebidas alcohólicas?",
    items_select: ["SI", "NO"],
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-checkbox",
    id: "molestias_ingerir_alcohol",
    name: "molestias_ingerir_alcohol",
    label:
      "¿Le ha molestado que la gente lo critique por su forma de ingerir bebidas alcohólicas?",
    items_select: ["SI", "NO"],
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-checkbox",
    id: "culpa_ingerir_alcohol",
    name: "culpa_ingerir_alcohol",
    label:
      "¿Alguna vez se ha sentido mal por su forma de ingerir bebidas alcohólicas?",
    items_select: ["SI", "NO"],
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-checkbox",
    id: "ingerir_alcohol_manana",
    name: "ingerir_alcohol_manana",
    label:
      "¿Alguna vez ha sentido la necesidad de ingerir bebidas alcohólicas en la mañana?",
    items_select: ["SI", "NO"],
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-checkbox",
    id: "actividad_fisica_30min",
    name: "actividad_fisica_30min",
    label:
      "¿Practica actividad física por lo menos 3 veces a la semana por 30 minutos mínimo?",
    items_select: ["SI", "NO"],
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-checkbox",
    id: "fumador",
    name: "fumador",
    label: "¿Usted es fumador?",
    items_select: ["SI", "NO"],
  },
  {
    type_element: "single-checkbox",
    id: "exfumador",
    name: "exfumador",
    label: "¿Usted es exfumador?",
    items_select: ["SI", "NO"],
  },
];

export default habitosSaludablesFields;
