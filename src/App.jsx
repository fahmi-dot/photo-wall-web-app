import { useEffect, useState, useRef } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import Letter from "./components/Letter";
import soundFile from "./assets/sounds/ruang_sendiri.mp3";

function App() {
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [perRow, setPerRow] = useState(getPerRow());
  const [loading, setLoading] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const TITLE_APP = import.meta.env.VITE_TITLE_APP;
  const SUBTITLE_APP = import.meta.env.VITE_SUBTITLE_APP;

  const audioRef = useRef(new Audio(soundFile));

  function getPerRow() {
    if (window.innerWidth <= 640) return 2;
    if (window.innerWidth <= 1024) return 4;
    return 5;
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    const processEmbeds = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    const timer = setTimeout(processEmbeds, 500);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [images, selectedImage]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/images`);
      setImages([...response.data]);
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

  const isInstagramEmbed = (image) => {
    return image.type === "instagram";
  };

  const handleShowFrom = () => {
    handlePauseMusic();
    setShowForm(!showForm);
    setShowLetter(false);
  }

  const handleShowLetter = () => {
    handlePauseMusic();
    setShowLetter(!showLetter);
    setShowForm(false);
  }

  const handlePlayMusic = () => {
    audioRef.current.loop = true;
    audioRef.current.play().catch((err) => {
      console.warn("Audio play failed:", err);
    });
    setIsMusicPlaying(true);
  };

  const handlePauseMusic = () => {
    audioRef.current.pause();
    setIsMusicPlaying(false);
  };

  return (
    <div className="relative min-h-screen font-montserrat py-10 overflow-x-hidden">
      {/* Floating Action Buttons dengan Pulse Effect */}
      {/* Play/Pause Button */}
      <button
        onClick={isMusicPlaying ? handlePauseMusic : handlePlayMusic}
        className="fixed bottom-16 right-4 z-50 group"
        aria-label={isMusicPlaying ? "Pause musik" : "Play musik"}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative p-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
            {isMusicPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            )}
          </div>
        </div>
      </button>

      {/* Add Photo Button */}
      <button
        onClick={handleShowFrom}
        className="fixed bottom-4 right-4 z-50 group"
        aria-label={showForm ? "Tutup form" : "Tambah foto"}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
          <div className="relative p-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Open Letter Button */}
      <button
        onClick={handleShowLetter}
        className="fixed bottom-4 left-4 z-50 group"
        aria-label="Buka surat"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative p-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            Buka pi!
          </div>
        </div>
      </button>

      <div className="container mx-auto px-4 text-center relative">
        {/* Header with Animation */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight text-shadow">
            {TITLE_APP}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white font-semibold text-shadow">
            <span className="text-lg">{SUBTITLE_APP}</span>
          </div>
          <div className="mt-4 w-24 h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto rounded-full"></div>
        </div>

        {/* Upload Form with Slide Animation */}
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in">
            {/* Floating Particles for Upload Form */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-300 rounded-full animate-float"
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
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 z-[102] p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Tutup form"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative z-[101] max-h-[90vh] overflow-y-auto">
              <UploadForm
                onUploadSuccess={() => {
                  fetchImages();
                  setShowForm(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Letter Modal with Backdrop */}
        {showLetter && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md animate-fade-in">
            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-red-300 rounded-full animate-float"
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
              <svg
                className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative z-[101]">
              <Letter />
            </div>
          </div>
        )}

        {/* Polaroid Modal - Enlarged View */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
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
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-[112] p-2 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              aria-label="Tutup foto"
            >
              <svg
                className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Enlarged Polaroid */}
            <div
              className="polaroid relative w-[90vw] max-w-[90vw] sm:max-w-[35vw] bg-white shadow-2xl p-4 sm:p-5 md:p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Large Image or Instagram Embed */}
              {isInstagramEmbed(selectedImage) ? (
                <div className="relative max-h-[40vh] sm:max-h-[65vh] bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
                  <div
                    className="mt-24 sm:mt-32 mr-0 sm:mr-0 scale-100 sm:scale-125"
                    dangerouslySetInnerHTML={{
                      __html: `<blockquote class="instagram-media" data-instgrm-permalink="${selectedImage.imageUrl}" data-instgrm-version="13">
                                          <a href="${selectedImage.imageUrl}" target="_blank"></a>
                                        </blockquote>`,
                    }}
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden flex items-center justify-center">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.caption}
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
              )}

              {/* Full Caption */}
              {selectedImage.caption && (
                <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mt-3 md:mt-4 text-center px-2">
                  {selectedImage.caption}
                </p>
              )}
              {selectedImage.createdBy && (
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-2 text-center px-2">
                  oleh: {selectedImage.createdBy}
                </p>
              )}
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
                  image.imageUrl || isInstagramEmbed(image) ? (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image)}
                      className="polaroid relative w-32 sm:w-36 animate-swing bg-white shadow-lg p-2 transition-all duration-300 z-20 cursor-pointer group hover:scale-105 hover:z-30"
                      style={{
                        "--rotate-angle": `${(Math.random() * 16 - 8).toFixed(
                          2
                        )}deg`,
                        animationDelay: `${idx * 0.05}s`,
                      }}
                    >
                      {/* Clip */}
                      <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 flex items-center justify-center z-30">
                        <div className="clip-inner w-4 h-2 sm:w-5 sm:h-3 bg-gradient-to-b from-[#deb887] to-[#c9a77f] rounded-sm shadow-md relative">
                          <div className="clip-seam absolute w-[1px] h-2 sm:h-3 bg-[#c79b75] left-1/2 -translate-x-1/2"></div>
                        </div>
                      </div>

                      <div className="relative w-full h-32 sm:h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm overflow-hidden">
                        {isInstagramEmbed(image) ? (
                          <div className="relative bottom-48 flex items-center justify-center overflow-hidden">
                            <div
                              className="mr-28 sm:mr-24 w-[100%] scale-50"
                              dangerouslySetInnerHTML={{
                                __html: `<blockquote class="instagram-media" data-instgrm-permalink="${image.imageUrl}" data-instgrm-version="13">
                                          <a href="${image.imageUrl}" target="_blank"></a>
                                        </blockquote>`,
                              }}
                            />
                          </div>
                        ) : (
                          <img
                            src={image.imageUrl}
                            alt={image.caption}
                            className="w-full h-full object-cover rounded-sm transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                      </div>

                      {/* Caption with Gradient Overlay */}
                      {image.caption && (
                        <p className="text-xs font-semibold text-gray-800 mt-2 line-clamp-2 transition-colors">
                          {image.caption}
                        </p>
                      )}
                      {image.createdBy && (
                        <p className="text-xs text-gray-600 mt-1 transition-colors">
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
                <p className="text-white text-shadow text-lg mb-2">
                  Belum ada foto yang ditampilkan
                </p>
                <p className="text-white text-shadow text-sm">
                  Klik tombol + untuk menambahkan foto pertama!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
