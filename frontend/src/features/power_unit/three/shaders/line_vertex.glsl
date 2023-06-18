#include "easings.glsl"

uniform float u_time;
uniform float u_time_start;
uniform float u_position_duration;
uniform float u_position_stagger;
uniform float u_count;
attribute vec3 positionFrom;
attribute float index;
varying float v_index;

void main() {
  v_index = index;

  float point_delay = linear(index / u_count) * u_position_stagger;
  float point_start = u_time_start + point_delay;
  float x = (u_time - point_start) / u_position_duration;
  float inter = cubic_in_out(x);

  vec3 new_position = mix(positionFrom, position, inter);
  vec4 modelPosition = modelMatrix * vec4(new_position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_PointSize = 1.0 * (100.0 / -viewPosition.z);

  gl_Position = projectedPosition;
}