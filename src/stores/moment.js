import { ref, computed, getCurrentInstance } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

export const useMomentStore = defineStore("moment", () => {
  const { proxy } = getCurrentInstance();
  const $moment = proxy.$moment;

  const now = $moment();
  const today = ref(now.format("YYYY-MM-DD"));
  const tomorrow = ref(now.add(1, "days").format("YYYY-MM-DD"));
  const yesterday = ref(now.subtract(1, "days").format("YYYY-MM-DD"));
  const currentYear = ref($moment().year());

  const addDays = (date, days) => {
    return $moment(date).add(days, "days").format("YYYY-MM-DD");
  };

  const subtractDays = (date, days) => {
    return $moment(date).subtract(days, "days").format("YYYY-MM-DD");
  };

  const formatPrettyDate = (date) => {
    return date ? $moment(date).format("MMM Do YYYY") : "-";
  };

  const formatFullPrettyDate = (date) => {
    return date ? $moment(date).format("dddd, Do MMMM YYYY") : "-";
  };

  const formatPrettyDateDayMonth = (date) => {
    return $moment(date).format("DD MMM");
  };

  const formatPrettyBusinessDateDayMonth = (date) => {
    const day = $moment(date).day();

    const weekendDays = [0, 6];

    if (!weekendDays.includes(day)) {
      return $moment(date).format("DD MMM");
    }
    return "-";
  };

  const formatPrettyDates = (dates) => {
    return dates.reduce((acc, date, index) => {
      const formattedDate = formatPrettyDate(date);
      return index === dates.length - 1
        ? acc + formattedDate
        : acc + formattedDate + " - ";
    }, "");
  };
  const formatStoreMonthYear = (date) => {
    return $moment(date).format("YYYY-MM");
  };
  //crea un metodo para formatear una fecha a un string con momentjs
  const formatStoreDate = (date) => {
    return $moment(date).format("YYYY-MM-DD");
  };
  //crea un metodo para parsear a un Date object una fecha con momentjs
  const parseStoreDate = (dateString) => {
    return $moment(dateString, "YYYY-MM-DD").toDate();
  };

  const parseStoreRangeDates = (dates) => {
    return dates.map((date) => $moment(date, "YYYY-MM-DD").toDate());
  };

  const parseTimeToPrettyDate = (time) => {
    const date = $moment(time); // Pass the timestamp directly
    return date.format("DD MMM"); // Format it to "DD MMM"
  };

  const formatStoreTime = (hours, minutes, seconds) => {
    const time = $moment().hours(hours).minutes(minutes).seconds(seconds);
    return time.format("HH:mm:ss");
  };

  const getTime = (date) => {
    return $moment(date).format("HHmmssSSS");
  };

  const parseStoreTime = (timeString) => {
    const time = $moment(timeString, "HH:mm:ss");
    return {
      hours: time.hours(),
      minutes: time.minutes(),
      seconds: time.seconds(),
    };
  };

  //crea un metodo para comparar un rango de dos fechas con momentjs
  const compareRangeDates = (date, startDate, endDate) => {
    const isoDate = $moment(date, $moment.ISO_8601, true);
    const isoStartDate = $moment(startDate, $moment.ISO_8601, true);
    const isoEndDate = $moment(endDate, $moment.ISO_8601, true);

    const isSameOrAfter = isoDate.isSameOrAfter(isoStartDate);
    const isSameOrBefore = isoDate.isSameOrBefore(isoEndDate);

    return isSameOrAfter && isSameOrBefore;
  };

  const compareDatesIsSame = (date1, date2) => {
    return $moment(date1).isSame(date2);
  };

  const compareDatesGreater = (date1, date2) => {
    return $moment(date1).isAfter(date2);
  };

  const compareDatesLess = (date1, date2) => {
    return $moment(date1).isBefore(date2);
  };

  const getToday = () => {
    return $moment().format("YYYY-MM-DD");
  };

  const getNow = () => {
    return $moment().format("YYYY-MM-DD HH:mm:ss");
  };

  const getNowTime = () => {
    return $moment().format("HH:mm:ss");
  };

  const getNowHour = () => {
    return $moment().format("HH");
  };

  const getNowMinute = () => {
    return $moment().format("mm");
  };

  const getNowSecond = () => {
    return $moment().format("ss");
  };

  const getNowDate = () => {
    return $moment().format("YYYY-MM-DD");
  };

  const getNowYear = () => {
    return $moment().year();
  };

  const getNowMonth = () => {
    return $moment().month();
  };

  const getNowDay = () => {
    return $moment().day();
  };

  const getNowWeekDay = () => {
    return $moment().weekday();
  };

  const getDaysBetweenDates = (startDate, endDate) => {
    return $moment(endDate).diff(startDate, "days");
  };

  const isDateBetweenDates = (date, startDate, endDate) => {
    return $moment(date).isBetween(startDate, endDate);
  };

  const getMonthYear = (date) => {
    const parsedDate = $moment(date, $moment.ISO_8601, true);
    if (!parsedDate.isValid()) {
      console.warn(
        "Invalid date format. Please provide a date in RFC2822 or ISO format."
      );
      return null;
    }
    return parsedDate.format("MMMM YYYY");
  };

  const isMonthBetweenMonths = (monthYear, startMontYear, endMonthYear) => {
    const monthYearDate = $moment(monthYear, "MMMM YYYY");
    const startMonthYearDate = $moment(startMontYear, "MMMM YYYY");
    const endMonthYearDate = $moment(endMonthYear, "MMMM YYYY");

    return monthYearDate.isBetween(startMonthYearDate, endMonthYearDate);
  };

  const getMonth = (date) => {
    return $moment(date).format("MMMM");
  };

  const locale = ref($moment.locale());

  const reduceDaysToDate = (date, days) => {
    return $moment(date).subtract(days, "days").toDate();
  };

  // Función para reducir una fecha en `days` días, evitando fines de semana
  // const reduceDaysToDate = (date, days) => {
  //   const saturday = 6, sunday = 0;
  //   let newDate = parseStoreDate(date);
  //   let remainingDays = days;

  //   while (remainingDays > 0) {
  //     newDate.setDate(newDate.getDate() - 1); // Retrocede un día
  //     if (newDate.getDay() !== saturday && newDate.getDay() !== sunday) {
  //       remainingDays--; // Solo cuenta días laborables
  //     }
  //   }
  //   return newDate;
  // };

  const addDaysToDate = (date, days) => {
    return $moment(date).add(days, "days").toDate();
  };

  return {
    today,
    tomorrow,
    yesterday,
    currentYear,
    addDays,
    subtractDays,
    formatPrettyDate,
    formatFullPrettyDate,
    formatPrettyDateDayMonth,
    formatPrettyBusinessDateDayMonth,
    formatStoreMonthYear,
    formatStoreDate,
    parseStoreDate,
    formatStoreTime,
    parseStoreTime,
    compareRangeDates,
    compareDatesGreater,
    compareDatesLess,
    formatPrettyDates,
    parseStoreRangeDates,
    getDaysBetweenDates,
    getTime,
    getMonthYear,
    isMonthBetweenMonths,
    isDateBetweenDates,
    getMonth,
    reduceDaysToDate,
    addDaysToDate,
    compareDatesIsSame,
    getToday,
    locale,
    parseTimeToPrettyDate,
  };
});
