import {
  BufferAttribute,
  CanvasTexture,
  DoubleSide,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Uniform,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vertexShader from './shaders/particles/vertex.glsl';
import fragmentShader from './shaders/particles/fragment.glsl';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

// Desktop only (Hero decides). The scene is static between inputs, so frames are drawn on
// demand: after the last pointer move the cursor trail needs ~130 frames to fade out.
const FADE_FRAMES = 180;
const MAX_DPR = 1.5;
const SEGMENTS = 128;

const layoutSize = gap => ({
  width: document.documentElement.clientWidth,
  height: Math.max(1, document.documentElement.clientHeight - gap),
});

const ShaderPhoto = ({ onReady }) => {
  const horizontal = useMediaQuery({ maxHeight: 600 });
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    let disposed = false;
    let deferredId = 0;
    let cleanup = null;
    const start = () => {
      if (disposed) return;
      const canvas = document.querySelector('#webgl');
      if (!canvas || !document.documentElement.clientWidth || !document.documentElement.clientHeight) {
        deferredId = requestAnimationFrame(start);
        return;
      }
      let renderer;
      try {
        renderer = new WebGLRenderer({ canvas, antialias: false, powerPreference: 'low-power' });
      } catch (error) {
        console.warn('Hero WebGL is unavailable.', error);
        return;
      }

      const gap = horizontal ? 0 : 100;
      const sizes = {
        ...layoutSize(gap),
        pixelRatio: Math.min(devicePixelRatio, MAX_DPR),
      };
      renderer.setClearColor('#000');
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
      const scene = new Scene();
      const paint = document.createElement('canvas');
      paint.width = paint.height = 128;
      const context = paint.getContext('2d', { willReadFrequently: true });
      if (!context) {
        renderer.dispose();
        return;
      }
      context.fillRect(0, 0, paint.width, paint.height);
      const displacement = new CanvasTexture(paint);
      displacement.minFilter = displacement.magFilter = LinearFilter;
      displacement.generateMipmaps = false;
      displacement.flipY = false;
      const glow = new Image();
      glow.src = '/images/glow.png';
      const geometry = new PlaneGeometry(10, 10, SEGMENTS, SEGMENTS);
      geometry.setIndex(null);
      geometry.deleteAttribute('normal');
      const intensity = new Float32Array(geometry.attributes.position.count),
        angle = new Float32Array(geometry.attributes.position.count);
      for (let i = 0; i < intensity.length; i++) {
        intensity[i] = Math.random();
        angle[i] = Math.random() * Math.PI * 2;
      }
      geometry.setAttribute('aIntensity', new BufferAttribute(intensity, 1));
      geometry.setAttribute('aAngle', new BufferAttribute(angle, 1));
      let loaded = false;
      const image = new TextureLoader().load('/images/pavel-bw.webp', () => {
        loaded = true;
        play();
      });
      image.minFilter = image.magFilter = LinearFilter;
      image.generateMipmaps = false;
      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uResolution: new Uniform(new Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)),
          uPictureTexture: new Uniform(image),
          uDisplacementTexture: new Uniform(displacement),
        },
      });
      scene.add(new Points(geometry, material));
      const plane = new Mesh(new PlaneGeometry(10, 10), new MeshBasicMaterial({ side: DoubleSide }));
      plane.visible = false;
      scene.add(plane);
      const camera = new PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(0, 0, 20);
      scene.add(camera);
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.enableZoom = false;
      const raycaster = new Raycaster(),
        screen = new Vector2(9999, 9999),
        cursor = new Vector2(9999, 9999),
        previous = new Vector2(9999, 9999);
      let raf = 0,
        pageVisible = !document.hidden,
        inViewport = true,
        pointerMoved = false,
        fadeFrames = 0,
        ready = false;
      const stop = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const tick = () => {
        raf = 0;
        const orbiting = controls.update();
        if (pointerMoved) {
          pointerMoved = false;
          raycaster.setFromCamera(screen, camera);
          const hit = raycaster.intersectObject(plane)[0];
          if (hit?.uv) cursor.set(hit.uv.x * paint.width, hit.uv.y * paint.height);
        }
        context.globalCompositeOperation = 'source-over';
        context.globalAlpha = 0.02;
        context.fillRect(0, 0, paint.width, paint.height);
        const alpha = Math.min(previous.distanceTo(cursor) * 0.1, 1);
        previous.copy(cursor);
        const glowSize = paint.width * 0.25;
        if (alpha > 0 && glow.complete) {
          context.globalCompositeOperation = 'lighten';
          context.globalAlpha = alpha;
          context.drawImage(glow, cursor.x - glowSize / 2, cursor.y - glowSize / 2, glowSize, glowSize);
          fadeFrames = FADE_FRAMES;
        }
        displacement.needsUpdate = true;
        renderer.render(scene, camera);
        if (loaded && !ready) {
          ready = true;
          onReadyRef.current?.();
        }
        if (orbiting || fadeFrames-- > 0) play();
      };
      const play = () => {
        if (!raf && pageVisible && inViewport && !disposed) raf = requestAnimationFrame(tick);
      };
      const pointer = event => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        screen.set(
          ((event.clientX - rect.left) / rect.width) * 2 - 1,
          -((event.clientY - rect.top) / rect.height) * 2 + 1
        );
        pointerMoved = true;
        play();
      };
      const resize = () => {
        const { width, height } = layoutSize(gap);
        if (width === sizes.width && height === sizes.height) return;
        sizes.width = width;
        sizes.height = height;
        sizes.pixelRatio = Math.min(devicePixelRatio, MAX_DPR);
        material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(sizes.pixelRatio);
        play();
      };
      const visibility = () => {
        pageVisible = !document.hidden;
        pageVisible ? play() : stop();
      };
      const observer = new IntersectionObserver(
        ([entry]) => {
          inViewport = entry.isIntersecting;
          inViewport ? play() : stop();
        },
        { threshold: 0.01 }
      );
      const lost = event => {
        event.preventDefault();
        stop();
      };
      const restored = () => {
        if (!disposed) {
          cleanup();
          start();
        }
      };
      cleanup = () => {
        stop();
        observer.disconnect();
        window.removeEventListener('pointermove', pointer);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', visibility);
        canvas.removeEventListener('webglcontextlost', lost);
        canvas.removeEventListener('webglcontextrestored', restored);
        controls.dispose();
        geometry.dispose();
        material.dispose();
        displacement.dispose();
        image.dispose();
        plane.geometry.dispose();
        plane.material.dispose();
        renderer.dispose();
      };
      window.addEventListener('pointermove', pointer, { passive: true });
      window.addEventListener('resize', resize, { passive: true });
      document.addEventListener('visibilitychange', visibility);
      canvas.addEventListener('webglcontextlost', lost, false);
      canvas.addEventListener('webglcontextrestored', restored, false);
      observer.observe(canvas);
    };
    start();
    return () => {
      disposed = true;
      cancelAnimationFrame(deferredId);
      cleanup?.();
      cleanup = null;
    };
  }, [horizontal]);
  return <canvas id="webgl" aria-label="Interactive portrait" />;
};

export default ShaderPhoto;
