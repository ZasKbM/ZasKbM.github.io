"use strict";

function main() {
  const cuotas =[document.getElementById("cuota1"), document.getElementById("cuota2"), document.getElementById("cuota3")];
  const stakes =[document.getElementById("stake1"), document.getElementById("stake2"), document.getElementById("stake3")];
  const freebets =[document.getElementById("free1"), document.getElementById("free2"), document.getElementById("free3")];
  const ganancias =[document.getElementById("Ganancias1"),document.getElementById("Ganancias2"),document.getElementById("Ganancias3")];
  const resultBox = document.getElementById("result");
  let cuotaVal = [cuotas[0].value, cuotas[1].value, cuotas[2].value];
  let validas =[1,1,1];
  let perdidas=0;
  let veces = 0;
  const calculaBtn = document.getElementById("calculaBtn");

  const getodds = async p =>{
    cuotaVal = [cuotas[0].value, cuotas[1].value ,cuotas[2].value];
    validas =[1,1,1];
    for (let i = 0; i<3; i++){
        if(cuotaVal[i]!=0){
          if (freebets[i].checked) {
            console.log("hola");
            cuotaVal[i] -= 1;
          }
          perdidas = perdidas + (1/cuotaVal[i]);
        }
        else validas[i] =0;
        if(stakes[i].value == 0) validas[i]=0;
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
  }

  const updateStakes = async t => {
    let usable = [];
    for(let i=0; i<3; i++){
      if(validas[i]) usable.push(stakes[i].value/((1/cuotaVal[i])/perdidas));
    }
  usable.sort();
    let total = usable[0];
    if (total == null) total =100;
    for(let i=0; i<3; i++){
      if (cuotaVal[i]!=0) stakes[i].value = (total/(cuotaVal[i]*perdidas)).toFixed(2);
    }
    console.log(total);
  }

  const findOdds = async t => {
    let total =0;
    for(let i=0; i<3; i++){
      total += parseInt(stakes[i].value);
    }
    for(let i=0; i<3; i++){
      if(stakes[i].value !=0)cuotas[i].value= (total/stakes[i].value).toFixed(2);
    }
  }

  const calcular = async p => {
    getodds();
    perdida();
    if(perdidas > 1.05){
      updateStakes();
      texto.innerHTML = `
        <div id="perdido">
          <p>Esta operación dará ${(1/perdidas).toFixed(4)} euros por euro apostado.</p>
        </div>`
      ;}
    else if (perdidas > 0){
      updateStakes();
      texto.innerHTML = `
        <div id="ganado">
          <p>Esta operación dará ${(1/perdidas).toFixed(4)} euros por euro apostado.</p>
        </div>`
      ;
    }
    else {
      findOdds();
      getodds();
      perdida();
      if(perdidas > 1.05){
        updateStakes();
        texto.innerHTML = `
          <div id="perdido">
            <p>Esta operación dará ${(1/perdidas).toFixed(4)} euros por euro apostado.</p>
          </div>`
        ;}
      else {
        updateStakes();
        texto.innerHTML = `
          <div id="ganado">
            <p>Esta operación dará ${(1/perdidas).toFixed(4)} euros por euro apostado.</p>
          </div>`
        ;
      }
    }
    for (let a = 0; a<3; a++ ){
      ganancias[a].innerHTML =(cuotaVal[a]*stakes[a].value).toFixed(2);
    }
  };
  const anuncio = async p =>{
    document.getElementById("siteHeader").innerHTML = "<script data-cfasync='false' type='text/javascript' src='//p345991.clksite.com/adServe/banners?tid=345991_675417_5&type=footer&size=37'></script>";
  }
  document.getElementById("limpiarBtn0").addEventListener("click", () =>{
    for(let i=0; i<3; i++){
    cuotas[i].value = 0;
    }
  });
  document.getElementById("limpiarBtn1").addEventListener("click", () =>{
    for(let i=0; i<3; i++){
    stakes[i].value = 0;
    }
  });
  calculaBtn.addEventListener("click", () => {
    veces++;
    calcular();
    if (veces%5 == 0) anuncio();
  });
}
window.addEventListener("load", main);
