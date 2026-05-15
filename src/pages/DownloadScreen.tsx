import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import { path1, path2 } from "../svgData/zine-icon";
import { path1PP, path2PP, path3PP } from "../svgData/p-icon";
import { lineZine } from "../svgData/zine-script";

const PROJECT_BLUE = "#0038a8";

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

const prepareImage = (
  url: string,
  rotate180: boolean,
  targetRatio: number,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const imgRatio = img.width / img.height;

      let drawWidth = img.width;
      let drawHeight = img.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
        drawWidth = img.height * targetRatio;
        offsetX = (img.width - drawWidth) / 2;
      } else {
        drawHeight = img.width / targetRatio;
        offsetY = (img.height - drawHeight) / 2;
      }

      canvas.width = drawWidth;
      canvas.height = drawHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject();

      if (rotate180) {
        ctx.translate(drawWidth / 2, drawHeight / 2);
        ctx.rotate(Math.PI);
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight,
        );
      } else {
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          drawWidth,
          drawHeight,
          0,
          0,
          drawWidth,
          drawHeight,
        );
      }
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
    img.onerror = reject;
    img.src = url;
  });
};

const createLogoData = (): string => {
  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.scale(3, 3);
    ctx.fillStyle = PROJECT_BLUE;
    ctx.fill(new Path2D(path1PP));
    ctx.fill(new Path2D(path2PP));
    ctx.fill(new Path2D(path3PP));
  }
  return canvas.toDataURL("image/png");
};

