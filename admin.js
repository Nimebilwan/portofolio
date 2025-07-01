import { supabase } from "./config.js";

const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) window.location.href = "login.html";

window.logout = () => {
  localStorage.removeItem("admin");
  location.href = "login.html";
};

document.getElementById("formProject").addEventListener("submit", async (e) => {
  e.preventDefault();
  await uploadProject();
});

async function uploadProject() {
  const judul = document.getElementById("judul").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const file = document.getElementById("gambar").files[0];

  if (!judul || !file) return alert("Judul dan Gambar wajib diisi!");

  const fileName = `${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(`gambar/${fileName}`, file);

  if (uploadError) return alert("Gagal upload gambar!");

  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(`gambar/${fileName}`);

  const gambar_url = urlData.publicUrl;

  const { error: insertError } = await supabase.from("portofolio").insert({
    judul, deskripsi, gambar_url
  });

  if (insertError) {
    alert("Gagal simpan project");
  } else {
    alert("Project berhasil ditambahkan!");
    location.reload();
  }
}
