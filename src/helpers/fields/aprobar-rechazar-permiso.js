const aprobarRechazarPermisoFields = [
  {
    type_element: "single-checkbox",
    id: "estado_jefe",
    name: "estado_jefe",
    label: "Estado",
    items_select: ["APROBADO", "RECHAZADO"],
  },
  {
    type_element: "textarea",
    id: "observacion_jefe",
    name: "observacion_jefe",
    label: "Observación",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    required: false,
  },
];

export default aprobarRechazarPermisoFields;
