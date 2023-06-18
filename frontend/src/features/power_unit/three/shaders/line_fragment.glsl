#include "easings.glsl"
uniform float u_time;
uniform float u_opacity_stagger;
uniform float u_opacity_delay;
uniform float u_count;
varying float v_index;

vec3 colorA = vec3(0.912,0.191,0.652);
vec3 colorB = vec3(1.000,0.777,0.052);

float opacity_change_duration = 0.2;

void main() {
  vec3 color = mix(colorA, colorB, 1.0);
  gl_FragColor.rgb = color;
  
  float point_delay = u_opacity_delay + linear(v_index / u_count) * u_opacity_stagger;
  gl_FragColor.a = clamp((u_time - point_delay) / opacity_change_duration, 0.0, 1.0);
  
  // if (distance(gl_PointCoord, vec2(0.5)) > 0.5) {
  //   gl_FragColor.a = 0.0;
  // }
}