import { useRef, type CSSProperties } from "react";

import scene1 from "@/assets/mewflow-scene-1.webp.asset.json";
import scene2 from "@/assets/mewflow-scene-2.webp.asset.json";
import scene3 from "@/assets/mewflow-scene-3.webp.asset.json";
import scene4 from "@/assets/mewflow-scene-4.webp.asset.json";
import scene6 from "@/assets/mewflow-scene-6.webp.asset.json";
import scene7 from "@/assets/mewflow-scene-7.webp.asset.json";
import scene8 from "@/assets/mewflow-scene-8.webp.asset.json";
import { ConnectionsOrbit } from "./ConnectionsOrbit";
import { ThemeToggle } from "./ThemeToggle";
import { useLandingMotion } from "./useLandingMotion";
import { useTypewriter } from "./useTypewriter";

type Vars = CSSProperties & Record<`--${string}`, string | number>;
const v = (vars: Record<string, string | number>) =>
  Object.fromEntries(Object.entries(vars).map(([k, val]) => [`--${k}`, val])) as Vars;
const bg = (url: string): CSSProperties => ({ backgroundImage: `url(${url})` });

function Logo({ className = "lgo" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 11 9" aria-hidden="true">
      <use href="#lg" />
    </svg>
  );
}

const LOGOS = [
  { name: "Instagram" },
  { name: "Discord" },
  { name: "Gmail" },
  { name: "Stripe", soon: true },
  { name: "PayPal", soon: true },
  { name: "Notion", soon: true },
];

const FAQ = [
  {
    q: "How is Mewflow different from a spreadsheet?",
    a: "It keeps quotes, files and payments linked to each client and sends the reminders for you.",
  },
  {
    q: "Which commissions can I quote?",
    a: "Drawings, digital art, comics, emotes, logos and full brand projects. You set your own prices.",
  },
  {
    q: "How do I get started?",
    a: "Create an account, add your price list and send your first quote in a few minutes.",
  },
  {
    q: "What if I use a tool you don’t support?",
    a: "Tell us. Connections are added based on what artists ask for most.",
  },
];

