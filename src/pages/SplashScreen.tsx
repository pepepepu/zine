import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { path1Z } from "../svgData/zine-z";

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

export default function SplashScreen() {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  const svgPosition = useMemo(() => {
    const v1 = Math.floor(Math.random() * 41) + 110;
    const v2 = Math.floor(Math.random() * 41) + 110;
    const isTopLeft = Math.random() > 0.5;

    if (isTopLeft) {
      return { top: `-${v1}px`, left: `-${v2}px`, bottom: "0px", right: "0px" };
    } else {
      return { bottom: `-${v1}px`, right: `-${v2}px`, top: "0px", left: "0px" };
    }
  }, []);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "linear",
      },
    } as const,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        width: "100%",
        height: "100dvh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "60px 30px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.header variants={itemVariants} style={{ zIndex: 1 }}>
        <h1
          style={{
            fontSize: "48px",
            color: "var(--color-blue)",
            fontWeight: "800",
            lineHeight: 1,
            marginBottom: "8px",
            textTransform: "uppercase",
            backgroundColor: "var(--color-bg)",
          }}
        >
          Zine
        </h1>
        <p
          style={{
            fontSize: "12px",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-blue)",
            fontWeight: 700,
          }}
        >
          rabisque o mundo. dobre o resto.
        </p>
      </motion.header>

      <div
        style={{
          position: "absolute",
          width: "200%",
          height: "auto",
          zIndex: 0,
          ...svgPosition,
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 78 103"
          id="zine-logo-svg"
          style={{ width: "100%", height: "auto", overflow: "visible" }}
        >
          <defs>
            <filter id="pen-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="0.01"
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              <feBlend
                mode="darken"
                in="darkNoise"
                in2="displaced"
                result="blended"
              />
              <feComposite operator="in" in="blended" in2="displaced" />
            </filter>

            <filter
              id="wiggle-z"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04 0.05"
                numOctaves="3"
                result="wiggle_noise"
              >
                <animate
                  attributeName="seed"
                  values="0;1;2;3"
                  dur="0.4s"
                  calcMode="discrete"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="wiggle_noise"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          <g filter="url(#wiggle-z)">
            <g filter="url(#pen-grain)">
              <path d={path1Z} fill="var(--color-blue)" />
            </g>
          </g>
        </svg>
      </div>

      <motion.footer
        variants={itemVariants}
        style={{
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          alignItems: "flex-start",
        }}
      >
        <button
          onClick={() => navigate("/upload")}
          style={{
            fontSize: "18px",
            color: "var(--color-blue)",
            backgroundColor: "var(--color-bg)",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Criar meu zine
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="var(--color-blue)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={() => setShowInfo(true)}
          style={{
            fontSize: "12px",
            color: "var(--color-blue)",
            backgroundColor: "var(--color-bg)",
            fontWeight: "700",
            textDecoration: "underline",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          o que é um zine?
        </button>
      </motion.footer>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            style={{
              position: "absolute",
              bottom: "40px",
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
                id="info-border"
                viewBox="0 0 300 200"
                baseFrequency="0.015 0.02"
                scale="4"
                dur="0.4s"
                preserveAspectRatio="none"
              >
                <rect
                  x="4"
                  y="4"
                  width="292"
                  height="192"
                  fill="var(--color-bg)"
                  stroke="var(--color-blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </WigglySvg>
            </div>

            <button
              onClick={() => setShowInfo(false)}
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
                id="close-info"
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
              Um zine (ou fanzine) é uma publicação independente, criativa e
              cheia de personalidade, feita para compartilhar ideias de forma
              livre
              <br />
              <br />
              Este site foi criado para te ajudar a montar e organizar as
              páginas do seu zine de forma simples e divertida.
              <br />
              <br />
              <button
                onClick={() =>
                  window.open("https://cornucopeiac.vercel.app/home", "_blank")
                }
                style={{
                  color: "var(--color-blue)",
                  fontWeight: 900,
                  fontSize: "12px",
                  lineHeight: "1.6",
                  textAlign: "left",
                  zIndex: 1,
                  margin: 0,
                }}
              >
                pepe
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
