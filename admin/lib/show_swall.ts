"use client";

import Swal, { SweetAlertIcon } from "sweetalert2";

export const showLoadingAlert = (title: string = "Memproses data...") => {
  if (typeof window === "undefined") return;
  Swal.fire({
    title: title,
    text: "Mohon tunggu sebentar",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const swallAlert = (text: string, icon: SweetAlertIcon = "success") => {
  if (typeof window === "undefined") return;
  Swal.fire({
    title: icon === "success" ? "Berhasil!" : "Pemberitahuan!",
    text: `Data ${text}.`,
    icon: icon,
    timer: 1500,
    showConfirmButton: false,
    backdrop: false,
  });
};
