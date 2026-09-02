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
    const pathGroup = new THREE.Group();
    const globeGroup = new THREE.Group();
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const materials = {};
    let isVisible = true;
    let frameId = 0;
    let lastFrame = 0;

    scene.add(world);
    world.add(pathGroup, globeGroup);
    camera.position.set(0.15, 1.25, 9.6);
    camera.lookAt(1.35, -0.2, -0.8);

    const readColor = (property, fallback) => {
      const value = getComputedStyle(document.documentElement).getPropertyValue(property).trim();
      const color = new THREE.Color();
      color.setStyle(value || fallback);
      return color;
    };

    const makeMaterials = () => {
      const green = readColor("--green", "#13c636");
      const deep = readColor("--green-deep", "#087a2a");
      const surface = readColor("--surface-raised", "#f6fbf5");

      materials.green = new THREE.MeshStandardMaterial({
        color: green,
        emissive: green,
        emissiveIntensity: 0.08,
        metalness: 0.05,
        roughness: 0.5,
      });
      materials.surface = new THREE.MeshStandardMaterial({
        color: surface,
        metalness: 0.04,
        roughness: 0.62,
        transparent: true,
        opacity: 0.88,
      });
      materials.stepAccent = new THREE.MeshStandardMaterial({
        color: green,
        emissive: green,
        emissiveIntensity: 0.06,
        metalness: 0.04,
        roughness: 0.56,
        transparent: true,
        opacity: 0.36,
      });
      materials.stepEdge = new THREE.LineBasicMaterial({ color: deep, transparent: true, opacity: 0.38 });
      materials.route = new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.9 });
      materials.routeGlow = new THREE.MeshBasicMaterial({ color: green, transparent: true, opacity: 0.12 });
      materials.globe = new THREE.LineBasicMaterial({ color: deep, transparent: true, opacity: 0.24 });
    };

    makeMaterials();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x16321f, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-3, 7, 8);
    scene.add(keyLight);

    const pathPoints = [];
    const stepCount = compactViewport.matches ? 7 : 9;
    for (let index = 0; index < stepCount; index += 1) {
      const progress = index / (stepCount - 1);
      const height = 0.22 + progress * 0.62;
      const top = -1.45 + progress * 2.55;
      const width = 0.94 - progress * 0.14;
      const geometry = new THREE.BoxGeometry(width, height, 0.82);
      const step = new THREE.Mesh(geometry, index % 3 === 2 ? materials.stepAccent : materials.surface);
      step.position.set(0.2 + progress * 4.25, top - height / 2, 2.45 - progress * 6.3);
      step.rotation.y = -0.09;
      pathGroup.add(step);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), materials.stepEdge);
      edges.position.copy(step.position);
      edges.rotation.copy(step.rotation);
      pathGroup.add(edges);
      pathPoints.push(new THREE.Vector3(step.position.x, top + 0.12, step.position.z));
    }

    const growthCurve = new THREE.CatmullRomCurve3(pathPoints);
    const growthGlow = new THREE.Mesh(
      new THREE.TubeGeometry(growthCurve, 80, 0.095, 7, false),
      materials.routeGlow,
    );
    pathGroup.add(growthGlow);
    const growthPath = new THREE.Mesh(
      new THREE.TubeGeometry(growthCurve, 80, 0.045, 7, false),
      materials.route,
    );
    pathGroup.add(growthPath);
    pathGroup.position.set(1.08, 0.08, 0);

    const growthMarker = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      materials.green,
    );
    pathGroup.add(growthMarker);

    const grid = new THREE.GridHelper(18, 22, 0x4bb962, 0x80a98a);
    grid.position.set(1.8, -1.5, -1.4);
    grid.material.transparent = true;
    grid.material.opacity = 0.15;
    world.add(grid);

    const globeRadius = 0.92;
    const globeGeometry = new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius, 24, 14));
    globeGroup.add(new THREE.LineSegments(globeGeometry, materials.globe));

    const pointFromCoordinates = (latitude, longitude, radius) => {
      const phi = THREE.MathUtils.degToRad(90 - latitude);
      const theta = THREE.MathUtils.degToRad(longitude + 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    };

    const colombia = pointFromCoordinates(4.57, -74.3, globeRadius * 1.01);
    const australia = pointFromCoordinates(-33.87, 151.21, globeRadius * 1.01);
    const routePeak = colombia.clone().add(australia).normalize().multiplyScalar(globeRadius * 1.55);
    const routeCurve = new THREE.QuadraticBezierCurve3(colombia, routePeak, australia);
    const route = new THREE.Mesh(
      new THREE.TubeGeometry(routeCurve, 42, 0.018, 6, false),
      materials.route,
    );
    globeGroup.add(route);

    for (const point of [colombia, australia]) {
      const marker = new THREE.Mesh(new THREE.OctahedronGeometry(0.075, 0), materials.green);
      marker.position.copy(point);
      globeGroup.add(marker);
    }

    globeGroup.position.set(5.35, 1.75, -1.15);
    globeGroup.rotation.set(0.08, -0.52, -0.08);

    const updatePalette = () => {
      const green = readColor("--green", "#13c636");
      const deep = readColor("--green-deep", "#087a2a");
      const surface = readColor("--surface-raised", "#f6fbf5");
      const line = readColor("--line", "#cfe2cf");
      materials.green.color.copy(green);
      materials.green.emissive.copy(green);
      materials.surface.color.copy(surface);
      materials.stepAccent.color.copy(green);
      materials.stepAccent.emissive.copy(green);
      materials.stepEdge.color.copy(deep);
      materials.route.color.copy(green);
      materials.routeGlow.color.copy(green);
      materials.globe.color.copy(deep);
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
      world.position.x = width < 980 ? -0.7 : 0.35;
      world.scale.setScalar(width < 720 ? 0.82 : 1);
      renderFrame(0);
    };

    function renderFrame(elapsed) {
      const motionEnabled = !reducedMotion.matches && !compactViewport.matches;
      pointer.lerp(pointerTarget, motionEnabled ? 0.035 : 1);
      world.rotation.y = pointer.x * 0.035;
      world.rotation.x = pointer.y * 0.018;
      globeGroup.rotation.y = -0.52 + (motionEnabled ? elapsed * 0.035 : 0);
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
