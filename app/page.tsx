"use client";

import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const NOMOR_WHATSAPP = "6281297571153";

const KELAS_LIST = [
  "X PS 1",
  "X PS 2",
  "X PS 3",
  "X ULP 1",
  "X ULP 2",
  "X AKL 1",
  "X AKL 2",
  "X AKL 3",
  "X AKL 4",
  "X MPLB 1",
  "X MPLB 2",
  "X MPLB 3",
  "X MPLB 4",
];

const CHALLENGES = [
  {
    number: "01",
    text: "Post di Instagram Story menggunakan foto TER-ESTETIK kamu tentang SMEA, lalu pakai lagu yang paling menggambarkan diri kamu.",
  },
  {
    number: "02",
    text: "Post foto Desuh dan Kasuh yang lucu lalu pakai lagu yang paling menggambarkan Kasuh kamu. Jangan lupa tag Kasuh kamu.",
  },
  {
    number: "03",
    text: "Post hobi kamu menggunakan lagu yang paling menggambarkan Kang Fathur hhe.",
  },
  {
    number: "04",
    text: "Tag saya di Instagram. Instagramnya tanya ke siapa aja boleh yaa.",
  },
  {
    number: "05",
    text: "Udah segitu aja, gampang kan yaa, tag saya disemua story nya! Baca instruksi selanjutnya.",
  },
];

async function uploadToCloudinary(file: File) {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Konfigurasi Cloudinary belum lengkap. Periksa file .env.local."
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Gagal mengupload screenshot ke Cloudinary."
    );
  }

  if (!result.secure_url) {
    throw new Error("Cloudinary tidak mengembalikan URL gambar.");
  }

  return result.secure_url as string;
}

