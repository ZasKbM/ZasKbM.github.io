"use strict";

function main() {
  const cuotas =[document.getElementById("cuota1"), document.getElementById("cuota2"), document.getElementById("cuota3")];
  const stakes =[document.getElementById("stake1"), document.getElementById("stake2"), document.getElementById("stake3")];
  const ganancias =[document.getElementById("Ganancias1"),document.getElementById("Ganancias2"),document.getElementById("Ganancias3")];
  const resultBox = document.getElementById("result");
  let cuotaVal = [cuotas[0].value, cuotas[1].value ,cuotas[2].value];
  let validas =[1,1,1];
  let perdidas=0

  const calculaBtn = document.getElementById("calculaBtn");

  const getodds = async p =>{
    cuotaVal = [cuotas[0].value, cuotas[1].value ,cuotas[2].value];
    for (let i = 0; i<3; i++){
        if(cuotaVal[i]!=0){
          perdidas = perdidas + (1/cuotaVal[i]);
        }
        else validas[i] =0;
    }
  }

  const perdida = async t => {
    perdidas=0;
    for (let i = 0; i<3; i++){
        if(cuotaVal[i]!=0){
          perdidas = perdidas + (1/cuotaVal[i]);
        }
    }
    if(perdidas!=0) perdidas =(perdidas);
    else perdidas= error;
  }

  const updateStakes = async t => {
    let usable = [];
    for(let i=0; i<3; i++){
      if(validas[i]) usable.push(stakes[i].value/((1/cuotaVal[i])/perdidas)) ;
    }
  usable.sort();
    let total = usable[0];
    for(let i=0; i<3; i++){
      stakes[i].value = (total*((1/cuotaVal[i])/perdidas)).toFixed(2);
    }
    console.log(total);
  }

  const calcular = async p => {
    getodds();
    perdida();
    updateStakes();
    if(perdidas > 1.05){
    texto.innerHTML = `
      <div id="perdido">
        <p>Esta operación dará ${(1/perdidas).toFixed(2)} euros por euro apostado.</p>
      </div>`
    ;}
    else {
      texto.innerHTML = `
        <div id="ganado">
          <p>Esta operación dará ${(1/perdidas).toFixed(2)} euros por euro apostado.</p>
        </div>`
      ;
    }
    for (let a = 0; a<3; a++ ){
      ganancias[a].innerHTML =(cuotaVal[a]*stakes[a].value).toFixed(2);
    }
  };
  calculaBtn.addEventListener("click", () => {
    calcular();
  });
}
window.addEventListener("load", main);
