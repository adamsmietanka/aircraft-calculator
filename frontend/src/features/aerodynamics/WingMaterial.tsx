import Wood from "../../assets/materials/log.svg?react";
import Metal from "../../assets/materials/metal.svg?react";
import Fabric from "../../assets/materials/fabric.svg?react";
import Honeycomb from "../../assets/materials/honeycomb.svg?react";
import { useWingStore } from "./stores/useWing";

const WingMaterial = () => {
  const material = useWingStore((state) => state.material);
  const setMaterial = useWingStore((state) => state.setMaterial);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Wing Material</span>
      </label>
      <label className="flex flex-col">
        <input
          type="range"
          min="0"
          max="1"
          value={material}
          className="range range-xs"
          onChange={(e) => setMaterial(parseFloat(e.target.value))}
        />
        <div className="w-full flex justify-between mt-2">
          <div className="flex space-x-1 -ml-2">
            <div className="tooltip" data-tip="Wood">
              <Wood className="w-10 h-8 mt-1 " />
            </div>
            <div className="tooltip" data-tip="Fabric">
              <Fabric className="w-10 h-8 mt-1" />
            </div>
          </div>
          <div className="flex space-x-1 -mr-2">
            <div className="tooltip" data-tip="Metal">
              <Metal className="w-10 h-8 mt-1 " />
            </div>
            <div className="tooltip" data-tip="Composite">
              <Honeycomb className="w-10 h-8 mt-1" />
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default WingMaterial;
