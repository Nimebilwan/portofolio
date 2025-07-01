import { supabase } from "./config.js";

const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) window.location.href = "login.html";

window.logout = () => {
  localStorage.removeItem("admin");
  location.href = "login.html";
};

document.getElementById("formProject").addEventListener("submit", uploadProject);

async function uploadProject(e) {
  e.preventDefault();
  const judul = document.getElementById("judul").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const file = document.getElementById("gambar").files[0];

  if (!judul || !file) return alert("Judul dan Gambar wajib diisi!");

  const fileName = `gambar/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(fileName, file);

  if (uploadError) return alert("Gagal upload gambar!");

  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  const gambar_url = urlData.publicUrl;

  const { error: insertError } = await supabase.from("portofolio").insert({
    judul, deskripsi, gambar_url
  });

  if (insertError) {
    alert("Gagal simpan proyek");
  } else {
    alert("Proyek berhasil ditambahkan!");
    document.getElementById("formProject").reset();
    loadProjects();
  }
}

async function loadProjects() {
  const { data, error } = await supabase.from("portofolio").select("*").order("judul", { ascending: true });
  const container = document.getElementById("listProject");
  container.innerHTML = "";

  if (error) return;

  data.forEach(proyek => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${proyek.gambar_url}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="gambar">
        <div class="card-body">
          <h5 class="card-title">${proyek.judul}</h5>
          <p class="card-text">${proyek.deskripsi}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

loadProjects();
