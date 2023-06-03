const velocity = (cz:number, density:number, wingSurface:number, mass:number) => {
  return Math.sqrt(2*mass*9.81/(cz*density*wingSurface))
}

const calcVelocityArray = (czArray:number[], density:number, wingSurface:number, mass:number) =>{
    return czArray.map((cz) => velocity(cz, density, wingSurface, mass))
}
export default velocity
