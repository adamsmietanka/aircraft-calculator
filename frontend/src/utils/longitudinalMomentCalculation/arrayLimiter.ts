const arrayLimiter = (czArray:number[],cmbuArray:number[], alfaArray:number[], cxArray:number[]) => {
    let firstPositveIndex = czArray.findIndex((cz) => cz>0)
    let positveCzArray =czArray.slice(firstPositveIndex)
    let positveCmbuArray = cmbuArray.slice(firstPositveIndex)
    let positiveAlfa = alfaArray.slice(firstPositveIndex)
    let positiveCx = cxArray.slice(firstPositveIndex)
  return {cz:positveCzArray,cmbu:positveCmbuArray, alfa:positiveAlfa, cx:positiveCx}
}

export default arrayLimiter
