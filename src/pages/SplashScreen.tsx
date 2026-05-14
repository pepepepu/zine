import { motion } from "framer-motion";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { path1Z, path2Z } from "../svgData/zine-z";

export default function SplashScreen() {
  const navigate = useNavigate();

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
      transition: { staggerChildren: 0.4, delayChildren: 0.2 },
    },
    exit: { opacity: 0 },
  };

  // Alterado para any para aceitar a interpolação CSS nativa steps()
  const itemVariants: any = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "steps(5, end)",
      },
    },
  };

  // Alterado para any para aceitar a interpolação CSS nativa steps()
  const writeVariants: any = {
    initial: { pathLength: 0 },
    animate: {
      pathLength: 1,
      transition: {
        duration: 2.5,
        ease: "steps(25, end)",
        delay: 0.8,
      },
    },
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
                scale="3"
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

            <mask id="logoMask" maskUnits="userSpaceOnUse">
              <g id="originalLogoShapes" fill="white">
                <path fillRule="evenodd" clipRule="evenodd" d={path1Z} />
              </g>
            </mask>
          </defs>

          <g filter="url(#wiggle-z)">
            <g mask="url(#logoMask)" filter="url(#pen-grain)">
              <motion.path
                d={path2Z}
                variants={writeVariants}
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>
      </div>

      <motion.footer
        variants={itemVariants}
        style={{ zIndex: 1, width: "100%" }}
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
      </motion.footer>
    </motion.div>
  );
}
