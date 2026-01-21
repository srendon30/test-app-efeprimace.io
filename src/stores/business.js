import { ref, defineAsyncComponent, markRaw } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";
import { useAuthStore } from "@/stores/auth";
import { useMomentStore } from "@/stores/moment";
import { HttpError, showErrorMessage } from "@/helpers/errors";
import Swal from "sweetalert2/dist/sweetalert2.js";

export const useBusinessStore = defineStore("business", () => {
  const authStore = useAuthStore();
  const { formatStoreDate, parseStoreDate, formatPrettyDate } =
    useMomentStore();

  const businessDays = async (startDate, endDate) => {
    try {
      startDate = formatStoreDate(startDate);
      endDate = formatStoreDate(endDate);
      const url = new URL(
        `api/business-days/${startDate}/${endDate}`,
        useMainStore().backendUrlFC
      );
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        throw new HttpError(
          "Unauthorized: Porfavor vuelve a Iniciar Sesión",
          response.status
        );
      }

      if (!response.ok) {
        throw new HttpError("Error al traer los datos", response.status);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      throw new Error("Failed to get business days.");
    }
  };
  const getNextCodigoProyecto = async () => {
    try {
      const response = await fetch(
        `${useMainStore().backendUrlFC}/api/proyectos/next-codigo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      const data = await response.json();

      return response.ok
        ? data
        : (() => {
            throw new HttpError(data.message, response.status);
          })();
    } catch (error) {
      showErrorMessage(error);
    }
  };
  const getNextCodigoEstructura = async (proyectoId) => {
    try {
      const response = await fetch(
        `${
          useMainStore().backendUrlFC
        }/api/estructuras/next-codigo/${proyectoId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      const data = await response.json();

      return response.ok
        ? data
        : (() => {
            throw new HttpError(data.message, response.status);
          })();
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const getActiveOrdenByEstructura = async (estructuraId) => {
    try {
      const response = await fetch(
        `${useMainStore().backendUrlFC}/api/ordenes/active/${estructuraId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      const data = await response.json();

      return response.ok
        ? data
        : (() => {
            throw new HttpError(data.message, response.status);
          })();
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const parseStringToIntHours = (formattedString) => {
    // Validar si el string es nulo, indefinido o vacío
    if (!formattedString || typeof formattedString !== "string") {
      throw new Error(
        "El formato no es válido: entrada nula o no es un string"
      );
    }

    // Extraer el número del string usando una expresión regular
    const match = formattedString.match(/(\d+(\.\d+)?)/);
    if (!match) {
      throw new Error("El formato no es válido: no se encontró un número");
    }

    const value = parseFloat(match[0]); // Convertir el número capturado a float

    // Determinar la unidad (horas o minutos)
    if (formattedString.includes("hrs") || formattedString.includes("hora")) {
      // Si es "hrs" o "hora", devolver el valor en horas (entero)
      return Math.floor(value);
    } else if (formattedString.includes("min")) {
      // Si es "min", convertir minutos a horas (entero)
      return Math.floor(value / 60);
    } else {
      // Si no se reconoce la unidad, lanzar un error
      throw new Error("El formato no es válido: unidad desconocida");
    }
  };

  const formatStringHours = (valor) => {
    if (valor === 0) {
      return "0 hrs";
    } else if (valor === 1) {
      return `${valor} hora`;
    } else if (valor > 1) {
      return `${valor} hrs`;
    } else {
      return `${valor} min`;
    }
  };

  const formatIntHours = (horas) => {
    if (horas === 0) {
      return 0;
    } else {
      const roundedHours = Math.ceil(horas); // Redondea hacia la hora cerrada más cercana
      return roundedHours;
    }
  };

  const formatHours = (horas) => {
    return formatStringHours(formatIntHours(horas));
  };

  const getResponsables = async (typeResponsables) => {
    const optionsMap = {
      all: "responsables",
      ingenieria: "responsablesIngenieria",
      dibujo: "responsablesDibujo",
      cantidades: "responsablesCantidades",
      "coordinador-ingenieria": "responsablesCoordinadorIngenieria",
      "coordinador-dibujo": "responsablesCoordinadorDibujo",
    };

    const url = new URL(
      "api/list/" + optionsMap[typeResponsables],
      useMainStore().backendUrlFC
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.status === 401) {
      throw new HttpError(
        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
        response.status
      );
    }
    if (!response.ok) {
      throw new HttpError("Error al listar los datos", response.status);
    }
    const data = await response.json();

    return data;
  };

  const getOrdenTrabajo = async (ordenId) => {
    const url = new URL(
      "api/list/ordenTrabajo/" + ordenId,
      useMainStore().backendUrlFC
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.status === 401) {
      throw new HttpError(
        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
        response.status
      );
    }
    if (!response.ok) {
      throw new HttpError("Error al listar los datos", response.status);
    }
    const data = await response.json();

    return data;
  };

  // const getOrdenTrabajoSkipNotAvailableDatesOwnOrder = async (ordenId) => {
  //   const url = new URL(
  //     "api/list/ordenTrabajoSkipNotAvailableDatesOwnOrder/" + ordenId,
  //     useMainStore().backendUrlFC
  //   );

  //   const response = await fetch(url, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${authStore.token}`,
  //       "Content-Type": "application/json",
  //       Accept: "application/json",
  //     },
  //   });
  //   if (response.status === 401) {
  //     throw new HttpError(
  //       "Unauthorized: Porfavor vuelve a Iniciar Sesión",
  //       response.status
  //     );
  //   }
  //   if (!response.ok) {
  //     throw new HttpError("Error al listar los datos", response.status);
  //   }
  //   const data = await response.json();

  //   return data;
  // };

  const getOrdenEtapas = async (ordenSelectedId) => {
    const url = new URL(
      "api/list/ordenEtapas/" + ordenSelectedId,
      useMainStore().backendUrlFC
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.status === 401) {
      throw new HttpError(
        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
        response.status
      );
    }
    if (!response.ok) {
      throw new HttpError("Error al listar los datos", response.status);
    }
    const data = await response.json();

    return data.data;
  };

  const getOrdenEtapaTasks = async (ordenEtapaId) => {
    const url = new URL(
      "api/orden-etapa/tasks/" + ordenEtapaId,
      useMainStore().backendUrlFC
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.status === 401) {
      throw new HttpError(
        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
        response.status
      );
    }
    if (!response.ok) {
      throw new HttpError("Error al listar los tasks", response.status);
    }
    const data = await response.json();

    return data.data;
  };

  const getOrdenEtapasGeneralTasks = async (ordenId) => {
    console.log("api/orden-etapas/general-tasks/");
    const url = new URL(
      "api/orden-etapas/general-tasks/" + ordenId,
      useMainStore().backendUrlFC
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    if (response.status === 401) {
      throw new HttpError(
        "Unauthorized: Porfavor vuelve a Iniciar Sesión",
        response.status
      );
    }
    if (!response.ok) {
      throw new HttpError("Error al listar los tasks", response.status);
    }
    const data = await response.json();

    return data;
  };

  const getLaboralTimeBetweenTwoDates = async (
    date1,
    date2,
    fechasNoDisponibles = []
  ) => {
    const HORAS_LABORALES_POR_DIA = await getLaboralHoursPerDay();
    let fecha1 = parseStoreDate(date1);
    let fecha2 = parseStoreDate(date2);

    // Asegurarse de que fecha1 sea menor o igual a fecha2
    if (fecha1 > fecha2) {
      [fecha1, fecha2] = [fecha2, fecha1];
    }

    // Incluir ambos días en el cálculo
    fecha2.setDate(fecha2.getDate() + 1);

    // Calcular la diferencia en días
    const dias = Math.ceil((fecha2 - fecha1) / (1000 * 60 * 60 * 24));

    let totalHorasLaborales = 0;

    // Convertir las fechas no disponibles a objetos Date
    const convertedFechasNoDisponibles = fechasNoDisponibles.map((range) => ({
      start: parseStoreDate(range.start),
      end: parseStoreDate(range.end),
      type: range.type,
    }));

    // Iterar sobre cada día y contar solo los días laborales
    for (let i = 0; i < dias; i++) {
      const currentDay = parseStoreDate(date1);
      currentDay.setDate(fecha1.getDate() + i);
      const dayOfWeek = currentDay.getDay();

      // Verificar si el día actual está en las fechas no disponibles
      const isFechaNoDisponible = convertedFechasNoDisponibles.some(
        (range) => currentDay >= range.start && currentDay <= range.end
      );

      if (dayOfWeek >= 1 && dayOfWeek <= 5 && !isFechaNoDisponible) {
        // Lunes a Viernes y no en fechas no disponibles
        totalHorasLaborales += HORAS_LABORALES_POR_DIA[dayOfWeek];
      }
    }

    // Devolver el total de horas como un entero
    return totalHorasLaborales;
  };

  const getVacationsData = async () => {
    try {
      const response = await fetch(
        `${useMainStore().backendUrlFC}/api/vacaciones/data`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      );
      const data = await response.json();

      return response.ok
        ? data
        : (() => {
            throw new HttpError(data.message, response.status);
          })();
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const getLaboralHoursPerDay = async () => {
    const url = new URL(
      "api/laboral-hours/per-day",
      useMainStore().backendUrlFC
    );

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.status === 401) {
        throw new HttpError(
          "Unauthorized: Porfavor vuelve a Iniciar Sesión",
          response.status
        );
      }

      if (!response.ok) {
        throw new HttpError("Error al listar los tasks", response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching laboral hours per day:", error);
      throw error;
    }
  };

  const findFreeDates = (startDate, endDate, fechasNoDisponibles) => {
    const saturday = 6,
      sunday = 0;

    // Genera todas las fechas en el rango [startDate, endDate] (UTC)
    const generateDateRange = (startStr, endStr) => {
      const current = parseStoreDate(startStr);
      const end = parseStoreDate(endStr);

      const dates = [];
      while (current <= end) {
        dates.push(formatStoreDate(current));
        // Avanza al día siguiente
        current.setDate(current.getDate() + 1);
      }
      return dates;
    };

    // Generar todas las fechas en el rango
    const allDates = generateDateRange(startDate, endDate);

    // Filtrar fechas no cubiertas por ningún rango no disponible
    const fechasLibres = allDates.filter((fecha) => {
      const currentDate = parseStoreDate(fecha);

      if (
        currentDate.getDay() === saturday ||
        currentDate.getDay() === sunday
      ) {
        return false;
      }

      const isFreeDay = !fechasNoDisponibles.some((rango) => {
        const startDate = parseStoreDate(rango.start);
        const endDate = parseStoreDate(rango.end);

        const isInRange = currentDate >= startDate && currentDate <= endDate;
        return isInRange;
      });

      return isFreeDay;
    });

    return fechasLibres;
  };

  const confirmSuggestedPlanning = async (ordenId, tareas) => {
    try {
      const url = new URL(
        "api/confirm-suggested-planning",
        useMainStore().backendUrlFC
      );

      console.log("confirmSuggestedPlanning Tasks: ", tareas);

      const data = {
        orden_id: ordenId,
        tasks: tareas,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new HttpError("Error al guardar la planeación.", response.status);
      }

      const responseData = await response.json();

      Swal.fire({
        title: responseData.message,
        icon: "success",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#EC7522",
      });
      return;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const components = ref({});
  const loadComponents = async (componentsObjects) => {
    try {
      const componentsToLoad = componentsObjects.filter(
        (componentObject) => !components.value[componentObject.name]
      );

      if (componentsToLoad.length === 0) return;

      const promises = componentsToLoad.map((componentObject) =>
        defineAsyncComponent(() =>
          import(
            `@/components/${componentObject.folder}/${componentObject.name}.vue`
          )
        )
      );

      const loadedComponents = await Promise.all(promises);

      componentsToLoad.forEach((componentObject, index) => {
        components.value[componentObject.name] = markRaw(
          loadedComponents[index]
        );
      });
    } catch (error) {
      throw new Error("Failed to load vue components.");
    }
  };

  const getListProyectos = async () => {
    try {
      const url = new URL("api/list/proyectos", useMainStore().backendUrlFC);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new HttpError(
          "Error al listar los datos del proyecto",
          response.status
        );
      }
      const data = await response.json();

      return data;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const getEstructurasProyectoActivas = async (proyectoId) => {
    try {
      const url = new URL(
        `api/list/estructurasProyectoActivas/${proyectoId}`,
        useMainStore().backendUrlFC
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new HttpError(
          "Error al listar las estructuras activas en proyecto",
          response.status
        );
      }
      const data = await response.json();

      return data;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const fetchDataTabDashboard = async (tabName, params) => {
    try {
      const url = new URL(
        `api/dashboard/${tabName}`,
        useMainStore().backendUrlFC
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HttpError(data.message, response.status);
      }

      return data;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const getCategorizacion = async (puntajeObtenido) => {
    try {
      const url = new URL(
        "api/categorizacion/" + puntajeObtenido,
        useMainStore().backendUrlFC
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HttpError(data.message, response.status);
      }

      return data;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const getLevelExperienceByYears = (yearsExperience, levelsOfExperience) => {
    let level = levelsOfExperience.find(
      (level) =>
        yearsExperience >= level.min_experiencia &&
        yearsExperience < level.max_experiencia
    );

    if (!level) {
      const lastLevel = levelsOfExperience[levelsOfExperience.length - 1];
      if (yearsExperience >= lastLevel.min_experiencia) {
        level = lastLevel; // Si no hay un nivel específico, asignar el último nivel
      }
    }
    return level;
  };

  const getPuntajeByYearsExperience = async (yearsExperience) => {
    try {
      const url = new URL(
        `api/puntaje-by-years-experience/${yearsExperience}`,
        useMainStore().backendUrlFC
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      console.log("Response data:", data);

      if (!response.ok) {
        throw new HttpError(data.message, response.status);
      }

      return data.puntaje_obtenido;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const generateCategorizacionEmployees = async (employeeId = null) => {
    try {
      const url = new URL(
        `api/generate-categorization-employees/${employeeId ? employeeId : ""}`,
        useMainStore().backendUrlFC
      );

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HttpError(data.message, response.status);
      }

      return data;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const sendInvitationSatisfationSurvey = async (clientId) => {
    try {
      const url = new URL(
        "api/send-invitation-satisfaction-survey/" + clientId,
        useMainStore().backendUrlFC
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new HttpError(data.message, response.status);
      }

      return data;
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const downloadAllAnswersSurvey = async () => {
    const url = `${
      useMainStore().backendUrlFC
    }/api/download/respuesta-encuesta`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          Accept: "application/pdf",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new HttpError(errorData.message, response.status);
      }
      const contentType = response.headers.get("content-type");

      const contentTypeToExtension = {
        "application/pdf": "pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          "docx",
        "application/msword": "doc",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
          "xlsx",
      };
      const fileExtension = contentTypeToExtension[contentType] || "txt";

      let fileName = `Respuestas Encuesta Todas - ${formatPrettyDate(
        new Date()
      )}.${fileExtension}`;

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Failed to download survey answers.");
    }
  };

  return {
    businessDays,
    getNextCodigoProyecto,
    getNextCodigoEstructura,
    getActiveOrdenByEstructura,
    formatHours,
    formatIntHours,
    formatStringHours,
    parseStringToIntHours,
    getResponsables,
    getOrdenTrabajo,
    // getOrdenTrabajoSkipNotAvailableDatesOwnOrder,
    getOrdenEtapas,
    getOrdenEtapaTasks,
    getOrdenEtapasGeneralTasks,
    getLaboralTimeBetweenTwoDates,
    getVacationsData,
    getLaboralHoursPerDay,
    findFreeDates,
    confirmSuggestedPlanning,
    components,
    loadComponents,
    getListProyectos,
    getEstructurasProyectoActivas,
    fetchDataTabDashboard,
    getCategorizacion,
    generateCategorizacionEmployees,
    sendInvitationSatisfationSurvey,
    downloadAllAnswersSurvey,
    getPuntajeByYearsExperience,
    getLevelExperienceByYears,
  };
});
