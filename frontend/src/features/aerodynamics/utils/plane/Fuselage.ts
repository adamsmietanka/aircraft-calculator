import { useLoader } from "@react-three/fiber";
import { BufferGeometry, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export interface Fuse {
  shape: number;
  length: number;
  wingX: number;
  configuration: number;
  fuseDistance: number;
  geometry: BufferGeometry;
}

const defaults = {
  shape: 2301,
  length: 9,
  wingX: 1.5,
  configuration: 0,
  fuseDistance: 3,
};

export class Fuselage implements Fuse {
  public shape: number;
  public length: number;
  public wingX: number;
  public configuration: number;
  public fuseDistance: number;
  public geometry: BufferGeometry;

  constructor(config: Partial<Fuse>) {
    const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");

    this.shape = config.shape || defaults.shape;
    this.length = config.length || defaults.length;
    this.wingX = config.wingX || defaults.wingX;
    this.configuration = config.configuration || defaults.configuration;
    this.fuseDistance = config.fuseDistance || defaults.fuseDistance;

    const geom = (nodes[this.shape] as Mesh).geometry
      .clone()
      .scale(this.length, this.length, this.length)
      .translate(-this.wingX, 0, 0)
      .toNonIndexed();
    geom.deleteAttribute("uv");

    this.geometry = geom;
  }
}
