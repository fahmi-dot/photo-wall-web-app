import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function UploadForm({ onUploadSuccess }) {
  const [createdBy, setCreatedBy] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Validasi ukuran file (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran file terlalu besar! Maksimal 5MB");
        return;
      }

      // Validasi tipe file
      if (!selectedFile.type.startsWith("image/")) {
        setError("File harus berupa gambar!");
        return;
      }

      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !caption || !createdBy) {
      setError("Semua field harus diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("createdBy", createdBy);
    formData.append("caption", caption);
    formData.append("file", file);

    setIsUploading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success animation
      setSuccess(true);

      setTimeout(() => {
        setCreatedBy("");
        setCaption("");
        setFile(null);
        setPreview(null);
        setSuccess(false);
        e.target.reset();
        onUploadSuccess();
      }, 1500);
    } catch (err) {
      setError("Gagal mengunggah foto. Coba lagi ya!");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const removePreview = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="w-[95%] sm:w-full max-w-md mx-auto font-montserrat bg-white border-2 border-blue-200 shadow-2xl p-4 sm:p-6 rounded-2xl relative overflow-hidden animate-slide-down max-h-[85vh] flex flex-col">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-100 to-transparent rounded-full -ml-12 -mb-12 opacity-50"></div>

      {/* Header */}
      <div className="relative mb-3 sm:mb-4 text-center flex-shrink-0">
        <div className="inline-block">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1 sm:mb-2">
            Tambah Foto
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-400 to-pink-400 mx-auto rounded-full"></div>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2">
          Abadikan <b>kenangan</b> di e-dinding ini. Kalo gamau juga gapapa :D
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 sm:space-y-4 relative flex-1 flex flex-col overflow-y-auto px-1"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Nama Input */}
          <div className="group">
            <label
              htmlFor="by"
              className="flex items-center gap-2 text-blue-800 font-semibold mb-2 text-xs sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Nama
            </label>
            <input
              type="text"
              id="by"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              placeholder="Siapa yang menambahkan?"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300"
              required
            />
          </div>

          {/* Caption Input */}
          <div className="group">
            <label
              htmlFor="caption"
              className="flex items-center gap-2 text-blue-800 font-semibold mb-2 text-xs sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Keterangan
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Ceritakan tentang foto ini..."
              rows="3"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:border-blue-300 resize-none"
              required
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {caption.length}/200 karakter
            </div>
          </div>

          {/* File Input */}
          <div className="group">
            <label
              htmlFor="file"
              className="flex items-center gap-2 text-blue-800 font-semibold mb-2 text-xs sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Pilih Foto
            </label>

            {!preview ? (
              <div className="relative">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  required
                />
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-300 group"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 group-hover:text-blue-500 transition-colors mb-1 sm:mb-2"
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
                  <span className="text-xs sm:text-sm text-blue-600 font-medium">
                    Klik untuk upload
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    PNG, JPG, GIF (max. 5MB)
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative group/preview">
                {/* Preview Image dengan Polaroid Style */}
                <div className="relative w-full bg-white shadow-lg p-2 sm:p-3 rounded-lg border-2 border-blue-200">
                  <div className="relative w-full h-40 sm:h-48 overflow-hidden rounded-lg">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/preview:scale-105"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={removePreview}
                    className="absolute top-1 right-1 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover/preview:opacity-100 hover:scale-110"
                    aria-label="Hapus preview"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-2 text-center truncate">
                  {file?.name} ({(file?.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-600 text-xs sm:text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-green-600 text-xs sm:text-sm font-medium">
                Foto berhasil diunggah!
              </p>
            </div>
          )}
        </div>

        {/* Submit Button - Fixed at Bottom */}
        <div className="flex-shrink-0 pt-3 sm:pt-4">
          <button
            type="submit"
            disabled={isUploading || success}
            className="relative w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl overflow-hidden group disabled:hover:shadow-lg"
          >
            {/* Button Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <span className="relative flex items-center justify-center gap-2">
              {isUploading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Mengunggah...
                </>
              ) : success ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Berhasil!
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Unggah
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

UploadForm.propTypes = {
  onUploadSuccess: PropTypes.func.isRequired,
};

export default UploadForm;
