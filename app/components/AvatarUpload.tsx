"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faTimes, faImage, faCrop, faUser as faUserIcon } from "@fortawesome/free-solid-svg-icons";

type Point = { x: number; y: number };

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  onAvatarChange: (url: string) => void;
}

export default function AvatarUpload({ currentAvatarUrl, onAvatarChange }: AvatarUploadProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showFaceGuide, setShowFaceGuide] = useState(false);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const readFile = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      const imageData = await readFile(file);
      setImageSrc(imageData as string);
      setIsCropping(true);
      // Reset file input value so same file can be selected again if needed
      e.target.value = "";
    }
  };

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // Set canvas size to 256x256 as requested
    canvas.width = 256;
    canvas.height = 256;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      256,
      256
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/webp", 0.85); // Quality 85%
    });
  };

  const handleUpload = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      const formData = new FormData();
      formData.append("file", croppedBlob, "avatar.webp");

      const res = await fetch("/api/upload/team", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onAvatarChange(data.url);
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="avatar-upload-container">
      <div className="avatar-preview-section" style={{ marginBottom: 15 }}>
        {currentAvatarUrl ? (
          <div className="current-avatar" style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <img src={currentAvatarUrl} alt="Avatar" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
            <button 
                type="button"
                className="remove-avatar-btn" 
                onClick={() => onAvatarChange("")}
                style={{ 
                    padding: "6px 12px", 
                    background: "#fee2e2", 
                    color: "#991b1b", 
                    border: "1px solid #fca5a5", 
                    borderRadius: 6, 
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 500
                }}
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className="no-avatar" style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
                <FontAwesomeIcon icon={faUserIcon} size="2x" />
            </div>
            <span style={{ fontSize: "14px", color: "#6b7280" }}>No avatar uploaded</span>
          </div>
        )}
      </div>

      <div className="upload-controls">
        <div className="mode-switch" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <button 
            type="button"
            onClick={() => setMode("upload")}
            style={{ 
                padding: "6px 12px", 
                background: mode === "upload" ? "#4f46e5" : "#fff", 
                color: mode === "upload" ? "#fff" : "#374151",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6
            }}
          >
            <FontAwesomeIcon icon={faCloudUploadAlt} />
            Upload Image
          </button>
          <button 
            type="button"
            onClick={() => setMode("url")}
            style={{ 
                padding: "6px 12px", 
                background: mode === "url" ? "#4f46e5" : "#fff", 
                color: mode === "url" ? "#fff" : "#374151",
                border: "1px solid #d1d5db",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6
            }}
          >
            <FontAwesomeIcon icon={faImage} />
            Use URL
          </button>
        </div>

        {mode === "upload" ? (
          <div className="file-input-wrapper" style={{ padding: 15, border: "2px dashed #e5e7eb", borderRadius: 8, textAlign: "center" }}>
             <input 
                type="file" 
                id="avatar-upload-input"
                accept="image/png, image/jpeg, image/webp" 
                onChange={onFileChange} 
                style={{ display: "none" }}
            />
            <label htmlFor="avatar-upload-input" style={{ cursor: "pointer", display: "block" }}>
                <div style={{ color: "#4f46e5", marginBottom: 5 }}>Click to upload</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>PNG, JPG, WebP (Max 5MB)</div>
            </label>
          </div>
        ) : (
          <div className="url-input-wrapper" style={{ display: "flex", gap: 10 }}>
             <input 
                type="text" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                style={{ flex: 1, padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: "14px" }}
            />
            <button 
                type="button"
                onClick={() => { if(urlInput) { onAvatarChange(urlInput); setUrlInput(""); } }}
                style={{ padding: "8px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "14px" }}
            >
                Set
            </button>
          </div>
        )}
      </div>

      {isCropping && (
        <div className="crop-modal" style={{ 
            position: "fixed", 
            top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 9999, 
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
          <div className="crop-container" style={{ position: "relative", width: "500px", height: "500px", maxWidth: "90%", maxHeight: "60%", background: "#000", borderRadius: 8, overflow: "hidden" }}>
            <Cropper
              image={imageSrc || ""}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              showGrid={true}
            />
            {showFaceGuide && (
              <div 
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "120px",
                  height: "160px",
                  border: "2px dashed rgba(255, 255, 255, 0.7)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.3)"
                }}
              />
            )}
          </div>
          <div className="crop-controls" style={{ marginTop: 20, width: "500px", maxWidth: "90%", background: "#fff", padding: 20, borderRadius: 8 }}>
            <div className="zoom-slider" style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 10, fontSize: "14px", fontWeight: 500, color: "#374151" }}>Zoom</label>
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    style={{ width: "100%" }}
                />
            </div>
            
            <div className="face-guide-toggle" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <input 
                    type="checkbox" 
                    id="face-guide" 
                    checked={showFaceGuide} 
                    onChange={(e) => setShowFaceGuide(e.target.checked)} 
                />
                <label htmlFor="face-guide" style={{ fontSize: "14px", color: "#374151", cursor: "pointer" }}>Show Center Face Guide</label>
            </div>

            <div className="crop-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button 
                    type="button"
                    onClick={() => { setIsCropping(false); setImageSrc(null); }}
                    style={{ padding: "8px 16px", background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer", fontWeight: 500 }}
                >
                    Cancel
                </button>
                <button 
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{ padding: "8px 16px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 500, opacity: uploading ? 0.7 : 1 }}
                >
                    {uploading ? "Processing..." : "Crop & Upload"}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