export default function DownloadScreen() {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);
  const location = useLocation();
  const images = location.state?.images || Array(8).fill(null);

  const generateZine = async () => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isInAppBrowser = /Instagram|FBAN|FBAV/i.test(ua);

    if (isInAppBrowser) {
      setShowBrowserWarning(true);
      return;
    }

    setIsDownloading(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 297;
    const pageHeight = 210;
    const targetRatio = 1 / 1.5;

    const marginTop = 25;
    const marginBottom = 20;
    const maxGridH = pageHeight - marginTop - marginBottom;

    const rowH = maxGridH / 2;
    const colW = rowH * targetRatio;
    const gridW = colW * 4;
    const marginX = (pageWidth - gridW) / 2;

    const gridMap = [
      { idx: 0, col: 0, row: 0, rot: true },
      { idx: 1, col: 1, row: 0, rot: true },
      { idx: 2, col: 2, row: 0, rot: true },
      { idx: 3, col: 3, row: 0, rot: true },
      { idx: 4, col: 0, row: 1, rot: false },
      { idx: 5, col: 1, row: 1, rot: false },
      { idx: 6, col: 2, row: 1, rot: false },
      { idx: 7, col: 3, row: 1, rot: false },
    ];

    for (const item of gridMap) {
      const imgUrl = images[item.idx];
      if (imgUrl) {
        try {
          const base64 = await prepareImage(imgUrl, item.rot, targetRatio);
          doc.addImage(
            base64,
            "JPEG",
            marginX + item.col * colW,
            marginTop + item.row * rowH,
            colW,
            rowH,
          );
        } catch (e) {
          console.error(e);
        }
      }
    }

    doc.setDrawColor(0, 56, 168);
    doc.setLineWidth(0.1);

    doc.setLineDashPattern([1, 1], 0);
    doc.rect(marginX, marginTop, gridW, maxGridH);

    doc.setLineDashPattern([0.5, 1.5], 0);
    for (let i = 1; i < 4; i++) {
      doc.line(
        marginX + i * colW,
        marginTop,
        marginX + i * colW,
        marginTop + maxGridH,
      );
    }

    doc.line(marginX, marginTop + rowH, marginX + colW, marginTop + rowH);
    doc.line(
      marginX + colW * 3,
      marginTop + rowH,
      marginX + gridW,
      marginTop + rowH,
    );

    doc.setLineWidth(0.4);
    doc.setLineDashPattern([3, 1], 0);
    doc.line(
      marginX + colW,
      marginTop + rowH,
      marginX + colW * 3,
      marginTop + rowH,
    );

    doc.setFontSize(14);
    doc.text("✂", pageWidth / 2, marginTop + rowH + 1.5, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(0, 56, 168);

    const tutorial = [
      "PASSO A PASSO: 1. RECORTE AS MARGENS DA FOLHA  |  2. DOBRE AO MEIO (SENTIDO HORIZONTAL)  |  3. DOBRE AS COLUNAS (SANFONADO)",
      "4. CORTE O PONTILHADO CENTRAL ✂  |  5. DOBRE NO MEIO NOVAMENTE",
    ];
    doc.text(tutorial, pageWidth / 2, 12, { align: "center" });

    const logoData = createLogoData();
    doc.addImage(logoData, "PNG", pageWidth / 2 - 5, pageHeight - 15, 10, 10);

    const pdfBlob = doc.output("blob");
    const blobUrl = URL.createObjectURL(pdfBlob);
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);

    if (isMobileDevice) {
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "zine-rabiscado.pdf";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 1500);
    } else {
      const newWin = window.open(blobUrl, "_blank");
      if (!newWin) {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "zine-rabiscado.pdf";
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1500);
      }
    }

    setIsDownloading(false);
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
        fontFamily: '"Martian Mono", monospace',
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
          id="zine-scribble-dl"
          viewBox="0 0 49 38"
          scale="5"
          baseFrequency="0.04 0.05"
        >
          <path d={path1} fill={PROJECT_BLUE} />
          <path d={path2} fill={PROJECT_BLUE} />
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
        }}
      >
        <p
          style={{
            fontSize: "12px",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-blue)",
            fontWeight: 700,
            marginBottom: "40px",
            fontFamily: '"Martian Mono", monospace',
          }}
        >
          seu zine está pronto para download!
        </p>
        <div
          style={{
            width: "200px",
            aspectRatio: "1 / 1.5",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
              id="card-border"
              viewBox="0 0 100 150"
              baseFrequency="0.015 0.02"
              scale="2.5"
              dur="0.5s"
              preserveAspectRatio="none"
            >
              <rect
                x="2"
                y="2"
                width="96"
                height="146"
                fill="none"
                stroke={PROJECT_BLUE}
                strokeWidth="3"
              />
            </WigglySvg>
          </div>

          {isDownloading ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
              }}
            >
              <WigglySvg
                id="card-scribble"
                viewBox="0 0 100 150"
                baseFrequency="0.03 0.04"
                scale="3"
                dur="0.3s"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 5,20 L 95,10 L 15,40 L 90,30 L 10,60 L 85,50 L 15,80 L 90,75 L 10,100 L 80,90 L 20,120 L 85,115 L 30,140 L 70,130 L 40,145 L 60,140"
                  fill="none"
                  stroke={PROJECT_BLUE}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </WigglySvg>
            </div>
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <WigglySvg
                id="zine-p-dl"
                viewBox="0 0 439 251"
                scale="11"
                baseFrequency="0.05 0.06"
              >
                <g>
                  <path d={lineZine} fill={PROJECT_BLUE} />
                </g>
              </WigglySvg>
            </div>
          )}
        </div>

        <button
          onClick={generateZine}
          disabled={isDownloading}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-blue)",
            fontSize: "0.9rem",
            fontWeight: "800",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            marginTop: "40px",
            opacity: isDownloading ? 0.5 : 1,
          }}
        >
          {isDownloading ? "rabiscando..." : "baixar meu zine"}
        </button>

        <button
          onClick={() => navigate("/upload")}
          disabled={isDownloading}
          style={{
            background: "none",
            border: "none",
            color: "var(--color-bg)",
            backgroundColor: "var(--color-blue)",
            fontSize: "0.8rem",
            fontWeight: "600",
            textDecoration: "underline",
            cursor: "pointer",
            padding: 0,
            marginTop: "10px",
            opacity: isDownloading ? 0.5 : 1,
          }}
        >
          gerar um novo zine
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
          width: "30px",
          height: "30px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WigglySvg
          id="zine-p-dl"
          viewBox="0 0 24 28"
          scale="5"
          baseFrequency="0.05 0.06"
        >
          <g>
            <path d={path1PP} fill={PROJECT_BLUE} />
            <path d={path2PP} fill={PROJECT_BLUE} />
            <path d={path3PP} fill={PROJECT_BLUE} />
          </g>
        </WigglySvg>
      </div>

      <AnimatePresence>
        {showBrowserWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            style={{
              position: "absolute",
              top: "40px",
              left: "50%",
              width: "300px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
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
                id="warning-border"
                viewBox="0 0 300 160"
                baseFrequency="0.015 0.02"
                scale="4"
                dur="0.4s"
                preserveAspectRatio="none"
              >
                <rect
                  x="4"
                  y="4"
                  width="292"
                  height="152"
                  fill="var(--color-bg)"
                  stroke="var(--color-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </WigglySvg>
            </div>

            <button
              onClick={() => setShowBrowserWarning(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                width: "24px",
                height: "24px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <WigglySvg
                id="close-warning"
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

            <p
              style={{
                color: "var(--color-blue)",
                fontWeight: 600,
                fontSize: "12px",
                lineHeight: "1.6",
                textAlign: "left",
                zIndex: 1,
                margin: 0,
              }}
            >
              O navegador do Instagram bloqueia downloads diretos.
              <br />
              <br />
              Para baixar seu zine, clique nos 3 pontinhos no canto superior da
              tela e escolha "Abrir no navegador".
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
