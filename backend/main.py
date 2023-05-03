from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import breguet_simple_jet as bsj
import breguet_simple_propeller as bsp

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
    returned_dictProp1 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
    if object.proptype == 'propeller':
        return {
            'xes': returned_dictProp1['x_list'],
            'yes' : returned_dictProp1['times_list']
        }

    
   



