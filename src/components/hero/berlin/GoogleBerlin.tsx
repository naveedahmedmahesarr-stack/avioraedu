"use client";

import { Component, useCallback, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { TilesAttributionOverlay, TilesPlugin, TilesRenderer } from "3d-tiles-renderer/r3f";
import { GLTFExtensionsPlugin, GoogleCloudAuthPlugin, ReorientationPlugin, TilesFadePlugin } from "3d-tiles-renderer/plugins";
import { BERLIN_ORIGIN, REAL_LANDMARKS } from "./landmarkSpace";
import type { LandmarkKey } from "./BerlinCity";

export type TilesStatus = "loading" | "ready" | "error";

type AuthLike = { autoRefreshToken: boolean; sessionToken: string | null; fetch: (url: string, options?: RequestInit) => Promise<unknown> };

/**
 * GoogleCloudAuthPlugin with a safe failure mode.
 *
 * The stock plugin with `autoRefreshToken: true` answers ANY 4xx on the very first root request by
 * re-requesting the root to "refresh" the session — for a permanently invalid key/project that second
 * request fails too and throws "GoogleCloudAuth: Failed to load data with error code 404".
 * Here auto-refresh starts OFF; a failed root request raises one clear error with Google's status
 * (surfaced through the renderer's load-error event → procedural Berlin fallback). Once a real session
 * exists, auto-refresh is enabled so long-running sessions can still renew their token.
 */
type TileNode = { content?: { uri?: string }; children?: TileNode[] };

/** Same session-token extraction the library performs: the first child content URI carries `session=`. */
function findSessionToken(node: TileNode | undefined): string | null {
  if (!node) return null;
  const uri = node.content?.uri;
  if (uri && uri.includes("?")) {
    const token = new URLSearchParams(uri.split("?")[1]).get("session");
    if (token) return token;
  }
  for (const child of node.children ?? []) {
    const token = findSessionToken(child);
    if (token) return token;
  }
  return null;
}

class SafeGoogleCloudAuthPlugin extends GoogleCloudAuthPlugin {
  async fetchData(url: string, options?: RequestInit) {
    const self = this as unknown as { auth: AuthLike; apiToken: string };
    const auth = self.auth;

    if (auth.sessionToken === null) {
      // First (root) request is handled here: the library's helper would parse Google's error body as a
      // tileset and crash ("reading 'content'") or retry via refreshToken ("Failed to load data with error code 404").
      const rootUrl = new URL(url);
      rootUrl.searchParams.set("key", self.apiToken);
      const res = await fetch(rootUrl, options);
      if (!res.ok) {
        let detail = "";
        try {
          const body = await res.json();
          const err = (Array.isArray(body) ? body[0] : body)?.error as { status?: string; message?: string } | undefined;
          if (err) detail = ` ${err.status ?? ""} — ${err.message ?? ""}`;
        } catch {
          // non-JSON error body; the HTTP status alone is reported
        }
        throw new Error(`Google Photorealistic 3D Tiles unavailable: HTTP ${res.status}${detail}`);
      }
      const json = (await res.json()) as { root?: TileNode };
      auth.sessionToken = findSessionToken(json.root);
      // A real session now exists — allow the library to renew it on later 4xx responses.
      if (auth.sessionToken) auth.autoRefreshToken = true;
      return json;
    }

    return auth.fetch(url, options);
  }
}

/** Any render-time failure inside the tiles subtree switches the hero back to the procedural Berlin instead of crashing the page. */
class TilesErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[3D tiles] disabled after render error:", error instanceof Error ? error.message : error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Real Berlin from Google Photorealistic 3D Tiles (photogrammetry), re-centred so the
 * Brandenburger Tor sits at the origin with +Y up, in metres. Rendered inside the existing
 * Berlin group, so the hero's scale, rise animation and camera path are unchanged.
 *
 * CONFIGURATION REQUIRED: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY with the "Map Tiles API" enabled.
 * Google's policies require visible attribution — rendered by <TilesAttributionOverlay />.
 */
export function GoogleBerlin(props: {
  apiKey: string;
  compact: boolean;
  active: boolean;
  clippingPlanes: THREE.Plane[];
  onStatus: (s: TilesStatus) => void;
  onLandmark?: (key: LandmarkKey) => void;
}) {
  const { onStatus } = props;
  const onError = useCallback(() => onStatus("error"), [onStatus]);
  return (
    <TilesErrorBoundary onError={onError}>
      <GoogleBerlinTiles {...props} />
    </TilesErrorBoundary>
  );
}

function GoogleBerlinTiles({
  apiKey,
  compact,
  active,
  clippingPlanes,
  onStatus,
  onLandmark,
}: {
  apiKey: string;
  compact: boolean;
  active: boolean;
  clippingPlanes: THREE.Plane[];
  onStatus: (s: TilesStatus) => void;
  onLandmark?: (key: LandmarkKey) => void;
}) {
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const reported = useRef<TilesStatus>("loading");
  const report = useCallback(
    (s: TilesStatus) => {
      if (reported.current === s) return;
      reported.current = s;
      onStatus(s);
    },
    [onStatus],
  );

  // Plugin constructor arguments MUST be referentially stable: <TilesPlugin> re-creates the plugin
  // whenever `args` changes. Re-creating GoogleCloudAuthPlugin on every render dropped the session
  // token, so tile requests went out without key/session (HTTP 400/403) and the renderer crashed.
  const authArgs = useMemo(() => [{ apiToken: apiKey, autoRefreshToken: false, useRecommendedSettings: false }], [apiKey]);
  const gltfArgs = useMemo(() => {
    const draco = new DRACOLoader();
    draco.setDecoderPath("/draco/"); // served locally (public/draco) to satisfy the CSP
    return [{ dracoLoader: draco }];
  }, []);
  const reorientArgs = useMemo(
    () => [
      {
        lat: BERLIN_ORIGIN.lat * THREE.MathUtils.DEG2RAD,
        lon: BERLIN_ORIGIN.lon * THREE.MathUtils.DEG2RAD,
        height: BERLIN_ORIGIN.height,
        recenter: true,
      },
    ],
    [],
  );
  const fadeArgs = useMemo(() => [{ fadeDuration: 250 }], []);
  const attributionStyle = useMemo(
    () => ({
      left: "auto",
      right: "92px",
      bottom: "10px",
      top: "auto",
      fontSize: "10px",
      lineHeight: 1.3,
      color: "rgba(247,243,234,0.75)",
      textShadow: "0 1px 2px rgba(0,0,0,.6)",
      pointerEvents: "none" as const,
    }),
    [],
  );

  // "tiles-load-end" only fires when the download queue fully drains, which may never happen while
  // the camera keeps moving — so the scene is considered ready once enough real tiles have arrived.
  const loadedModels = useRef(0);

  // Clip to central Berlin so the city does not spread across the Europe map.
  const onLoadModel = useCallback(
    (e: { scene: THREE.Object3D }) => {
      loadedModels.current += 1;
      if (loadedModels.current >= 24) report("ready");
      e.scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          m.clippingPlanes = clippingPlanes;
          // Full anisotropic filtering keeps photo textures sharp at oblique camera angles.
          const map = (m as THREE.MeshBasicMaterial).map;
          if (map) {
            map.anisotropy = maxAnisotropy;
            map.needsUpdate = true;
          }
          m.needsUpdate = true;
        });
      });
    },
    [clippingPlanes, maxAnisotropy, report],
  );
  const onTilesLoadEnd = useCallback(() => report("ready"), [report]);
  const onLoadError = useCallback(
    (e: { tile: unknown; error: Error }) => {
      console.warn("[3D tiles] load error", e.error?.message);
      if (!e.tile) report("error");
    },
    [report],
  );

  const hit = (key: LandmarkKey) =>
    onLandmark
      ? {
          onClick: (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onLandmark(key);
          },
          onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
          },
          onPointerOut: () => {
            document.body.style.cursor = "";
          },
        }
      : {};

  const invisible = <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />;

  return (
    <group>
      {/* ReorientationPlugin's local frame is rotated 180° about +Y relative to this scene's
          convention (+X east, −Z north); verified visually against the Tiergarten / Pariser Platz axis. */}
      <group rotation={[0, Math.PI, 0]}>
        <TilesRenderer
          key={apiKey}
          enabled={active}
          // Screen-space error in pixels: lower = finer LOD. 2 px desktop keeps buildings sharp at every zoom.
          errorTarget={compact ? 10 : 2}
          onLoadModel={onLoadModel}
          onTilesLoadEnd={onTilesLoadEnd}
          onLoadError={onLoadError}
        >
          <TilesPlugin plugin={SafeGoogleCloudAuthPlugin} args={authArgs} />
          <TilesPlugin plugin={GLTFExtensionsPlugin} args={gltfArgs} />
          <TilesPlugin plugin={ReorientationPlugin} args={reorientArgs} />
          <TilesPlugin plugin={TilesFadePlugin} args={fadeArgs} />
          <TilesAttributionOverlay style={attributionStyle} />
        </TilesRenderer>
      </group>

      {/* Invisible click targets at the real landmark positions (the photogrammetry mesh is not split per building). */}
      <mesh position={[REAL_LANDMARKS.gate.x, 14, REAL_LANDMARKS.gate.z]} {...hit("gate")}>
        <boxGeometry args={[24, 30, 70]} />
        {invisible}
      </mesh>
      <mesh position={[REAL_LANDMARKS.reichstag.x, 28, REAL_LANDMARKS.reichstag.z]} {...hit("reichstag")}>
        <boxGeometry args={[100, 60, 140]} />
        {invisible}
      </mesh>
      <mesh position={[REAL_LANDMARKS.tower.x, 185, REAL_LANDMARKS.tower.z]} {...hit("tower")}>
        <cylinderGeometry args={[30, 40, 370, 12]} />
        {invisible}
      </mesh>
    </group>
  );
}
