import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import type { ReactNode } from "react";
import { path1, path2 } from "../svgData/zine-icon";
import { path1PP, path2PP, path3PP } from "../svgData/p-icon";
import { useNavigate } from "react-router-dom";

interface WigglySvgProps {
  children?: ReactNode;
  id: string;
  viewBox?: string;
  baseFrequency?: string;
  scale?: string;
  dur?: string;
  preserveAspectRatio?: string;
  style?: React.CSSProperties;
}

const PAGE_LABELS = [
  "Capa",
  "Contra-capa",
  "Pág 6",
  "Pág 5",
  "Pág 1",
  "Pág 2",
  "Pág 3",
  "Pág 4",
];

const WigglySvg = ({
  children,
  id,
  viewBox,
  baseFrequency = "0.03 0.04",
  scale = "1.5",
  dur = "0.4s",
  preserveAspectRatio = "xMidYMid meet",
  style,
}: WigglySvgProps) => (
  <svg
    width={viewBox ? "100%" : "0"}
    height={viewBox ? "100%" : "0"}
    viewBox={viewBox}
    preserveAspectRatio={preserveAspectRatio}
    style={{
      overflow: "visible",
      position: viewBox ? "relative" : "absolute",
      ...style,
    }}
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
    {children && <g filter={`url(#wiggle-${id})`}>{children}</g>}
  </svg>
);

