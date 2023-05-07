import numpy as np
import math
import basic_funcs as basf



def breguetJet(startmass,nompow_jet,fuelcons_jet,propnumber,altitude,aspectratio,cx0,area,vmax,fuelmass, aero_input):
    
    #Air density from SI
    air_density=1.2255*(1-(altitude/44300))**4.256

    #masses needed in calculations
    diffmass_jet=propnumber*nompow_jet*fuelcons_jet*1.25    
    fuelmass_jet=fuelmass-diffmass_jet                 
    endmass_jet=startmass-fuelmass_jet 
    calc_mass = (startmass + endmass_jet)/2   

    double_arr = basf.aero_prep(aero_input)
    cz_arr = double_arr[1]
    vmin = basf.velocity(calc_mass, air_density, area, max(cz_arr))                         
    #array of velocities, counting step - 100
    x=np.linspace(vmin,vmax,100)
    
    #creating empty arrays for further calculations
    times=[]
    ranges=[]

    #loop calculations of Breguet formulas
    for i in x:
        A_factor=air_density*area*i*i*math.sqrt(cx0*3.14*aspectratio)
        time=10*(1/9.81/fuelcons_jet)*math.sqrt(3.14*aspectratio/cx0)*(math.atan(2*9.81*startmass/A_factor)-math.atan(2*9.81*endmass_jet/A_factor))
        range=3.6*i*time
        times.append(time)
        ranges.append(range)
    
    times_arr=100*np.array(times)     
    ranges_arr=np.array(ranges)    
    velocities = np.multiply(3.6, x)

    #preparing lists of needed values
    x_list=list(x*3.6)
    times_list=list(times_arr)    
    ranges_list=list(ranges_arr) 
  
    #returning dictionary, as this is form needed by Plotly
    return_dict={
        'times_list':times_list,
        'ranges_list':ranges_list,
        'x_list':x_list
    }
    triple_arr = [velocities, times_arr, ranges_arr]

    return return_dict

def breguetJet_2set(startmass,nompow_jet,fuelcons_jet,propnumber,altitude,aspectratio,cx0,area,vmax,fuelmass, aero_input):
    
    #Air density from SI
    air_density=1.2255*(1-(altitude/44300))**4.256

    #masses needed in calculations
    diffmass_jet=propnumber*nompow_jet*fuelcons_jet*1.25    
    fuelmass_jet=fuelmass-diffmass_jet                 
    endmass_jet=startmass-fuelmass_jet 
    calc_mass = (startmass + endmass_jet)/2                            

    #implementation of cz and cx arrays
    double_arr = basf.aero_prep(aero_input)
    alpha_arr = double_arr[0]
    cz_arr = double_arr[1]
    alpha_root = basf.poly_root(alpha_arr, cz_arr, 5, basf.cz(calc_mass, air_density, area, vmax))
    coeff_arr = np.polyfit(alpha_arr, cz_arr, 5)
    new_alph_arr = basf.new_alph_arr(alpha_arr, alpha_root)
    new_cz_arr = basf.new_cz_arr(new_alph_arr, coeff_arr)
    new_cx_arr = basf.cx_arr(new_cz_arr, cx0, aspectratio)
    lift_drag = basf.lift_to_drag(new_cz_arr, new_cx_arr)

    #creating empty arrays for further calculations
    times=[]
    ranges=[]

    #loop calculations of Breguet formulas
    for i in lift_drag:
        time = 10*i/9.81/fuelcons_jet*np.log(startmass/endmass_jet)
        times.append(time)
 
    for i in new_cz_arr:
        pom = 10*3.6*2*math.sqrt(2/9.81/air_density/area)/fuelcons_jet
        range = pom*math.sqrt(i)/basf.cx(i, cx0 ,aspectratio)*(math.sqrt(startmass) - math.sqrt(endmass_jet))
        ranges.append(range)

    times_arr=100*np.array(times)     
    ranges_arr=np.array(ranges)    
    velocity_arr = 3.6*basf.velocity_arr(calc_mass, air_density, area, new_cz_arr)

    #preparing lists of needed values
    times_list=list(times_arr)    
    ranges_list=list(ranges_arr)
    velocities_list = list(velocity_arr)
  
    #returning dictionary, as this is form needed by Plotly
    return_dict={
        'times_list':times_list,
        'ranges_list':ranges_list,
        'x_list':velocities_list
    }

    triple_arr = [velocity_arr, times_arr, ranges_arr]

    return return_dict

def breguetJet_3set(startmass,nompow_jet,fuelcons_jet,propnumber,altitude,aspectratio,cx0,area,vmax,fuelmass, aero_input):
    
    #Air density from SI
    air_density=1.2255*(1-(altitude/44300))**4.256

    #masses needed in calculations
    diffmass_jet=propnumber*nompow_jet*fuelcons_jet*1.25    
    fuelmass_jet=fuelmass-diffmass_jet                 
    endmass_jet=startmass-fuelmass_jet 
    calc_mass = (startmass + endmass_jet)/2                           

    #implementation of cz and cx arrays
    double_arr = basf.aero_prep(aero_input)
    alpha_arr = double_arr[0]
    cz_arr = double_arr[1]
    alpha_root = basf.poly_root(alpha_arr, cz_arr, 5, basf.cz(calc_mass, air_density, area, vmax))
    coeff_arr = np.polyfit(alpha_arr, cz_arr, 5)

    new_alph_arr = basf.new_alph_arr(alpha_arr, alpha_root)
    new_cz_arr = basf.new_cz_arr(new_alph_arr, coeff_arr)
    new_cx_arr = basf.cx_arr(new_cz_arr, cx0, aspectratio)

    lift_drag = basf.lift_to_drag(new_cz_arr, new_cx_arr)
    velocity_arr = basf.velocity_arr(calc_mass, air_density, area, new_cz_arr)
    velocity_L_D = np.multiply(lift_drag, velocity_arr)

    #creating empty arrays for further calculations
    times=[]
    ranges=[]

    #loop calculations of Breguet formulas
    for i in lift_drag:
        time = 10*i/9.81/fuelcons_jet*np.log(startmass/endmass_jet)
        times.append(time)
 
    for i in velocity_L_D:
        range = 10*3.6*i/9.81/fuelcons_jet*np.log(startmass/endmass_jet)
        ranges.append(range)

    times_arr=100*np.array(times)     
    ranges_arr=np.array(ranges)    
    velocity_arr_export = np.multiply(3.6, velocity_arr)
    #preparing lists of needed values
    times_list=list(times_arr)    
    ranges_list=list(ranges_arr)
    velocities_list = list(velocity_arr_export)
  
    #returning dictionary, as this is form needed by Plotly
    return_dict={
        'times_list':times_list,
        'ranges_list':ranges_list,
        'x_list':velocities_list
    }

    triple_arr = [velocity_arr_export, times_arr, ranges_arr]

    return return_dict
    