import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import particlesVertexShader from '../shaders/particles/vertex.glsl';
import particlesFragmentShader from '../shaders/particles/fragment.glsl';
import { useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

const ShaderPhoto = () => {
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const horizontal = useMediaQuery({ maxHeight: 600 });
  const mountedRef = useRef(false);
  const cleanupRef = useRef(null);

  function run() {
    const canvas = document.querySelector('#webgl');
    if (!canvas) return;

    if (window.outerWidth === 0 || window.outerHeight === 0) {
      const deferredId = requestAnimationFrame(() => run());
      return () => cancelAnimationFrame(deferredId);
    }

    // Scene
    const scene = new THREE.Scene();

    // Loaders
    const textureLoader = new THREE.TextureLoader();
    // todo: make it dynamic based on screen size
    const gap = horizontal ? 0 : isMobile ? 150 : 100;

    /**
     * Sizes - use outerWidth/outerHeight to avoid reacting to browser panel changes
     */
    const sizes = {
      width: window.outerWidth,
      height: window.outerHeight - gap,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    };

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
    });
    renderer.setClearColor('#000');
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

    // Displacement
    const displacement = {};

    // 2D Canvas
    displacement.canvas = document.createElement('canvas');
    displacement.canvas.width = 128;
    displacement.canvas.height = 128;

    // Context
    displacement.context = displacement.canvas.getContext('2d', { willReadFrequently: true });
    displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

    // Glow image
    displacement.glowImage = new Image();
    displacement.glowImage.src = '/images/glow.png';

    // Texture
    displacement.texture = new THREE.CanvasTexture(displacement.canvas);
    displacement.texture.minFilter = THREE.LinearFilter;
    displacement.texture.magFilter = THREE.LinearFilter;
    displacement.texture.generateMipmaps = false;
    displacement.texture.flipY = false;

    /**
     * Particles
     */
    const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
    particlesGeometry.setIndex(null);
    particlesGeometry.deleteAttribute('normal');

    const intensitesArray = new Float32Array(particlesGeometry.attributes.position.count);
    const anglesArray = new Float32Array(particlesGeometry.attributes.position.count);

    for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
      intensitesArray[i] = Math.random();
      anglesArray[i] = Math.random() * Math.PI * 2;
    }

    particlesGeometry.setAttribute('aIntensity', new THREE.BufferAttribute(intensitesArray, 1));
    particlesGeometry.setAttribute('aAngle', new THREE.BufferAttribute(anglesArray, 1));

    // Picture texture
    const pictureTexture = textureLoader.load('/images/pavel-bw.webp');
    pictureTexture.minFilter = THREE.LinearFilter;
    pictureTexture.magFilter = THREE.LinearFilter;
    pictureTexture.generateMipmaps = false;

    const particlesMaterial = new THREE.ShaderMaterial({
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uResolution: new THREE.Uniform(
          new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
        ),
        uPictureTexture: new THREE.Uniform(pictureTexture),
        uDisplacementTexture: new THREE.Uniform(displacement.texture),
      },
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Interactive plane
    displacement.interactivePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshBasicMaterial({ color: 'red', side: THREE.DoubleSide })
    );
    displacement.interactivePlane.visible = false;
    scene.add(displacement.interactivePlane);

    // Raycaster
    displacement.raycaster = new THREE.Raycaster();

    // Coordinates
    displacement.screenCursor = new THREE.Vector2(9999, 9999);
    displacement.canvasCursor = new THREE.Vector2(9999, 9999);
    displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

    const handlePointerMove = e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      displacement.screenCursor.x = (x / rect.width) * 2 - 1;
      displacement.screenCursor.y = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove);

    /**
     * Camera
     */
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 27 : 20);
    scene.add(camera);

    const handleResize = () => {
      const newWidth = window.outerWidth;
      const newHeight = window.outerHeight - gap;

      if (sizes.width === newWidth && sizes.height === newHeight) return;
      sizes.width = newWidth;
      sizes.height = newHeight;
      sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

      particlesMaterial.uniforms.uResolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio);

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(sizes.pixelRatio);
    };

    const orientationTimeouts = [];

    const handleOrientationChange = () => {
      orientationTimeouts.forEach(clearTimeout);
      orientationTimeouts.length = 0;
      [100, 200, 400].forEach(delay => {
        orientationTimeouts.push(setTimeout(handleResize, delay));
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.enableZoom = false;

    /**
     * Animate
     */
    let animationFrameId;
    const tick = () => {
      controls.update();

      displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
      const intersections = displacement.raycaster.intersectObject(displacement.interactivePlane);

      if (intersections.length) {
        const uv = intersections[0].uv;
        displacement.canvasCursor.x = uv.x * displacement.canvas.width;
        displacement.canvasCursor.y = uv.y * displacement.canvas.height;
      }

      displacement.context.globalCompositeOperation = 'source-over';
      displacement.context.globalAlpha = 0.02;
      displacement.context.fillRect(0, 0, displacement.canvas.width, displacement.canvas.height);

      const cursorDistance = displacement.canvasCursorPrevious.distanceTo(displacement.canvasCursor);
      displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
      const alpha = Math.min(cursorDistance * 0.1, 1);

      const glowSize = displacement.canvas.width * 0.25;
      displacement.context.globalCompositeOperation = 'lighten';
      displacement.context.globalAlpha = alpha;

      displacement.context.drawImage(
        displacement.glowImage,
        displacement.canvasCursor.x - glowSize * 0.5,
        displacement.canvasCursor.y - glowSize * 0.5,
        glowSize,
        glowSize
      );

      displacement.texture.needsUpdate = true;

      renderer.render(scene, camera);

      animationFrameId = window.requestAnimationFrame(tick);
    };

    tick();

    const initialResizeId = requestAnimationFrame(() => {
      requestAnimationFrame(handleResize);
    });

    return () => {
      orientationTimeouts.forEach(clearTimeout);

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(initialResizeId);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      displacement.texture.dispose();
      pictureTexture.dispose();
      renderer.dispose();
      controls.dispose();
    };
  }

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    cleanupRef.current = run();

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      mountedRef.current = false;
    };
  }, [isMobile, horizontal]);

  return <canvas id="webgl"></canvas>;
};

export default ShaderPhoto;
