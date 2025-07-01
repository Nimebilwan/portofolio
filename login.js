import { supabase } from "./config.js";

document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const loginBtn = document.getElementById("loginBtn");
  loginBtn.disabled = true; // Disable tombol saat proses dimulai
  loginBtn.textContent = 'Logging in...'; // Ubah teks tombol

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
    loginBtn.disabled = false; // Aktifkan kembali tombol
    loginBtn.textContent = 'Login'; // Kembalikan teks tombol
  } else {
    localStorage.setItem("admin", JSON.stringify(data));
    window.location.href = "admin.html";
  }
});