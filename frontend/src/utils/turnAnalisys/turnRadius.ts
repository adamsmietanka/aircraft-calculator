//phi wstaewiać w radianach
export const turnRadius=  (velocity:number, phi:number)=>{
    return velocity*velocity /(9.81*Math.tan(phi))
}