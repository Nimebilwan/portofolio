import { supabase } from "./config.js";

const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) window.location.href = "login.html";

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

  if (uploadError) {
    showAlert("Gagal upload gambar!", "danger");
    return;
  }

  const { data: urlData } = supabase
    .storage
    .from("project-images")
    .getPublicUrl(fileName);

  const gambar_url = urlData.publicUrl;

  const { error: insertError } = await supabase
    .from("projects")
    .insert({ judul, deskripsi, gambar_url });

  if (insertError) {
    showAlert("Gagal menyimpan proyek!", "danger");
  } else {
    showAlert("Proyek berhasil ditambahkan!", "success");
    document.getElementById("formProject").reset();
    loadProjects();
  }
}

function showAlert(msg, type) {
  const alertBox = document.getElementById("alert");
  alertBox.className = `alert alert-${type}`;
  alertBox.innerText = msg;
  alertBox.classList.remove("d-none");
  setTimeout(() => alertBox.classList.add("d-none"), 3000);
}

async function loadProjects() {
  const { data, error } = await supabase.from("portofolio").select("*").order("id", { ascending: false });
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  if (error || !data) {
    container.innerHTML = "<p class='text-danger'>Gagal memuat proyek</p>";
    return;
  }

  data.forEach(project => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100">
        <img src="${project.gambar_url}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${project.judul}">
        <div class="card-body">
          <h5 class="card-title">${project.judul}</h5>
          <p class="card-text">${project.deskripsi}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// Auto load saat halaman terbuka
loadProjects();
