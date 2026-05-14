import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, type ChangeEvent } from "react";
import type { ReactNode } from "react";
import { path1, path2 } from "../svgData/zine-icon";
import { path1PP, path2PP, path3PP } from "../svgData/p-icon";
import { useNavigate } from "react-router-dom";

interface WigglySvgProps {
  children: ReactNode;
  id: string;
  viewBox: string;
  baseFrequency?: string;
  scale?: string;
  dur?: string;
  preserveAspectRatio?: string;
}

const WigglySvg = ({
  children,
  id,
  viewBox,
  baseFrequency = "0.03 0.04",
  scale = "1.5",
  dur = "0.4s",
  preserveAspectRatio = "xMidYMid meet",
}: WigglySvgProps) => (
  <svg
    width="100%"
    height="100%"
    viewBox={viewBox}
    preserveAspectRatio={preserveAspectRatio}
    style={{ overflow: "visible" }}
  >
    <defs>
      <filter
        id={`wiggle-${id}`}
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves="3"
          result="noise"
        >
          <animate
            attributeName="seed"
            values="0;1;2;3"
            dur={dur}
            calcMode="discrete"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={scale}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
    <g filter={`url(#wiggle-${id})`}>{children}</g>
  </svg>
);

export default function UploadScreen() {
  const navigate = useNavigate();

  const [images, setImages] = useState<(string | null)[]>(Array(8).fill(null));
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...images];
    let currentSlotIndex = index;
    let hasSizeError = false;

    for (let i = 0; i < files.length; i++) {
      while (currentSlotIndex < 8 && newImages[currentSlotIndex] !== null) {
        currentSlotIndex++;
      }

      if (currentSlotIndex >= 8) break;

      const file = files[i];
      if (file.size > 1048576) {
        hasSizeError = true;
        continue;
      }

      const url = URL.createObjectURL(file);
      newImages[currentSlotIndex] = url;
      currentSlotIndex++;
    }

    setImages(newImages);

    if (hasSizeError) {
      setToastMessage("A imagem deve ter no máximo 1MB.");
      setTimeout(() => setToastMessage(""), 3000);
    }

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    if (newImages[index]) {
      URL.revokeObjectURL(newImages[index] as string);
      newImages[index] = null;
      setImages(newImages);
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index]!.value = "";
      }
    }
  };

  const handleGenerateClick = () => {
    const hasAtLeastOneImage = images.some((img) => img !== null);

    if (hasAtLeastOneImage) {
      navigate("/download", { state: { images } });
    } else {
      setToastMessage("Envie pelo menos 1 foto");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: "100%",
        height: "100dvh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "60px 30px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WigglySvg
          id="zine-scribble"
          viewBox="0 0 49 38"
          scale="5"
          baseFrequency="0.04 0.05"
        >
          <path d={path1} fill="var(--color-blue)" />
          <path d={path2} fill="var(--color-blue)" />
        </WigglySvg>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: "40px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-blue)",
            fontWeight: 700,
          }}
        >
          envie as imagens para criar seu zine
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: "12px",
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => !img && fileInputRefs.current[i]?.click()}
              style={{
                width: "100%",
                aspectRatio: "1/1.5",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: img ? "default" : "pointer",
              }}
            >
              {!img && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                    }}
                  >
                    <WigglySvg
                      id={`border-${i}`}
                      viewBox="0 0 100 100"
                      baseFrequency="0.015 0.02"
                      scale="6"
                      dur="0.5s"
                      preserveAspectRatio="none"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="96"
                        height="96"
                        fill="none"
                        stroke="var(--color-blue)"
                        strokeWidth="2"
                        strokeDasharray="6 8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </WigglySvg>
                  </div>

                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      pointerEvents: "none",
                    }}
                  >
                    <WigglySvg
                      id={`upload-${i}`}
                      viewBox="0 0 24 24"
                      baseFrequency="0.03 0.04"
                      scale="3"
                      dur="0.4s"
                    >
                      <path
                        d="M12 16V4m0 0l-4 4m4-4l4 4M6 20h12"
                        stroke="var(--color-blue)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </WigglySvg>
                  </div>
                </>
              )}

              {img && (
                <>
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(i);
                    }}
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      width: "24px",
                      height: "24px",
                      background: "var(--color-bg)",
                      border: "none",
                      padding: "2px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <WigglySvg
                      id={`close-${i}`}
                      viewBox="0 0 24 24"
                      baseFrequency="0.02 0.03"
                      scale="5"
                      dur="0.3s"
                    >
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="var(--color-blue)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </WigglySvg>
                  </button>
                </>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                ref={(el) => {
                  fileInputRefs.current[i] = el;
                }}
                style={{ display: "none" }}
                onChange={(e) => handleUpload(i, e)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleGenerateClick}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-blue)",
            fontSize: "0.9rem",
            fontWeight: "800",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
          }}
        >
          gerar meu zine
        </button>
      </div>

      <div
        style={{
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WigglySvg
          id="zine-p"
          viewBox="0 0 24 28"
          scale="5"
          baseFrequency="0.05 0.06"
        >
          <g>
            <path d={path1PP} fill="var(--color-blue)" />
            <path d={path2PP} fill="var(--color-blue)" />
            <path d={path3PP} fill="var(--color-blue)" />
          </g>
        </WigglySvg>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            style={{
              position: "absolute",
              top: "50px",
              left: "50%",
              width: "280px",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              <WigglySvg
                id="toast-border"
                viewBox="0 0 280 60"
                baseFrequency="0.015 0.02"
                scale="4"
                dur="0.4s"
                preserveAspectRatio="none"
              >
                <rect
                  x="3"
                  y="3"
                  width="274"
                  height="54"
                  fill="var(--color-bg)"
                  stroke="var(--color-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </WigglySvg>
            </div>
            <span
              style={{
                color: "var(--color-blue)",
                fontWeight: 800,
                fontSize: "12px",
                textAlign: "center",
                zIndex: 1,
                padding: "0 10px",
                textTransform: "uppercase",
              }}
            >
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
