import type { CSSProperties } from "react";
import {
  siDiscord,
  siGmail,
  siGoogledrive,
  siInstagram,
  siNotion,
  siStripe,
  type SimpleIcon,
} from "simple-icons";

// Stage coordinates (viewBox units). Nodes are placed with the same numbers as % of the stage.
const W = 540;
const H = 420;
const CX = W / 2;
const CY = H / 2;

type App = { name: string; icon: SimpleIcon; tone: string; x: number; y: number; ring: "inner" | "outer" };

const APPS: App[] = [
  { name: "Gmail", icon: siGmail, tone: "gmail", x: 118, y: 74, ring: "outer" },
  { name: "Discord", icon: siDiscord, tone: "discord", x: 422, y: 74, ring: "outer" },
  { name: "Stripe", icon: siStripe, tone: "stripe", x: 66, y: 214, ring: "inner" },
  { name: "Instagram", icon: siInstagram, tone: "instagram", x: 474, y: 214, ring: "inner" },
  { name: "Google Drive", icon: siGoogledrive, tone: "drive", x: 118, y: 352, ring: "outer" },
  { name: "Notion", icon: siNotion, tone: "notion", x: 422, y: 352, ring: "outer" },
];

/** A gentle clockwise swirl from each app into the core. */
function curve({ x, y }: App) {
  const mx = (x + CX) / 2;
  const my = (y + CY) / 2;
  const dx = CX - x;
  const dy = CY - y;
  const bend = 0.22;
  return `M${x} ${y} Q${mx - dy * bend} ${my + dx * bend} ${CX} ${CY}`;
}

export function ConnectionsOrbit() {
  return (
    <div className="orbit" role="img" aria-label="Gmail, Stripe, Google Drive, Discord, Instagram and Notion all flowing into Mewflow">
      <div className="orbit-glow" aria-hidden="true" />
      <div className="orbit-live" aria-hidden="true">
        <i />
        Live sync
      </div>

      <svg className="orbit-lines" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <g className="orbit-ring orbit-ring-a">
          <circle cx={CX} cy={CY} r={118} />
        </g>
        <g className="orbit-ring orbit-ring-b">
          <circle cx={CX} cy={CY} r={186} />
        </g>
        {APPS.map((app, k) => {
          const d = curve(app);
          return (
            <g key={app.name} className={`orbit-link tone-${app.tone}`}>
              <path className="orbit-track" d={d} />
              <path className="orbit-pulse" d={d} pathLength={100} style={{ animationDelay: `${k * 0.45}s` }} />
              <circle className="orbit-packet" r={3}>
                <animateMotion dur="2.8s" begin={`${k * 0.45}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".5 0 .3 1" />
              </circle>
            </g>
          );
        })}
      </svg>

      {APPS.map((app, k) => (
        <div
          key={app.name}
          className={`orbit-node tone-${app.tone}`}
          style={{ left: `${(app.x / W) * 100}%`, top: `${(app.y / H) * 100}%`, "--k": k } as CSSProperties}
        >
          <span className="orbit-tile">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={app.icon.path} />
            </svg>
          </span>
          <small>{app.name}</small>
        </div>
      ))}

      <div className="orbit-core">
        <span className="orbit-halo" aria-hidden="true" />
        <span className="orbit-halo orbit-halo-late" aria-hidden="true" />
        <span className="orbit-core-tile">
          <svg className="orbit-logo" viewBox="0 0 11 9" aria-hidden="true">
            <use href="#lg" />
          </svg>
        </span>
        <small>mewflow</small>
      </div>
    </div>
  );
}
