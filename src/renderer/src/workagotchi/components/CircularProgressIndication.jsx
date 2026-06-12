export function CircularProgressIndication({
  value = 100,
  size = 72,
  stroke = 5,
  children,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  // value 100 → anillo completo; value 0 → anillo vacío
  const offset = circumference * (1 - value / 100);
  let color = value >= 80 ? "#35A843" : value >= 50 ? "#F7B940" : "#A30000";

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* pista de fondo, opcional */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth={stroke}
        />
        {/* el progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
      </svg>
      {/* el contenido va centrado encima del anillo */}
      <div
        style={{
          position: "absolute",
          inset: stroke, // ← se mete hacia adentro el grosor del anillo
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // por las dudas, recorta lo que se pase
        }}
      >
        {children}
      </div>
    </div>
  );
}
