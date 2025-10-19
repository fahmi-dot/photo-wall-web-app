import { useEffect, useState } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import Letter from "./components/Letter";

function App() {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [perRow, setPerRow] = useState(getPerRow());
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  function getPerRow() {
    if (window.innerWidth <= 640) return 2;
    if (window.innerWidth <= 1024) return 4;
    return 5;
  }

  useEffect(() => {
    const handleResize = () => setPerRow(getPerRow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/images`);
      setImages([...response.data, ...response.data, ...response.data, ...response.data]);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const rows = [];
  for (let i = 0; i < images.length; i += perRow) {
    rows.push(images.slice(i, i + perRow));
  }

  return (
    <div className="relative min-h-screen bg-[#f5f2ed] font-montserrat py-10 overflow-x-hidden">
      {/* Floating Action Buttons dengan Pulse Effect */}
      <button
        onClick={() => {
          setShowForm(!showForm);
          setShowLetter(false);
        }}
        className="fixed bottom-4 right-4 z-50 group"
        aria-label={showForm ? "Tutup form" : "Tambah foto"}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative px-6 py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
            {showForm ? (
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tutup
              </span>
            ) : (
              <span className="text-2xl leading-none">+</span>
            )}
          </div>
        </div>
      </button>

      <button
        onClick={() => {
          setShowLetter(!showLetter);
          setShowForm(false);
        }}
        className="fixed bottom-4 left-4 z-50 group"
        aria-label="Buka surat"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Buka pi
          </div>
        </div>
      </button>

      <div className="container mx-auto px-4 text-center relative">
        {/* Header dengan Animasi */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-3 tracking-tight">
            My Wall
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-lg">Kenangan yang digantung di dinding</span>
            <span className="text-2xl animate-swing">🎞️</span>
          </div>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Upload Form dengan Slide Animation */}
        {showForm && (
          <div className="mb-10 mt-16 animate-slide-down">
            <UploadForm
              onUploadSuccess={() => {
                fetchImages();
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Letter Modal dengan Backdrop */}
        {showLetter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-float"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${3 + Math.random() * 2}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowLetter(false)}
              className="absolute top-4 right-4 z-[102] p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Tutup surat"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative z-[101]">
              <Letter />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 animate-pulse">Memuat foto-foto...</p>
          </div>
        ) : (
          /* Photo Gallery */
          <div className="flex flex-col items-center gap-16 mt-8">
            {rows.map((row, i) => (
              <div
                key={i}
                className="photo-row relative flex justify-center flex-wrap items-start gap-6 w-full"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                {row.map((image, idx) =>
                  image.imageUrl ? (
                    <div
                      key={image.id}
                      className="polaroid z-40 relative w-40 bg-white shadow-lg p-2 rounded-sm transition-all duration-300 hover:z-20 cursor-pointer group"
                      style={{
                        transform: `rotate(${(Math.random() * 10 - 5).toFixed(2)}deg)`,
                        animationDelay: `${idx * 0.05}s`,
                      }}
                    >
                      {/* Clip */}
                      <div className="clip absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
                        <div className="clip-inner w-5 h-3 bg-gradient-to-b from-[#deb887] to-[#c9a77f] rounded-sm shadow-md relative">
                          <div className="clip-seam absolute w-[1px] h-3 bg-[#c79b75] left-1/2 -translate-x-1/2"></div>
                        </div>
                      </div>

                      {/* Image dengan Loading Effect */}
                      <div className="relative w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden">
                        <img
                          src={image.imageUrl}
                          alt={image.caption}
                          className="w-full h-full object-cover rounded-sm transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>

                      {/* Caption dengan Gradient Overlay */}
                      {image.caption && (
                        <p className="text-xs font-semibold text-gray-800 mt-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
                          {image.caption}
                        </p>
                      )}
                      {image.createdBy && (
                        <p className="text-xs text-gray-600 mt-1 group-hover:text-gray-800 transition-colors">
                          oleh: {image.createdBy}
                        </p>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm pointer-events-none"></div>
                    </div>
                  ) : null
                )}
              </div>
            ))}

            {/* Empty State */}
            {images.length === 0 && !loading && (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-gray-600 text-lg mb-2">Belum ada foto yang ditampilkan</p>
                <p className="text-gray-500 text-sm">Klik tombol + untuk menambahkan foto pertama!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;