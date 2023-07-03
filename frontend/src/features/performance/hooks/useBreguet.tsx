import { useCallback } from "react";
import { useInitialStore } from "../stores/useInitial";

export const useBreguet = () => {
    const initialData = useInitialStore();
    const efficiency = 0.8;

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
    
    // might be used in the future to calculate stall velocity
    const calculateVmin = useCallback(
        () => {
            const vmin = (2 * ((initialData.startMass + calculateEndMass())/2) * 9.81 * calculateDensity() * initialData.area * initialData.czmax);
        }, [initialData.startMass, initialData.area, initialData.czmax, calculateEndMass, calculateDensity]
    )

    const calculateEndurance = useCallback(
        (velocity: number) => {
            const sqrtFactor1 = Math.sqrt(initialData.cx0 * initialData.aspectRatio * 3.14);
            const aFactor = calculateDensity() * initialData.area * sqrtFactor1 * velocity * velocity;
            const efficiencyFactor = efficiency / 9.81 / velocity / initialData.fuelcons;
            const atanFactor = 2 * 9.81 / aFactor;
            const sqrtFactor2 = Math.sqrt(3.14 * initialData.aspectRatio / initialData.cx0);
        return (
            100000 * efficiencyFactor * sqrtFactor2 * 
            (Math.atan(initialData.startMass * atanFactor) - Math.atan(calculateEndMass() * atanFactor))
        );
        }, 
        [calculateDensity, calculateEndMass, initialData.area, initialData.aspectRatio, initialData.cx0, initialData.czmax ]
    );

    const calculateRange = useCallback(
        (velocity: number) => {
            const sqrtFactor1 = Math.sqrt(initialData.cx0 * initialData.aspectRatio *3.14);
            const aFactor = calculateDensity() * initialData.area * sqrtFactor1 * velocity **2;
            const efficiencyFactor = efficiency / 9.81 / velocity / initialData.fuelcons;
            const atanFactor = 2 * 9.81 / aFactor;
            const sqrtFactor2 = Math.sqrt(3.14 * initialData.aspectRatio / initialData.cx0);
        return (
            3.6 * velocity * 1000 * efficiencyFactor * sqrtFactor2 * 
            (Math.atan(initialData.startMass * atanFactor) - Math.atan(calculateEndMass() * atanFactor))
        );
        }, 
        [calculateDensity, calculateEndMass, initialData.area, initialData.aspectRatio, initialData.cx0, initialData.czmax ]
    );

    return [calculateEndurance, calculateRange];
}
