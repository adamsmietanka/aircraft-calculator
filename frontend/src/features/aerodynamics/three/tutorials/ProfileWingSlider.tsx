import { ReactComponent as Mass } from "../../../../assets/mass.svg";
import { useShowStore } from "./stores/useInduced";

interface Props {
  value: boolean;
  setter: (value: boolean) => void;
}

const ProfileWingSlider = ({ value, setter }: Props) => {
  const setShowItem = useShowStore((state) => state.setShow);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text"></span>
      </label>
      <div className="flex flex-col">
        <input
          type="range"
          min={0}
          max={1}
          value={+value}
          onChange={(e) => {
            setter(!!parseFloat(e.target.value));
            setShowItem({ vortex: !!parseFloat(e.target.value) });
          }}
          className="range range-xs join-item pr-2"
        />
        <div className="w-full flex justify-between mt-1">
          <p>Profile</p>
          <p>Wing</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileWingSlider;
