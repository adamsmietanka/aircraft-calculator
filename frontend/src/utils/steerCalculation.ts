interface kappaCalculation{
    s:number
    sh:number
    configuration:number
    mac:number
    xh:number
    cog:number
}
interface dEpsTodAlfaCalculation{
    a:number;
    wingAspectRatio:number;
}
export const calculateKappa = ({s,sh,configuration,mac,xh,cog}:kappaCalculation) => {
    return ((xh/mac-cog))*s/sh*configuration
}

export const calculateDepsToDalfa = ({a,wingAspectRatio}:dEpsTodAlfaCalculation)=>{
     return (2*a)/(Math.PI*wingAspectRatio)
}