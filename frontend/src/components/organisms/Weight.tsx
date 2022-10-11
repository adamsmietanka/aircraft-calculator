import React from 'react'
import WeightCofiguration from '../molecules/WeightCofiguration'



const Weight = () => {
  const massComponents = [{name:"Fuselage", mass: 1000 }]
  return (
    <div className='flex '>
      <div className='flex flex-col w-64 mr-8 space-y-2'>
        Weight distribution page
        <WeightCofiguration/>
      </div>
    </div>
  )
}

export default Weight