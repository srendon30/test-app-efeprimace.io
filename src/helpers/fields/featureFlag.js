const featureFlagFields = [
    {
      type_element: "text",
      id: "nombre",
      name: "nombre",
      label: "Nombre",
      cols_desktop: "md:basis-2/4",
      cols_mobile: "basis-full",
      can_edit: false,
    },
    {
      type_element: "text",
      id: "descripcion",
      name: "descripcion",
      label: "Descripción",
      cols_desktop: "md:basis-2/4",
      cols_mobile: "basis-full",
    },
    {
      type_element: "switch",
      id: "is_active",
      name: "is_active",
      label: "Activo",
    },
  ];
  
  export default featureFlagFields;
  