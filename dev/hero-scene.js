import * as THREE from "./vendor/three.module.min.js";

const host = document.querySelector("[data-hero-scene]");
const canvas = host?.querySelector("canvas");

if (host && canvas) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactViewport = window.matchMedia("(max-width: 720px)");
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !compactViewport.matches,
      powerPreference: "low-power",
    });
  } catch {
    host.dataset.renderer = "unavailable";
  }

  if (renderer) {
    host.dataset.renderer = "ready";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    const world = new THREE.Group();
    const chartGroup = new THREE.Group();
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const materials = {};
    let isVisible = true;
    let frameId = 0;
    let lastFrame = 0;

    scene.add(world);
    world.add(chartGroup);
    camera.position.set(0, 1.25, 9.6);
    camera.lookAt(0, -0.18, -0.8);

    const readColor = (property, fallback) => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
      const color = new THREE.Color();
      color.setStyle(value || fallback);
      return color;
    };

    const makeMaterials = () => {
      const green = readColor("--green", "#13c636");
      const deep = readColor("--green-deep", "#087a2a");

      materials.green = new THREE.MeshStandardMaterial({
        color: green,
        emissive: green,
        emissiveIntensity: 0.08,
        metalness: 0.05,
        roughness: 0.5,
      });
      materials.bar = new THREE.MeshStandardMaterial({
        color: green,
        emissive: green,
        emissiveIntensity: 0.035,
        metalness: 0.04,
        roughness: 0.58,
        transparent: true,
        opacity: 0.2,
      });
      materials.barAccent = new THREE.MeshStandardMaterial({
        color: green,
        emissive: green,
        emissiveIntensity: 0.08,
        metalness: 0.04,
        roughness: 0.52,
        transparent: true,
        opacity: 0.44,
      });
      materials.barEdge = new THREE.LineBasicMaterial({ color: deep, transparent: true, opacity: 0.62 });
      materials.route = new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.9 });
      materials.routeGlow = new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.18 });
    };

    makeMaterials();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x16321f, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-3, 7, 8);
    scene.add(keyLight);

    const chartValues = compactViewport.matches
      ? [0.48, 0.74, 0.63, 1.02, 0.9, 1.35, 1.72]
      : [0.48, 0.74, 0.63, 1.02, 0.9, 1.32, 1.18, 1.58, 1.92];
    const chartPoints = [];
    const chartBase = -1.5;
    const chartStart = -3.25;
    const chartSpacing = compactViewport.matches ? 0.92 : 0.82;

    chartValues.forEach((value, index) => {
      const progress = index / (chartValues.length - 1);
      const height = value * 1.38;
      const geometry = new THREE.BoxGeometry(0.54, height, 0.68);
      const material = index === chartValues.length - 1 ? materials.barAccent : materials.bar;
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(chartStart + index * chartSpacing, chartBase + height / 2, 1.25 - progress * 2.7);
      bar.rotation.y = -0.08;
      chartGroup.add(bar);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), materials.barEdge);
      edges.position.copy(bar.position);
      edges.rotation.copy(bar.rotation);
      chartGroup.add(edges);
      chartPoints.push(new THREE.Vector3(bar.position.x, chartBase + height + 0.1, bar.position.z));
    });

    const growthCurve = new THREE.CatmullRomCurve3(chartPoints, false, "catmullrom", 0.22);
    const growthGlow = new THREE.Mesh(
      new THREE.TubeGeometry(growthCurve, 96, 0.105, 7, false),
      materials.routeGlow,
    );
    chartGroup.add(growthGlow);
    const growthPath = new THREE.Mesh(
      new THREE.TubeGeometry(growthCurve, 96, 0.044, 7, false),
      materials.route,
    );
    chartGroup.add(growthPath);
    chartGroup.position.set(0.55, -0.03, 0);

    const growthMarker = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      materials.green,
    );
    chartGroup.add(growthMarker);

    const grid = new THREE.GridHelper(18, 22, 0x4bb962, 0x80a98a);
    grid.position.set(0.4, chartBase - 0.03, -1.25);
    grid.material.transparent = true;
    grid.material.opacity = 0.22;
    world.add(grid);

    const updatePalette = () => {
      const green = readColor("--green", "#13c636");
      const deep = readColor("--green-deep", "#087a2a");
      const line = readColor("--line", "#cfe2cf");
      materials.green.color.copy(green);
      materials.green.emissive.copy(green);
      materials.bar.color.copy(green);
      materials.bar.emissive.copy(green);
      materials.barAccent.color.copy(green);
      materials.barAccent.emissive.copy(green);
      materials.barEdge.color.copy(deep);
      materials.route.color.copy(green);
      materials.routeGlow.color.copy(green);
      grid.material.color.copy(line);
      renderFrame(0);
    };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compactViewport.matches ? 1 : 1.5));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      world.position.x = width < 720 ? -0.25 : 0;
      world.scale.setScalar(width < 720 ? 0.82 : 1);
      renderFrame(0);
    };

    function renderFrame(elapsed) {
      const motionEnabled = !reducedMotion.matches && !compactViewport.matches;
      pointer.lerp(pointerTarget, motionEnabled ? 0.035 : 1);
      world.rotation.y = pointer.x * 0.035;
      world.rotation.x = pointer.y * 0.018;
      growthMarker.position.copy(growthCurve.getPointAt(motionEnabled ? (elapsed * 0.035) % 1 : 0.72));
      growthMarker.rotation.y = elapsed * 0.7;
      renderer.render(scene, camera);
    }

    const animate = (timestamp) => {
      if (!isVisible || document.hidden || reducedMotion.matches || compactViewport.matches) {
        frameId = 0;
        return;
      }
      frameId = requestAnimationFrame(animate);
      if (timestamp - lastFrame < 33) return;
      lastFrame = timestamp;
      renderFrame(clock.getElapsedTime());
    };

    const syncAnimation = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
      renderFrame(0);
      if (isVisible && !document.hidden && !reducedMotion.matches && !compactViewport.matches) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const handlePointer = (event) => {
      const bounds = host.getBoundingClientRect();
      pointerTarget.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointerTarget.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const resetPointer = () => pointerTarget.set(0, 0);
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      syncAnimation();
    }, { threshold: 0.02 });
    observer.observe(host);

    new ResizeObserver(resize).observe(host);
    new MutationObserver(updatePalette).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    reducedMotion.addEventListener("change", syncAnimation);
    compactViewport.addEventListener("change", () => {
      resize();
      syncAnimation();
    });
    document.addEventListener("visibilitychange", syncAnimation);
    host.closest(".hero")?.addEventListener("pointermove", handlePointer, { passive: true });
    host.closest(".hero")?.addEventListener("pointerleave", resetPointer, { passive: true });

    resize();
    syncAnimation();

    window.addEventListener("pagehide", () => cancelAnimationFrame(frameId), { once: true });
  }
}
