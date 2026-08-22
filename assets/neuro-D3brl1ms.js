var U=`precision mediump float;

varying vec2 vUv;
attribute vec2 a_position;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,F=`precision mediump float;

varying vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;
uniform float u_scroll_progress;

vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.);
    vec2 res = vec2(0.);
    float scale = 8.;

    for (int j = 0; j < 15; j++) {
        uv = rotate(uv, 1.);
        sine_acc = rotate(sine_acc, 1.);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer) + 2.4 * p;
        res += (.5 + .5 * cos(layer)) / scale;
        scale *= (1.2);
    }
    return res.x + res.y;
}

void main() {
    vec2 uv = 1.1 * vUv;
    uv.x *= u_ratio;

    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0., 1.);
    p = .6 * pow(1. - p, 2.);

    float t = .001 * u_time;
    vec3 color = vec3(0.);

    float noise = neuro_shape(uv, t, p);

    noise = 2.0 * pow(noise, 3.);
    noise += pow(noise, 10.);
    noise = max(.0, noise - .5);
    noise *= (1. - length(vUv - .2));

    color = normalize(vec3(1,1,1));

    color = color * noise;

    gl_FragColor = vec4(color, noise);
}`;let d=null;function T(){if(d)return d;const n=document.querySelector("canvas#neuro"),t=document.getElementById("contacts");if(!n)return()=>{};const e=n.getContext("webgl",{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!e)return t==null||t.classList.add("fallback-bg"),()=>{};const b=(i,R)=>{const l=e.createShader(R);return l?(e.shaderSource(l,i),e.compileShader(l),e.getShaderParameter(l,e.COMPILE_STATUS)?l:(console.warn("Neuro shader compilation failed.",e.getShaderInfoLog(l)),e.deleteShader(l),null)):null},a=b(U,e.VERTEX_SHADER),s=b(F,e.FRAGMENT_SHADER),r=a&&s?e.createProgram():null;if(!r||!a||!s)return a&&e.deleteShader(a),s&&e.deleteShader(s),t==null||t.classList.add("fallback-bg"),()=>{};if(e.attachShader(r,a),e.attachShader(r,s),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))return console.warn("Neuro shader linking failed.",e.getProgramInfoLog(r)),e.deleteProgram(r),e.deleteShader(a),e.deleteShader(s),t==null||t.classList.add("fallback-bg"),()=>{};const p=e.createBuffer();if(!p)return e.deleteProgram(r),e.deleteShader(a),e.deleteShader(s),t==null||t.classList.add("fallback-bg"),()=>{};e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.useProgram(r);const w=e.getAttribLocation(r,"a_position");e.enableVertexAttribArray(w),e.vertexAttribPointer(w,2,e.FLOAT,!1,0,0);const v={time:e.getUniformLocation(r,"u_time"),pointer:e.getUniformLocation(r,"u_pointer_position"),scroll:e.getUniformLocation(r,"u_scroll_progress"),ratio:e.getUniformLocation(r,"u_ratio")};let c=0,f=n.dataset.visible==="true",m=!1,g=!document.hidden;const o={x:0,y:0,targetX:0,targetY:0},u=()=>{c&&(cancelAnimationFrame(c),c=0)},L=i=>{if(m||!f||!g)return u();o.x+=(o.targetX-o.x)*.2,o.y+=(o.targetY-o.y)*.2,e.uniform1f(v.time,i),e.uniform2f(v.pointer,o.x/innerWidth,1-o.y/innerHeight),e.uniform1f(v.scroll,scrollY/(2*innerHeight)),e.drawArrays(e.TRIANGLE_STRIP,0,4),c=requestAnimationFrame(L)},h=()=>{!c&&f&&g&&!m&&(c=requestAnimationFrame(L))},_=()=>{if(m)return;const i=Math.min(devicePixelRatio,innerWidth<768?1:2);n.width=innerWidth*i,n.height=innerHeight*i,e.viewport(0,0,n.width,n.height),e.uniform1f(v.ratio,n.width/n.height)},S=i=>{o.targetX=i.clientX,o.targetY=i.clientY},A=()=>{g=!document.hidden,g?h():u()},x=new MutationObserver(()=>{f=n.dataset.visible==="true",f?h():u()}),E=i=>{i.preventDefault(),m=!0,u(),t==null||t.classList.add("fallback-bg")},y=()=>{P(),d=null,T()},P=()=>{u(),x.disconnect(),window.removeEventListener("resize",_),window.removeEventListener("pointermove",S),document.removeEventListener("visibilitychange",A),n.removeEventListener("webglcontextlost",E),n.removeEventListener("webglcontextrestored",y),e.deleteBuffer(p),e.deleteProgram(r),e.deleteShader(a),e.deleteShader(s)};return window.addEventListener("resize",_,{passive:!0}),window.addEventListener("pointermove",S,{passive:!0}),document.addEventListener("visibilitychange",A),n.addEventListener("webglcontextlost",E,!1),n.addEventListener("webglcontextrestored",y,!1),x.observe(n,{attributes:!0,attributeFilter:["data-visible"]}),t==null||t.classList.remove("fallback-bg"),_(),h(),d=()=>{P(),d=null},d}export{T as initNeuro};
