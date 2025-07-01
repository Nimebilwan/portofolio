import { supabase } from "./config.js";

document.addEventListener("DOMContentLoaded", loadProjects);

async function loadProjects() {
  const { data, error } = await supabase.from("portofolio").select("*").order("judul", { ascending: true });
  const container = document.getElementById("publicProjects");

  if (error || !data) {
    container.innerHTML = "<p class='text-center text-muted'>Belum ada proyek.</p>";
    return;
  }

  data.forEach(proyek => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card portfolio-item">
        <img src="${proyek.gambar_url}" class="card-img-top" style="height:200px; object-fit:cover;" alt="Project">
        <div class="card-body">
          <h5 class="card-title">${proyek.judul}</h5>
          <p class="card-text">${proyek.deskripsi}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}
