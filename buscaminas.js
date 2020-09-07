// elementos
const divTablero = document.getElementById('tablero');

// variables
const totalColumnas = 10;
const totalFilas = 10;
const totalBombas = 10;
let totalBanderas = 10;
let celdasReveladas = 0;
const tablero = new Array(totalFilas);

document.getElementById("bombas").innerHTML = totalBombas
document.getElementById("banderas").innerHTML = totalBanderas

let segundos = 0;
let minutos = 0;
let horas = 0;

function mostrarTiempo(tiempo){
    if(tiempo < 10){
        tiempo = '0'+tiempo;
    }
    return tiempo
} 

const tiempo = setInterval(function() {
    segundos++
    if(segundos === 59){
        segundos = 0
        minutos++
    }
    if(minutos === 59){
        minutos = 0
        horas++
    }
    document.getElementById("tiempo").innerHTML = 
    `${mostrarTiempo(horas)}:${mostrarTiempo(minutos)}:${mostrarTiempo(segundos)}`;
}, 1000);

function dibujarTablero() {
    for(let fila=0; fila < totalFilas; fila++) {
        tablero[fila] = new Array(totalColumnas);
        const nuevaFila = document.createElement('div');
        nuevaFila.classList.add("row", "row-cols-10","celda");
        divTablero.appendChild(nuevaFila);
        for(let columna=0; columna < totalColumnas; columna++) {
            tablero[fila][columna] = '1';
            const nuevaCelda = document.createElement('div');
            // attributos
            nuevaCelda.setAttribute('id', `f${fila}-c${columna}`);
            nuevaCelda.setAttribute('data-fila', fila);
            nuevaCelda.setAttribute('data-columna', columna);
            // clases
            nuevaCelda.classList.add("col", "border", "text-center", "celda");
            // eventos
            nuevaCelda.addEventListener('click', function(){
                revelar(fila, columna);
            });
            nuevaCelda.addEventListener('contextmenu', function(e){
                e.preventDefault();
                e.stopPropagation();
                if(totalBanderas > 0) {
                if(nuevaCelda.classList.contains('bandera')){
                    totalBanderas++
                    nuevaCelda.classList.remove('bandera')
                    nuevaCelda.innerHTML = ''
                } else {
                    totalBanderas--
                    nuevaCelda.classList.add('bandera');
                    nuevaCelda.innerHTML = 
                    `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-flag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
                    </svg>`
                }
                document.getElementById("banderas").innerHTML = totalBanderas
            }
            });
            nuevaFila.appendChild(nuevaCelda);
        }
        divTablero.appendChild(nuevaFila);
    }
    ubicarBombas(); // ubicamos las bombas
    agregarTotalBombasAlTablero(); // contamos bombas alrededor
}

function ubicarBombas() {
    for(let bombas=0; bombas < totalBombas; bombas++) {
        const filaBomba = Math.round(Math.random() * (totalFilas - 1));
        const columnaBomba = Math.round(Math.random() * (totalColumnas -1 ));
        tablero[filaBomba][columnaBomba] = 'B';
    }
}

function mostrarModalFinJuego(resultado){
    const imgModal = document.getElementById('imgResultado')
    $('#modalResultado').modal('show');
    if(resultado === 'perdedor') {
        imgModal.src = "imagenes/perder.png";
        imgModal.alt = "Perdiste"
    }
    if(resultado === 'ganador') {
        imgModal.src = "imagenes/ganar.png";
        imgModal.alt = "Ganaste"
        imgModal.style.width = "60%"
        document.getElementById('detalle').innerHTML = 
        `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-clock-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
        </svg> ${document.getElementById('tiempo').innerHTML}`
    }
    $("#btnVolverAJugar").on("click", function() {
        window.location.reload()
    })
    clearTimeout(tiempo);
}

function revelarBombas() {
    for(let fila=0; fila < totalFilas; fila++) {
        for(let columna=0; columna < totalColumnas; columna++) {
            if(tablero[fila][columna] === 'B') {
                revelar(fila, columna);
            }
        }
    }
}

function comprobarGanador(){
    if(celdasReveladas === ((totalFilas * totalColumnas) - totalBombas)){
        mostrarModalFinJuego('ganador')
    }
}

function revelar(filaClickeada, columnaClickeada) {
    const elementoClickeado = document.getElementById(`f${filaClickeada}-c${columnaClickeada}`);
    if(filaClickeada > -1 && filaClickeada < totalFilas && columnaClickeada > -1 && columnaClickeada < totalColumnas) {
        if(!elementoClickeado.classList.contains('revelada')) {
            if(!elementoClickeado.classList.contains('bandera')) { 
                elementoClickeado.classList.add('revelada');
                const cantidadBombasAlrededor = tablero[filaClickeada][columnaClickeada];
                if(cantidadBombasAlrededor === 'B') {
                    elementoClickeado.classList.add('bg-danger');
                    elementoClickeado.innerHTML =
                    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="mdi-bomb" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M11.25,6A3.25,3.25 0 0,1 14.5,2.75A3.25,3.25 0 0,1 17.75,6C17.75,6.42 18.08,6.75 18.5,6.75C18.92,6.75 19.25,6.42 19.25,6V5.25H20.75V6A2.25,2.25 0 0,1 18.5,8.25A2.25,2.25 0 0,1 16.25,6A1.75,1.75 0 0,0 14.5,4.25A1.75,1.75 0 0,0 12.75,6H14V7.29C16.89,8.15 19,10.83 19,14A7,7 0 0,1 12,21A7,7 0 0,1 5,14C5,10.83 7.11,8.15 10,7.29V6H11.25M22,6H24V7H22V6M19,4V2H20V4H19M20.91,4.38L22.33,2.96L23.04,3.67L21.62,5.09L20.91,4.38Z" />
                    </svg>`;
                    revelarBombas()
                    mostrarModalFinJuego('perdedor')
                } else {
                    elementoClickeado.classList.add('bg-success');
                    celdasReveladas++
                    comprobarGanador()
                    if(cantidadBombasAlrededor === 0) { 
                    for(let f= filaClickeada-1; f <= filaClickeada+1; f++){
                        for(let c= columnaClickeada-1; c <= columnaClickeada+1; c++){
                            if(!(f === filaClickeada && c === columnaClickeada)){
                                revelar(f,c)
                            }
                        } 
                    }
                } else {
                    elementoClickeado.innerHTML = cantidadBombasAlrededor;
                }
            }
            } 
        }
    }
}

function agregarTotalBombasAlTablero() {
    for(let fila=0; fila < totalFilas; fila++) {
        for(let columna=0; columna < totalColumnas; columna++) {
            if(tablero[fila][columna] !== 'B') {
                tablero[fila][columna] = contarCantidadBombasAlrededor(fila, columna);
            }
        }
    }
}

function contarCantidadBombasAlrededor(fila, columna){
    let cantidadBombas = 0;
    for(let posicionY= fila-1; posicionY <= fila+1; posicionY++){
        for(let posicionX= columna-1; posicionX <= columna+1; posicionX++){
            if(posicionY > -1 && posicionY < totalFilas && posicionX > -1 && posicionX < totalColumnas){
                if(tablero[posicionY][posicionX] === 'B') {
                    cantidadBombas++;
                }
            }
        } 
    }
    return cantidadBombas;
}

dibujarTablero();
