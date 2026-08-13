varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceToCenter = distance(uv, vec2(0.5)); // 0.5 because we want to get the center of the particle

    if (distanceToCenter > 0.5) {
        discard; // this prevents everything around the center of the particle from being rendered
    }

    gl_FragColor = vec4(vColor, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}