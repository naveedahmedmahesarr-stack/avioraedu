"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Interactive 3D globe for the Karachi feature.
 *
 * A true orthographic sphere projection drawn on a 2D canvas (no WebGL, no extra dependency):
 * - rotates slowly on its own; pauses while dragged and eases back in after release (with inertia)
 * - mouse/pen drag rotates horizontally and vertically; touch drags horizontally (vertical swipes keep scrolling the page)
 * - arrow keys rotate when focused; Tab moves on normally
 * - Berlin, Karachi and the route are projected from real coordinates every frame, so they turn with the Earth
 * - prefers-reduced-motion: no automatic rotation or flowing route; dragging still works
 * - renders only while on screen; geometry is fetched lazily; the server-rendered static globe (children) stays as fallback
 * Colors match the existing static globe artwork.
 */
type GlobeData = { land: number[][]; borders: number[][]; highlight: number[][] };

const BERLIN = { lon: 13.405, lat: 52.52 };
const KARACHI = { lon: 67.0099, lat: 24.8607 };
const RAD = Math.PI / 180;
const AUTO_SPEED = 4.5; // degrees per second — one turn every ~80 s
const HOME_LAT = 24;

export function InteractiveGlobe({
  ariaLabel,
  hint,
  berlinLabel,
  karachiLabel,
  children,
}: {
  ariaLabel: string;
  hint: string;
  berlinLabel: string;
  karachiLabel: string;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const hintId = useId();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; // keep the static fallback

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(wrap).fontFamily || "sans-serif";
    const s = { lon0: 38, lat0: HOME_LAT, vLon: 0, vLat: 0, auto: reduced ? 0 : 1, dragging: false, touch: false, lastX: 0, lastY: 0, lastT: 0 };
    let data: GlobeData | null = null;
    let loading = false;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let R = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let last = performance.now();
    let visible = false;
    let lastPublish = -1e9;
    let disposed = false;
    wrap.dataset.reducedMotion = String(reduced);

    // Great-circle route Berlin → Karachi, lifted above the surface for depth.
    const route: { lon: number; lat: number; k: number }[] = [];
    {
      const vec = (lon: number, lat: number) => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
      const a = vec(BERLIN.lon, BERLIN.lat);
      const b = vec(KARACHI.lon, KARACHI.lat);
      const om = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
      for (let i = 0; i <= 80; i++) {
        const t = i / 80;
        const w1 = Math.sin((1 - t) * om) / Math.sin(om);
        const w2 = Math.sin(t * om) / Math.sin(om);
        const v = [w1 * a[0] + w2 * b[0], w1 * a[1] + w2 * b[1], w1 * a[2] + w2 * b[2]];
        route.push({ lon: Math.atan2(v[1], v[0]) / RAD, lat: Math.asin(v[2]) / RAD, k: 1 + 0.2 * Math.sin(Math.PI * t) });
      }
    }

    const draw = (time: number) => {
      if (!data || !w) return;
      const sin0 = Math.sin(s.lat0 * RAD);
      const cos0 = Math.cos(s.lat0 * RAD);
      const proj = (lon: number, lat: number) => {
        const l = (lon - s.lon0) * RAD;
        const p = lat * RAD;
        const cp = Math.cos(p);
        const sp = Math.sin(p);
        const cl = Math.cos(l);
        return { x: cx + R * cp * Math.sin(l), y: cy - R * (cos0 * sp - sin0 * cp * cl), c: sin0 * sp + cos0 * cp * cl };
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Atmosphere
      let g = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.16);
      g.addColorStop(0, "rgba(231,207,155,0.20)");
      g.addColorStop(1, "rgba(231,207,155,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.16, 0, Math.PI * 2);
      ctx.fill();

      // Ocean
      g = ctx.createRadialGradient(cx - R * 0.24, cy - R * 0.4, R * 0.05, cx, cy, R * 1.02);
      g.addColorStop(0, "#1c3860");
      g.addColorStop(0.55, "#0c1d38");
      g.addColorStop(1, "#050d1c");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      const visibleLine = (ring: number[]) => {
        let pen = false;
        for (let i = 0; i < ring.length; i += 2) {
          const p = proj(ring[i], ring[i + 1]);
          if (p.c > 0) {
            if (pen) ctx.lineTo(p.x, p.y);
            else ctx.moveTo(p.x, p.y);
            pen = true;
          } else pen = false;
        }
      };

      // Graticule
      ctx.beginPath();
      for (let lon = -180; lon < 180; lon += 15) {
        const ring: number[] = [];
        for (let lat = -90; lat <= 90; lat += 3) ring.push(lon, lat);
        visibleLine(ring);
      }
      for (let lat = -75; lat <= 75; lat += 15) {
        const ring: number[] = [];
        for (let lon = -180; lon <= 180; lon += 4) ring.push(lon, lat);
        visibleLine(ring);
      }
      ctx.strokeStyle = "rgba(159,177,204,0.13)";
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Land: hidden vertices are pushed onto the limb so partially visible shapes stay closed.
      const polygon = (ring: number[]) => {
        for (let i = 0; i < ring.length; i += 2) {
          const p = proj(ring[i], ring[i + 1]);
          let { x, y } = p;
          if (p.c <= 0) {
            const dx = x - cx;
            const dy = y - cy;
            const d = Math.hypot(dx, dy) || 1;
            x = cx + (dx / d) * R;
            y = cy + (dy / d) * R;
          }
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
      };
      ctx.beginPath();
      for (const ring of data.land) polygon(ring);
      ctx.fillStyle = "#15294a";
      ctx.fill();

      // Coastlines and borders (visible parts only)
      ctx.beginPath();
      for (const ring of data.borders) visibleLine(ring);
      for (const ring of data.land) visibleLine(ring);
      ctx.strokeStyle = "rgba(216,182,116,0.24)";
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Germany and Pakistan
      ctx.beginPath();
      for (const ring of data.highlight) polygon(ring);
      ctx.fillStyle = "rgba(140,118,80,0.88)";
      ctx.fill();
      ctx.beginPath();
      for (const ring of data.highlight) visibleLine(ring);
      ctx.strokeStyle = "rgba(243,226,184,0.8)";
      ctx.lineWidth = 0.7;
      ctx.stroke();

      // Lighting: soft shade toward the edge + highlight sheen
      g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.2, cx, cy, R * 1.05);
      g.addColorStop(0.5, "rgba(5,13,28,0)");
      g.addColorStop(1, "rgba(2,6,13,0.72)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      g = ctx.createRadialGradient(cx - R * 0.36, cy - R * 0.56, 0, cx - R * 0.36, cy - R * 0.56, R * 0.85);
      g.addColorStop(0, "rgba(243,226,184,0.16)");
      g.addColorStop(1, "rgba(243,226,184,0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      // Rim
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(231,207,155,0.35)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Route (lifted above the surface, hidden behind the horizon)
      const rp = route.map((q) => {
        const p = proj(q.lon, q.lat);
        return { x: cx + (p.x - cx) * q.k, y: cy + (p.y - cy) * q.k, c: p.c };
      });
      const strokeRoute = (from: number, to: number, width: number, color: string) => {
        ctx.beginPath();
        let pen = false;
        for (let i = Math.max(0, from); i <= Math.min(rp.length - 1, to); i++) {
          const p = rp[i];
          if (p.c > -0.05) {
            if (pen) ctx.lineTo(p.x, p.y);
            else ctx.moveTo(p.x, p.y);
            pen = true;
          } else pen = false;
        }
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.lineCap = "round";
        ctx.stroke();
      };
      strokeRoute(0, rp.length - 1, 5, "rgba(231,207,155,0.22)");
      strokeRoute(0, rp.length - 1, 1.6, "#e7cf9b");
      if (!reduced) {
        const head = Math.floor(((time / 3600) % 1) * rp.length);
        strokeRoute(head - 5, head, 2.6, "rgba(255,246,223,0.95)");
      }

      // Markers
      const phase = reduced ? 0.45 : (time / 2600) % 1;
      const marker = (lon: number, lat: number, label: string, color: string, dot: number, labelDx: number, labelDy: number, align: CanvasTextAlign) => {
        const p = proj(lon, lat);
        if (p.c <= 0) return { x: p.x, y: p.y, visible: false };
        const a = Math.min(1, p.c * 5);
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dot, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, dot * (1.6 + phase * 2.2), 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = a * (1 - phase) * 0.8;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.globalAlpha = a;
        ctx.font = `600 ${Math.max(11, R * 0.052)}px ${font}`;
        (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "2px";
        ctx.fillStyle = color === "#f3e2b8" ? "#e7cf9b" : "#f7f3ea";
        // Keep the label inside the canvas when the marker turns toward the edge.
        const tw = ctx.measureText(label).width;
        let lx = align === "right" ? p.x + labelDx - tw : p.x + labelDx;
        lx = Math.max(6, Math.min(w - tw - 6, lx));
        ctx.textAlign = "left";
        ctx.fillText(label, lx, Math.max(14, Math.min(h - 6, p.y + labelDy)));
        ctx.globalAlpha = 1;
        return { x: p.x, y: p.y, visible: true };
      };
      const b = marker(BERLIN.lon, BERLIN.lat, berlinLabel, "#cfe0ff", 4, -12, -12, "right");
      const k = marker(KARACHI.lon, KARACHI.lat, karachiLabel, "#f3e2b8", 5.5, 14, 26, "left");

      // Lightweight state for QA tools (throttled): current rotation and on-screen marker positions.
      if (time - lastPublish > 250) {
        lastPublish = time;
        wrap.dataset.lon = s.lon0.toFixed(2);
        wrap.dataset.lat = s.lat0.toFixed(2);
        wrap.dataset.auto = s.auto.toFixed(2);
        wrap.dataset.berlin = `${b.x.toFixed(1)},${b.y.toFixed(1)},${b.visible}`;
        wrap.dataset.karachi = `${k.x.toFixed(1)},${k.y.toFixed(1)},${k.visible}`;
      }
    };

    const step = (dt: number) => {
      if (!s.dragging) {
        s.lon0 += s.vLon * dt;
        s.lat0 += s.vLat * dt;
        const decay = Math.exp(-2.8 * dt);
        s.vLon *= decay;
        s.vLat *= decay;
        if (!reduced) {
          s.auto = Math.min(1, s.auto + dt / 1.6); // ease back into rotation — no jump
          s.lon0 -= AUTO_SPEED * s.auto * dt;
          s.lat0 += (HOME_LAT - s.lat0) * (1 - Math.exp(-0.25 * dt)) * s.auto;
        }
      }
      s.lat0 = Math.max(-55, Math.min(65, s.lat0));
      s.lon0 = ((((s.lon0 + 180) % 360) + 360) % 360) - 180;
    };

    const tick = (t: number) => {
      raf = 0;
      step(Math.min(0.05, Math.max(0, (t - last) / 1000)));
      last = t;
      draw(t);
      const moving = !reduced || s.dragging || Math.abs(s.vLon) + Math.abs(s.vLat) > 0.3;
      if (visible && !document.hidden && moving) raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf && visible && !disposed && data) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      R = Math.min(w, h) * 0.4615; // matches the static globe (R 240 in a 520 viewBox)
      cx = w / 2;
      cy = h / 2;
      draw(performance.now());
    };

    const load = () => {
      if (data || loading) return;
      loading = true;
      fetch("/karachi-globe-data.json")
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((json: GlobeData) => {
          if (disposed) return;
          data = json;
          resize();
          setReady(true);
          kick();
        })
        .catch((err: unknown) => {
          loading = false;
          wrap.dataset.globeError = String(err); // static globe stays visible
        });
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      s.dragging = true;
      s.touch = e.pointerType === "touch";
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = performance.now();
      s.vLon = 0;
      s.vLat = 0;
      s.auto = 0;
      wrap.dataset.dragging = "true";
      wrap.dataset.auto = "0.00";
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* pointer already gone */
      }
      kick();
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      const now = performance.now();
      const dts = Math.max(8, now - s.lastT) / 1000;
      const k = 180 / Math.PI / Math.max(R, 1); // degrees per pixel so the surface follows the pointer
      s.lon0 -= dx * k;
      if (!s.touch) s.lat0 += dy * k;
      s.lat0 = Math.max(-55, Math.min(65, s.lat0));
      s.vLon = s.vLon * 0.4 + ((-dx * k) / dts) * 0.6;
      s.vLat = s.touch ? 0 : s.vLat * 0.4 + ((dy * k) / dts) * 0.6;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.lastT = now;
      wrap.dataset.lon = s.lon0.toFixed(2);
      wrap.dataset.lat = s.lat0.toFixed(2);
      kick();
    };
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      delete wrap.dataset.dragging;
      if (performance.now() - s.lastT > 90) {
        s.vLon = 0;
        s.vLat = 0;
      }
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      kick();
    };
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, [number, number]> = { ArrowLeft: [12, 0], ArrowRight: [-12, 0], ArrowUp: [0, -8], ArrowDown: [0, 8] };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      s.lon0 += d[0];
      s.lat0 = Math.max(-55, Math.min(65, s.lat0 + d[1]));
      s.auto = 0;
      lastPublish = -1e9;
      draw(performance.now());
      kick();
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    wrap.addEventListener("keydown", onKey);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);
    window.addEventListener("resize", resize);

    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) {
            load();
            kick();
          }
        },
        { rootMargin: "300px 0px" },
      );
      io.observe(wrap);
    } else {
      visible = true;
      load();
    }
    const onVis = () => !document.hidden && kick();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      wrap.removeEventListener("keydown", onKey);
    };
  }, [berlinLabel, karachiLabel]);

  return (
    <div
      ref={wrapRef}
      role="group"
      aria-label={ariaLabel}
      aria-describedby={hintId}
      tabIndex={0}
      data-globe={ready ? "interactive" : "static"}
      className="relative h-full w-full rounded-full outline-offset-8"
    >
      <div aria-hidden={ready} className={`absolute inset-0 transition-opacity duration-700 ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full cursor-grab touch-pan-y select-none drop-shadow-[0_40px_60px_rgba(0,0,0,.55)] transition-opacity duration-700 active:cursor-grabbing ${ready ? "opacity-100" : "opacity-0"}`}
      />
      <p id={hintId} className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.68rem] uppercase tracking-[0.18em] text-ivory/45">
        {hint}
      </p>
    </div>
  );
}
