import { supabase } from "./config.js";

document.addEventListener("DOMContentLoaded", loadProjects);

async function loadProjects() {
  const { data, error } = await supabase.from("portofolio").select("*").order("judul", { ascending: true });
  const container = document.getElementById("publicProjects");
  const noProjectsMessage = document.getElementById("noProjectsMessage"); // Dapatkan elemen pesan

  container.innerHTML = ""; // Bersihkan kontainer

  if (error || !data) {
    console.error("Error loading public projects:", error.message);
    noProjectsMessage.classList.remove("d-none"); // Tampilkan pesan
    noProjectsMessage.innerHTML = "<p class='text-center text-danger'>Gagal memuat proyek. Silakan coba lagi nanti.</p>";
    return;
  }

  if (data.length === 0) {
    noProjectsMessage.classList.remove("d-none"); // Tampilkan pesan jika tidak ada data
    return;
  } else {
    noProjectsMessage.classList.add("d-none"); // Sembunyikan jika ada data
  }

  data.forEach(proyek => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card portfolio-item">
        <img src="${proyek.gambar_url}" class="card-img-top" alt="${proyek.judul}">
        <div class="card-body">
          <h5 class="card-title">${proyek.judul}</h5>
          <p class="card-text">${proyek.deskripsi.substring(0, 150)}${proyek.deskripsi.length > 150 ? '...' : ''}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}