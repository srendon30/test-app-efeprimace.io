import { useBusinessStore } from "@/stores/business";

const { getNextCodigoProyecto } = useBusinessStore();

const proyectosFields = [
  {
    type_element: "text",
    id: "codigo",
    name: "codigo",
    label: "Código",
    can_edit: false,
    default_value: async () => {
      const data = await getNextCodigoProyecto();
      return data.codigo;
    },
    disabled: true,
  },
  {
    type_element: "text",
    id: "nombre_proyecto",
    name: "nombre_proyecto",
    label: "Nombre del Proyecto",
    cols_desktop: "md:basis-1/2",
    cols_mobile: "basis-full",
  },
  {
    type_element: "single-select",
    id: "cliente_id",
    name: "cliente_id",
    label: "Cliente",
    api_call: {
      method: "GET",
      endpoint: "api/list/clientes",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "coordinador_diseno_id",
    name: "coordinador_diseno_id",
    label: "Coordinador de Diseño",
    api_call: {
      method: "GET",
      endpoint: "api/list/personas",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "lider_diseno_id",
    name: "lider_diseno_id",
    label: "Líder de Diseño",
    api_call: {
      method: "GET",
      endpoint: "api/list/personas",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "coordinador_dibujo_id",
    name: "coordinador_dibujo_id",
    label: "Coordinador de Dibujo",
    api_call: {
      method: "GET",
      endpoint: "api/list/personas",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "lider_dibujo_id",
    name: "lider_dibujo_id",
    label: "Líder de Dibujo",
    api_call: {
      method: "GET",
      endpoint: "api/list/personas",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "pais_id",
    name: "pais_id",
    label: "País",
    api_call: {
      method: "GET",
      endpoint: "api/list/paises",
      params: null,
      headers: null,
    },
  },
  {
    type_element: "single-select",
    id: "departamento_id",
    name: "departamento_id",
    label: "Departamento",
    required: false,
  },
  {
    type_element: "single-select",
    id: "municipio_id",
    name: "municipio_id",
    label: "Municipio",
    required: false,
  },
  // {
  //   type_element: "single-select",
  //   id: "contacto_id",
  //   name: "contacto_id",
  //   label: "Contacto",
  // },
  {
    type_element: "textarea",
    id: "descripcion",
    name: "descripcion",
    label: "Descripción",
  },
];

export default proyectosFields;
