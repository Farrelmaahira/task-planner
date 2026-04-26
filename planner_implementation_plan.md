# Planner App Implementation Plan

## 1. Project Overview
Project ini adalah aplikasi "Task Tracker / To-Do List / Planner" yang dirancang khusus untuk mahasiswa yang juga aktif sebagai fungsionaris himpunan. Aplikasi ini bertujuan membantu manajemen waktu dengan memisahkan kegiatan berdasarkan kategorinya (misal: Kuliah, Organisasi, Kepanitiaan, Pribadi). Aplikasi ini akan dideploy di **Vercel** dan menggunakan database **PostgreSQL**.

## 2. Tech Stack
Berikut adalah rekomendasi teknologi terbaik agar implementasi oleh AI agent dapat dilakukan dengan cepat dan rapi:
*   **Framework Frontend & Backend:** Next.js (App Router)
*   **Styling:** Tailwind CSS (dengan library komponen seperti shadcn/ui untuk UI yang rapi dan elegan)
*   **Database:** PostgreSQL (bisa menggunakan Vercel Postgres, Supabase, atau Neon)
*   **ORM (Object-Relational Mapping):** Prisma ORM atau Drizzle ORM (Prisma sangat disarankan karena dokumentasi dan skema yang sangat jelas bagi AI)
*   **Deployment:** Vercel

## 3. Database Schema (PostgreSQL)

### Table: `Category`
Menyimpan kategori kegiatan agar dinamis (atau bisa juga di-hardcode sebagai Enum jika ingin lebih simpel).
*   `id` (String/UUID, Primary Key)
*   `name` (String) - contoh: "Kuliah", "Himpunan", "Kepanitiaan", "Pribadi"
*   `color` (String) - untuk label warna di UI (misal: "#FF5733")

### Table: `Task`
Menyimpan data detail kegiatan.
*   `id` (String/UUID, Primary Key)
*   `title` (String, Required) - Nama kegiatan
*   `description` (Text, Optional) - Deskripsi detail kegiatan
*   `dueDate` (DateTime, Optional) - Tenggat waktu kegiatan
*   `isCompleted` (Boolean, Default: false) - Status kegiatan
*   `categoryId` (String, Foreign Key -> Category) - Relasi ke kategori tertentu
*   `createdAt` (DateTime, Default: now())
*   `updatedAt` (DateTime)

## 4. Features to Implement

**A. Dashboard / Halaman Utama**
*   Menampilkan ringkasan (summary) kegiatan yang belum selesai.
*   *Upcoming Tasks*: Menampilkan tugas-tugas yang tenggat waktunya paling dekat.

**B. Task Management (CRUD)**
*   **Create**: Form untuk menambah kegiatan baru (Input: Title, Description, Categoy dropdown, Due Date).
*   **Read**: Menampilkan daftar (List) semua kegiatan.
*   **Update**: Klik kegiatan untuk mengedit detailnya atau mencentang (mark as completed).
*   **Delete**: Menghapus kegiatan dari daftar.

**C. Kategori / Filtering**
*   Fitur untuk memfilter daftar to-do list berdasarkan kategori (Tampilkan *hanya* tugas Kuliah, atau *hanya* tugas Himpunan).

**D. Tema & Tampilan (UI/UX)**
*   **Theme Toggle**: Terdapat opsi/tombol (*toggle*) intuitif bagi pengguna untuk mengubah tema aplikasi antara mode gelap (*Dark Mode*) dan mode terang (*Light Mode*).
*   **Warna yang Ramah Mata (Eye-pleasing)**: UI harus menggunakan palet warna yang nyaman dipandang dalam waktu lama, tidak terlalu mencolok (kontras yang aman), dan tetap terbaca dengan jelas di kedua mode (terang dan gelap).

## 5. Implementation Steps for AI Agent
*Untuk AI Agent yang akan membaca dokumen ini, silakan ikuti urutan implementasi berikut:*

1.  **Setup Project:** Inisialisasi Next.js dengan Tailwind CSS (`npx create-next-app@latest`).
2.  **Setup Database & ORM:** Install Prisma, buat schema.prisma berdasarkan struktur database di atas, dan lakukan koneksi ke PostgreSQL. Jalankan `npx prisma db push`.
3.  **UI Components Setup:** Buat atau install komponen layout dasar (Navbar, Sidebar, Card, Button, Form Inputs).
4.  **Backend APIs (Server Actions / API Routes):** Buat Next.js Server Actions untuk melakukan operasi CRUD ke database Postgres (getTasks, createTask, updateTask, deleteTask).
5.  **Frontend Integration:** Hubungkan UI dengan Server Actions/API. Buat state untuk menghandle *loading* dan revalidasi data.
6.  **Polishing:** Implementasikan `next-themes` atau yang setara untuk fitur *Dark/Light mode*. Pastikan bahwa warna dasar aplikasi ramah di mata. Pastikan juga desainnya responsif, tambahkan indikator warna yang halus untuk setiap kategori, dan pastikan UX (User Experience) berjalan lancar saat menambah/menyelesaikan task.
7.  **Deployment Prep:** Pastikan environment variables (`DATABASE_URL`) telah disiapkan untuk di-set pada dashboard Vercel.

---
**Catatan untuk AI Agent:** Utamakan fungsionalitas CRUD secara end-to-end terlebih dahulu dari frontend menuju database PostgreSQL, kemudian fokus pada pemisahan kategori tugas. Buat desain antarmuka yang bersih (clean minimalis) agar cocok bagi pengguna yang sibuk.
