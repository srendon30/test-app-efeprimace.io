import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/main";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { HttpError, showErrorMessage } from "@/helpers/errors";
import { extractAllowedPermissionsSlugs } from "@/utils/permissions";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const userAuth = ref(localStorage.getItem("userAuth") || null);
  const token = ref(localStorage.getItem("token") || "");
  const isAuthenticated = ref(!!localStorage.getItem("token"));
  const isLoadingAuth = ref(false);

  const isAppReady = computed(() => {
    return isAuthenticated.value && !isLoadingAuth.value;
  });

  const register = async (credentials) => {
    const response = await fetch(
      "/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(credentials),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new HttpError("Error al registrar el usuario", response.status);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          position: "top",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };

  const login = async (credentials) => {
    return await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          return { success: false, data: errorData };
        }
        const data = await response.json();
        return { success: true, data: data };
      })
      .then((response) => {
        if (response.success) {
          setToken(response.data.token);
        }
        return { success: response.success, message: response.data.message };
      })
      .catch((error) => {
        return {
          success: false,
          message:
            "An unexpected error occurred. Please try again." + error.message,
        };
      });
  };

  const fetchUser = async () => {
    const response = await fetch("/api/user", {
      method: "GET",
      headers: { Authorization: `Bearer ${token.value}` },
    })
      .then(async (response) => {
        if (!response.ok) {
          await clearAuthData();
          throw new HttpError("Error al obtener el usuario", response.status);
        }
        return response.json();
      })
      .then((data) => {
        userAuth.value = JSON.stringify(data);
        localStorage.setItem("userAuth", JSON.stringify(data));
        console.log("User fetched successfully:", data);
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };

  const logout = async () => {
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new HttpError("Error al cerrar sesión", response.status);
        }
        return response.json();
      })
      .then(async (data) => {
        await clearAuthData();
        router.push({ name: "login" });
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };

  const refreshToken = async () => {
    const response = await fetch(
      "/api/refresh-token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new HttpError("Error al refrescar el token", response.status);
        }
        return response.json();
      })
      .then((data) => {
        setToken(data.token);
        Swal.fire({
          position: "top",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };

  const invalidateToken = async () => {
    const response = await fetch(
      "/api/invalidate-token",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new HttpError("Error al invalidar el token", response.status);
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          position: "top",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 2000,
        });
      })
      .catch((error) => {
        showErrorMessage(error);
      });
  };

  const setToken = (value) => {
    token.value = value;
    isAuthenticated.value = true;
    localStorage.setItem("token", value);
  };

  const clearAuthData = () => {
    token.value = "";
    userAuth.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("userAuth");
  };

  const harRoutePermission = (permissions, routeName) => {
    const allowedSlugs = extractAllowedPermissionsSlugs(permissions);
    const routeIsAllowed = allowedSlugs.has(routeName);
    return routeIsAllowed;
  };

  return {
    isAppReady,
    isLoadingAuth,
    isAuthenticated,
    userAuth,
    token,
    register,
    login,
    logout,
    refreshToken,
    invalidateToken,
    fetchUser,
    clearAuthData,
    harRoutePermission,
  };
});
