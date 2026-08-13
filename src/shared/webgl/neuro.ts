import vertSource from './shaders/neuro/vertex.glsl';
import fragSource from './shaders/neuro/fragment.glsl';

let canvasEl: HTMLCanvasElement | null;
let gl: WebGLRenderingContext | null;
let uniforms: Record<string, WebGLUniformLocation | null>;
let shaderProgram: WebGLProgram | null;
let animationId: number | null = null;
let contextLost = false;
let isVisible = false;

const pointer = {
  x: 0,
  y: 0,
  tX: 0,
  tY: 0,
};

function getDevicePixelRatio() {
  return Math.min(window.devicePixelRatio, 2);
}

export function initNeuro() {
  canvasEl = document.querySelector<HTMLCanvasElement>('canvas#neuro');
  if (!canvasEl) {
    return;
  }

  canvasEl.addEventListener('webglcontextlost', handleContextLost, false);
  canvasEl.addEventListener('webglcontextrestored', handleContextRestored, false);

  initWebGL();
}

function initWebGL() {
  const contacts = document.getElementById('contacts');

  gl = initShader();

  if (gl) {
    contextLost = false;
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setupEvents();

    if (contacts && contacts.classList.contains('fallback-bg')) {
      contacts.classList.remove('fallback-bg');
    }
  } else {
    if (contacts) {
      contacts.classList.add('fallback-bg');
    }
  }
}

function handleContextLost(event: Event) {
  event.preventDefault();
  contextLost = true;

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  const contacts = document.getElementById('contacts');
  if (contacts) {
    contacts.classList.add('fallback-bg');
  }
}

function handleContextRestored() {
  initWebGL();
}

function createShader(glCtx: WebGLRenderingContext, sourceCode: string, type: number) {
  const shader = glCtx.createShader(type);
  if (!shader) return null;

  glCtx.shaderSource(shader, sourceCode);
  glCtx.compileShader(shader);

  if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + glCtx.getShaderInfoLog(shader));
    glCtx.deleteShader(shader);
    return null;
  }

  return shader;
}

function createShaderProgram(
  glCtx: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  const program = glCtx.createProgram();
  if (!program) return null;

  glCtx.attachShader(program, vertexShader);
  glCtx.attachShader(program, fragmentShader);
  glCtx.linkProgram(program);

  if (!glCtx.getProgramParameter(program, glCtx.LINK_STATUS)) {
    console.error(
      'Unable to initialize the shader program: ' + glCtx.getProgramInfoLog(program),
    );
    return null;
  }

  return program;
}

function getUniforms(glCtx: WebGLRenderingContext, program: WebGLProgram) {
  const uniformsMap: Record<string, WebGLUniformLocation | null> = {};
  const uniformCount = glCtx.getProgramParameter(program, glCtx.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    const info = glCtx.getActiveUniform(program, i);
    if (info) {
      uniformsMap[info.name] = glCtx.getUniformLocation(program, info.name);
    }
  }
  return uniformsMap;
}

function initShader() {
  if (!canvasEl) return null;

  const glContext =
    canvasEl.getContext('webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
    }) ||
    canvasEl.getContext('experimental-webgl', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: false,
    });

  if (!glContext) {
    return null;
  }

  const glCtx = glContext as WebGLRenderingContext;

  const vertexShader = createShader(glCtx, vertSource, glCtx.VERTEX_SHADER);
  const fragmentShader = createShader(glCtx, fragSource, glCtx.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  shaderProgram = createShaderProgram(glCtx, vertexShader, fragmentShader);

  if (!shaderProgram) {
    return null;
  }

  uniforms = getUniforms(glCtx, shaderProgram);

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const vertexBuffer = glCtx.createBuffer();
  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vertexBuffer);
  glCtx.bufferData(glCtx.ARRAY_BUFFER, vertices, glCtx.STATIC_DRAW);

  glCtx.useProgram(shaderProgram);

  const positionLocation = glCtx.getAttribLocation(shaderProgram, 'a_position');
  glCtx.enableVertexAttribArray(positionLocation);

  glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vertexBuffer);
  glCtx.vertexAttribPointer(positionLocation, 2, glCtx.FLOAT, false, 0, 0);

  return glCtx;
}

function render() {
  if (contextLost || !gl || !isVisible) {
    animationId = null;
    return;
  }

  if (gl.isContextLost()) {
    contextLost = true;
    animationId = null;
    return;
  }

  const currentTime = performance.now();

  pointer.x += (pointer.tX - pointer.x) * 0.2;
  pointer.y += (pointer.tY - pointer.y) * 0.2;

  gl.uniform1f(uniforms.u_time, currentTime);
  gl.uniform2f(
    uniforms.u_pointer_position,
    pointer.x / window.innerWidth,
    1 - pointer.y / window.innerHeight,
  );
  gl.uniform1f(uniforms.u_scroll_progress, window.pageYOffset / (2 * window.innerHeight));

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  animationId = requestAnimationFrame(render);
}

function startRenderLoop() {
  if (!animationId && isVisible && !contextLost && gl) {
    render();
  }
}

function stopRenderLoop() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function resizeCanvas() {
  if (!canvasEl || !gl || contextLost) return;

  const dpr = getDevicePixelRatio();
  canvasEl.width = window.innerWidth * dpr;
  canvasEl.height = window.innerHeight * dpr;
  gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
  gl.viewport(0, 0, canvasEl.width, canvasEl.height);
}

function updateMousePosition(eX: number, eY: number) {
  pointer.tX = eX;
  pointer.tY = eY;
}

function setupEvents() {
  window.addEventListener('pointermove', (e) => {
    updateMousePosition(e.clientX, e.clientY);
  });
  window.addEventListener(
    'touchmove',
    (e) => {
      if (e.targetTouches[0]) {
        updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
    },
    { passive: true },
  );
  window.addEventListener('click', (e) => {
    updateMousePosition(e.clientX, e.clientY);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startRenderLoop();
    } else {
      stopRenderLoop();
    }
  });

  if ('MutationObserver' in window && canvasEl) {
    const checkVisibility = () => {
      const nowVisible = canvasEl?.getAttribute('data-visible') === 'true';
      if (nowVisible !== isVisible) {
        isVisible = nowVisible;
        if (isVisible) {
          startRenderLoop();
        } else {
          stopRenderLoop();
        }
      }
    };

    const observer = new MutationObserver(checkVisibility);
    observer.observe(canvasEl, { attributes: true, attributeFilter: ['data-visible'] });

    isVisible = false;
  } else {
    isVisible = true;
    startRenderLoop();
  }
}
