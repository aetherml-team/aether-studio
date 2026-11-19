/* Æther's orbit as a graphic element: an ellipse with two nodes, drawn at pixel size so
   the hairline stays 1.25px. Its parent crops it; the wordmark never comes with it.
   `nodes` are [angle in radians, radius] on the ellipse. */
export function Orbit({ rx, ry, nodes }: { rx: number; ry: number; nodes: [number, number][] }) {
  return (
    <svg width={rx * 2} height={ry * 2} viewBox={`0 0 ${rx * 2} ${ry * 2}`} className="block overflow-visible text-turn" aria-hidden>
      <ellipse cx={rx} cy={ry} rx={rx - 1} ry={ry - 1} fill="none" stroke="currentColor" strokeWidth={6} opacity={0.1} />
      <ellipse cx={rx} cy={ry} rx={rx - 1} ry={ry - 1} fill="none" stroke="currentColor" strokeWidth={1.25} />
      {nodes.map(([a, r]) => (
        <circle key={a} cx={rx + rx * Math.cos(a)} cy={ry + ry * Math.sin(a)} r={r} fill="currentColor" />
      ))}
    </svg>
  );
}
