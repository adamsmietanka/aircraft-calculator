interface WeightComponent {
    componentName: string;
    mass: number;
    cords: { x: number; y: number; z: number };
  }
  
export const CoG = (configuration:Array<WeightComponent>) => {
 const masses = configuration.map(component =>  component.mass)
 const mx = configuration.map(component => component.mass*component.cords.x)
 const my = configuration.map(component =>  component.mass*component.cords.y)
 const mz = configuration.map(component =>  component.mass*component.cords.z)
 const massSum =masses.reduce((a,b) => a+b)
 const mxSum = mx.reduce((a,b) => a+b)
 const mySum = my.reduce((a,b) => a+b)
 const mzSum = mz.reduce((a,b) => a+b)
 return {x:mxSum/massSum , y:mySum/massSum, z:mzSum/massSum}
}

export const getXarray =(configuration:Array<WeightComponent>)=>{
  const xArray = configuration.map(component => component.cords.x)
  return xArray
}

export const getYarray =(configuration:Array<WeightComponent>)=>{
  const yArray = configuration.map(component => component.cords.y)
  return yArray
}

export const getZarray =(configuration:Array<WeightComponent>)=>{
  const zArray = configuration.map(component => component.cords.z)
  return zArray
}

export const getNamesArray =(configuration:Array<WeightComponent>)=>{
  const namesArray = configuration.map(component => component.componentName)
  return namesArray
}