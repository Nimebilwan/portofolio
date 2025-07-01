import { supabase } from "./config.js";

const container = document.getElementById("projectContainer");

async function tampilkanProject() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id", { ascending: false });

  if (error) return console.error("Gagal ambil data:", error);

  data.forEach(project => {
    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card portfolio-item">
          <img src="${project.gambar_url}" class="card-img-top" alt="${project.judul}">
          <div class="card-body">
            <h5 class="card-title">${project.judul}</h5>
            <p class="card-text">${project.deskripsi}</p>
          </div>
        </div>
      </div>
    `;
  });
}

tampilkanProject();
