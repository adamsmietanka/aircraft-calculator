import { useCallback } from "react";
import { useInitialStore } from "../stores/useInitial";
import { density } from "../../../utils/atmosphere";

export const useBreguet = () => {
    const initialData = useInitialStore();
    const efficiency = 0.8

    const calculateEndMass = useCallback(
        () => {
        const deltaMass = initialData.propnumber * initialData.fuelcons * initialData.nominalPower * 1.25;
        const flightFuel = initialData.fuelMass - deltaMass;
        const endMass = initialData.startMass - flightFuel;
        return endMass;
    }, 
    [initialData.propnumber, initialData.fuelcons, initialData.nominalPower, initialData.fuelMass, initialData.startMass]
    );

    const calculateDensity = useCallback(
        () => {
        const density = 1.2255 * (1 - (initialData.flightAltitude/44.3)) ** 4.256;
        return density;
        }, [initialData.flightAltitude]
    );

    const calculateBreguet = useCallback(
        (velocity: number) => {
            const sqrtFactor = Math.sqrt(initialData.cx0 * initialData.aspectRatio *3.14);
            const aFactor = calculateDensity() * initialData.area * sqrtFactor * velocity **2;
            const efficiencyFactor = efficiency / 9.81 / velocity / initialData.fuelcons;
            const atanFactor = 2 * 9.81 * initialData.startMass / aFactor;
        return (
            1000 * efficiencyFactor * sqrtFactor * (Math.atan(atanFactor) - Math.atan(atanFactor))
        );
        }, 
        [calculateDensity, calculateEndMass]
    );

    return [calculateBreguet];
}
