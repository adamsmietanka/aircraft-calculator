import numpy as np
import math
import basic_funcs as basf

#zmieniac 1.25 na 0.75 w przypadku kiedy zapas nie jest brany pod uwagę w źródłach do wyznaczania zasięgu

def breguetPropeller(startmass,nompow_prop,fuelcons_prop,propnumber,altitude,aspectratio,cx0,area,vmax,fuelmass, aero_input):
    efficiency = 0.8
    #Air density from SI
    air_density=1.2255*(1-(altitude/44300))**4.256

    #masses needed in calculations
    diffmass_prop=propnumber*nompow_prop*fuelcons_prop*1.25
    fuelmass_prop=fuelmass-diffmass_prop                 
    endmass_prop=startmass-fuelmass_prop                            
    calc_mass = (startmass + endmass_prop)/2

    double_arr = basf.aero_prep(aero_input)
    cz_arr = double_arr[1]
    vmin = basf.velocity(calc_mass, air_density, area, max(cz_arr))
    #array of velocities, counting step - 50
    x=np.linspace(vmin,vmax,50)

    #creating empty arrays for further calculations
    times=[]
    ranges=[]

    #loop calculations of Breguet formulas
    for i in x:
        A_factor=air_density*area*i*i*math.sqrt(cx0*3.14*aspectratio)
        time=1000*(efficiency/9.81/i/fuelcons_prop)*math.sqrt(3.14*aspectratio/cx0)*(math.atan(2*9.81*startmass/A_factor)-math.atan(2*9.81*endmass_prop/A_factor))
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

def breguetPropeller_2set(startmass,nompow_prop,fuelcons_prop,propnumber,altitude,aspectratio,cx0,area,vmax,fuelmass, aero_input):
    efficiency = 0.8
    #Air density from SI
    air_density=1.2255*(1-(altitude/44300))**4.256

    #masses needed in calculations
    diffmass_prop=propnumber*nompow_prop*fuelcons_prop*1.25
    fuelmass_prop=fuelmass-diffmass_prop                 
    endmass_prop=startmass-fuelmass_prop 
    calc_mass = (startmass + endmass_prop)/2 
    print('Calc mass:',calc_mass)
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

    #array of velocities, based on cz range
    x=basf.velocity_arr(calc_mass, air_density, area, new_cz_arr)

    #creating empty arrays for further calculations
    times=[]
    ranges=[]

    #loop calculations of Breguet formulas
    for i in new_cz_arr:
        pom = (efficiency/fuelcons_prop/9.81**1.5)*math.sqrt(2*air_density*area)
        time = 1000*pom*i**1.5/basf.cx(i, cx0, aspectratio)*(1/math.sqrt(endmass_prop) - 1/math.sqrt(startmass))
        times.append(time)

    for i in lift_drag:
        range = 3600*i*efficiency/9.81/fuelcons_prop*np.log(startmass/endmass_prop)
        ranges.append(range)
    
    times_arr=100*np.array(times)    
    ranges_arr=np.array(ranges) 
    velocity_arr = np.multiply(3.6, x)
    #preparing lists of needed values
    x_list=list(np.multiply(3.6, x))
    times_list=list(times_arr)    
    ranges_list=list(ranges_arr)
   
    #returning dictionary, as this is form needed by Plotly
    return_dict={
        'times_list':times_list,
        'ranges_list':ranges_list,
        'x_list':x_list
    }

    triple_arr = [velocity_arr, times_arr, ranges_arr]

    return return_dict

def breguetPropeller_3set(startmass,nompow_prop,fuelcons_prop,propnumber,altitude,aspectratio,cx0,area,vmax,fuelmass, aero_input):
    efficiency = 0.8
    #Air density from SI
    air_density=1.2255*(1-(altitude/44300))**4.256

    #masses needed in calculations
    diffmass_prop=propnumber*nompow_prop*fuelcons_prop*1.25
    fuelmass_prop=fuelmass-diffmass_prop                 
    endmass_prop=startmass-fuelmass_prop 
    calc_mass = (startmass + endmass_prop)/2 
    
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

    #array of velocities, based on cz range
    velocity_arr=basf.velocity_arr(calc_mass, air_density, area, new_cz_arr)
    L_D_velocity = np.divide(lift_drag, velocity_arr)

    #creating empty arrays for further calculations
    times=[]
    ranges=[]

    #loop calculations of Breguet formulas
    for i in L_D_velocity:
        time = 1000*i*efficiency/9.81/fuelcons_prop*np.log(startmass/endmass_prop)
        times.append(time)

    for i in lift_drag:
        range = 3600*i*efficiency/9.81/fuelcons_prop*np.log(startmass/endmass_prop)
        ranges.append(range)
    
    times_arr=100*np.array(times)    
    ranges_arr=np.array(ranges) 
    velocity_arr_export = np.multiply(3.6, velocity_arr)
    
    #preparing lists of needed values
    x_list=list(velocity_arr_export)
    times_list=list(times_arr)    
    ranges_list=list(ranges_arr)
    
    #returning dictionary, as this is form needed by Plotly
    return_dict={
        'times_list':times_list,
        'ranges_list':ranges_list,
        'x_list':x_list
    }

    triple_arr = [velocity_arr_export, times_arr, ranges_arr]
    return return_dict

