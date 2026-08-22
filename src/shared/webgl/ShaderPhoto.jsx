import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import vertexShader from './shaders/particles/vertex.glsl';
import fragmentShader from './shaders/particles/fragment.glsl';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

const ShaderPhoto = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const horizontal = useMediaQuery({ maxHeight: 600 });
  const cleanupRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let deferredId = 0;
    const start = () => {
      if (disposed) return;
      const canvas = document.querySelector('#webgl');
      if (!canvas || !window.innerWidth || !window.innerHeight) {
        deferredId = requestAnimationFrame(start);
        return;
      }
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference: 'low-power' });
      } catch (error) {
        console.warn('Hero WebGL is unavailable.', error);
        return;
      }

      const gap = horizontal ? 0 : isMobile ? 150 : 100;
      const quality = isMobile ? { dpr: 1, segments: 96, frameMs: 1000 / 60 } : { dpr: 2, segments: 128, frameMs: 0 };
      const sizes = {
        width: innerWidth,
        height: Math.max(1, innerHeight - gap),
        pixelRatio: Math.min(devicePixelRatio, quality.dpr),
      };
      renderer.setClearColor('#000');
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
      const scene = new THREE.Scene();
      const paint = document.createElement('canvas');
      paint.width = paint.height = isMobile ? 96 : 128;
      const context = paint.getContext('2d', { willReadFrequently: true });
      if (!context) {
        renderer.dispose();
        return;
      }
      context.fillRect(0, 0, paint.width, paint.height);
      const displacement = new THREE.CanvasTexture(paint);
      displacement.minFilter = displacement.magFilter = THREE.LinearFilter;
      displacement.generateMipmaps = false;
      displacement.flipY = false;
      const glow = new Image();
      glow.src = '/images/glow.png';
      const geometry = new THREE.PlaneGeometry(10, 10, quality.segments, quality.segments);
      geometry.setIndex(null);
      geometry.deleteAttribute('normal');
      const intensity = new Float32Array(geometry.attributes.position.count),
        angle = new Float32Array(geometry.attributes.position.count);
      for (let i = 0; i < intensity.length; i++) {
        intensity[i] = Math.random();
        angle[i] = Math.random() * Math.PI * 2;
      }
      geometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensity, 1));
      geometry.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1));
      let stop = () => {};
      const image = new THREE.TextureLoader().load('/images/pavel-bw.webp', undefined, undefined, () => {
        stop();
      });
      image.minFilter = image.magFilter = THREE.LinearFilter;
      image.generateMipmaps = false;
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uResolution: new THREE.Uniform(
            new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
          ),
          uPictureTexture: new THREE.Uniform(image),
          uDisplacementTexture: new THREE.Uniform(displacement),
        },
      });
      scene.add(new THREE.Points(geometry, material));
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
      );
      plane.visible = false;
      scene.add(plane);
      const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(0, 0, isMobile ? 27 : 20);
      scene.add(camera);
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.enableZoom = false;
      const raycaster = new THREE.Raycaster(),
        screen = new THREE.Vector2(9999, 9999),
        cursor = new THREE.Vector2(9999, 9999),
        previous = new THREE.Vector2(9999, 9999);
      let raf = 0,
        pageVisible = !document.hidden,
        inViewport = true,
        lastFrame = 0;
      stop = () => {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      };
      const tick = now => {
        if (!pageVisible || !inViewport || disposed) return stop();
        raf = requestAnimationFrame(tick);
        if (quality.frameMs && now - lastFrame < quality.frameMs) return;
        lastFrame = now;
        controls.update();
        raycaster.setFromCamera(screen, camera);
        const hit = raycaster.intersectObject(plane)[0];
        if (hit?.uv) cursor.set(hit.uv.x * paint.width, hit.uv.y * paint.height);
        context.globalCompositeOperation = 'source-over';
        context.globalAlpha = 0.02;
        context.fillRect(0, 0, paint.width, paint.height);
        const alpha = Math.min(previous.distanceTo(cursor) * 0.1, 1);
        previous.copy(cursor);
        const glowSize = paint.width * 0.25;
        if (glow.complete) {
          context.globalCompositeOperation = 'lighten';
          context.globalAlpha = alpha;
          context.drawImage(glow, cursor.x - glowSize / 2, cursor.y - glowSize / 2, glowSize, glowSize);
        }
        displacement.needsUpdate = true;
        renderer.render(scene, camera);
      };
      const play = () => {
        if (!raf && pageVisible && inViewport && !disposed) raf = requestAnimationFrame(tick);
      };
      const pointer = event => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height)
          screen.set(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
          );
      };
      const resize = () => {
        sizes.width = innerWidth;
        sizes.height = Math.max(1, innerHeight - gap);
        sizes.pixelRatio = Math.min(devicePixelRatio, quality.dpr);
        material.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(sizes.pixelRatio);
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
      const cleanup = () => {
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
      play();
      cleanupRef.current = cleanup;
    };
    start();
    return () => {
      disposed = true;
      cancelAnimationFrame(deferredId);
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [isMobile, horizontal]);
  return <canvas id="webgl" aria-label="Interactive portrait" />;
};

export default ShaderPhoto;
