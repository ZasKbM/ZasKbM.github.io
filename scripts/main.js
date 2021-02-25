"use strict";

function main() {
    const cuotas = [document.getElementById("cuota1"), document.getElementById("cuota2"), document.getElementById("cuota3")];
    const stakes = [document.getElementById("stake1"), document.getElementById("stake2"), document.getElementById("stake3")];
    const freebets = [document.getElementById("free1"), document.getElementById("free2"), document.getElementById("free3")];
    const ganancias = [document.getElementById("Ganancias1"), document.getElementById("Ganancias2"), document.getElementById("Ganancias3")];
    const balance = document.getElementById("balance");
    const resultBox = document.getElementById("result");
    let cuotaVal = [cuotas[0].value, cuotas[1].value, cuotas[2].value];
    let validas = [1, 1, 1];
    let perdidas = 0;
    let veces = 0;
    let free = 0;
    let txt = "";
    const calculaBtn = document.getElementById("calculaBtn");

    const getodds = async p => {
        cuotaVal = [cuotas[0].value, cuotas[1].value, cuotas[2].value];
        validas = [1, 1, 1];
        for (let i = 0; i < 3; i++) {
            if (cuotaVal[i] != 0) {
                if (freebets[i].checked) {
                    free = 1;
                    cuotaVal[i] -= 1;
                }
                perdidas = perdidas + (1 / cuotaVal[i]);
            } else validas[i] = 0;
            if (stakes[i].value == 0) validas[i] = 0;
        }
    }

    const perdida = async t => {
        perdidas = 0;
        for (let i = 0; i < 3; i++) {
            if (cuotaVal[i] != 0) {
                perdidas = perdidas + (1 / cuotaVal[i]);
            }
        }
        if (perdidas != 0) perdidas = (perdidas);
    }

    const updateStakes = async t => {
        let usable = [];
        for (let i = 0; i < 3; i++) {
            if (validas[i]) usable.push(stakes[i].value / ((1 / cuotaVal[i]) / perdidas));
        }
        usable.sort();
        let total = usable[0];
        if (total == null) total = 100;
        for (let i = 0; i < 3; i++) {
            if (cuotaVal[i] != 0) stakes[i].value = (total / (cuotaVal[i] * perdidas)).toFixed(2);
        }
    }

    const findOdds = async t => {
        let total = 0;
        for (let i = 0; i < 3; i++) {
            total += parseInt(stakes[i].value);
        }
        for (let i = 0; i < 3; i++) {
            if (stakes[i].value != 0) cuotas[i].value = (total / stakes[i].value).toFixed(2);
        }
    }
    const freebet = async p => {
        let totfb = 0;
        let tot = 0;
        let absperd, perce = 0.0;
        for (let i = 0; i < 3; i++) {
            if (cuotaVal[i] != 0) {
                //console.log(i + " : " + stakes[i].value);
                tot += parseFloat(stakes[i].value);
                if (freebets[i].checked) totfb += parseInt(stakes[i].value);
                absperd = cuotaVal[i] * stakes[i].value
            }
        };
        //console.log("Guanys: " + absperd + " total: " + tot + " perdues: ");
        absperd = tot - absperd;
        //console.log(absperd);

        perce = 1 - (absperd / totfb);
        perce *= 100;
        if (perce >= 70) {
            txt += `<div id="ganado" class="alert alert-success">
        <p>Esta operación dará un <span class="font-weight-bold">${perce.toFixed(2)}%</span> de rentabilidad en el caso de las fb.</p>
        </div>`
        } else {
            txt += `<div id="perdido" class="alert alert-danger">
        <p>Esta operación dará un <span class="font-weight-bold">${perce.toFixed(2)}%</span> de rentabilidad en el caso de las fb.</p>
        </div>`
        }
    }

    const calcular = async p => {
        getodds();
        perdida();
        if (perdidas > 1.05) {
            updateStakes();
            txt = `
        <div id="perdido" class="alert alert-danger">
          <p>Esta operación dará <span class="font-weight-bold">${(1/perdidas).toFixed(4)} euros</span> por euro invertido.</p>
        </div>`;
        } else if (perdidas > 0) {
            updateStakes();
            txt = `
        <div id="ganado" class="alert alert-success">
          <p>Esta operación dará <span class="font-weight-bold">${(1/perdidas).toFixed(4)} euros</span> por euro invertido.</p>
        </div>`;
        } else {
            findOdds();
            getodds();
            perdida();
            if (perdidas > 1.05) {
                updateStakes();
                txt = `
          <div id="perdido" class="alert alert-danger">
            <p>Esta operación dará <span class="font-weight-bold">${(1/perdidas).toFixed(4)} euros</span> por euro invertido.</p>
          </div>`;
            } else {
                updateStakes();
                txt = `
          <div id="ganado" class="alert alert-success">
            <p>Esta operación dará <span class="font-weight-bold">${(1/perdidas).toFixed(4)} euros</span> por euro invertido.</p>
          </div>`;
            }
        }
        for (let a = 0; a < 3; a++) {
            ganancias[a].innerHTML = (cuotaVal[a] * stakes[a].value).toFixed(2);
        }

        // CALCULAMOS EL BALANCE DEL CRUCE EN   €
        let numOr0 = n => isNaN(n) ? 0 : n;

        let totalStake = 0;
        stakes.map((item, index) => {
            console.log(item.value);
            //totalStake += +numOr0(item.value);
            if (!freebets[index].checked) totalStake += +numOr0(item.value);
        });

        balance.innerHTML = (((+ganancias[0].innerText) - totalStake).toFixed(2) + '€');
    };
    document.getElementById("limpiarBtn0").addEventListener("click", () => {
        for (let i = 0; i < 3; i++) {
            cuotas[i].value = 0;
        }
    });
    document.getElementById("limpiarBtn1").addEventListener("click", () => {
        for (let i = 0; i < 3; i++) {
            stakes[i].value = 0;
        }
    });
    calculaBtn.addEventListener("click", () => {
        free = 0;
        txt = "";
        veces++;
        gtag('event', 'Calcular', {
          'event_category': "Engagement",
          'event_label': "ClickBoton",
          'value': veces
        });
        calcular();
        if (free == 1) freebet();
        texto.innerHTML = txt;
    });
    document.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        calculaBtn.click();
  }
});
}
window.addEventListener("load", main);
