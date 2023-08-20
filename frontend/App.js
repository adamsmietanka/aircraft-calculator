import React, { useState} from 'react';
import Plotly from 'plotly.js-dist-min';

const tableStyles = {
  borderCollapse: 'collapse'
};

const cellStyles = {
  border: '1px solid black',
  padding: '5px'
};

const App = () => {
  const [CzMax, setCzMax] = useState(0);
  const [mass, setMass] = useState(0);
  const [density, setDensity] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [Cx0, setCx0] = useState(0);
  const [Lambda_e, setLambda_e] = useState(0);
  const [S, setS] = useState(0);
  const [Px, setPx] = useState(0);
  const g = 9.81; // przyspieszenie ziemskie

  let stala = 3.14159253749**(-1)*Lambda_e**(-1);
 
  const calculateVgranczmax = (fi) => Math.sqrt((2*mass*g)/(density*CzMax*Math.cos(fi)));
  const calculateRgranczmax = (V_granczmax, fi) => (V_granczmax**2)/(g*Math.tan(fi));

    const data = {
      fiDegs: [],
      V_granczmaxs: [],
      R_granczmaxs: []
    };
  
    for (let fiDeg = 5; fiDeg <= 75; fiDeg += 5) {
      const fi = fiDeg * Math.PI / 180; // konwersja na radiany
      const V_granczmax = calculateVgranczmax(fi);
      const R_granczmax = calculateRgranczmax(V_granczmax, fi);
      
      data.fiDegs.push(fiDeg);
      data.V_granczmaxs.push(V_granczmax);
      data.R_granczmaxs.push(R_granczmax);
    }
  


  const calculateRadiusTable = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      for (let angle = 5; angle <= 80; angle += 5) {
        let angleRad = angle * Math.PI / 180; // konwersja  na radiany
        let R = ((speed **2) / (g * Math.tan(angleRad)));
        row.push(R);
      }
      rows.push(row);
    }
    return rows;
  };

  const RadiusTable = calculateRadiusTable();

  const calculateCzTable = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      for (let angle = 5; angle <= 80; angle += 5) {
        let angleRad = angle * Math.PI / 180; // konwersja na radiany
        let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(angleRad));
        row.push(Cz);
      }
      rows.push(row);
    }
    return rows;
  };

  const czTable = calculateCzTable();

  const calculatePowerTable0 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable0 = calculatePowerTable0();

  const calculatePowerTable5 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.08727));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.01;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable5 = calculatePowerTable5();

  const calculatePowerTable10 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.1745));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.02323;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable10 = calculatePowerTable10();

  const calculatePowerTable15 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.2618));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.05338;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable15 = calculatePowerTable15();

  const calculatePowerTable20 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.3491));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.0978;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable20 = calculatePowerTable20();

  const calculatePowerTable25 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.4363));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.15901;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable25 = calculatePowerTable25();

  const calculatePowerTable30 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.5236));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.24081;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable30 = calculatePowerTable30();

  const calculatePowerTable35 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.6109));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.34882;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable35 = calculatePowerTable35();
  
  const calculatePowerTable40 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.6981));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.49149;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable40 = calculatePowerTable40();

  const calculatePowerTable45 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.7854));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.68179;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};


  const PowerTable45 = calculatePowerTable45();
  
  const calculatePowerTable50 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.8727));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*1.94043;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
};

const PowerTable50 = calculatePowerTable50();

