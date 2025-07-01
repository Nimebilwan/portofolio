import { supabase } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase.from("projects").select("*");

  const list = document.getElementById("projectList");
  list.innerHTML = "";

  data.forEach((p) => {
    list.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${p.gambar_url}" class="card-img-top" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${p.judul}</h5>
            <p class="card-text">${p.deskripsi}</p>
          </div>
        </div>
      </div>
    `;
  });
});
