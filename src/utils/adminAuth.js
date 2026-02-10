export const isAdminLoggedIn = () => {
  return !!localStorage.getItem("admin_token");
};

export const adminLogout = () => {
  localStorage.removeItem("admin_token");
  window.location.href = "/admin/login";
};
