//Constatnts where estimated numerically
//tau : [deg] ,  profileThickness: [-]
const a10T = (tau: number, profileThickness: number) => {
  return (0.019 * tau + 4.67) * profileThickness + 6.28;
};

export default a10T