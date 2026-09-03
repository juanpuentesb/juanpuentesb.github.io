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
    const globeGroup = new THREE.Group();
    const clock = new THREE.Clock();
    const materials = {};
    let isVisible = true;
    let frameId = 0;
    let lastFrame = 0;

    scene.add(world);
    world.add(chartGroup, globeGroup);
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
      materials.globe = new THREE.LineBasicMaterial({ color: deep, transparent: true, opacity: 0.22 });
      materials.continentOutline = new THREE.LineBasicMaterial({ color: green, transparent: true, opacity: 0.5 });
      materials.country = new THREE.MeshBasicMaterial({
        color: green,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true,
      });
      materials.countryOutline = new THREE.LineBasicMaterial({
        color: green,
        transparent: true,
        opacity: 1,
        depthTest: true,
      });
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
    const chartStart = -3.35;
    const chartSpacing = compactViewport.matches ? 0.88 : 0.75;

    chartValues.forEach((value, index) => {
      const height = value * 1.38;
      const geometry = new THREE.BoxGeometry(0.54, height, 0.34);
      const material = index === chartValues.length - 1 ? materials.barAccent : materials.bar;
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set(chartStart + index * chartSpacing, chartBase + height / 2, -0.2);
      chartGroup.add(bar);

      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), materials.barEdge);
      edges.position.copy(bar.position);
      chartGroup.add(edges);
      chartPoints.push(new THREE.Vector3(bar.position.x, chartBase + height + 0.1, 0.02));
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
    chartGroup.position.set(0.25, -0.03, 0);

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

    const globeRadius = 0.78;
    const globeDepth = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius * 0.992, 32, 20),
      new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true }),
    );
    globeGroup.add(globeDepth);
    const globeWireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(globeRadius, 28, 16)),
      materials.globe,
    );
    globeGroup.add(globeWireframe);

    const globeCenterLongitude = -85;
    const toGlobePoint = (longitude, latitude, radius = globeRadius * 1.018) => {
      const longitudeFromCenter = THREE.MathUtils.degToRad(longitude - globeCenterLongitude);
      const latitudeRadians = THREE.MathUtils.degToRad(latitude);
      const latitudeRadius = Math.cos(latitudeRadians) * radius;
      return new THREE.Vector3(
        Math.sin(longitudeFromCenter) * latitudeRadius,
        Math.sin(latitudeRadians) * radius,
        Math.cos(longitudeFromCenter) * latitudeRadius,
      );
    };

    const addContinentOutline = (coordinates) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        coordinates.map((coordinate) => toGlobePoint(...coordinate, globeRadius * 1.014)),
      );
      globeGroup.add(new THREE.LineLoop(geometry, materials.continentOutline));
    };

    const continentOutlines = [
      [
        [-168, 72], [-150, 71], [-132, 58], [-124, 49], [-123, 40],
        [-117, 32], [-110, 27], [-102, 22], [-94, 18], [-88, 21],
        [-86, 15], [-82, 9], [-79, 8], [-77, 10], [-84, 17],
        [-81, 26], [-75, 36], [-67, 45], [-59, 51], [-64, 59],
        [-79, 64], [-98, 70], [-121, 74], [-145, 73],
      ],
      [
        [-81, 12], [-75, 10], [-70, 12], [-61, 10], [-51, 5],
        [-35, -6], [-38, -15], [-43, -23], [-50, -31], [-55, -40],
        [-66, -55], [-73, -50], [-75, -40], [-72, -30], [-70, -20],
        [-77, -10], [-81, 0],
      ],
      [
        [-10, 36], [-10, 43], [-5, 48], [2, 51], [5, 57],
        [10, 64], [20, 71], [30, 70], [32, 62], [40, 58],
        [38, 50], [30, 45], [28, 40], [20, 36], [10, 38], [0, 38],
      ],
      [
        [-17, 37], [-5, 36], [10, 37], [24, 32], [34, 30],
        [44, 12], [51, 11], [44, -12], [40, -20], [32, -34],
        [18, -35], [12, -25], [5, -5], [-5, 5], [-15, 15],
      ],
      [
        [26, 40], [34, 46], [40, 55], [60, 65], [90, 78],
        [120, 70], [150, 62], [180, 65], [170, 55], [150, 50],
        [135, 42], [130, 32], [122, 24], [115, 10], [105, 3],
        [99, 10], [92, 22], [84, 20], [78, 8], [72, 20],
        [62, 24], [56, 17], [47, 12], [43, 22], [36, 30],
      ],
      [
        [113, -22], [114, -16], [122, -13], [129, -14], [136, -12],
        [142, -11], [146, -16], [154, -26], [152, -34], [146, -38],
        [137, -35], [131, -33], [123, -34], [115, -29],
      ],
      [
        [-180, -72], [-150, -70], [-120, -74], [-90, -71], [-60, -76],
        [-30, -72], [0, -75], [30, -71], [60, -76], [90, -72],
        [120, -75], [150, -71], [180, -72],
      ],
      [
        [-73, 60], [-45, 60], [-20, 70], [-25, 82], [-50, 84], [-65, 76],
      ],
    ];
    continentOutlines.forEach(addContinentOutline);

    const addCountryShape = (coordinates, center) => {
      const vertices = [];
      const centerPoint = toGlobePoint(center[0], center[1], globeRadius * 1.024);
      coordinates.forEach((coordinate, index) => {
        const next = coordinates[(index + 1) % coordinates.length];
        for (const point of [centerPoint, toGlobePoint(...coordinate), toGlobePoint(...next)]) {
          vertices.push(point.x, point.y, point.z);
        }
      });

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      globeGroup.add(new THREE.Mesh(geometry, materials.country));

      const outlineGeometry = new THREE.BufferGeometry().setFromPoints(
        coordinates.map((coordinate) => toGlobePoint(...coordinate, globeRadius * 1.032)),
      );
      globeGroup.add(new THREE.LineLoop(outlineGeometry, materials.countryOutline));
      return centerPoint;
    };

    const colombiaCenter = addCountryShape([
      [-78.9, 8.6], [-77.4, 8.3], [-75.7, 11.8], [-72.3, 12.1],
      [-71.1, 10.5], [-71.7, 7.1], [-69.5, 4.2], [-69.8, 0.7],
      [-72.1, -3.1], [-75.1, -0.8], [-77.1, 0.8], [-78.2, 4.4],
    ], [-74.2, 4.6]);

    const australiaCenter = addCountryShape([
      [113.0, -22.0], [114.0, -16.0], [122.0, -13.0], [129.0, -14.2],
      [136.0, -12.0], [142.0, -10.8], [146.0, -16.0], [153.5, -25.5],
      [152.0, -33.5], [146.0, -38.0], [137.0, -35.0], [131.0, -32.5],
      [123.0, -34.0], [115.0, -29.0],
    ], [133.5, -25.5]);
    addCountryShape([
      [144.6, -40.7], [148.4, -40.8], [148.3, -43.6], [146.1, -43.8],
    ], [146.4, -42.3]);

    const routePeak = colombiaCenter.clone().add(australiaCenter).normalize().multiplyScalar(globeRadius * 1.45);
    const countryRoute = new THREE.QuadraticBezierCurve3(australiaCenter, routePeak, colombiaCenter);
    globeGroup.add(new THREE.Mesh(
      new THREE.TubeGeometry(countryRoute, 48, 0.012, 6, false),
      materials.route,
    ));
    globeGroup.position.set(-2.45, 1.62, 0.12);

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
      materials.globe.color.copy(deep);
      materials.continentOutline.color.copy(green);
      materials.country.color.copy(green);
      materials.countryOutline.color.copy(green);
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
      const roomyGlobe = width >= 1050;
      globeGroup.scale.setScalar(roomyGlobe ? 1 : 0.76);
      globeGroup.position.set(roomyGlobe ? -2.45 : -2.82, roomyGlobe ? 1.62 : 1.78, 0.12);
      renderFrame(0);
    };

    function renderFrame(elapsed) {
      const motionEnabled = !reducedMotion.matches && !compactViewport.matches;
      globeGroup.rotation.y = motionEnabled ? elapsed * 0.12 : 0;
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
    resize();
    syncAnimation();

    window.addEventListener("pagehide", () => cancelAnimationFrame(frameId), { once: true });
  }
}