export default function Home() {
  const [step, setStep] = useState<
    "form" | "challenge" | "upload" | "confirm" | "success"
  >("form");

  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function mulaiChallenge() {
    if (!nama.trim()) {
      alert("Silakan masukkan nama terlebih dahulu.");
      return;
    }

    if (!kelas) {
      alert("Silakan pilih kelas terlebih dahulu.");
      return;
    }

    setStep("challenge");
  }

  function pilihFile(selectedFile: File | undefined) {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("File harus berupa gambar.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("Ukuran screenshot maksimal 10 MB.");
      return;
    }

    setFile(selectedFile);

    const objectURL = URL.createObjectURL(selectedFile);
    setPreview(objectURL);
  }

  function bukaFilePicker() {
    fileInputRef.current?.click();
  }

  function lanjutUpload() {
    if (!file) {
      alert("Silakan upload screenshot terlebih dahulu.");
      return;
    }

    setStep("confirm");
  }

  async function konfirmasiSubmission() {
    if (!file) {
      alert("Screenshot belum dipilih.");
      return;
    }

    try {
      setUploading(true);

      const screenshotURL = await uploadToCloudinary(file);

      await addDoc(collection(db, "challengeSubmissions"), {
        nama: nama.trim(),
        kelas,
        screenshotURL,
        status: "Menunggu Verifikasi",
        createdAt: serverTimestamp(),
      });

      setStep("success");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengirim data."
      );
    } finally {
      setUploading(false);
    }
  }

  function kirimWhatsApp() {
    const pesan = `
Assalamualaikum kang,
Selamat pagi/siang/sore/malam kang,

Nama : ${nama}
Kelas : ${kelas}

Izin berbicara kang,
Izin kang, izin mengonfirmasi bahwa saya sudah menyelesaikan challengenya kang.

Terima kasih kang,
Maaf mengganggu waktunya.
    `.trim();

    const url = `https://wa.me/${NOMOR_WHATSAPP}?text=${encodeURIComponent(
      pesan
    )}`;

    window.open(url, "_blank");
  }

  return (
    <main className="min-h-screen bg-[#f7f0df] text-[#173b63]">
      <div className="mx-auto min-h-screen max-w-xl px-5 py-6 sm:px-7">

        {/* HEADER */}
        <header className="mb-7 rounded-[28px] bg-[#173b63] px-6 py-7 text-center shadow-lg">
          <p className="mb-2 text-xs font-black tracking-[0.25em] text-[#f9dca4]">
            SPECIAL CHALLENGE
          </p>

          <h1 className="text-3xl font-black leading-tight text-[#fff8e8] sm:text-4xl">
            Challengenya
          </h1>

          <h2 className="mt-1 text-3xl font-black leading-tight text-[#f9dca4] sm:text-4xl">
            Kang Fathur
          </h2>

          <p className="mt-4 text-sm font-semibold leading-relaxed text-[#edf5ff]">
            Selesaikan misinya yaa, wajib!
            <br />
            Gampang kok, owkaokwoakwok 😭
          </p>
        </header>

        {/* FORM */}
        {step === "form" && (
          <section className="space-y-5">

            <div className="rounded-[26px] bg-white p-6 shadow-md">
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-wider text-[#7a9ab9]">
                  STEP 01
                </p>

                <h2 className="mt-1 text-2xl font-black">
                  Kenalan dulu 👋
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Isi nama dan kelas kamu sebelum mulai challenge.
                </p>
              </div>

              <label className="mb-2 block text-sm font-bold">
                Nama
              </label>

              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="mb-5 w-full rounded-2xl border-2 border-[#d8e3ee] bg-[#fbfdff] px-4 py-3 outline-none transition focus:border-[#4d82b0]"
              />

              <label className="mb-2 block text-sm font-bold">
                Kelas
              </label>

              <select
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#d8e3ee] bg-[#fbfdff] px-4 py-3 outline-none transition focus:border-[#4d82b0]"
              >
                <option value="">Pilih kelas</option>

                {KELAS_LIST.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={mulaiChallenge}
              className="w-full rounded-2xl bg-[#2e6698] px-5 py-4 text-base font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#245780]"
            >
              Mulai Challenge →
            </button>
          </section>
        )}

        {/* CHALLENGE */}
        {step === "challenge" && (
          <section className="space-y-5">

            <div className="rounded-[26px] bg-white p-6 shadow-md">
              <p className="text-xs font-black uppercase tracking-wider text-[#7a9ab9]">
                STEP 02
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Challenge kamu 🎯
              </h2>

              <div className="mt-5 space-y-3">
                {CHALLENGES.map((challenge) => (
                  <div
                    key={challenge.number}
                    className="flex gap-4 rounded-2xl bg-[#f5f8fb] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#173b63] text-xs font-black text-white">
                      {challenge.number}
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-slate-700">
                      {challenge.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border-2 border-[#e8d39c] bg-[#fff7df] p-6">
              <h3 className="font-black">
                Sebelum lanjut:
              </h3>

              <div className="mt-3 space-y-2 text-sm font-medium text-slate-700">
                <p>✓ Selesaikan challenge.</p>
                <p>✓ Screenshot hasilnya lalu kolasekan 3 screenshot.</p>
                <p>✓ Pastikan screenshot terlihat jelas.</p>
                <p>✓ Upload screenshot pada tahap berikutnya.</p>
              </div>
            </div>

            <button
              onClick={() => setStep("upload")}
              className="w-full rounded-2xl bg-[#2e6698] px-5 py-4 font-black text-white shadow-md transition hover:bg-[#245780]"
            >
              Sudah Selesai → Upload Bukti
            </button>
          </section>
        )}

        {/* UPLOAD */}
        {step === "upload" && (
          <section className="space-y-5">

            <div className="rounded-[26px] bg-white p-6 shadow-md">
              <p className="text-xs font-black uppercase tracking-wider text-[#7a9ab9]">
                STEP 03
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Upload bukti 📸
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Upload screenshot kolase hasil challenge kamu.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  pilihFile(e.target.files?.[0])
                }
              />

              {!preview ? (
                <button
                  onClick={bukaFilePicker}
                  className="mt-6 flex min-h-52 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#a9c1d6] bg-[#f7fafc] p-6 text-center transition hover:bg-[#eef5fa]"
                >
                  <span className="text-5xl">📸</span>

                  <span className="mt-3 text-base font-black">
                    Pilih Screenshot
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG, WEBP • Maks. 10 MB
                  </span>
                </button>
              ) : (
                <div className="mt-6">
                  <div className="overflow-hidden rounded-3xl border-2 border-[#d8e3ee] bg-[#f7fafc]">
                    <img
                      src={preview}
                      alt="Preview screenshot"
                      className="max-h-[500px] w-full object-contain"
                    />
                  </div>

                  <button
                    onClick={bukaFilePicker}
                    className="mt-3 w-full rounded-2xl border-2 border-[#d8e3ee] bg-white px-4 py-3 text-sm font-bold transition hover:bg-[#f7fafc]"
                  >
                    Ganti Screenshot
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={lanjutUpload}
              disabled={!file}
              className="w-full rounded-2xl bg-[#2e6698] px-5 py-4 font-black text-white shadow-md transition hover:bg-[#245780] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Lanjut →
            </button>
          </section>
        )}

        {/* CONFIRM */}
        {step === "confirm" && (
          <section className="space-y-5">

            <div className="rounded-[26px] bg-white p-6 shadow-md">
              <p className="text-xs font-black uppercase tracking-wider text-[#7a9ab9]">
                STEP 04
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Konfirmasi
              </h2>

              <div className="mt-5 rounded-2xl bg-[#f5f8fb] p-4">
                <p className="text-xs font-bold uppercase text-slate-400">
                  Nama
                </p>

                <p className="mt-1 font-black">
                  {nama}
                </p>

                <p className="mt-4 text-xs font-bold uppercase text-slate-400">
                  Kelas
                </p>

                <p className="mt-1 font-black">
                  {kelas}
                </p>
              </div>

              {preview && (
                <div className="mt-5 overflow-hidden rounded-3xl">
                  <img
                    src={preview}
                    alt="Screenshot bukti"
                    className="max-h-[450px] w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="rounded-[26px] border-2 border-[#e8d39c] bg-[#fff7df] p-5">
              <p className="text-sm font-semibold leading-relaxed text-slate-700">
                Pastikan nama, kelas, dan screenshot kamu sudah benar sebelum dikirim.
              </p>
            </div>

            <button
              onClick={konfirmasiSubmission}
              disabled={uploading}
              className="w-full rounded-2xl bg-[#173b63] px-5 py-4 font-black text-white shadow-md transition hover:bg-[#102d4d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Mengupload Screenshot..."
                : "Konfirmasi & Kirim →"}
            </button>
          </section>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <section className="space-y-5">

            <div className="rounded-[30px] bg-white p-7 text-center shadow-lg">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f4e8] text-4xl">
                🎉
              </div>

              <p className="mt-5 text-xs font-black tracking-[0.2em] text-[#7a9ab9]">
                CHALLENGE SELESAI
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Mantap! 🎉
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Konfirmasi WhatsApp sudah dibuka.
                Tinggal kirim pesannya yaa.
              </p>

              <div className="mt-6 rounded-2xl bg-[#fff7df] p-4">
                <p className="font-black text-[#173b63]">
                  Menunggu Verifikasi
                </p>
              </div>

              <p className="mt-5 text-sm font-medium text-slate-600">
                Terima kasih sudah ikut challenge! 💙
              </p>
            </div>

            <button
              onClick={kirimWhatsApp}
              className="w-full rounded-2xl bg-[#25d366] px-5 py-4 font-black text-white shadow-md transition hover:bg-[#1fb857]"
            >
              Konfirmasi via WhatsApp
            </button>

            <p className="pb-3 text-center text-sm font-black text-[#173b63]">
              Yang Semangat Yaa!
            </p>
          </section>
        )}

      </div>
    </main>
  );
}