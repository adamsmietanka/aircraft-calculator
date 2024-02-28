import { Center, Float, Text3D, useCursor } from "@react-three/drei";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedHtml from "../common/three/AnimatedHtml";
import LinkedIn from "../../assets/contact/linkedin.svg?react";
import YouTube from "../../assets/contact/youtube.svg?react";
import GitHub from "../../assets/contact/github.svg?react";
import Mail from "../../assets/contact/mail.svg?react";
import { useCameraStore } from "../common/three/stores/useCamera";

const Contact = () => {
  const [hovered, setHover] = useState(false);
  const [show, setShow] = useState(false);

  const setCamera = useCameraStore((state) => state.set);

  useCursor(hovered);
  return (
    <Float
      speed={0.5} // Animation speed, defaults to 1
      rotationIntensity={0.1} // XYZ rotation intensity, defaults to 1
      floatIntensity={0.1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
    >
      <Center
        position={[-7, -4, 60]}
        rotation={[
          (-10 * Math.PI) / 180,
          (45 * Math.PI) / 180,
          (0 * Math.PI) / 180,
          "YXZ",
        ]}
      >
        <AnimatedHtml position-x={-3} show={show}>
          <div className="flex flex-col text-2xl space-y-4 items-center">
            <p>Adam Śmietanka</p>
            <div className="flex space-x-4">
              <a
                role="button"
                className="btn btn-ghost p-0"
                href="https://www.linkedin.com/in/adam-smietanka/"
                target="_blank"
              >
                <LinkedIn className="w-10 h-10" />
              </a>
              <a
                role="button"
                className="btn btn-ghost p-0"
                href="https://www.youtube.com/channel/UCwFuWr3LvX9QiDakwqrTw3w"
                target="_blank"
              >
                <YouTube className="w-12 h-12" />
              </a>
              <a
                role="button"
                className="btn btn-ghost p-0"
                href="https://github.com/adamsmietanka"
                target="_blank"
              >
                <GitHub className="w-10 h-10" />
              </a>
            </div>
            <p className="text-xs flex space-x-2">
              <Mail />{" "}
              <small className="select-all">adam@bookofflight.com</small>
            </p>
          </div>
        </AnimatedHtml>
        <mesh
          visible={false}
          position={[0.75, 0.1, 0]}
          onPointerOver={(e) => (e.stopPropagation(), setHover(true))}
          onPointerOut={(e) => setHover(false)}
          onClick={() => {
            show
              ? setCamera({ center: [0, 0, 0], spherical: [70, 90, 0] })
              : setCamera({ center: [-7, -2, 60], spherical: [10, 90, 45] });
            setShow(() => !show);
          }}
        >
          <planeGeometry args={[1.75, 0.5]} />
        </mesh>
        <Text3D
          font="/fonts/Roboto Medium_Regular.json"
          lineHeight={0.5}
          size={0.3}
          height={0.1}
          curveSegments={8}
        >
          Contact
          <meshPhongMaterial color={hovered ? "lightgrey" : "white"} />
        </Text3D>
      </Center>
    </Float>
  );
};

export default Contact;
