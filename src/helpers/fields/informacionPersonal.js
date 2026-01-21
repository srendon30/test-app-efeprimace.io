const informacionPersonalFields = [
  {
    type_element: "text",
    id: "direccion_domicilio",
    name: "direccion_domicilio",
    label: "Dirección de Domicilio",
  },
  {
    type_element: "single-select",
    id: "pais_domicilio_id",
    name: "pais_domicilio_id",
    label: "País de Domicilio",
    api_call: {
      method: "GET",
      endpoint: "api/list/paises",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "departamento_domicilio_id",
    name: "departamento_domicilio_id",
    label: "Dpto. de Domicilio",
    required: false,
  },
  {
    type_element: "single-select",
    id: "municipio_domicilio_id",
    name: "municipio_domicilio_id",
    label: "Mncipio. de Domicilio",
    required: false,
  },
  {
    type_element: "text",
    id: "telefono_celular",
    name: "telefono_celular",
    label: "Teléfono Celular",
  },
  {
    type_element: "email",
    id: "email",
    name: "email",
    label: "Correo Electrónico",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
  },
];

export default informacionPersonalFields;
