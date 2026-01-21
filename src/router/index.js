import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/404",
      name: "404",
      component: () => import("../views/404/404.vue"),
    },
    {
      path: "/",
      redirect: () => {
        return "/login";
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
    },
    {
      path: "/reset-password",
      name: "reset-password",
      component: () => import("../views/auth/ResetPassword.vue"),
    },
    {
      path: "/reset-password-form",
      name: "reset-password-form",
      component: () => import("../views/auth/ResetPasswordForm.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("../views/home/Home.vue"),
    },
    {
      path: "/perfil",
      name: "perfil",
      component: () => import("../views/perfil/Perfil.vue"),
    },
    // Gestión Humana -> Personal
    {
      path: "/personal",
      children: [
        {
          path: "nueva-persona",
          name: "nueva-persona",
          component: () => import("../views/personal/NuevaPersona.vue"),
        },
        {
          path: "listado-personas",
          name: "listado-personas",
          component: () => import("../views/personal/ListadoPersonas.vue"),
        },
      ],
    },
    // Gestión Humana -> Contratos
    {
      path: "/contratos",
      children: [
        {
          path: "nuevo-contrato",
          name: "nuevo-contrato",
          component: () => import("../views/contratos/NuevoContrato.vue"),
        },
        {
          path: "listado-contratos",
          name: "listado-contratos",
          component: () => import("../views/contratos/ListadoContratos.vue"),
        },
      ],
    },
    // Gestión Humana -> Usuarios
    {
      path: "/usuarios",
      children: [
        {
          path: "crear-usuario",
          name: "crear-usuario",
          component: () => import("../views/usuarios/CrearUsuario.vue"),
        },
        {
          path: "listado-usuarios",
          name: "listado-usuarios",
          component: () => import("../views/usuarios/ListadoUsuarios.vue"),
        },
      ],
    },
    // Gestión Humana -> Permisos
    {
      path: "/permisos",
      children: [
        {
          path: "nuevo-permiso",
          name: "nuevo-permiso",
          component: () => import("../views/permisos/NuevoPermiso.vue"),
        },
        {
          path: "listado-permisos",
          name: "listado-permisos",
          component: () => import("../views/permisos/ListadoPermisos.vue"),
        },
        {
          path: "historial-permisos",
          name: "historial-permisos",
          component: () => import("../views/permisos/HistorialPermisos.vue"),
        },
      ],
    },
    // Gestión Humana -> Incapacidades
    {
      path: "/incapacidades",
      children: [
        {
          path: "nueva-incapacidad",
          name: "nueva-incapacidad",
          component: () =>
            import("../views/incapacidades/NuevaIncapacidad.vue"),
        },
        {
          path: "listado-incapacidades",
          name: "listado-incapacidades",
          component: () =>
            import("../views/incapacidades/ListadoIncapacidades.vue"),
        },
      ],
    },
    // Gestión Humana -> Vacaciones
    {
      path: "/vacaciones",
      children: [
        {
          path: "solicitar-vacaciones",
          name: "solicitar-vacaciones",
          component: () => import("../views/vacaciones/NuevaVacacion.vue"),
        },
        {
          path: "listado-vacaciones",
          name: "listado-vacaciones",
          component: () => import("../views/vacaciones/ListadoVacaciones.vue"),
        },
        {
          path: "historial-vacaciones",
          name: "historial-vacaciones",
          component: () =>
            import("../views/vacaciones/HistorialVacaciones.vue"),
        },
      ],
    },
    // Gestión Humana -> Encuestas Satisfacción
    {
      path: "/encuestas-satisfaccion",
      children: [
        {
          path: "invitaciones",
          name: "invitaciones",
          component: () =>
            import(
              "../views/encuestas-satisfaccion/InvitacionEncuestaSatisfaccion.vue"
            ),
        },
        {
          path: "respuestas",
          name: "respuestas",
          component: () =>
            import(
              "../views/encuestas-satisfaccion/RespuestasEncuestaSatisfaccion.vue"
            ),
        },
      ],
    },
    // Gestión Humana -> Licencias
    {
      path: "/licencias",
      children: [
        {
          path: "nueva-licencia",
          name: "nueva-licencia",
          component: () => import("../views/licencias/NuevaLicencia.vue"),
        },
        {
          path: "listado-licencias",
          name: "listado-licencias",
          component: () => import("../views/licencias/ListadoLicencias.vue"),
        },
      ],
    },
    // Gestión Humana -> Reportes
    {
      path: "/reportes-gh",
      name: "reportes-gh",
      component: () => import("../views/reportes/ReportesGestionHumana.vue"),
    },
    // Gestión Humana -> Perfil Sociodemográfico
    {
      path: "/perfil-sociodemografico",
      name: "perfil-sociodemografico",
      component: () =>
        import("../views/perfil-sociodemografico/PerfilSociodemografico.vue"),
    },
    // Gestión Humana -> Categorización
    {
      path: "/categorizacion",
      name: "categorizacion",
      component: () => import("../views/categorizacion/Categorizacion.vue"),
    },
    // Gestión Proyectos -> Clientes
    {
      path: "/clientes",
      children: [
        {
          path: "nuevo-cliente",
          name: "nuevo-cliente",
          component: () => import("../views/clientes/NuevoCliente.vue"),
        },
        {
          path: "listado-clientes",
          name: "listado-clientes",
          component: () => import("../views/clientes/ListadoClientes.vue"),
        },
      ],
    },
    // Gestión Proyectos -> Usuarios Bloqueados
    {
      path: "/usuarios-bloqueados",
      name: "usuarios-bloqueados",
      component: () =>
        import("../views/usuarios-bloqueados/UsuariosBloqueados.vue"),
    },
    //Gestión Proyectos -> Proyectos
    {
      path: "/proyectos",
      children: [
        {
          path: "nuevo-proyecto",
          name: "nuevo-proyecto",
          component: () => import("../views/proyectos/NuevoProyecto.vue"),
        },
        {
          path: "listado-proyectos",
          name: "listado-proyectos",
          component: () => import("../views/proyectos/ListadoProyectos.vue"),
        },
      ],
    },
    // Gestión Proyectos -> Estructuras
    {
      path: "/estructuras/:proyecto_id",
      name: "estructuras",
      component: () => import("../views/estructuras/ListadoEstructuras.vue"),
    },
    // Gestión Proyectos -> Ordenes Trabajo
    {
      path: "/ordenes/:estructura_id",
      name: "ordenes",
      component: () => import("../views/ordenes/ListadoOrdenes.vue"),
    },
    // Gestión Proyectos -> Planeación
    {
      path: "/planeacion",
      name: "planeacion",
      component: () => import("../views/planeacion/Planeacion.vue"),
    },
    // Gestión Proyectos -> Planeación Sugerida
    {
      path: "/planeacion-sugerida/:orden_id",
      name: "planeacion-sugerida",
      component: () => import("../views/planeacion/PlaneacionSugerida.vue"),
    },
    // Gestión Proyectos -> Planeación Aplicada
    {
      path: "/planeacion-aplicada/:orden_id",
      name: "planeacion-aplicada",
      component: () => import("../views/planeacion/PlaneacionAplicada.vue"),
    },
    // Gestión de Proyectos -> Ocupación Personal
    {
      path: "/ocupacion-personal",
      name: "ocupacion-personal",
      component: () =>
        import("../views/ocupacion-personal/OcupacionPersonal.vue"),
    },
    // Gestión de Proyectos -> Dashboard
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../views/dashboard/Dashboard.vue"),
    },
    // Gestión Proyectos -> Mis Actividades
    {
      path: "/mis-actividades",
      name: "mis-actividades",
      component: () => import("../views/mis-actividades/Actividades.vue"),
    },
    // Gestión Proyectos -> Mis Actividades Generales
    {
      path: "/mis-actividades-generales",
      name: "mis-actividades-generales",
      component: () =>
        import("../views/mis-actividades/MisActividadesGenerales.vue"),
    },
    // Gestión Proyectos -> Mis Reportes
    {
      path: "/mis-reportes-actividades",
      name: "mis-reportes-actividades",
      component: () => import("../views/mis-reportes/MisReportes.vue"),
    },
    // Gestión Proyectos -> Calendario
    {
      path: "/calendario",
      name: "calendario",
      component: () => import("../views/404/Building.vue"),
    },
    //Configuración
    {
      path: "/configuracion",
      name: "configuracion",
      component: () => import("../views/configuracion/Configuracion.vue"),
    },
    {
      path: "/tipos-estructuras",
      name: "tipos-estructuras",
      component: () => import("../views/404/Building.vue"),
    },
    {
      path: "/tipos-cimentaciones",
      name: "tipos-cimentaciones",
      component: () => import("../views/404/Building.vue"),
    },

    //CLIENTES ROUTES
    {
      path: "/encuesta-satisfaccion",
      name: "encuesta-satisfaccion",
      component: () =>
        import("../views/encuesta-satisfaccion/EncuestaSatisfaccion.vue"),
    },
    {
      path: "/mis-proyectos",
      name: "mis-proyectos",
      component: () => import("../views/clientes/MisProyectos.vue"),
    },
    {
      path: "/configuracion",
      children: [
        {
          path: "feature-flags",
          name: "feature-flags",
          component: () => import("../views/configuracion/FeatureFlags.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  let validRoutes = [];

  // Función para agregar rutas y sus hijos a validRoutes como rutas válidas
  const addRoutes = (routes, parentPath = "") => {
    routes.forEach((route) => {
      const fullPath =
        parentPath +
        (route.path.startsWith("/") ? route.path : "/" + route.path);
      validRoutes.push(fullPath);

      if (route.children) {
        addRoutes(route.children, fullPath);
      }
    });
  };

  // Agregar todas las rutas instanciadas y sus hijos como rutas válidas
  addRoutes(router.options.routes);

  // Si el usuario no está auntenticado y está intentando acceder a una ruta de la aplicación, redirigir al login
  if (
    !authStore.isAuthenticated &&
    to.path !== "/login" &&
    to.path !== "/reset-password" &&
    to.path !== "/reset-password-form"
  ) {
    return next("/login");
  }

  // Si el usuario está autenticado y está intentando acceder a la ruta de login, reset-password o reset-password-form, redirigir a home
  if (
    authStore.isAuthenticated &&
    (to.path === "/" ||
      to.path === "/login" ||
      to.path === "/reset-password" ||
      to.path === "/reset-password-form")
  ) {
    return next("/home");
  }

  // Verificar si la ruta es válida, y pertenece a las rutas definidas en el index.js
  const isValidRoute = validRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace(/:\w+/g, "\\w+")}$`);
    return regex.test(to.path);
  });

  // Si el usuario está autenticado y la ruta no es válida, redirigir a 404
  if (authStore.isAuthenticated && !isValidRoute) {
    return next("/404");
  }

  const user = JSON.parse(authStore.userAuth);
  //Si el usuario está autenticado pero NO tiene permisos para acceder a la ruta, redirigir a 404
  if (
    authStore.isAuthenticated &&
    !authStore.harRoutePermission(user.permissions, to.name) &&
    to.path !== "/404"
  ) {
    console.log(
      `Acceso denegado a la ruta: ${to.path}. El usuario no tiene permiso para acceder a esta ruta.`
    );
    return next("/404");
  }

  console.log(
    `Acceso permitido a la ruta: ${to.path}. Usuario tiene permiso para acceder a esta ruta.`
  );
  next();
});

export default router;
