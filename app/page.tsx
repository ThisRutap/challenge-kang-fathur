"use client";

import { useEffect, useState } from "react";

type Step = "data" | "challenge" | "upload" | "preview" | "success";

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

export default function Home() {
  const [step, setStep] = useState<Step>("data");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Gunakan file JPG, PNG, atau WEBP.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("Ukuran screenshot maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imageUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreview(imageUrl);
  }

  function mulaiChallenge() {
    if (!nama.trim()) {
      alert("Nama belum diisi.");
      return;
    }

    if (!kelas) {
      alert("Silakan pilih kelas terlebih dahulu.");
      return;
    }

    setStep("challenge");
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

    setStep("success");
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#FFF8EA] px-3 py-6 text-[#173B66] sm:px-4 sm:py-10">
      <div className="mx-auto w-full max-w-md sm:max-w-lg">

        {/* HEADER */}
        <header className="mb-6 text-center sm:mb-8">

          {/* LOGO */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] bg-white shadow-lg ring-4 ring-[#DDEBFA] sm:mb-5 sm:h-20 sm:w-20 sm:rounded-[24px]">
            <img
              src="/logo.jpeg"
              alt="Logo Challenge"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E6F2FF] px-3.5 py-2 text-[11px] font-bold text-[#2878C8] sm:px-4 sm:text-xs">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#F6B73C]" />
            SPECIAL CHALLENGE
          </div>

          <h1 className="text-[30px] font-black leading-[1.08] tracking-tight text-[#173B66] sm:text-4xl">
            Challengenya
            <br />
            Kang Fathur
          </h1>

          <p className="mt-3 text-xs leading-relaxed text-[#6C7F95] sm:text-sm">
            Selesaikan misinya yaa, wajib!
            <br />
            Gampang kok, owkaokwoakwok 😭
          </p>
        </header>

        {/* PROGRESS */}
        {step !== "success" && (
          <div className="mb-5 flex w-full items-center gap-1.5 px-1 sm:gap-2 sm:px-2">
            <Progress
              number="1"
              active={step === "data"}
            />

            <Line />

            <Progress
              number="2"
              active={step === "challenge"}
            />

            <Line />

            <Progress
              number="3"
              active={
                step === "upload" ||
                step === "preview"
              }
            />

            <Line />

            <Progress
              number="4"
              active={false}
            />
          </div>
        )}

        {/* MAIN CARD */}
        <div className="w-full overflow-hidden rounded-[26px] border border-[#E8DCC8] bg-white shadow-[0_16px_45px_rgba(43,91,138,0.12)] sm:rounded-[30px] sm:shadow-[0_20px_60px_rgba(43,91,138,0.12)]">

          {/* STEP 1 */}
          {step === "data" && (
            <section className="p-5 sm:p-7">

              <StepTitle
                icon="👋"
                title="Isi Dulu Atuh Ah"
                description="Masukkan data kamu sebelum memulai challenge."
              />

              <div className="space-y-4 sm:space-y-5">

                {/* NAMA */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#284B70]">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    value={nama}
                    onChange={(e) =>
                      setNama(e.target.value)
                    }
                    placeholder="Contoh: Fathurrahman"
                    className="min-h-[50px] w-full rounded-2xl border border-[#DCE5EE] bg-[#F9FBFD] px-4 py-3.5 text-base text-[#173B66] outline-none transition placeholder:text-[#9AAABD] focus:border-[#4A94D6] focus:bg-white focus:ring-4 focus:ring-[#E6F2FF] sm:text-sm"
                  />
                </div>

                {/* KELAS */}
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#284B70]">
                    Kelas
                  </label>

                  <select
                    value={kelas}
                    onChange={(e) =>
                      setKelas(e.target.value)
                    }
                    className="min-h-[50px] w-full rounded-2xl border border-[#DCE5EE] bg-[#F9FBFD] px-4 py-3.5 text-base text-[#173B66] outline-none transition focus:border-[#4A94D6] focus:bg-white focus:ring-4 focus:ring-[#E6F2FF] sm:text-sm"
                  >
                    <option value="">
                      Pilih kelas
                    </option>

                    {KELAS_LIST.map((item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BUTTON */}
                <button
                  onClick={mulaiChallenge}
                  className="group flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#3185D0] px-5 py-4 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(49,133,208,0.25)] transition hover:-translate-y-0.5 hover:bg-[#2675BD] active:translate-y-0 active:scale-[0.99]"
                >
                  Mulai Challenge
                  <span className="transition group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </section>
          )}

          {/* STEP 2 */}
          {step === "challenge" && (
            <section className="p-5 sm:p-7">

              <StepTitle
                icon="🎯"
                title="Challengenya adalah..."
                description="Baca instruksinya baik-baik yaa."
              />

              {/* CHALLENGE BOX */}
              <div className="rounded-[22px] border border-[#F0D9A7] bg-[#FFF7DF] p-4 sm:rounded-[24px] sm:p-5">

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F6C85F] text-2xl shadow-sm sm:h-12 sm:w-12">
                  🎯
                </div>

                <h2 className="mb-4 text-lg font-black leading-tight text-[#173B66] sm:text-xl">
                  Gampang aja challengenya
                </h2>

                <div className="space-y-4 text-sm leading-6 text-[#49627B] sm:leading-7">

                  <ChallengeItem number="1">
                    Post di Instagram Story menggunakan foto
                    <b> TER-ESTETIK </b>
                    kamu tentang SMEA, lalu pakai lagu yang paling
                    menggambarkan diri kamu.
                  </ChallengeItem>

                  <ChallengeItem number="2">
                    Post foto Desuh dan Kasuh yang lucu lalu pakai
                    lagu yang paling menggambarkan Kasuh kamu.
                    Jangan lupa <b>tag Kasuh kamu.</b>
                  </ChallengeItem>

                  <ChallengeItem number="3">
                    Post hobi kamu menggunakan lagu yang paling
                    menggambarkan Kang Fathur hhe.
                  </ChallengeItem>

                  <ChallengeItem number="4">
                    Tag saya di Instagram.
                    Instagramnya tanya ke siapa aja boleh yaa.
                  </ChallengeItem>

                  <ChallengeItem number="5">
                    Udah segitu aja, gampang kan yaa, tag saya disemua story nya!
                    <br />
                    <b>Baca instruksi selanjutnya.</b>
                  </ChallengeItem>

                </div>
              </div>

              {/* REMINDER */}
              <div className="mt-4 rounded-2xl bg-[#EAF5FF] p-4 text-sm leading-6 text-[#35638B] sm:mt-5 sm:leading-7">
                <p className="mb-2 font-bold">
                  📸 Jangan lupa!
                </p>

                <div className="space-y-1.5">
                  <p>✓ Selesaikan challenge.</p>
                  <p>
                    ✓ Screenshot hasilnya lalu kolasekan
                    3 screenshot.
                  </p>
                  <p>
                    ✓ Pastikan screenshot terlihat jelas.
                  </p>
                  <p>
                    ✓ Upload screenshot pada tahap berikutnya.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setStep("upload")}
                className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#3185D0] px-5 py-4 text-sm font-extrabold text-white shadow-[0_10px_25px_rgba(49,133,208,0.25)] transition hover:-translate-y-0.5 hover:bg-[#2675BD] active:scale-[0.99] sm:mt-5"
              >
                Saya Sudah Selesai
                <span>→</span>
              </button>
            </section>
          )}

          {/* STEP 3 */}
          {step === "upload" && (
            <section className="p-5 sm:p-7">

              <StepTitle
                icon="📸"
                title="Upload Screenshot"
                description="Upload hasil challenge kamu di sini."
              />

              <label className="block cursor-pointer">

                <div className="rounded-[22px] border-2 border-dashed border-[#BFD8EE] bg-[#F5FAFF] p-7 text-center transition hover:border-[#3185D0] hover:bg-[#EDF7FF] sm:rounded-[24px] sm:p-9">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDEEFF] text-3xl sm:h-16 sm:w-16">
                    📸
                  </div>

                  <p className="text-sm font-extrabold text-[#284B70] sm:text-base">
                    Klik untuk memilih screenshot
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#8294A8]">
                    JPG, PNG atau WEBP
                    <br />
                    Maksimal 5 MB
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-[#3185D0] shadow-sm">
                    Pilih File
                  </div>

                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

              {file && (
                <div className="mt-5">

                  <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#DCE8F2] bg-[#F8FBFE] p-3.5 sm:p-4">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E3F1FF]">
                      🖼️
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#7A8FA4]">
                        FILE DIPILIH
                      </p>

                      <p className="truncate text-sm font-bold text-[#284B70]">
                        {file.name}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => setStep("preview")}
                    className="mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#3185D0] px-5 py-4 text-sm font-extrabold text-white transition hover:bg-[#2675BD] active:scale-[0.99]"
                  >
                    Lihat Preview
                    <span>→</span>
                  </button>

                </div>
              )}
            </section>
          )}

          {/* STEP 4 */}
          {step === "preview" && (
            <section className="p-5 sm:p-7">

              <StepTitle
                icon="👀"
                title="Periksa Screenshot"
                description="Pastikan screenshot yang kamu upload sudah benar."
              />

              <div className="overflow-hidden rounded-[22px] border border-[#DDE5EC] bg-[#F5F5F5] sm:rounded-[24px]">

                {preview && (
                  <img
                    src={preview}
                    alt="Preview screenshot"
                    className="max-h-[65vh] w-full object-contain"
                    style={{
                      touchAction: "pinch-zoom",
                    }}
                  />
                )}

              </div>

              {/* DATA */}
              <div className="mt-4 rounded-2xl bg-[#F8FAFC] p-3.5 sm:mt-5 sm:p-4">

                <InfoRow
                  label="Nama"
                  value={nama}
                />

                <InfoRow
                  label="Kelas"
                  value={kelas}
                />

                <InfoRow
                  label="File"
                  value={file?.name || "-"}
                />

              </div>

              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-3">

                <button
                  onClick={() => setStep("upload")}
                  className="min-h-[52px] rounded-2xl border border-[#D7E0E8] bg-white px-3 py-3.5 text-sm font-bold text-[#4D6680] transition hover:bg-[#F5F8FA] active:scale-[0.98]"
                >
                  ← Ganti
                </button>

                <button
                  onClick={kirimWhatsApp}
                  className="min-h-[52px] rounded-2xl bg-[#25B864] px-3 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(37,184,100,0.2)] transition hover:bg-[#1EA555] active:scale-[0.98]"
                >
                  Konfirmasi WA
                </button>

              </div>

            </section>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <section className="p-6 text-center sm:p-9">

              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#DDF7E8] text-4xl text-[#25A95B]">
                ✓
              </div>

              <div className="inline-flex rounded-full bg-[#EAF5FF] px-4 py-2 text-xs font-bold text-[#3185D0]">
                CHALLENGE SELESAI
              </div>

              <h2 className="mt-4 text-2xl font-black text-[#173B66]">
                Mantap! 🎉
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-[#71859A]">
                Mantap, Makasih ya udah sampe sejauh ini niatnya!!.
                <br />
                Tinggal kirim pesannya yaa.
              </p>

              <div className="mt-6 rounded-[22px] bg-[#F8FAFC] p-4 text-left sm:p-5">

                <InfoRow
                  label="Nama"
                  value={nama}
                />

                <InfoRow
                  label="Kelas"
                  value={kelas}
                />

                <div className="mt-3 border-t border-[#E6EDF3] pt-3">
                  <div className="flex items-center justify-between gap-3">

                    <span className="text-sm text-[#8292A3]">
                      Status
                    </span>

                    <span className="rounded-full bg-[#DDF7E8] px-3 py-1 text-xs font-bold text-[#209452]">
                      Menunggu Verifikasi
                    </span>

                  </div>
                </div>

              </div>

              <p className="mt-6 text-xs text-[#9AA9B8]">
                Terima kasih sudah ikut challenge! 💙
              </p>

            </section>
          )}

        </div>

        {/* FOOTER */}
        <footer className="mt-5 pb-2 text-center text-xs text-[#9AA3AB] sm:mt-6">
          Yang Semangat Yaa!
        </footer>

      </div>
    </main>
  );
}


/* =========================
   COMPONENTS
========================= */

function StepTitle({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">

      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF5FF] text-xl">
        {icon}
      </div>

      <h2 className="text-[22px] font-black leading-tight tracking-tight text-[#173B66] sm:text-2xl">
        {title}
      </h2>

      <p className="mt-1 text-sm leading-relaxed text-[#7A8EA3]">
        {description}
      </p>

    </div>
  );
}


function ChallengeItem({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3185D0] text-xs font-black text-white">
        {number}
      </div>

      <p className="min-w-0 flex-1">
        {children}
      </p>

    </div>
  );
}


function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">

      <span className="shrink-0 text-sm text-[#8292A3]">
        {label}
      </span>

      <span className="max-w-[65%] break-words text-right text-sm font-bold text-[#284B70]">
        {value}
      </span>

    </div>
  );
}


function Progress({
  number,
  active,
}: {
  number: string;
  active: boolean;
}) {
  return (
    <div
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition ${
        active
          ? "bg-[#3185D0] text-white shadow-md shadow-blue-200"
          : "bg-white text-[#A6B5C4] ring-1 ring-[#DCE5ED]"
      }`}
    >
      {number}
    </div>
  );
}


function Line() {
  return (
    <div className="h-[2px] min-w-[8px] flex-1 rounded-full bg-[#E2EAF1]" />
  );
}