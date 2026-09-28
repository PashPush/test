import{r as Z,j as oe}from"./vendor-8x-7sR9u.js";import{W as se,S as ae,C as re,L as J,P as K,B as $,T as le,a as ce,U as z,V as M,b as de,M as ue,c as me,D as pe,d as he,O as ve,R as we}from"./vendor_three-BHQEjw8I.js";import{u as ge}from"./mount-DhI9BAah.js";import"./vendor_gsap-Bs3GFK5R.js";import"./preload-helper-ckwbz45p.js";var fe=`uniform vec2 uResolution;
uniform sampler2D uPictureTexture;
uniform sampler2D uDisplacementTexture;

attribute float aIntensity;
attribute float aAngle;

varying vec3 vColor;

void main()
{
    
    vec3 newPosition = position;
    float displacementIntensity = texture2D(uDisplacementTexture, uv).r;
    displacementIntensity = smoothstep(0.1, 0.35, displacementIntensity);

    vec3 displacement = vec3(
        cos(aAngle) * 0.25,
        sin(aAngle) * 0.25,
        1.0
    );
    displacement = normalize(displacement);
    displacement *= displacementIntensity;
    displacement *= 2.5;
    displacement *= aIntensity;

    newPosition += displacement;

    
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    
    float pictureIntensity = texture2D(uPictureTexture, uv).r;

    
    gl_PointSize = 0.15 * pictureIntensity * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    
    vColor = vec3(pow(pictureIntensity, 2.0));
}`,xe=`varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = distance(uv, vec2(0.5)); 

    if (distanceToCenter > 0.5) {
        discard; 
    }

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}`;const be=180,ee=1.5,te=128,ne=g=>({width:document.documentElement.clientWidth,height:Math.max(1,document.documentElement.clientHeight-g)}),Ae=({onReady:g})=>{const D=ge("(max-height: 600px)"),f=Z.useRef(g);return f.current=g,Z.useEffect(()=>{let x=!1,T=0,d=null;const E=()=>{if(x)return;const o=document.querySelector("#webgl");if(!o||!document.documentElement.clientWidth||!document.documentElement.clientHeight){T=requestAnimationFrame(E);return}let s;try{s=new se({canvas:o,antialias:!1,powerPreference:"low-power"})}catch(t){console.warn("Hero WebGL is unavailable.",t);return}const _=D?0:100,e={...ne(_),pixelRatio:Math.min(devicePixelRatio,ee)};s.setClearColor("#000"),s.setSize(e.width,e.height),s.setPixelRatio(e.pixelRatio);const b=new ae,i=document.createElement("canvas");i.width=i.height=128;const a=i.getContext("2d",{willReadFrequently:!0});if(!a){s.dispose();return}a.fillRect(0,0,i.width,i.height);const l=new re(i);l.minFilter=l.magFilter=J,l.generateMipmaps=!1,l.flipY=!1;const A=new Image;A.src="/images/glow.png";const r=new K(10,10,te,te);r.setIndex(null),r.deleteAttribute("normal");const C=new Float32Array(r.attributes.position.count),j=new Float32Array(r.attributes.position.count);for(let t=0;t<C.length;t++)C[t]=Math.random(),j[t]=Math.random()*Math.PI*2;r.setAttribute("aIntensity",new $(C,1)),r.setAttribute("aAngle",new $(j,1));let O=!1;const p=new le().load("/images/pavel-bw.webp",()=>{O=!0,m()});p.minFilter=p.magFilter=J,p.generateMipmaps=!1;const I=new ce({vertexShader:fe,fragmentShader:xe,uniforms:{uResolution:new z(new M(e.width*e.pixelRatio,e.height*e.pixelRatio)),uPictureTexture:new z(p),uDisplacementTexture:new z(l)}});b.add(new de(r,I));const h=new ue(new K(10,10),new me({side:pe}));h.visible=!1,b.add(h);const c=new he(35,e.width/e.height,.1,100);c.position.set(0,0,20),b.add(c);const y=new ve(c,o);y.enableDamping=!0,y.enableZoom=!1;const W=new we,q=new M(9999,9999),v=new M(9999,9999),B=new M(9999,9999);let u=0,F=!document.hidden,S=!0,L=!1,G=0,V=!1;const P=()=>{u&&(cancelAnimationFrame(u),u=0)},ie=()=>{var Q;u=0;const t=y.update();if(L){L=!1,W.setFromCamera(q,c);const w=W.intersectObject(h)[0];w!=null&&w.uv&&v.set(w.uv.x*i.width,w.uv.y*i.height)}a.globalCompositeOperation="source-over",a.globalAlpha=.02,a.fillRect(0,0,i.width,i.height);const n=Math.min(B.distanceTo(v)*.1,1);B.copy(v);const R=i.width*.25;n>0&&A.complete&&(a.globalCompositeOperation="lighten",a.globalAlpha=n,a.drawImage(A,v.x-R/2,v.y-R/2,R,R),G=be),l.needsUpdate=!0,s.render(b,c),O&&!V&&(V=!0,(Q=f.current)==null||Q.call(f)),(t||G-- >0)&&m()},m=()=>{!u&&F&&S&&!x&&(u=requestAnimationFrame(ie))},H=t=>{const n=o.getBoundingClientRect();!n.width||!n.height||(q.set((t.clientX-n.left)/n.width*2-1,-((t.clientY-n.top)/n.height)*2+1),L=!0,m())},U=()=>{const{width:t,height:n}=ne(_);t===e.width&&n===e.height||(e.width=t,e.height=n,e.pixelRatio=Math.min(devicePixelRatio,ee),I.uniforms.uResolution.value.set(e.width*e.pixelRatio,e.height*e.pixelRatio),c.aspect=e.width/e.height,c.updateProjectionMatrix(),s.setSize(e.width,e.height),s.setPixelRatio(e.pixelRatio),m())},X=()=>{F=!document.hidden,F?m():P()},Y=new IntersectionObserver(([t])=>{S=t.isIntersecting,S?m():P()},{threshold:.01}),k=t=>{t.preventDefault(),P()},N=()=>{x||(d(),E())};d=()=>{P(),Y.disconnect(),window.removeEventListener("pointermove",H),window.removeEventListener("resize",U),document.removeEventListener("visibilitychange",X),o.removeEventListener("webglcontextlost",k),o.removeEventListener("webglcontextrestored",N),y.dispose(),r.dispose(),I.dispose(),l.dispose(),p.dispose(),h.geometry.dispose(),h.material.dispose(),s.dispose()},window.addEventListener("pointermove",H,{passive:!0}),window.addEventListener("resize",U,{passive:!0}),document.addEventListener("visibilitychange",X),o.addEventListener("webglcontextlost",k,!1),o.addEventListener("webglcontextrestored",N,!1),Y.observe(o)};return E(),()=>{x=!0,cancelAnimationFrame(T),d==null||d(),d=null}},[D]),oe.jsx("canvas",{id:"webgl","aria-label":"Interactive portrait"})};export{Ae as default};
