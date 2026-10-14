# RIS Visual Hub

Frontend interaktif Yayasan Eka Harap untuk pengelolaan proyek visual dari Google Sheets/Docs yang telah disiapkan dalam GAS v1.0.0.

## Arsitektur

- **React 18 + react-scripts 5 + CSS** → GitHub Pages (tidak menyimpan data institusi).
- **Google Apps Script** → logika, pengolahan indikator, sinkronisasi sumber, snapshot.
- **Google Sheets + Drive** → database dan arsip proyek.
- Komunikasi frontend ↔ GAS memakai iframe HTMLService per permintaan. Tidak menggunakan JSONP, skrip pihak ketiga, atau token di browser.
- **Penting:** diperlukan patch `Code.gs` dan `Bridge.html` dalam paket luar, lalu set Origin GitHub via menu Spreadsheet dan redeploy versi GAS baru.

## Fitur v1.0.0

Perpustakaan proyek, tabel metadata-driven, formulir CRUD, autosave per field, alur berelasi, indikator, timeline, sumber data, impor terpetakan, snapshot, presentasi layar penuh, sidebar responsif, navigasi halaman, diagnostik, cache IndexedDB, dan refresh manual. Referensi hukum tidak diekstrak otomatis dari naskah.

## Pemasangan

Ikuti `PANDUAN_PASANG.txt` di luar folder ini. Isi `src/config.js` sudah menggunakan alamat deployment GAS dari pengguna.

## Catatan build

Lingkungan penyiapan paket tidak memiliki akses ke registry npm. Karena itu file `package-lock.json` di sini adalah **bootstrap lock minimal**; workflow secara sengaja melengkapinya (`npm install --package-lock-only`) sebelum `npm ci` dan `CI=false npm run build`. Build final dan akses backend harus diuji melalui GitHub Actions/browser setelah repositori diterbitkan.

## Keamanan

Tahap demo tanpa password tambahan sesuai permintaan. Bila GAS deployment memakai akses Anyone, jangan unggah data internal/rahasia: penghubung origin bukan autentikasi API. Penguatan autentikasi dan kebijakan berbagi wajib ditentukan sebelum penggunaan nyata.
