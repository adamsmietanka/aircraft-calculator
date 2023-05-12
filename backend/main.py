from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import breguet_simple_jet as bsj
import breguet_simple_propeller as bsp
import extended_alg as ext

app = FastAPI()

origins = ["http://localhost:3000", "http://127.0.0.1:3000/"]

aero_cessna = "C:/Users/barto/Desktop/bachelor-thesis/test-data/cessna-data/cessna-cz-data.xlsx"
rpm_input_cessna = 'C:/Users/barto/Desktop/bachelor-thesis/test-data/cessna-data/cessna-rpm-load-data.xlsx'
eta_input_cessna = "C:/Users/barto/Desktop/bachelor-thesis/test-data/cessna-data/eta-velo.xlsx"
fuelcons_input_cessna = "C:/Users/barto/Desktop/bachelor-thesis/test-data/cessna-data/cessna-fuelcons-load-data.xlsx"

avg_efficiency = 0.8

class MyForm(BaseModel):
    method_type: str
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
    maxPower:float


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/")
def home(object: MyForm):

    if object.proptype == 'propeller-breguet' and object.method_type == 'breguet':
        returned_dictProp1 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictProp2 = bsp.breguetPropeller_2set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictProp3 = bsp.breguetPropeller_3set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
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
    elif object.proptype == 'jet-breguet' and object.method_type == 'breguet':
        returned_dictJet1 = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictJet2 = bsj.breguetJet_2set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictJet3 = bsj.breguetJet_3set(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
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
    elif object.proptype == 'propeller-breguet' and object.method_type == 'raymer' or object.proptype == 'propeller-breguet' and object.method_type == 'authors' or object.proptype == 'propeller-breguet' and object.method_type == 'paturski':
        returned_dictExt = ext.extended_alg(rpm_input_cessna, fuelcons_input_cessna, eta_input_cessna, object, 30)
        return{
            'xes': returned_dictExt['x_list'],
            'yes' : returned_dictExt['times_list'],
            'zes': returned_dictExt['ranges_list'],  
        }
    elif object.proptype == 'propeller-breguet' and object.method_type == 'sensitivity-start-mass':
        returned_dictSens = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens75 = bsp.breguetPropeller(0.75*object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens50 = bsp.breguetPropeller(0.5*object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        return{
            'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'jet-breguet' and object.method_type == 'sensitivity-start-mass':
        returned_dictSens = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictSens75 = bsj.breguetJet(0.75*object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictSens50 = bsj.breguetJet(0.5*object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        return{
            'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'propeller-breguet' and object.method_type == "sensitivity-fuel-mass":
        returned_dictSens = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens75 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, 0.75*object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens50 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, 0.5*object.fuelMass, aero_cessna, avg_efficiency)
        
        return{
            'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'jet-breguet' and object.method_type == "sensitivity-fuel-mass":
        returned_dictSens = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictSens75 = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, 0.75*object.fuelMass, aero_cessna)
        returned_dictSens50 = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, 0.5*object.fuelMass, aero_cessna)
        
        return{
            'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'propeller-breguet' and object.method_type == "sensitivity-SFC":
        returned_dictSens = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens75 = bsp.breguetPropeller(object.startMass, object.nominalPower, 0.75*object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens50 = bsp.breguetPropeller(object.startMass, object.nominalPower, 0.5*object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        
        return{
           'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'jet-breguet' and object.method_type == "sensitivity-SFC":
        returned_dictSens = bsj.breguetJet(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictSens75 = bsj.breguetJet(object.startMass, object.nominalPower, 0.75*object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        returned_dictSens50 = bsj.breguetJet(object.startMass, object.nominalPower, 0.5*object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna)
        
        return{
           'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'propeller-breguet' and object.method_type == "sensitivity-eff":
        returned_dictSens = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, avg_efficiency)
        returned_dictSens75 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, 0.75*avg_efficiency)
        returned_dictSens50 = bsp.breguetPropeller(object.startMass, object.nominalPower, object.fuelcons, object.propnumber, 1000*object.flightAltitude, object.aspectRatio, object.cx0, object.area, object.vmax, object.fuelMass, aero_cessna, 0.5*avg_efficiency)
        
        return{
           'xes': returned_dictSens['x_list'],
            'yes' : returned_dictSens['times_list'],
            'yes2': returned_dictSens75['times_list'],  
            'yes3': returned_dictSens50['times_list'],
            'zes': returned_dictSens['ranges_list'],
            'zes2': returned_dictSens75['ranges_list'],
            'zes3': returned_dictSens50['ranges_list'],
        }
    elif object.proptype == 'jet-breguet' and object.method_type == "sensitivity-eff":
        
        return{
           'xes': [0,0],
            'yes' : [0,0],
            'yes2': [0,0],  
            'yes3': [0,0],
            'zes': [0,0],
            'zes2': [0,0],
            'zes3': [0,0],
        }
