#include "easings.glsl"
uniform float u_time;
uniform float u_opacity_stagger;
uniform float u_opacity_delay;
uniform float u_count;
varying float v_index;
uniform vec3 u_color;

float opacity_change_duration = 0.2;

void main() {
  gl_FragColor.rgb = u_color;
  
  float point_delay = u_opacity_delay + linear(v_index / u_count) * u_opacity_stagger;
  gl_FragColor.a = clamp((u_time - point_delay) / opacity_change_duration, 0.0, 1.0);
}