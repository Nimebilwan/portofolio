import { supabase } from "./config.js";

const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) window.location.href = "login.html";

window.logout = () => {
  localStorage.removeItem("admin");
  location.href = "login.html";
};

window.uploadProject = async function () {
  const judul = document.getElementById("judul").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const file = document.getElementById("gambar").files[0];

  if (!judul || !file) return alert("Judul dan Gambar wajib diisi!");

  // Upload gambar
  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(fileName, file);

  if (uploadError) return alert("Gagal upload gambar!");

  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  const gambar_url = urlData.publicUrl;

  const { error: insertError } = await supabase.from("projects").insert({
    judul, deskripsi, gambar_url
  });

  if (insertError) {
    alert("Gagal simpan project");
  } else {
    alert("Project berhasil ditambahkan!");
    location.reload();
  }
};
