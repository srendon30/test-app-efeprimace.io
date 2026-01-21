const aprobarRechazarVacacionFields = [
  {
    type_element: "single-checkbox",
    id: "estado",
    name: "estado",
    label: "Estado",
    items_select: ["APROBADO", "RECHAZADO"],
  },
  {
    type_element: "textarea",
    id: "obs",
    name: "obs",
    label: "Observación",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    required: false,
  },
];

export default aprobarRechazarVacacionFields;
