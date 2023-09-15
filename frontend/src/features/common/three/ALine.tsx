import * as React from "react";
import { Vector2, Vector3, Color, ColorRepresentation } from "three";
import { ReactThreeFiber, useFrame, useThree } from "@react-three/fiber";
import {
  LineGeometry,
  LineSegmentsGeometry,
  LineMaterial,
  LineMaterialParameters,
  Line2,
  LineSegments2,
} from "three-stdlib";
import {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from "react";
import { SpringValue } from "@react-spring/three";

export type LineProps = {
  points: Array<number>;
  pointz: SpringValue<number[]>;
  lineWidth?: number;
} & Omit<LineMaterialParameters, "vertexColors" | "color"> &
  Omit<ReactThreeFiber.Object3DNode<Line2, typeof Line2>, "args"> &
  Omit<
    ReactThreeFiber.Object3DNode<LineMaterial, [LineMaterialParameters]>,
    "color" | "vertexColors" | "args"
  > & {
    color?: ColorRepresentation;
  };

type ForwardRefComponent<P, T> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

export const ALine: ForwardRefComponent<LineProps, Line2 | LineSegments2> =
  React.forwardRef<Line2 | LineSegments2, LineProps>(function Line(
    { points, pointz, color = "black", linewidth, lineWidth, dashed, ...rest },
    ref
  ) {
    const size = useThree((state) => state.size);
    const line2 = new Line2();
    const [lineMaterial] = React.useState(() => new LineMaterial());
    const lineGeom = React.useMemo(() => {
      const geom = new LineGeometry();

      geom.setPositions(points);

      return geom;
    }, [points]);

    React.useLayoutEffect(() => {
      line2.computeLineDistances();
    }, [points, line2]);

    React.useLayoutEffect(() => {
      if (dashed) {
        lineMaterial.defines.USE_DASH = "";
      } else {
        // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
        delete lineMaterial.defines.USE_DASH;
      }
      lineMaterial.needsUpdate = true;
    }, [dashed, lineMaterial]);

    React.useEffect(() => {
      return () => lineGeom.dispose();
    }, [lineGeom]);

    useFrame(() => {
      const interp = pointz.get();
      lineGeom.setPositions(interp);
      console.log(lineGeom, interp);
    });

    return (
      <primitive object={line2} ref={ref} {...rest}>
        <primitive object={lineGeom} attach="geometry" />
        <primitive
          object={lineMaterial}
          attach="material"
          color={color}
          resolution={[size.width, size.height]}
          linewidth={linewidth ?? lineWidth}
          dashed={dashed}
          {...rest}
        />
      </primitive>
    );
  });
