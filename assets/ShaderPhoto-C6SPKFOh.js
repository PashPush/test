import{b as Q,r as X,j as ee}from"./vendor-Dk_g0iDH.js";import{W as te,S as ne,C as ie,L as Z,P as J,B as K,T as oe,a as se,U as L,V as M,b as ae,M as re,c as le,D as ce,d as de,O as me,R as ue}from"./vendor_three-BHQEjw8I.js";var pe=`uniform vec2 uResolution;
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
}`,he=`varying vec3 vColor;

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
}`;const N=a=>({width:document.documentElement.clientWidth,height:Math.max(1,document.documentElement.clientHeight-a)}),we=()=>{const a=Q({maxWidth:640}),S=Q({maxHeight:600}),h=X.useRef(null);return X.useEffect(()=>{let v=!1,z=0;const C=()=>{if(v)return;const i=document.querySelector("#webgl");if(!i||!document.documentElement.clientWidth||!document.documentElement.clientHeight){z=requestAnimationFrame(C);return}let s;try{s=new te({canvas:i,antialias:!a,powerPreference:"low-power"})}catch(t){console.warn("Hero WebGL is unavailable.",t);return}const T=S?0:a?150:100,u=a?{dpr:2,segments:104}:{dpr:2,segments:128},e={...N(T),pixelRatio:Math.min(devicePixelRatio,u.dpr)};s.setClearColor("#000"),s.setSize(e.width,e.height),s.setPixelRatio(e.pixelRatio);const x=new ne,o=document.createElement("canvas");o.width=o.height=a?96:128;const r=o.getContext("2d",{willReadFrequently:!0});if(!r){s.dispose();return}r.fillRect(0,0,o.width,o.height);const c=new ie(o);c.minFilter=c.magFilter=Z,c.generateMipmaps=!1,c.flipY=!1;const E=new Image;E.src="/images/glow.png";const l=new J(10,10,u.segments,u.segments);l.setIndex(null),l.deleteAttribute("normal");const I=new Float32Array(l.attributes.position.count),D=new Float32Array(l.attributes.position.count);for(let t=0;t<I.length;t++)I[t]=Math.random(),D[t]=Math.random()*Math.PI*2;l.setAttribute("aIntensity",new K(I,1)),l.setAttribute("aAngle",new K(D,1));let d=()=>{};const g=new oe().load("/images/pavel-bw.webp",void 0,void 0,()=>{d()});g.minFilter=g.magFilter=Z,g.generateMipmaps=!1;const A=new se({vertexShader:pe,fragmentShader:he,uniforms:{uResolution:new L(new M(e.width*e.pixelRatio,e.height*e.pixelRatio)),uPictureTexture:new L(g),uDisplacementTexture:new L(c)}});x.add(new ae(l,A));const w=new re(new J(10,10),new le({side:ce}));w.visible=!1,x.add(w);const m=new de(35,e.width/e.height,.1,100);m.position.set(0,0,a?27:20),x.add(m);const b=new me(m,i);b.enableDamping=!0,b.enableZoom=!1;const _=new ue,j=new M(9999,9999),f=new M(9999,9999),q=new M(9999,9999);let p=0,y=!document.hidden,P=!0,O=0;d=()=>{p&&(cancelAnimationFrame(p),p=0)};const W=t=>{if(!y||!P||v)return d();if(p=requestAnimationFrame(W),u.frameMs&&t-O<u.frameMs)return;O=t,b.update(),_.setFromCamera(j,m);const n=_.intersectObject(w)[0];n!=null&&n.uv&&f.set(n.uv.x*o.width,n.uv.y*o.height),r.globalCompositeOperation="source-over",r.globalAlpha=.02,r.fillRect(0,0,o.width,o.height);const $=Math.min(q.distanceTo(f)*.1,1);q.copy(f);const R=o.width*.25;E.complete&&(r.globalCompositeOperation="lighten",r.globalAlpha=$,r.drawImage(E,f.x-R/2,f.y-R/2,R,R)),c.needsUpdate=!0,s.render(x,m)},F=()=>{!p&&y&&P&&!v&&(p=requestAnimationFrame(W))},B=t=>{const n=i.getBoundingClientRect();n.width&&n.height&&j.set((t.clientX-n.left)/n.width*2-1,-((t.clientY-n.top)/n.height)*2+1)},H=()=>{const{width:t,height:n}=N(T);t===e.width&&n===e.height||(e.width=t,e.height=n,e.pixelRatio=Math.min(devicePixelRatio,u.dpr),A.uniforms.uResolution.value.set(e.width*e.pixelRatio,e.height*e.pixelRatio),m.aspect=e.width/e.height,m.updateProjectionMatrix(),s.setSize(e.width,e.height),s.setPixelRatio(e.pixelRatio))},V=()=>{y=!document.hidden,y?F():d()},G=new IntersectionObserver(([t])=>{P=t.isIntersecting,P?F():d()},{threshold:.01}),U=t=>{t.preventDefault(),d()},Y=()=>{v||(k(),C())},k=()=>{d(),G.disconnect(),window.removeEventListener("pointermove",B),window.removeEventListener("resize",H),document.removeEventListener("visibilitychange",V),i.removeEventListener("webglcontextlost",U),i.removeEventListener("webglcontextrestored",Y),b.dispose(),l.dispose(),A.dispose(),c.dispose(),g.dispose(),w.geometry.dispose(),w.material.dispose(),s.dispose()};window.addEventListener("pointermove",B,{passive:!0}),window.addEventListener("resize",H,{passive:!0}),document.addEventListener("visibilitychange",V),i.addEventListener("webglcontextlost",U,!1),i.addEventListener("webglcontextrestored",Y,!1),G.observe(i),F(),h.current=k};return C(),()=>{var i;v=!0,cancelAnimationFrame(z),(i=h.current)==null||i.call(h),h.current=null}},[a,S]),ee.jsx("canvas",{id:"webgl","aria-label":"Interactive portrait"})};export{we as default};