export function MewflowLanding() {
  const rootRef = useRef<HTMLDivElement>(null);
  useLandingMotion(rootRef);
  useTypewriter(rootRef);

  return (
    <div
      ref={rootRef}
      className="mf"
      style={v({ i8: `url(${scene8.url})`, i3: `url(${scene3.url})` })}
    >
      <i id="sp" data-progress />
      <div className="gridbg" id="grid" data-grid />
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="lg" viewBox="0 0 11 9">
          <path d="M2 0L9 0C10.105 0 7 2.895 7 4L11 2L11 7C11 8.105 10.105 9 9 9L9 9L2 9C0.895 9 4 8 4 6L0 7L0 2C0 0.895 0.895 0 2 0L2 0Z" />
        </symbol>
      </svg>

      <div className="wrap">
        <nav className="up">
          <a className="lg" href="#">
            <Logo />
            mewflow
          </a>
          <a className="x" href="#">Product</a>
          <a className="x" href="#connect">Connections</a>
          <a className="x" href="#">Pricing</a>
          <a className="x" href="#">Downloads</a>
          <a className="sp x" href="#">Book a demo</a>
          <ThemeToggle />
          <a className="btn" href="#cta">Get started</a>
        </nav>

        <h1 className="up" style={v({ d: ".1s" })}>
          Make the art. We’ll handle the{" "}
          <span className="hl">
            paperwork<b>Your studio</b>
          </span>
        </h1>
        <div className="cta2 up" style={v({ d: ".3s" })}>
          <a className="btn" href="#cta">Get started</a>
          <a className="btn l" href="#">Book a demo</a>
        </div>

        <div className="hero">
          <div className="win">
            <aside>
              <div className="ws"><i className="sq" />Aiko Studio</div>
              <p>Inbox <span>3</span></p>
              <p>Create</p>
              <p>Search <span>⌘K</span></p>
              <h6>Favorites</h6>
              <p>Spring commissions</p>
              <p>Price list</p>
              <h6>Workspace</h6>
              <p className="act">Quotes</p>
              <p>Clients</p>
              <p>Invoices</p>
              <p>Templates</p>
            </aside>
            <main>
              <div className="bc">
                <span>Quotes</span>
                <span>Quote #031</span>
                <span className="push"><i className="av" /><i className="av b" /><i className="av c" /></span>
                <span className="pill">Draft</span>
                <span className="pill k">Send</span>
              </div>
              <h3>Quote #031 · Mika Tanaka</h3>
              <small>Full-body character, flat colors. One free revision included.</small>
              <h5>Timeline</h5>
              <p>Sketch ready by Monday. Lineart approved by <mark>Wednesday<i>Aiko</i></mark>.</p>
              <p>Final files delivered after the balance is paid, <mark className="p">Friday<i>Mika</i></mark>.</p>
              <h5>Services</h5>
              <div className="ck" style={v({ k: 0 })}>Sketch · $40</div>
              <div className="ck" style={v({ k: 1 })}>Lineart + flat color · $90</div>
              <div className="ck" style={v({ k: 2 })}>Commercial license · <mark className="g">+$30</mark></div>
              <h5>Payment</h5>
              <p>50% deposit to start, 50% on delivery. <mark>Total $160</mark></p>
            </main>
          </div>
          <div className="chat">
            <div className="bc">
              <span>Mika Tanaka</span>
              <span className="push"><i className="av" /><i className="av b" /></span>
            </div>
            <div className="msg" style={v({ k: 0 })}>
              <i className="av c" />
              <div><small>Mika · 9:41 AM</small><p>Could you add a second pose? Same style, simple background.</p></div>
            </div>
            <div className="msg" style={v({ k: 1 })}>
              <i className="av" />
              <div><small>Aiko · 9:44 AM</small><p>Sure! I’ll add it to the quote: +$60. Want a rush date?</p></div>
            </div>
            <div className="msg" style={v({ k: 2 })}>
              <i className="av c" />
              <div><small>Mika · 9:46 AM</small><p>No rush, March 20 works!</p></div>
            </div>
            <div className="rep" style={v({ k: 3 })}><span>Reply</span><span>Quote v2 ▾</span></div>
          </div>
          <div className="help">
            Need help?
            <br />
            <strong>We reply within a day</strong>
          </div>
        </div>

        <p className="lead rev">
          Every place your clients find you, one inbox.
          <br />
          Quote from any message. Keep everything.
        </p>
        <div className="logos rev">
          {LOGOS.map((l) => (
            <div key={l.name}>
              {l.name}
              {l.soon && <small>Coming soon</small>}
            </div>
          ))}
        </div>

        <div className="big rev">
          <h2 className="c">Every artist runs their business alone.</h2>
          <p>
            The quotes live in DMs, the files in a folder and the payments in a spreadsheet. All of
            it is scattered, and it hasn’t made you faster.
          </p>
        </div>
        <h2 className="c rev tagline">Here’s what a calmer studio looks like.</h2>

        <div className="fp rev">
          <div className="tx">
            <h3>One inbox, private notes when you want them</h3>
            <p>Instagram, Discord and email land in a single thread. Notes stay private to you, and any message can become a quote.</p>
          </div>
          <div className="pi" style={bg(scene6.url)}>
            <div className="mk">
              <div className="row plain"><b>Mika Tanaka</b><span><i className="av" /><i className="av c" /></span></div>
              <p className="lead-line">Here’s the second pose reference. Is $60 okay?</p>
              <div className="note"><b>Private note</b><br />She mentioned a March 20 deadline. Skip the rush fee.</div>
              <div className="rep"><span>Reply or write a quote</span><span>USD ▾</span></div>
            </div>
          </div>
        </div>

        <div className="fp r rev">
          <div className="tx">
            <h3>Quotes that write themselves</h3>
            <p>Pick services from your price list and add extras. Clients get a clean page they can approve in one click.</p>
          </div>
          <div className="pi e focus-y20" style={bg(scene7.url)}>
            <div className="mk">
              <h4>Quote #031</h4>
              <small>Valid for 14 days · <mark>Aiko</mark> <mark className="p">Mika</mark></small>
              <div className="row"><span>Sketch</span><b>$40</b></div>
              <div className="row"><span>Lineart + flat color</span><b>$90</b></div>
              <div className="row"><span>Second pose</span><b>$60</b></div>
              <div className="row"><span>Commercial license</span><b>$30</b></div>
              <div className="tot"><span>Total</span><span data-n="220">$220</span></div>
            </div>
          </div>
        </div>

        <div className="fp rev bare" id="connect">
          <div className="tx">
            <h3>The tools you already use, connected</h3>
            <p>Nobody wants to leave the chat. Messages arrive from your inbox, payments go through Stripe, and files stay in Drive.</p>
          </div>
          <ConnectionsOrbit />
        </div>

        <div className="fp rev">
          <div className="tx">
            <h3>Every client in its place</h3>
            <p>A client page holds each quote, reference image and payment. Open one commission and everything about it is there.</p>
          </div>
          <div className="pi focus-y30" style={bg(scene2.url)}>
            <div className="mk narrow">
              <small>Clients</small>
              <div className="row"><b>Mika Tanaka</b><small>3</small></div>
              <div className="row"><span>› Quote #031</span><small>Draft</small></div>
              <div className="row"><span>› Invoice #024</span><small>Paid</small></div>
              <div className="row"><span>› References</span><small>12</small></div>
              <div className="row"><b>Café Hoshi</b><small>2</small></div>
              <div className="row"><b>Banda Nube</b><small>1</small></div>
              <small className="archive">Archive</small>
            </div>
          </div>
        </div>

        <div className="fp r rev">
          <div className="tx">
            <h3>Build your price list</h3>
            <p>Set your rates once. Extras, rush fees and licenses are remembered and added to every new quote.</p>
          </div>
          <div className="pi" style={bg(scene4.url)}>
            <div className="mk">
              <div className="row plain"><b>Price list</b><small>Studio · Saved</small></div>
              <div className="row"><span>Character, full body</span><b>$90</b></div>
              <div className="row"><span>Emote pack × 5</span><b>$75</b></div>
              <div className="row"><span>Logo + palette</span><b>$300</b></div>
              <div className="row"><span>Commercial license</span><b>+30%</b></div>
              <div className="row"><span>Rush (under 7 days)</span><b>+25%</b></div>
            </div>
          </div>
        </div>

        <div className="fp rev">
          <div className="tx">
            <h3>Reusable templates for your best work</h3>
            <p>Turn the quotes you send most into templates. Type “/” in any message and pick one.</p>
          </div>
          <div className="pi focus-y30" style={bg(scene1.url)}>
            <div className="mk">
              <div className="rep slash"><span>/</span><span>Aiko Studio</span></div>
              <div className="row"><b>/character-quote</b><small>Full body + license</small></div>
              <div className="row"><b>/emote-pack</b><small>5 emotes, animated</small></div>
              <div className="row"><b>/brand-package</b><small>Logo, palette, guide</small></div>
            </div>
          </div>
        </div>

        <section className="faq rev">
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      </div>

      <div className="band rev" id="cta">
        <h2>Make the art. We’ll do the rest.</h2>
        <a className="btn w" href="#">Get started</a>
      </div>

      <footer>
        <div>
          <div className="lg"><Logo />mewflow</div>
          <div>The CRM for artists.<br />© 2026 Mewflow. All rights reserved.</div>
        </div>
        <div className="fcols">
          <nav>
            <h6>Product</h6>
            <a href="#">How it works</a>
            <a href="#connect">Connections</a>
            <a href="#">Pricing</a>
          </nav>
          <nav>
            <h6>Legal</h6>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