const calculatePowerTable55 = () => {
  let rows = [];
  for (let speed = maxSpeed; speed >= 30; speed -= 10) {
    let row = [];
    row.push(speed);
    let Nr=Px*0.85;
    row.push(Nr);
    let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(0.9599));
    row.push(Cz);
    let Cx = stala*Cz **2;
    row.push(Cx);
    let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
    row.push(Nn);
    let Nn_zakr = Nn*2.30204;
    row.push(Nn_zakr);
    
    rows.push(row);
  }
  return rows;
};

  const PowerTable55 = calculatePowerTable55();
  
  const calculatePowerTable60 = () => {
    let rows = [];
    for (let speed = maxSpeed; speed >= 30; speed -= 10) {
      let row = [];
      row.push(speed);
      let Nr=Px*0.85;
      row.push(Nr);
      let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(1.04719755));
      row.push(Cz);
      let Cx = stala*Cz **2;
      row.push(Cx);
      let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
      row.push(Nn);
      let Nn_zakr = Nn*2.82843;
      row.push(Nn_zakr);
      
      rows.push(row);
    }
    return rows;
  };
  
    const PowerTable60 = calculatePowerTable60();

    const calculatePowerTable65 = () => {
      let rows = [];
      for (let speed = maxSpeed; speed >= 30; speed -= 10) {
        let row = [];
        row.push(speed);
        let Nr=Px*0.85;
        row.push(Nr);
        let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(1.134));
        row.push(Cz);
        let Cx = stala*Cz **2;
        row.push(Cx);
        let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
        row.push(Nn);
        let Nn_zakr = Nn*3.6398;
        row.push(Nn_zakr);
        
        rows.push(row);
      }
      return rows;
    };
    
      const PowerTable65 = calculatePowerTable65();

      const calculatePowerTable70 = () => {
        let rows = [];
        for (let speed = maxSpeed; speed >= 30; speed -= 10) {
          let row = [];
          row.push(speed);
          let Nr=Px*0.85;
          row.push(Nr);
          let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(1.222));
          row.push(Cz);
          let Cx = stala*Cz **2;
          row.push(Cx);
          let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
          row.push(Nn);
          let Nn_zakr = Nn*5;
          row.push(Nn_zakr);
          
          rows.push(row);
        }
        return rows;
      };
      
        const PowerTable70 = calculatePowerTable70();


        const calculatePowerTable75 = () => {
          let rows = [];
          for (let speed = maxSpeed; speed >= 30; speed -= 10) {
            let row = [];
            row.push(speed);
            let Nr=Px*0.85;
            row.push(Nr);
            let Cz = (2 * mass * g) / (density * CzMax * speed ** 2) * (1 / Math.cos(1.309));
            row.push(Cz);
            let Cx = stala*Cz **2;
            row.push(Cx);
            let Nn = (0.5*density*S*Cx*speed **3)/1000 ;
            row.push(Nn);
            let Nn_zakr = Nn*7.59461;
            row.push(Nn_zakr);
            
            rows.push(row);
          }
          return rows;
        };
        
          const PowerTable75 = calculatePowerTable75();
  
  return (
    <div>

      <input 
        type="number" 
        placeholder="Cz Max" 
        onChange={(e) => setCzMax(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Masa samolotu w kg" 
        onChange={(e) => setMass(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Gęstość powietrza w kg/m^3" 
        onChange={(e) => setDensity(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Prędkość maksymalna w m/s" 
        onChange={(e) => setMaxSpeed(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Pole powierzchni skrzydła w m^2" 
        onChange={(e) => setS(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Moc silnika w W" 
        onChange={(e) => setPx(e.target.value)} 
      />
      <input
        type="number"
        placeholder="C_x0"
        onChange={(e) => setCx0(e.target.value)}
      />
      <input
        type="number"
        placeholder="Lambda_e"
        onChange={(e) => setLambda_e(e.target.value)}
      />

      
      <h1>Analiza Zakrętu</h1>
      <h2>1.) Maksymalny kąt przechylenia</h2>
    Maksymalny kąt przechylenia określony jest w zależności od dopuszczalnego współczynnika obciążeń, zgodnie ze wzorem:
      <h4><span> <p> &phi;<sub>MAX</sub>=arccos(<span>1</span>&frasl;<span>m<sub>g</sub></span>)</p></span></h4>
    <span><p> Gdzie za kąt &phi; przyjmujemy maksymalną wartość &phi;<sub>MAX</sub>. Dopuszczalny współczynnik obciążeń (po lewej stronie wzoru) przyjmuje się równy
    3.8 (zgodnie z przepisami JAR-23). Jest to największy dopuszczalny współczynnik dla klasycznych samolotów nieakrobacyjnych. </p></span>
    <span><p>Skąd dostajemy: </p></span>
    <h4><span><p>  &phi;<sub>MAX</sub>=arccos(<span>1</span> &frasl; <span>3.8</span>)=75&deg;</p></span></h4>
      <h2>2.) Promień zakrętu w funkcji prędkości lotu i kąta przechylenia</h2>
    <span><p>Dla kątów przechylenia od 0 do 75 stopni, oraz szeregu prędkości (co 10 mniejszych od maksymalnej aż do 0) oblicza się
      promień zakrętu z zależności: </p></span>
    <h4><span>R = V<sup>2</sup>&frasl;(g*tan(&phi;))</span></h4>
    <span><p>Dodatkowo uwzględnia się ograniczenie ze względu na maksymalną wartość współczynnika siły nośnej</p></span>    
    <div><span><p> Cz<sub>MAX</sub> = {CzMax} </p></span></div>
    <span><p>Oblicza się graniczne prędkości dla zakręcania przy tym współczynniku:</p></span>       
    <h4>Cz = (2 * m * g) / (&rho; * S * V<sup>2</sup>) * (1 / cos(&phi;))</h4>
    <span><p>Skąd wynika, że</p></span> 
    <h4><span><p>V<sub>Gran_Cz_MAX</sub>=&radic;((2*m*g)&frasl;(&rho;*Cz<sub>MAX</sub>*cos(&phi;)))</p></span></h4>
    <span><p>i dla tej prędkości oblicza się potem graniczny promień zakrętu <h4>R<sub>Cz_MAX</sub></h4> z poprzedniej zależności. </p></span> 


    <div>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={cellStyles}>Kąt fi (°)</th>
                        {data.fiDegs.map((value, index) => (
                            <th key={index} style={cellStyles}>{value}</th>
                        ))}
                    </tr>
                    <tr>
                        <th style={cellStyles}>V_granczmax [m/s]</th>
                        {data.V_granczmaxs.map((value, index) => (
                            <th key={index} style={cellStyles}>{value.toFixed(2)}</th>
                        ))}
                    </tr>
                    <tr>
                        <th style={cellStyles}>R_granczmax [m] </th>
                        {data.R_granczmaxs.map((value, index) => (
                            <th key={index} style={cellStyles}>{value.toFixed(2)}</th>
                        ))}
                    </tr>
                </thead>
            </table>
            <p></p>
        </div>
<p></p>

<table style={tableStyles}>
            <thead>
                <tr>
                    <th style={cellStyles} rowSpan={2}>V [m/s]</th>
                    <th style={cellStyles} colSpan={15}>R[m]</th>
                </tr>
                <tr>
                    {Array.from({length: 15}, (_, i) => i * 5 + 5).map((angle) => (
                        <th key={angle} style={cellStyles}>Fi {angle} [deg]</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {RadiusTable.map((row, index) => (
                    <tr key={index}>
                        {row.map((cell, index) => (
                            <td key={index} style={cellStyles}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
   
   <h4><span><p>Tabela zależności promienia zakrętu dla poszczególnych prędkości i kątów przechylenia oraz graniczne wartości promienia zakrętu i prędkości.</p></span></h4>

   <div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
            TU MA BYĆ PROMIEŃ ZAKRĘTU W ZALEŻNOŚCI OD PRĘDKOŚCI!!!
        </div>

  <h4><span><p>Promień zakrętu w funkcji prędkości i kąta przechylenia.</p></span></h4>
  <h2>3.) Współczynnik siły nośnej wymagany do wykonania zakrętu</h2>

  <h4><span><p>Wymagany współczynnik siły nośnej do wykonania zakrętu określa zależność:</p></span></h4>
  <h4>Cz = (2 * m * g) / (&rho; * S * V<sup>2</sup>) * (1 / cos(&phi;))</h4>
  <h4><span><p>przy czym trzeba pamiętać o ograniczeniu ze względu na Cz<sub>MAX</sub></p></span></h4>
  
  <div>
            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={cellStyles}>V [m/s]</th>
                        {Array.from({length: 15}, (_, i) => i * 5 + 5).map((angle) => (
                            <th key={angle} style={cellStyles}>Fi {angle} [deg]</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {czTable.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

  <h4><span><p>Tabela zależności Cz dla różnych prędkości i różnych kątów przechylenia</p></span></h4>

  <div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
  TU MA BYĆ CZ W ZALEŻNOŚCI OD PRĘDKOŚCI!!!
        </div>


  <h2>4.) Moc niezbędna do wykonania zakrętu</h2>
  <h4><span><p>Moc niezbędna do wykonania zakrętu dana jest następującym wzorem:</p></span></h4>
  <h4><span><p>N<sub>n-zakr</sub>=N<sub>n</sub>*cos<sup>(-1.5)</sup>(&phi;)</p></span></h4>
  <span><p>,gdzie</p></span>
  <h4><span><p>N<sub>N</sub>=P<sub>X</sub>*V=&#189;*&rho;*S*C<sub>X</sub>*V<sup>3</sup></p></span></h4>
  <span><p>C<sub>X</sub> w powyższym wzorem wyznacza się zwykle metodą używaną, m. in. podczas przedmiotu Mechanika Lotu 1 w realizowanych wówczas 
  projektach 2 i 3. Dzięki wartościom podanym na początku strony można oszacować C<sub>X</sub> w stosunku do C<sub>Z</sub>, dzięki tzw. biegunowej analitycznej</p></span>
  <span><p>I tak jest ona dana jako: </p></span>
  <h4>C<sub>X</sub> = C<sub>X0</sub>+C<sub>Z</sub><sup>2</sup>*&pi;<sup>-1</sup>*&Lambda;<sup>-1</sup><sub>e</sub></h4>
  <div style={{ fontWeight: 'bold' , color: 'blue'}}>
  <span><p> C<sub>X</sub> = {Cx0} + {stala}*C<sub>Z</sub><sup>2</sup></p></span></div>

  <h4><span><p>Tabele z wartościami N<sub>n</sub>, N<sub>n-zakr</sub> oraz C<sub>Z</sub> dla poszczególnych prędkości.</p></span></h4>

  <div>
            <table style={tableStyles}>
                <caption><h3>FI = 0°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable0.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 5°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable5.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 10°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable10.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 15°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable15.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 20°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable20.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 25°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable25.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 30°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable30.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 35°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable35.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 40°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable40.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 45°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable45.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 50°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable50.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 55°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable55.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 60°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable60.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 65°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable65.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 70°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable70.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div>
            <table style={tableStyles}>
                <caption><h3>FI = 75°</h3></caption>
                <thead>
                    <tr>
                        <th style={cellStyles}>V[m/s]</th>
                        <th style={cellStyles}>Nr[kW]</th>
                        <th style={cellStyles}>Cz[1]</th>
                        <th style={cellStyles}>Cx[1]</th>
                        <th style={cellStyles}>Nn[kW]</th>
                        <th style={cellStyles}>Nn-Zakr[kW]</th>
                    </tr>
                </thead>
                <tbody>
                    {PowerTable75.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} style={cellStyles}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


        <div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
  TU MA BYĆ N_N-ZAKR W ZALEŻNOŚCI OD V
  </div>

  <span><p>Na wykresie celowo pomija się wykresy N<sub>N-ZAKR</sub> dla kątów 60 i 75 stopni, ponieważ ich wartości byłyby znacząco większe od
   N<sub>n-Cz<sub>MAX</sub></sub>, co pozbawiłoby fizycznego sensu umieszczenie ich na wykresie oraz powodowałoby niepotrzebne zaciemnienie wykresu.</p></span>

   <div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
    Tekst poniżej do dokończenia!
    </div>

  <span><p>Z wykresu można wyznaczyć:</p></span> 
  <ul>
  <li>Maksymalną prędkość lotu poziomego V<sub>MAX-POZ</sub>=...</li>
  <li>Moc niezbędna do pokonania zakrętu oraz prędkość lotu dla kąta granicznego to odpowiednio: N<sub>NIEZB</sub> = ... oraz V<sub>GRAN</sub> = ... </li>
  </ul>
  <span><p>Korzystając z wypisanych wcześniej zależności otrzymujemy zależność, z której numerycznie można wyznaczyć kąt graniczny, dla którego tylko
    dla jednej prędkości moc niezbędna do pokonania zakrętu pokrywa się z mocą rozporządzalną.</p></span> 

    <div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
    dotąd
    </div>

<div><h4><span><p>N<sub>N-ZAKR</sub>=&#189;*&rho;*S*V<sup>3</sup>*cos<sup>-1.5</sup>(&phi;)*[{stala}*(2*m*g)&frasl;(&rho;*S*V<sup>2</sup>*cos(&phi;))+
{Cx0}]</p></span></h4></div>
<div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
    I odtąd
    </div>
<span><p>Wynika stąd, że &phi;<sub>GRAN</sub>=...&deg;</p></span>
<div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
    do tego miejsca
    </div>

<h2>5.) Promień, współczynnik obciążeń, kąt przechylenia</h2>

<div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
TU MA BYĆ WSPÓŁCZYNNIK DOPUSZCZALNYCH OBCIĄŻEŃ W ZALEŻNOŚCI OD PRĘDKOŚCI
</div>

<h4><span><p>Współczynnik obciążeń dla zakrętu na stałym kącie natarcia (C<sub>Z</sub>=0,8*C<sub>Z-MAX</sub>)</p></span></h4>

<div style={{ fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline' , color: 'red'}}>
TU MA BYĆ WYKRES PROMIENIA R I KĄTA FI W ZALEŻNOŚCI OD PRĘDKOŚCI V.
</div>


<h4><span><p>Promień zakrętu oraz kąt przechylenia dla zakrętu na stałym kacie natarcia(C<sub>Z</sub>=0.8*C<sub>Z-MAX</sub>)</p></span></h4>

    </div>
  );
};

export default App;


