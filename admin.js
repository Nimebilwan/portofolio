import { supabase } from "./config.js";

// Cek autentikasi admin
const admin = JSON.parse(localStorage.getItem("admin"));
if (!admin) {
  window.location.href = "login.html";
}

// Event listener untuk tombol logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("admin");
  window.location.href = "index.html"; // Logout ke halaman publik
});

// Event listener untuk form tambah proyek
document.getElementById("formProject").addEventListener("submit", uploadProject);

const submitProjectBtn = document.getElementById("submitProjectBtn");
const alertDiv = document.getElementById("alertMessage");

// Fungsi untuk menampilkan alert
function showAlert(message, type) {
  alertDiv.textContent = message;
  alertDiv.className = `alert mt-4 ${type === 'success' ? 'alert-success' : 'alert-danger'}`;
  alertDiv.classList.remove('d-none');
  setTimeout(() => {
    alertDiv.classList.add('d-none');
  }, 5000); // Sembunyikan setelah 5 detik
}

async function uploadProject(e) {
  e.preventDefault();

  submitProjectBtn.disabled = true; // Disable tombol saat proses dimulai
  submitProjectBtn.textContent = 'Menyimpan...'; // Ubah teks tombol

  const judul = document.getElementById("judul").value;
  const deskripsi = document.getElementById("deskripsi").value;
  const file = document.getElementById("gambar").files[0];

  if (!judul || !file) {
    showAlert("Judul dan Gambar wajib diisi!", "danger");
    submitProjectBtn.disabled = false;
    submitProjectBtn.textContent = 'Simpan Proyek';
    return;
  }

  // Upload gambar ke Supabase Storage
  const fileName = `project_images/${Date.now()}_${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Gagal upload gambar:", uploadError.message);
    showAlert("Gagal upload gambar! " + uploadError.message, "danger");
    submitProjectBtn.disabled = false;
    submitProjectBtn.textContent = 'Simpan Proyek';
    return;
  }

  // Dapatkan URL publik gambar
  const { data: urlData } = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName);

  const gambar_url = urlData.publicUrl;

  // Simpan data proyek ke tabel 'portofolio'
  const { error: insertError } = await supabase.from("portofolio").insert({
    judul,
    deskripsi,
    gambar_url,
  });

  if (insertError) {
    console.error("Gagal simpan proyek:", insertError.message);
    showAlert("Gagal simpan proyek! " + insertError.message, "danger");
  } else {
    showAlert("Proyek berhasil ditambahkan!", "success");
    document.getElementById("formProject").reset();
    loadProjects();
  }

  submitProjectBtn.disabled = false; // Aktifkan kembali tombol
  submitProjectBtn.textContent = 'Simpan Proyek'; // Kembalikan teks tombol
}

async function loadProjects() {
  const { data, error } = await supabase
    .from("portofolio")
    .select("*")
    .order("judul", { ascending: true });

  const container = document.getElementById("projectList");
  container.innerHTML = "";

  if (error) {
    console.error("Error loading projects:", error.message);
    container.innerHTML = "<p class='text-center text-danger'>Gagal memuat proyek.</p>";
    return;
  }

  if (data.length === 0) {
    container.innerHTML = "<p class='text-center text-muted mt-3'>Belum ada proyek ditambahkan.</p>";
    return;
  }

  data.forEach((proyek) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100">
        <img src="${proyek.gambar_url}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${proyek.judul}">
        <div class="card-body">
          <h5 class="card-title">${proyek.judul}</h5>
          <p class="card-text text-muted">${proyek.deskripsi.substring(0, 100)}${proyek.deskripsi.length > 100 ? '...' : ''}</p>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Panggil loadProjects saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadProjects);