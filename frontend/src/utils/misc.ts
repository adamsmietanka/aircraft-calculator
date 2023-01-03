export const degTorad =  (angle:number) => {
 return angle*2*Math.PI/180
}

export const radTodeg =  (angle:number) => {
    return angle*180/(2*Math.PI)
}

export const findClosestValueIntheArray = (array:number[], goal:number) => {
    var closest = array.reduce(function(prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
    return closest
} 

export const findClosestValueIndexIntheArray = (array:number[], goal:number) => {
    var closestIndex = array.findIndex(function(prev, curr) {
        return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
      });
    return closestIndex
} 