import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Letter = () => {
  const [opened, setOpened] = useState(false);
  const [current, setCurrent] = useState(0);
  const [speeches, setSpeeches] = useState([]);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchSpeeches = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/speeches`);
      setSpeeches([...response.data]);
    } catch (error) {
      console.error("Error fetching speeches:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeeches();
  }, []);

  const handleOpen = () => {
    setOpened(true);
  };

  const nextSpeech = () => {
    setFlipped(!flipped);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % speeches.length);
      setFlipped(false);
    }, 300);
  };

  const prevSpeech = () => {
    setFlipped(!flipped);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + speeches.length) % speeches.length);
      setFlipped(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white font-semibold text-lg">Membuka surat...</p>
      </div>
    );
  }

  if (speeches.length === 0) {
    return (
      <div className="max-w-md mx-4 p-8 font-montserrat bg-white rounded-2xl shadow-2xl text-center">
        <div className="text-6xl mb-4">💌</div>
        <p className="text-gray-700 font-semibold text-xl mb-2">
          Wkwk kan udah dibilang sekali liat
        </p>
        <p className="text-gray-600">
          Malu soalnya. Selamat yakkk!
        </p>
      </div>
    );
  }

  return (
    <div className="relative font-montserrat flex flex-col items-center justify-center min-h-[320px] px-4">
      <AnimatePresence mode="wait">
        {!opened ? (
          // Closed Envelope
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative cursor-pointer group"
            onClick={handleOpen}
          >
            {/* Envelope Shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/30 to-red-400/30 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            {/* Envelope Body */}
            <div className="relative w-80 h-48 bg-gradient-to-br from-[#f0a8a8] to-[#f5b4b4] rounded-lg shadow-2xl overflow-hidden border-2 border-[#e29393] group-hover:shadow-3xl transition-all duration-300">
              {/* Envelope Flap */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                  className="absolute top-0 left-0 w-full h-full"
                >
                  <defs>
                    <linearGradient id="flapGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f5b4b4" />
                      <stop offset="100%" stopColor="#f0a8a8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,0 L100,70 L200,0 Z"
                    fill="url(#flapGradient)"
                    stroke="#e29393"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Decorative Hearts */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                {[...Array(3)].map((_, i) => (
                  <svg key={i} className="w-8 h-8 text-red-400 mx-2 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>

              {/* Call to Action */}
              <div className="absolute bottom-6 w-full flex flex-col items-center z-10">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="mb-2 p-2 bg-white/80 rounded-full shadow-lg">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <p className="text-white font-bold tracking-wide text-lg drop-shadow-lg">
                    Klik untuk Buka
                  </p>
                  <p className="text-xs italic text-red-100 tracking-wider mt-1">
                    (cuma sekali liat ya!)
                  </p>
                </motion.div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-all duration-500"></div>
            </div>
          </motion.div>
        ) : (
          // Opened Envelope with Letter
          <motion.div
            key="opened"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col items-center"
          >
            {/* Envelope Opening Animation */}
            <div className="relative w-80 h-48 bg-gradient-to-br from-[#f0a8a8] to-[#f5b4b4] rounded-lg shadow-xl overflow-hidden border-2 border-[#e29393]">
              <motion.div
                className="absolute top-0 left-0 w-full h-full origin-top"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: 180 }}
                transition={{ duration: 1.2, ease: [0.6, 0.01, 0.05, 0.95] }}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "top center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                  className="absolute top-0 left-0 w-full h-full"
                >
                  <defs>
                    <linearGradient id="flapOpenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f5b4b4" />
                      <stop offset="100%" stopColor="#f0a8a8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,0 L100,70 L200,0 Z"
                    fill="url(#flapOpenGradient)"
                    stroke="#e29393"
                    strokeWidth="2"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Letter Paper */}
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ 
                y: -30, 
                opacity: 1,
                rotateY: flipped ? 5 : 0,
                scale: flipped ? 0.95 : 1
              }}
              transition={{
                y: { delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { delay: 0.6, duration: 0.6 },
                rotateY: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              className="absolute top-[-150px] sm:top-[-150px] md:top-[-80px] w-[90%] max-w-md bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden flex flex-col"
              style={{ maxHeight: '70vh' }}
            >
              {/* Paper Content */}
              <div className="paper-lined flex-1 overflow-y-auto p-6 sm:p-8">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Header with Decorative Line */}
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      {speeches[current].header}
                    </h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-red-400 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
                    {speeches[current].content.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-justify">
                        {/* {paragraph} */}
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque cupiditate laudantium asperiores deserunt reprehenderit velit unde eligendi veniam dignissimos dolor. Illum consequuntur laboriosam aliquam reiciendis asperiores similique possimus? Incidunt, inventore?
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde esse, odio aperiam ducimus eveniet necessitatibus reprehenderit ullam optio in dolorum similique sapiente adipisci magnam ex eaque eos at cum voluptatibus.
                      </p>
                    ))}
                  </div>

                  {/* Signature */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-right text-gray-600 italic font-medium">
                      — {speeches[current].from}
                    </p>
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="mt-8 flex items-center gap-3">
                  {/* Previous Button */}
                  {speeches.length > 1 && current > 0 && (
                    <button
                      onClick={prevSpeech}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Sebelumnya
                    </button>
                  )}

                  {/* Progress Indicator */}
                  {speeches.length > 1 && (
                    <div className="flex items-center gap-1">
                      {speeches.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === current 
                              ? 'w-8 bg-gradient-to-r from-pink-400 to-red-400' 
                              : 'w-2 bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  )}

                  {/* Next/Close Button */}
                  {current === speeches.length - 1 ? (
                    <button
                      onClick={() => setOpened(false)}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      Tutup
                      <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={nextSpeech}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      Lanjut
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Speech Counter */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Pesan {current + 1} dari {speeches.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Letter