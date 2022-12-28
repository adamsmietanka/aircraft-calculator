interface kappaCalculation{
    s:number
    sh:number
    configuration:number
    mac:number
    xh:number
    cog:number
}

export const calculateKappa = ({s,sh,configuration,mac,xh,cog}:kappaCalculation) => {
    return ((xh/mac-cog))*s/sh*configuration
}