export default function UploadScreen() {
  const navigate = useNavigate();

  const [images, setImages] = useState<(string | null)[]>(Array(8).fill(null));
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    initPanX: 0,
    initPanY: 0,
  });

  const handleUpload = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newImages = [...images];
    let currentSlotIndex = index;
    let hasSizeError = false;
    for (let i = 0; i < files.length; i++) {
      while (currentSlotIndex < 8 && newImages[currentSlotIndex] !== null)
        currentSlotIndex++;
      if (currentSlotIndex >= 8) break;
      const file = files[i];
      if (file.size > 5242880) {
        hasSizeError = true;
        continue;
      }
      const url = URL.createObjectURL(file);
      newImages[currentSlotIndex] = url;
      currentSlotIndex++;
    }
    setImages(newImages);
    if (hasSizeError) {
      setToastMessage("A imagem deve ter no máximo 5MB.");
      setTimeout(() => setToastMessage(""), 3000);
    }
    if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    if (newImages[index]) {
      URL.revokeObjectURL(newImages[index] as string);
      newImages[index] = null;
      setImages(newImages);
    }
  };

  useEffect(() => {
    if (editingIndex === null || !images[editingIndex]) {
      setImgObj(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = images[editingIndex]!;
    img.onload = () => {
      setImgObj(img);
      setZoom(1);
      setRotation(0);
      setFlipH(false);
      setPan({ x: 0, y: 0 });
    };
  }, [editingIndex, images]);

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const targetW = 200;
    const targetH = 300;
    canvas.width = targetW;
    canvas.height = targetH;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.translate(targetW / 2 + pan.x, targetH / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    const isRotated = rotation % 180 !== 0;
    const w = isRotated ? imgObj.height : imgObj.width;
    const h = isRotated ? imgObj.width : imgObj.height;
    const scaleCover = Math.max(targetW / w, targetH / h) * zoom;
    const drawW = imgObj.width * scaleCover;
    const drawH = imgObj.height * scaleCover;
    ctx.drawImage(imgObj, -drawW / 2, -drawH / 2, drawW, drawH);
  }, [imgObj, zoom, rotation, flipH, pan]);

  const handleSaveEdit = () => {
    if (!imgObj || editingIndex === null) return;
    const targetW = 800;
    const targetH = 1200;
    const scaleMultiplier = targetW / 200;
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.translate(
      targetW / 2 + pan.x * scaleMultiplier,
      targetH / 2 + pan.y * scaleMultiplier,
    );
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);
    const isRotated = rotation % 180 !== 0;
    const w = isRotated ? imgObj.height : imgObj.width;
    const h = isRotated ? imgObj.width : imgObj.height;
    const scaleCover = Math.max(targetW / w, targetH / h) * zoom;
    const drawW = imgObj.width * scaleCover;
    const drawH = imgObj.height * scaleCover;
    ctx.drawImage(imgObj, -drawW / 2, -drawH / 2, drawW, drawH);
    const newUrl = canvas.toDataURL("image/jpeg", 0.9);
    const newImages = [...images];
    newImages[editingIndex] = newUrl;
    setImages(newImages);
    setEditingIndex(null);
  };

  const uiWiggleFilter = "url(#wiggle-ui-controls)";

  const btnStyle = {
    background: "none",
    border: "1px solid var(--color-blue)",
    color: "var(--color-blue)",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
    textTransform: "uppercase" as const,
    filter: uiWiggleFilter,
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
      <WigglySvg
        id="ui-controls"
        baseFrequency="0.04 0.06"
        scale="2"
        dur="0.5s"
      />

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
              <div
                style={{
                  position: "absolute",
                  bottom: "4px",
                  left: "4px",
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-blue)",
                  color: "var(--color-blue)",
                  padding: "2px 4px",
                  fontSize: "8px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  pointerEvents: "none",
                  zIndex: 2,
                  filter: uiWiggleFilter,
                }}
              >
                {PAGE_LABELS[i]}
              </div>

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
                  <div
                    style={{
                      position: "absolute",
                      top: "4px",
                      right: "4px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      zIndex: 3,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(i);
                      }}
                      style={{
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingIndex(i);
                      }}
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "var(--color-bg)",
                        border: "none",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <WigglySvg
                        id={`edit-${i}`}
                        viewBox="0 0 24 24"
                        baseFrequency="0.02 0.03"
                        scale="5"
                        dur="0.3s"
                      >
                        <path
                          d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
                          stroke="var(--color-blue)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </WigglySvg>
                    </button>
                  </div>
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
          onClick={() =>
            images.some((img) => img !== null)
              ? navigate("/download", { state: { images } })
              : (setToastMessage("Envie pelo menos 1 foto"),
                setTimeout(() => setToastMessage(""), 3000))
          }
          style={{
            background: "none",
            border: "none",
            color: "var(--color-blue)",
            fontSize: "0.9rem",
            fontWeight: "800",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          gerar meu zine
        </button>
      </div>

      <div style={{ width: "30px", height: "30px" }}>
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

      <AnimatePresence>
        {editingIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 200,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "320px",
                padding: "40px 30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
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
                  id="modal-border"
                  viewBox="0 0 320 520"
                  baseFrequency="0.015 0.02"
                  scale="4"
                  dur="0.4s"
                  preserveAspectRatio="none"
                >
                  <rect
                    x="4"
                    y="4"
                    width="312"
                    height="512"
                    fill="var(--color-bg)"
                    stroke="var(--color-blue)"
                    strokeWidth="3"
                  />
                </WigglySvg>
              </div>

              <div
                style={{
                  zIndex: 1,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "var(--color-blue)",
                    fontWeight: 800,
                    fontSize: "14px",
                    filter: uiWiggleFilter,
                  }}
                >
                  AJUSTAR IMAGEM
                </p>

                <canvas
                  ref={canvasRef}
                  onPointerDown={(e) =>
                    (dragRef.current = {
                      isDragging: true,
                      startX: e.clientX,
                      startY: e.clientY,
                      initPanX: pan.x,
                      initPanY: pan.y,
                    })
                  }
                  onPointerMove={(e) =>
                    dragRef.current.isDragging &&
                    setPan({
                      x:
                        dragRef.current.initPanX +
                        (e.clientX - dragRef.current.startX),
                      y:
                        dragRef.current.initPanY +
                        (e.clientY - dragRef.current.startY),
                    })
                  }
                  onPointerUp={() => (dragRef.current.isDragging = false)}
                  onPointerLeave={() => (dragRef.current.isDragging = false)}
                  style={{
                    width: "200px",
                    height: "300px",
                    border: "1px solid var(--color-blue)",
                    cursor: "grab",
                    touchAction: "none",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <button
                    onClick={() => setRotation((r) => r + 90)}
                    style={btnStyle}
                  >
                    ⟳ Girar
                  </button>
                  <button onClick={() => setFlipH((f) => !f)} style={btnStyle}>
                    ↔ Espelhar
                  </button>
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    filter: uiWiggleFilter,
                  }}
                >
                  <label
                    style={{
                      color: "var(--color-blue)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    Zoom
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      accentColor: "var(--color-blue)",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  <button
                    onClick={() => setEditingIndex(null)}
                    style={{
                      ...btnStyle,
                      border: "none",
                      textDecoration: "underline",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      ...btnStyle,
                      background: "var(--color-blue)",
                      color: "var(--color-bg)",
                    }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
