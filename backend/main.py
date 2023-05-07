from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import breguet_simple_jet as bsj
import breguet_simple_propeller as bsp
import extended_alg as ext

app = FastAPI()

#origins = ["http://localhost:3000/performance/initial_data", "http://127.0.0.1:3000/performance/initial_data"]
origins = ["http://localhost:3000", "http://127.0.0.1:3000/"]
aero_cessna = "C:/Users/barto/Desktop/inżynierka/test-data/cessna-data/cessna-cz-data.xlsx"

class MyForm(BaseModel):
    proptype:str
    propnumber:float
    nominalPower:float
    flightAltitude:float
    startMass:float
    fuelMass:float
    fuelcons:float
    vmax:float
    wmax:float
    area:float
    aspectRatio:float
    cx0:float
    czmax:float


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
def home(object: MyForm):
    returned_dictProp1 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
    returned_dictProp2 = bsp.breguetPropeller_2set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
    returned_dictProp3 = bsp.breguetPropeller_3set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
    returned_dictJet1 = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
    returned_dictJet2 = bsj.breguetJet_2set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
    returned_dictJet3 = bsj.breguetJet_3set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)

    if object.proptype == 'propeller-breguet':
        return {
            'xes': returned_dictProp1['x_list'],
            'xes2': returned_dictProp2['x_list'],
            'xes3': returned_dictProp3['x_list'],
            'yes' : returned_dictProp1['times_list'],
            'yes2': returned_dictProp2['times_list'],
            'yes3': returned_dictProp3['times_list'],
            'zes': returned_dictProp1['ranges_list'],
            'zes2': returned_dictProp2['ranges_list'],
            'zes3': returned_dictProp3['ranges_list']
        }
    elif object.proptype == 'jet-breguet':
        return{
            'xes': returned_dictJet1['x_list'],
            'xes2': returned_dictJet2['x_list'],
            'xes3': returned_dictJet3['x_list'],
            'yes' : returned_dictJet1['times_list'],
            'yes2': returned_dictJet2['times_list'],
            'yes3': returned_dictJet3['times_list'],
            'zes': returned_dictJet1['ranges_list'],
            'zes2': returned_dictJet2['ranges_list'],
            'zes3': returned_dictJet3['ranges_list']    
        }

    
   



