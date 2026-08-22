import vertSource from './shaders/neuro/vertex.glsl';
import fragSource from './shaders/neuro/fragment.glsl';

let disposeActive: (() => void) | null = null;

export function initNeuro() {
  // StrictMode, restored contexts and repeated proximity events may all call us.
  // Recreating from a clean disposal point keeps listeners and RAF singular.
  if (disposeActive) return disposeActive;
  const canvas = document.querySelector<HTMLCanvasElement>('canvas#neuro');
  const contacts = document.getElementById('contacts');
  if (!canvas) return () => {};
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  }) as WebGLRenderingContext | null;
  if (!gl) {
    contacts?.classList.add('fallback-bg');
    return () => {};
  }

  const shader = (source: string, type: number) => {
    const result = gl.createShader(type);
    if (!result) return null;
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) {
      console.warn('Neuro shader compilation failed.', gl.getShaderInfoLog(result));
      gl.deleteShader(result);
      return null;
    }
    return result;
  };
  const vertex = shader(vertSource, gl.VERTEX_SHADER),
    fragment = shader(fragSource, gl.FRAGMENT_SHADER);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (!program || !vertex || !fragment) {
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
    contacts?.classList.add('fallback-bg');
    return () => {};
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('Neuro shader linking failed.', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    contacts?.classList.add('fallback-bg');
    return () => {};
  }
  const buffer = gl.createBuffer();
  if (!buffer) {
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    contacts?.classList.add('fallback-bg');
    return () => {};
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = {
    time: gl.getUniformLocation(program, 'u_time'),
    pointer: gl.getUniformLocation(program, 'u_pointer_position'),
    scroll: gl.getUniformLocation(program, 'u_scroll_progress'),
    ratio: gl.getUniformLocation(program, 'u_ratio'),
  };
  let raf = 0,
    visible = canvas.dataset.visible === 'true',
    lost = false,
    pageVisible = !document.hidden;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const stop = () => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
  const render = (time: number) => {
    if (lost || !visible || !pageVisible) return stop();
    pointer.x += (pointer.targetX - pointer.x) * 0.2;
    pointer.y += (pointer.targetY - pointer.y) * 0.2;
    gl.uniform1f(uniforms.time, time);
    const { clientWidth, clientHeight } = document.documentElement;
    gl.uniform2f(uniforms.pointer, pointer.x / clientWidth, 1 - pointer.y / clientHeight);
    gl.uniform1f(uniforms.scroll, scrollY / (2 * innerHeight));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(render);
  };
  const play = () => {
    if (!raf && visible && pageVisible && !lost) raf = requestAnimationFrame(render);
  };
  const resize = () => {
    if (lost) return;
    const { clientWidth, clientHeight } = document.documentElement;
    if (!clientWidth || !clientHeight) return;
    const dpr = Math.min(devicePixelRatio, clientWidth < 768 ? 1 : 2);
    const width = Math.round(clientWidth * dpr);
    const height = Math.round(clientHeight * dpr);
    if (canvas.width === width && canvas.height === height) return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform1f(uniforms.ratio, width / height);
  };
  const move = (event: PointerEvent) => {
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
  };
  const visibilityChange = () => {
    pageVisible = !document.hidden;
    if (pageVisible) play();
    else stop();
  };
  const mutation = new MutationObserver(() => {
    visible = canvas.dataset.visible === 'true';
    if (visible) play();
    else stop();
  });
  const contextLost = (event: Event) => {
    event.preventDefault();
    lost = true;
    stop();
    contacts?.classList.add('fallback-bg');
  };
  const contextRestored = () => {
    dispose();
    disposeActive = null;
    initNeuro();
  };
  const dispose = () => {
    stop();
    mutation.disconnect();
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', move);
    document.removeEventListener('visibilitychange', visibilityChange);
    canvas.removeEventListener('webglcontextlost', contextLost);
    canvas.removeEventListener('webglcontextrestored', contextRestored);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
  };
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', move, { passive: true });
  document.addEventListener('visibilitychange', visibilityChange);
  canvas.addEventListener('webglcontextlost', contextLost, false);
  canvas.addEventListener('webglcontextrestored', contextRestored, false);
  mutation.observe(canvas, { attributes: true, attributeFilter: ['data-visible'] });
  contacts?.classList.remove('fallback-bg');
  resize();
  play();
  disposeActive = () => {
    dispose();
    disposeActive = null;
  };
  return disposeActive;
}

export function setNeuroVisible(visible: boolean) {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas#neuro');
  if (!canvas) return;
  if (visible) canvas.setAttribute('data-visible', 'true');
  else canvas.removeAttribute('data-visible');
}
