import{b as Q,r as X,j as $}from"./vendor-Dk_g0iDH.js";import{W as ee,S as te,C as ne,L as Z,P as J,B as K,T as ie,a as oe,U as E,V as R,b as se,M as re,c as ae,D as le,d as ce,O as de,R as me}from"./vendor_three-BHQEjw8I.js";var ue=`uniform vec2 uResolution;
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
}`,pe=`varying vec3 vColor;

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
}`;const we=()=>{const m=Q({maxWidth:640}),S=Q({maxHeight:600}),h=X.useRef(null);return X.useEffect(()=>{let v=!1,z=0;const C=()=>{if(v)return;const n=document.querySelector("#webgl");if(!n||!window.innerWidth||!window.innerHeight){z=requestAnimationFrame(C);return}let s;try{s=new ee({canvas:n,antialias:!m,powerPreference:"low-power"})}catch(t){console.warn("Hero WebGL is unavailable.",t);return}const T=S?0:m?150:100,u=m?{dpr:1,segments:96,frameMs:1e3/60}:{dpr:2,segments:128,frameMs:0},e={width:innerWidth,height:Math.max(1,innerHeight-T),pixelRatio:Math.min(devicePixelRatio,u.dpr)};s.setClearColor("#000"),s.setSize(e.width,e.height),s.setPixelRatio(e.pixelRatio);const x=new te,o=document.createElement("canvas");o.width=o.height=m?96:128;const r=o.getContext("2d",{willReadFrequently:!0});if(!r){s.dispose();return}r.fillRect(0,0,o.width,o.height);const l=new ne(o);l.minFilter=l.magFilter=Z,l.generateMipmaps=!1,l.flipY=!1;const I=new Image;I.src="/images/glow.png";const a=new J(10,10,u.segments,u.segments);a.setIndex(null),a.deleteAttribute("normal");const A=new Float32Array(a.attributes.position.count),D=new Float32Array(a.attributes.position.count);for(let t=0;t<A.length;t++)A[t]=Math.random(),D[t]=Math.random()*Math.PI*2;a.setAttribute("aIntensity",new K(A,1)),a.setAttribute("aAngle",new K(D,1));let c=()=>{};const w=new ie().load("/images/pavel-bw.webp",void 0,void 0,()=>{c()});w.minFilter=w.magFilter=Z,w.generateMipmaps=!1;const F=new oe({vertexShader:ue,fragmentShader:pe,uniforms:{uResolution:new E(new R(e.width*e.pixelRatio,e.height*e.pixelRatio)),uPictureTexture:new E(w),uDisplacementTexture:new E(l)}});x.add(new se(a,F));const g=new re(new J(10,10),new ae({side:le}));g.visible=!1,x.add(g);const d=new ce(35,e.width/e.height,.1,100);d.position.set(0,0,m?27:20),x.add(d);const b=new de(d,n);b.enableDamping=!0,b.enableZoom=!1;const _=new me,j=new R(9999,9999),f=new R(9999,9999),W=new R(9999,9999);let p=0,y=!document.hidden,P=!0,q=0;c=()=>{p&&(cancelAnimationFrame(p),p=0)};const O=t=>{if(!y||!P||v)return c();if(p=requestAnimationFrame(O),u.frameMs&&t-q<u.frameMs)return;q=t,b.update(),_.setFromCamera(j,d);const i=_.intersectObject(g)[0];i!=null&&i.uv&&f.set(i.uv.x*o.width,i.uv.y*o.height),r.globalCompositeOperation="source-over",r.globalAlpha=.02,r.fillRect(0,0,o.width,o.height);const N=Math.min(W.distanceTo(f)*.1,1);W.copy(f);const M=o.width*.25;I.complete&&(r.globalCompositeOperation="lighten",r.globalAlpha=N,r.drawImage(I,f.x-M/2,f.y-M/2,M,M)),l.needsUpdate=!0,s.render(x,d)},L=()=>{!p&&y&&P&&!v&&(p=requestAnimationFrame(O))},H=t=>{const i=n.getBoundingClientRect();i.width&&i.height&&j.set((t.clientX-i.left)/i.width*2-1,-((t.clientY-i.top)/i.height)*2+1)},B=()=>{e.width=innerWidth,e.height=Math.max(1,innerHeight-T),e.pixelRatio=Math.min(devicePixelRatio,u.dpr),F.uniforms.uResolution.value.set(e.width*e.pixelRatio,e.height*e.pixelRatio),d.aspect=e.width/e.height,d.updateProjectionMatrix(),s.setSize(e.width,e.height),s.setPixelRatio(e.pixelRatio)},V=()=>{y=!document.hidden,y?L():c()},G=new IntersectionObserver(([t])=>{P=t.isIntersecting,P?L():c()},{threshold:.01}),U=t=>{t.preventDefault(),c()},Y=()=>{v||(k(),C())},k=()=>{c(),G.disconnect(),window.removeEventListener("pointermove",H),window.removeEventListener("resize",B),document.removeEventListener("visibilitychange",V),n.removeEventListener("webglcontextlost",U),n.removeEventListener("webglcontextrestored",Y),b.dispose(),a.dispose(),F.dispose(),l.dispose(),w.dispose(),g.geometry.dispose(),g.material.dispose(),s.dispose()};window.addEventListener("pointermove",H,{passive:!0}),window.addEventListener("resize",B,{passive:!0}),document.addEventListener("visibilitychange",V),n.addEventListener("webglcontextlost",U,!1),n.addEventListener("webglcontextrestored",Y,!1),G.observe(n),L(),h.current=k};return C(),()=>{var n;v=!0,cancelAnimationFrame(z),(n=h.current)==null||n.call(h),h.current=null}},[m,S]),$.jsx("canvas",{id:"webgl","aria-label":"Interactive portrait"})};export{we as default};
