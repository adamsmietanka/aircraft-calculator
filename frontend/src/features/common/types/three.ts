import { Interpolation, SpringValue } from "@react-spring/three";
import { Object3D } from "three";

export interface Props {
  opacity: SpringValue<number>;
}

/** A spring or an interpolation derived from one. Both carry `.get()` and `.to()`,
 *  but neither is assignable to the other, so props taking either have to say so. */
export type FluidNumber = SpringValue<number> | Interpolation<number>;

/** Any value an `animated.*` scalar prop accepts. */
export type AnimatedNumber = number | FluidNumber;

/** drei types TransformControls' `onChange` event as the bare `THREE.Event`, whose
 *  `target` is `unknown`. This recovers the object the gizmo is dragging. */
export const transformTarget = (e?: {
  target?: unknown;
}): Object3D | undefined =>
  (e?.target as { object?: Object3D } | undefined)?.object;
