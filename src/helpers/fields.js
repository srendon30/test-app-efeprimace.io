import personaFields from "./fields/persona";
import contratoFields from "./fields/contrato";
import proyectosFields from "./fields/proyecto";
import clienteFields from "./fields/cliente";
import permisoFields from "./fields/permiso";
import aprobarRechazarPermisoFields from "./fields/aprobar-rechazar-permiso";
import vacacionFields from "./fields/vacacion";
import aprobarRechazarVacacionFields from "./fields/aprobar-rechazar-vacacion";
import contactoEmergenciaPerfilSDFields from "./fields/contactoEmergenciaPerfilSD";
import usuarioFields from "./fields/usuario";
import incapacidadFields from "./fields/incapacidad";
import licenciaFields from "./fields/licencia";
import documentoContratoFields from "./fields/documentoContrato";
import reportesGHFields from "./fields/reportesGH";
import informacionBasicaFields from "./fields/informacionBasica";
import informacionPersonalFields from "./fields/informacionPersonal";
import informacionLaboralFields from "./fields/informacionLaboral";
import seguridadSocialFields from "./fields/seguridadSocial";
import socioEconomicoFields from "./fields/socioEconomico";
import habitosSaludablesFields from "./fields/habitosSaludables";
import estructuraProyectoFields from "./fields/estructuraProyecto";
import procesoFields from "./fields/proceso";
import areaFields from "./fields/area";
import cargoFields from "./fields/cargo";
import perfilFields from "./fields/perfil";
import festivoFields from "./fields/festivo";
import ordenTrabajoFields from "./fields/ordenTrabajo";
import planeacionFields from "./fields/planeacion";
import actividadFields from "./fields/actividad";
import misActividadesFields from "./fields/misActividades";
import reportarHorasFields from "./fields/reportarHoras";
import taskFields from "./fields/task";
import horasLaboralesFields from "./fields/horasLaborales";
import tiposEstructuraFields from "./fields/tipoEstructura";
import tiposCimentacionFields from "./fields/tipoCimentacion";
import categorizacionFields from "./fields/categorizacion";
import configuracionCategorizacionFields from "./fields/configuracion-categorizacion";
import relacionCategorizacionEmpleadoFields from "./fields/relacion-categorizacion-empleado";
import categorizacionEducacionFields from "./fields/categorizacionEducacion";
import categorizacionFormacionFields from "./fields/categorizacionFormacion";
import categorizacionExperienciaFields from "./fields/categorizacionExperiencia";
import salariosBaseFields from "./fields/salariosBase";
import reportesCategorizacionFields from "./fields/reportesCategorizacion";
import agregarEmailEncuestaFields from "./fields/agregarEmailEncuesta";
import encuestaSatisfaccionFields from "./fields/encuestaSatisfaccion";
import reportesUsuariosBloqueadosFields from "./fields/reportesUsuariosBloqueados";
import filteredAnswersSurveyFields from "./fields/filteredAnswersSurvey";
import reportesMisReportesFields from "./fields/reportesMisReportes";
import misActividadesGeneralFields from "./fields/misActividadesGeneral";
import featureFlagFields from "./fields/featureFlag";
import actividadesGeneralesProyectosFields from "./fields/actividadesGeneralesProyectos";
import actividadesGeneralesFields from "./fields/actividadesGenerales";

export const getFormFields = (typeField) => {
  return [...fields[typeField]];
};

export const fields = {
  persona: personaFields,
  contactoEmergenciaPerfilSD: contactoEmergenciaPerfilSDFields,
  contrato: contratoFields,
  documentoContrato: documentoContratoFields,
  usuario: usuarioFields,
  permiso: permisoFields,
  aprobarRechazarPermiso: aprobarRechazarPermisoFields,
  incapacidad: incapacidadFields,
  vacacione: vacacionFields,
  aprobarRechazarVacacion: aprobarRechazarVacacionFields,
  licencia: licenciaFields,
  reportesGH: reportesGHFields,
  informacionBasica: informacionBasicaFields,
  informacionPersonal: informacionPersonalFields,
  informacionLaboral: informacionLaboralFields,
  seguridadSocial: seguridadSocialFields,
  socioEconomico: socioEconomicoFields,
  habitosSaludables: habitosSaludablesFields,
  proyecto: proyectosFields,
  cliente: clienteFields,
  estructura: estructuraProyectoFields,
  proceso: procesoFields,
  area: areaFields,
  cargo: cargoFields,
  perfil: perfilFields,
  festivo: festivoFields,
  ordenTrabajo: ordenTrabajoFields,
  planeacion: planeacionFields,
  actividadesOrdenEtap: actividadFields,
  misActividades: misActividadesFields,
  reportarHoras: reportarHorasFields,
  addTask: taskFields,
  horasLaborale: horasLaboralesFields,
  tiposEstructura: tiposEstructuraFields,
  tiposCimentacione: tiposCimentacionFields,
  categorizacion: categorizacionFields,
  configuracionCategorizacio: configuracionCategorizacionFields,
  relacionCategorizacionEmpleado: relacionCategorizacionEmpleadoFields,
  categorizacionEducacio: categorizacionEducacionFields,
  categorizacionFormacio: categorizacionFormacionFields,
  categorizacionExperienci: categorizacionExperienciaFields,
  salariosBas: salariosBaseFields,
  reportesCategorizacion: reportesCategorizacionFields,
  agregarEmailEncuesta: agregarEmailEncuestaFields,
  encuestaSatisfaccion: encuestaSatisfaccionFields,
  reportesUsuariosBloqueados: reportesUsuariosBloqueadosFields,
  filteredAnswersSurvey: filteredAnswersSurveyFields,
  reportesMisReportes: reportesMisReportesFields,
  misActividadesGeneral: misActividadesGeneralFields,
  featureFlag: featureFlagFields,
  actividadesGeneralesProyectos: actividadesGeneralesProyectosFields,
  actividadesGenerales: actividadesGeneralesFields
};

export default {
  getFormFields,
};
