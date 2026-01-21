const usuarioFields = [
  {
    type_element: "single-checkbox",
    id: "role_user",
    name: "role_user",
    label: "Rol de Usuario",
    items_select: ["EMPLEADO", "CLIENTE"],
  },
  {
    type_element: "single-select",
    id: "model_id",
    name: "model_id",
    label: "Model",
    cols_desktop: "md:basis-2/4",
    cols_mobile: "basis-full",
    can_edit: false,
    show: false,
  },
  {
    type_element: "email",
    id: "email",
    name: "email",
    label: "Correo Electrónico",
    cols_desktop: "md:basis-1/3",
    cols_mobile: "basis-full",
  },
];

export default usuarioFields;
