"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase";

type Submission = {
  id: string;
  nama: string;
  kelas: string;
  screenshotURL: string;
  status: string;
  createdAt?: {
    seconds: number;
  };
};

export default function AdminPage() {
  const [user, setUser] = useState(auth.currentUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState<Submission[]>([]);

  const [loading, setLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "challengeSubmissions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Submission[] = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<Submission, "id">),
      }));

      setData(items);
    });

    return () => unsubscribe();
  }, [user]);

  async function login() {
    if (!email || !password) {
      alert("Masukkan email dan password.");
      return;
    }

    try {
      setLoginLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
    } catch (error) {
      console.error(error);

      alert(
        "Login gagal. Periksa email dan password admin."
      );
    } finally {
      setLoginLoading(false);
    }
  }

  async function ubahStatus(
    id: string,
    status: string
  ) {
    try {
      await updateDoc(
        doc(db, "challengeSubmissions", id),
        {
          status,
        }
      );
    } catch (error) {
      console.error(error);
      alert("Gagal mengubah status.");
    }
  }

  function formatTanggal(
    createdAt?: {
      seconds: number;
    }
  ) {
    if (!createdAt?.seconds) {
      return "Baru saja";
    }

    return new Date(
      createdAt.seconds * 1000
    ).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f0df]">
        <p className="font-bold text-[#173b63]">
          Memuat...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f0df] px-5">
        <div className="w-full max-w-md rounded-[30px] bg-white p-7 shadow-xl">

          <div className="text-center">
            <p className="text-xs font-black tracking-[0.2em] text-[#7a9ab9]">
              ADMIN AREA
            </p>

            <h1 className="mt-2 text-3xl font-black text-[#173b63]">
              Challenge Kang Fathur
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Login untuk melihat submission peserta.
            </p>
          </div>

          <div className="mt-7 space-y-4">

            <div>
              <label className="mb-2 block text-sm font-bold">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email admin"
                className="w-full rounded-2xl border-2 border-[#d8e3ee] px-4 py-3 outline-none focus:border-[#4d82b0]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password admin"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
                className="w-full rounded-2xl border-2 border-[#d8e3ee] px-4 py-3 outline-none focus:border-[#4d82b0]"
              />
            </div>

            <button
              onClick={login}
              disabled={loginLoading}
              className="w-full rounded-2xl bg-[#173b63] px-5 py-4 font-black text-white transition hover:bg-[#102d4d] disabled:opacity-60"
            >
              {loginLoading
                ? "Memproses..."
                : "Login Admin"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  const menunggu = data.filter(
    (item) => item.status === "Menunggu Verifikasi"
  ).length;

  const diterima = data.filter(
    (item) => item.status === "Diterima"
  ).length;

  const ditolak = data.filter(
    (item) => item.status === "Ditolak"
  ).length;

  return (
    <main className="min-h-screen bg-[#f7f0df] px-4 py-6 text-[#173b63] sm:px-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-[#173b63] p-6 text-white sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-black tracking-[0.2em] text-[#f9dca4]">
              ADMIN DASHBOARD
            </p>

            <h1 className="mt-1 text-2xl font-black sm:text-3xl">
              Challenge Kang Fathur
            </h1>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold transition hover:bg-white/20"
          >
            Logout
          </button>
        </header>

        {/* STATISTIK */}

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">
              TOTAL
            </p>

            <p className="mt-1 text-3xl font-black">
              {data.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">
              MENUNGGU
            </p>

            <p className="mt-1 text-3xl font-black text-orange-500">
              {menunggu}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">
              DITERIMA
            </p>

            <p className="mt-1 text-3xl font-black text-green-600">
              {diterima}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400">
              DITOLAK
            </p>

            <p className="mt-1 text-3xl font-black text-red-500">
              {ditolak}
            </p>
          </div>

        </section>

        {/* DATA */}

        <section className="rounded-[28px] bg-white p-5 shadow-md sm:p-6">

          <div className="mb-5">
            <h2 className="text-xl font-black">
              Submission Peserta
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Screenshot peserta yang masuk.
            </p>
          </div>

          {data.length === 0 ? (
            <div className="rounded-2xl bg-[#f5f8fb] p-10 text-center">
              <p className="font-bold text-slate-500">
                Belum ada submission.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">

              {data.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-[#e3eaf1] bg-[#fbfdff]"
                >

                  <button
                    onClick={() =>
                      setSelectedImage(
                        item.screenshotURL
                      )
                    }
                    className="block w-full bg-slate-100"
                  >
                    <img
                      src={item.screenshotURL}
                      alt={`Screenshot ${item.nama}`}
                      className="h-64 w-full object-contain transition hover:scale-[1.02]"
                    />
                  </button>

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="font-black text-lg">
                          {item.nama}
                        </h3>

                        <p className="mt-1 text-sm font-bold text-[#4d82b0]">
                          {item.kelas}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${
                          item.status ===
                          "Diterima"
                            ? "bg-green-100 text-green-700"
                            : item.status ===
                              "Ditolak"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                      {formatTanggal(
                        item.createdAt
                      )}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-2">

                      <button
                        onClick={() =>
                          ubahStatus(
                            item.id,
                            "Diterima"
                          )
                        }
                        className="rounded-xl bg-green-600 px-3 py-3 text-sm font-black text-white transition hover:bg-green-700"
                      >
                        ✓ Terima
                      </button>

                      <button
                        onClick={() =>
                          ubahStatus(
                            item.id,
                            "Ditolak"
                          )
                        }
                        className="rounded-xl bg-red-500 px-3 py-3 text-sm font-black text-white transition hover:bg-red-600"
                      >
                        × Tolak
                      </button>

                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>
      </div>

      {/* IMAGE MODAL */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
          onClick={() => setSelectedImage("")}
        >
          <div className="relative max-h-[90vh] max-w-5xl">

            <img
              src={selectedImage}
              alt="Screenshot peserta"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain"
            />

            <button
              onClick={() => setSelectedImage("")}
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white font-black text-black shadow-lg"
            >
              ×
            </button>

          </div>
        </div>
      )}

    </main>
  );
}