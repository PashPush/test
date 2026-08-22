var T=`precision mediump float;

varying vec2 vUv;
attribute vec2 a_position;

void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
}`,k=`precision mediump float;

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
}`;let u=null;function I(){if(u)return u;const r=document.querySelector("canvas#neuro"),t=document.getElementById("contacts");if(!r)return()=>{};const e=r.getContext("webgl",{alpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"low-power"});if(!e)return t==null||t.classList.add("fallback-bg"),()=>{};const S=(o,d)=>{const i=e.createShader(d);return i?(e.shaderSource(i,o),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS)?i:(console.warn("Neuro shader compilation failed.",e.getShaderInfoLog(i)),e.deleteShader(i),null)):null},s=S(T,e.VERTEX_SHADER),l=S(k,e.FRAGMENT_SHADER),n=s&&l?e.createProgram():null;if(!n||!s||!l)return s&&e.deleteShader(s),l&&e.deleteShader(l),t==null||t.classList.add("fallback-bg"),()=>{};if(e.attachShader(n,s),e.attachShader(n,l),e.linkProgram(n),!e.getProgramParameter(n,e.LINK_STATUS))return console.warn("Neuro shader linking failed.",e.getProgramInfoLog(n)),e.deleteProgram(n),e.deleteShader(s),e.deleteShader(l),t==null||t.classList.add("fallback-bg"),()=>{};const b=e.createBuffer();if(!b)return e.deleteProgram(n),e.deleteShader(s),e.deleteShader(l),t==null||t.classList.add("fallback-bg"),()=>{};e.bindBuffer(e.ARRAY_BUFFER,b),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.useProgram(n);const A=e.getAttribLocation(n,"a_position");e.enableVertexAttribArray(A),e.vertexAttribPointer(A,2,e.FLOAT,!1,0,0);const v={time:e.getUniformLocation(n,"u_time"),pointer:e.getUniformLocation(n,"u_pointer_position"),scroll:e.getUniformLocation(n,"u_scroll_progress"),ratio:e.getUniformLocation(n,"u_ratio")};let c=0,m=r.dataset.visible==="true",g=!1,p=!document.hidden;const a={x:0,y:0,targetX:0,targetY:0},f=()=>{c&&(cancelAnimationFrame(c),c=0)},E=o=>{if(g||!m||!p)return f();a.x+=(a.targetX-a.x)*.2,a.y+=(a.targetY-a.y)*.2,e.uniform1f(v.time,o);const{clientWidth:d,clientHeight:i}=document.documentElement;e.uniform2f(v.pointer,a.x/d,1-a.y/i),e.uniform1f(v.scroll,scrollY/(2*innerHeight)),e.drawArrays(e.TRIANGLE_STRIP,0,4),c=requestAnimationFrame(E)},w=()=>{!c&&m&&p&&!g&&(c=requestAnimationFrame(E))},L=()=>{if(g)return;const{clientWidth:o,clientHeight:d}=document.documentElement;if(!o||!d)return;const i=Math.min(devicePixelRatio,o<768?1:2),h=Math.round(o*i),_=Math.round(d*i);r.width===h&&r.height===_||(r.width=h,r.height=_,e.viewport(0,0,h,_),e.uniform1f(v.ratio,h/_))},x=o=>{a.targetX=o.clientX,a.targetY=o.clientY},y=()=>{p=!document.hidden,p?w():f()},P=new MutationObserver(()=>{m=r.dataset.visible==="true",m?w():f()}),R=o=>{o.preventDefault(),g=!0,f(),t==null||t.classList.add("fallback-bg")},U=()=>{F(),u=null,I()},F=()=>{f(),P.disconnect(),window.removeEventListener("resize",L),window.removeEventListener("pointermove",x),document.removeEventListener("visibilitychange",y),r.removeEventListener("webglcontextlost",R),r.removeEventListener("webglcontextrestored",U),e.deleteBuffer(b),e.deleteProgram(n),e.deleteShader(s),e.deleteShader(l)};return window.addEventListener("resize",L,{passive:!0}),window.addEventListener("pointermove",x,{passive:!0}),document.addEventListener("visibilitychange",y),r.addEventListener("webglcontextlost",R,!1),r.addEventListener("webglcontextrestored",U,!1),P.observe(r,{attributes:!0,attributeFilter:["data-visible"]}),t==null||t.classList.remove("fallback-bg"),L(),w(),u=()=>{F(),u=null},u}export{I as initNeuro};
