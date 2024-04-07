import { useLoader } from "@react-three/fiber";
import { BufferGeometry, Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";

export interface Fuse {
  shape: number;
  length: number;
  wingX: number;
  configuration: number;
  geometry: BufferGeometry;
}

const defaults = {
  shape: 2301,
  length: 9,
  wingX: 1.5,
  configuration: 1,
};

const isMultifuse = (config: number) => [2, 3].includes(config);

export class Fuselage implements Fuse {
  public shape: number;
  public length: number;
  public wingX: number;
  public configuration: number;
  public geometry: BufferGeometry;
  public mesh: Mesh;

  constructor(config: Partial<Fuse>) {
    const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");

    this.shape = config.shape || defaults.shape;
    this.length = config.length || defaults.length;
    this.wingX = config.wingX || defaults.wingX;
    this.configuration = config.configuration || defaults.configuration;

    this.mesh = new Mesh();

    // const geom = nodes[this.shape]?.geometry.clone();
    // geom.scale(this.length, this.length, this.length);
    // geom.translate(-this.wingX, 0, 0);
    // this.geometry = geom;
    // // geom.translate(-this.wingX, 0, 0);
    // this.mesh = new Mesh();
    // this.mesh.geometry = nodes[this.shape]?.geometry;
    // this.mesh.scale.set(this.length, this.length, this.length);
    // this.mesh.position.set(-this.wingX, 0, 0);
    // // this.mesh2 = new Mesh();
    // // this.mesh2.geometry = nodes[this.shape]?.geometry;
    // // this.mesh2.scale.set(0.8 * length, 0.8 * length, 0.8 * length);
    // // this.mesh2.position.set(0, 0.2, 0);
    // // this.mesh.add(this.mesh2);
    // this.geometry = BufferGeometryUtils.mergeGeometries([
    //   geom,
    //   geom.clone().translate(-this.wingX, 0, 0),
    // ]);
    // this.geometry.scale(length, length, length);
    // this.geometry.translate(-this.wingX, 0, 0);
    this.createMesh();
  }

  public createMesh() {
    const { nodes } = useLoader(GLTFLoader, "/models/fuse.glb");

    const mesh = new Mesh();
    const geom = nodes[this.shape]?.geometry
      .clone()
      .scale(this.length, this.length, this.length)
      .translate(-this.wingX, 0, 0);

    // mesh.geometry = BufferGeometryUtils.mergeGeometries([
    //   geom.translate(0, 0, isMultifuse(this.configuration) && -0.5),
    //   geom.clone().translate(0, 0, isMultifuse(this.configuration) && -0.5),
    // ]);

    mesh.geometry = geom;
    this.geometry = geom;

    // mesh.position.set(-this.wingX, 0, 0);

    this.mesh = mesh;
  }
}
