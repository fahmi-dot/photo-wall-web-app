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

  const deleteSpeechById = async (id) => {
    try {
      await axios.delete(`${API_URL}/speeches/${id}`);
    } catch (error) {
      console.error(`Gagal menghapus speech dengan id ${id}:`, error);
    }
  };

  const closeLetter = async () => {
    const speechesToDelete = speeches.slice(0, current + 1);
    await Promise.all(speechesToDelete.map(s => deleteSpeechById(s.id)));
    setSpeeches(prev => prev.slice(current + 1));
    setOpened(false);
    setCurrent(0);
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

  // const prevSpeech = () => {
  //   setFlipped(!flipped);
  //   setTimeout(() => {
  //     setCurrent((prev) => (prev - 1 + speeches.length) % speeches.length);
  //     setFlipped(false);
  //   }, 300);
  // };

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
      <div className="max-w-md mx-4 p-8 font-montserrat bg-white rounded-lg shadow-2xl text-center">
        <p className="text-gray-700 font-semibold text-xl mb-2">
          Selamat yaaa!
        </p>
        <p>🎉🎉🎉</p>
      </div>
    );
  }

  return (
    <div className="relative font-montserrat flex flex-col items-center justify-center min-h-[320px] px-4">
      <AnimatePresence mode="wait">
        {!opened ? (
          /* Closed Envelope */
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
                  className="absolute top-0 left-0 w-full h-full"
                  fill="url(#flapGradient)"
                  stroke="#e29393"
                  strokeWidth="2"
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="flapGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f5b4b4" />
                      <stop offset="100%" stopColor="#f0a8a8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,0 L100,70 L200,0 Z"
                  />
                </svg>
              </div>

              {/* Call to Action */}
              <div className="absolute bottom-6 w-full flex flex-col items-center z-10">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex flex-col items-center"
                >
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
          /* Opened Envelope with Letter */
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
                  className="absolute top-0 left-0 w-full h-full"
                  fill="url(#flapOpenGradient)"
                  stroke="#e29393"
                  strokeWidth="2"
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="flapOpenGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#f5b4b4" />
                      <stop offset="100%" stopColor="#f0a8a8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,0 L100,70 L200,0 Z"
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
                scale: flipped ? 0.95 : 1,
              }}
              transition={{
                y: { delay: 0.6, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { delay: 0.6, duration: 0.6 },
                rotateY: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              className="absolute top-[-150px] sm:top-[-150px] md:top-[-80px] w-[90%] max-w-md bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden flex flex-col"
              style={{ maxHeight: "70vh" }}
            >
              {/* Paper Content */}
              <div className="paper-lined flex-1 overflow-y-auto py-8 pl-10 pr-2">
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
                  <div className="sm:text-base text-gray-700 leading-[25px] sm:leading-[25px]">
                    {speeches[current].content
                      .split("\n")
                      .map((paragraph, idx) => (
                        <p key={idx} className="text-justify">
                          {paragraph}
                        </p>
                      ))}
                  </div>

                  {/* Signature */}
                  <div className="mt-8 pt-4">
                    <p className="text-right text-gray-600 italic font-medium">
                      — {speeches[current].from}
                    </p>
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="mt-8 pt-5 flex flex-col items-end">
                  {/* Previous Button */}
                  {/* {speeches.length > 1 && current > 0 && (
                    <button
                      onClick={prevSpeech}
                      className="flex-1 flex items-center justify-center gap-2 group"
                    >
                      <svg
                        className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Sebelumnya
                    </button>
                  )} */}

                  {/* Progress Indicator */}
                  {/* {speeches.length > 1 && (
                    <div className="flex mt-1 items-center gap-1">
                      {speeches.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            idx === current 
                              ? 'w-6 bg-gradient-to-r from-gray-300 to-black' 
                              : 'w-1 bg-gray-300'
                          }`}
                        ></div>
                      ))}
                    </div>
                  )} */}

                  {/* Next Button */}
                  {current === speeches.length - 1 ? (
                    <></>
                  ) : (
                    <button
                      onClick={nextSpeech}
                      className="flex-1 flex items-center justify-center gap-2 group"
                    >
                      Lanjut
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={closeLetter}
                    className="flex-1 flex items-center justify-center gap-2 group"
                  >
                    Tutup
                  </button>
                </div>

                {/* Speech Counter */}
                <div className="mt-8 text-center">
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
};

export default Letter;
