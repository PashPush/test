let canvasEl, gl, uniforms, shaderProgram, animationId;
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

function init() {
  canvasEl = document.querySelector('canvas#neuro');
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

function handleContextLost(event) {
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

function initShader() {
  const vsSource = document.getElementById('vertShader')?.innerHTML;
  const fsSource = document.getElementById('fragShader')?.innerHTML;

  if (!vsSource || !fsSource) {
    return null;
  }

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

  function createShader(gl, sourceCode, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = createShader(glContext, vsSource, glContext.VERTEX_SHADER);
  const fragmentShader = createShader(glContext, fsSource, glContext.FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  function createShaderProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  shaderProgram = createShaderProgram(glContext, vertexShader, fragmentShader);

  if (!shaderProgram) {
    return null;
  }

  uniforms = getUniforms(glContext, shaderProgram);

  function getUniforms(gl, program) {
    let uniformsMap = [];
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let uniformName = gl.getActiveUniform(program, i).name;
      uniformsMap[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniformsMap;
  }

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const vertexBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
  glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);

  glContext.useProgram(shaderProgram);

  const positionLocation = glContext.getAttribLocation(shaderProgram, 'a_position');
  glContext.enableVertexAttribArray(positionLocation);

  glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
  glContext.vertexAttribPointer(positionLocation, 2, glContext.FLOAT, false, 0, 0);

  return glContext;
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
  gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
  gl.uniform1f(uniforms.u_scroll_progress, window['pageYOffset'] / (2 * window.innerHeight));

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

function setupEvents() {
  window.addEventListener('pointermove', e => {
    updateMousePosition(e.clientX, e.clientY);
  });
  window.addEventListener(
    'touchmove',
    e => {
      if (e.targetTouches[0]) {
        updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      }
    },
    { passive: true }
  );
  window.addEventListener('click', e => {
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
      const nowVisible = canvasEl.getAttribute('data-visible') === 'true';
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

  function updateMousePosition(eX, eY) {
    pointer.tX = eX;
    pointer.tY = eY;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  requestAnimationFrame(init);
}
