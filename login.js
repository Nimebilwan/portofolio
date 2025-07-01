import { supabase } from "./config.js";

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    alert("Login gagal, cek email dan password!");
  } else {
    localStorage.setItem("admin", JSON.stringify(data));
    window.location.href = "admin.html";
  }
};
