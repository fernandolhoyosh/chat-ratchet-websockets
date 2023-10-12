
function iniciar(){

    //OBTENER EL TOAST DE BIENVENIDA
    const Bienvenido = document.getElementById('toast-padre');
    Bienvenido.style.opacity = 1;

    //ACCION DEL ICONO CERRAR TOAST DE BIENVENIDA
    const cerrarToast = document.getElementById('icon-cerrar');
    cerrarToast.addEventListener('click',()=>{
        Bienvenido.style.opacity = 0;
        Bienvenido.style.visibility = 'hidden';
    });

    // FUNCION AUTOMATICA PARA CERRAR EL TOAST DE BIENVENIDA DESPUES DE UNOS SEGUNDOS

    setTimeout(() => {
        Bienvenido.style.opacity = 0;
        Bienvenido.style.visibility = 'hidden';
    }, 5000);

    /* ------------------------------------------------------------------------------ */

    const formulario = document.getElementById('formulario-chat');
    formulario.addEventListener('submit', enviarMensaje);

    formulario['mensaje'].focus();

    const contenedorMensajes = document.querySelector('.msg-container');
    const contenedorTyping = document.getElementById('typing');
    
    const btnNewMsg = document.getElementById('btn-new-msg');
    btnNewMsg.addEventListener('click', cargarNuevosMensajes);
    
    contenedorMensajes.addEventListener('scroll', () => {
        if (contenedorMensajes.scrollTop + contenedorMensajes.clientHeight + 10 >= 
            contenedorMensajes.scrollHeight) {
            btnNewMsg.style.display = 'none';
        }
    });
    const medio = document.getElementById('medio');
    const medioSend = document.getElementById('medio-send');

    const textArea = document.getElementById('mensaje');
    textArea.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') {
            e.preventDefault();
            const event = new Event('submit', {
                'bubbles'    : true, // Si el evento se puede propagar
                'cancelable' : true  // Si el evento puede ser cancelado
            });
            formulario.dispatchEvent(event);
        } else {
            let usuario = document.getElementById('username').innerText;
            let mensaje = document.getElementById("mensaje").value;
            const data = {
                'isMessage': false,
                'usuario': usuario,
                'mensaje': mensaje,
            };
    
            conn.send(JSON.stringify(data));
        }
    });

    const conn = new WebSocket('ws:localhost:8080');
    conn.onopen = function(e) {
        console.log("Conexión exitosa!");

    //FUNCION PARA ALERTAR A LOS USUARIOS QUE SE CONECTÓ UN NUEVO USUARIO

        let usernew = document.getElementById('username').innerText;
        const data = {
            'conection': true,
            'usuario': usernew,
        };

        conn.send(JSON.stringify(data));
    };

    //EVENTO WEBSOCKET CUANDO SE RECIBEN MENSAJES
    
    conn.onmessage = function(e) {

        const res = JSON.parse(e.data);

        //console.log(res);

        if (res.conection) {

            const textUser = document.getElementById('alert-text-user');
            textUser.innerText = `${res.usuario} se ha conectado a la sala.`;

            const toastUserNew = document.getElementById('alert-content-user');
            toastUserNew.style.opacity = 1;
            toastUserNew.style.visibility = 'visible';

            setTimeout(() => {
                toastUserNew.style.opacity = 0;
                toastUserNew.style.visibility = 'hidden';
            }, 3000);
        }

    /*     console.log(`${res.usuario} - ${res.mensaje}`); */

        else if (res.isMessage) {
            const elementoNuevo = document.createElement('div');
            elementoNuevo.className = 'message other';
            elementoNuevo.innerHTML = `
                <div class="msg-info">
                    <p>${res.usuario}</p>
                    <p><time datetime="${new Date()}" pubdate>${new Date().toLocaleString()}</time></p>
                </div> 
                <div class="msg-content">
                    <p>${res.mensaje}</p>
                </div>
            `;
            contenedorMensajes.append(elementoNuevo);

            if (contenedorMensajes.clientHeight < contenedorMensajes.scrollHeight) {
                btnNewMsg.style.display = 'block';
            } else {
                btnNewMsg.style.display = 'none';
            }

            medio.play();
        } else {
            contenedorTyping.innerHTML = `
                <p>
                    ${res.usuario} está escribiendo
                    <span id="punto1">.</span>
                    <span id="punto2">.</span>
                    <span id="punto3">.</span>
                </p>
            `;

            contenedorTyping.style.display = 'block';


            let timerTyping = 1;
            let id = setInterval(() => {

                timerTyping--; 
                if (timerTyping <= 0) {
                    contenedorTyping.style.display = 'none';
                    clearInterval(id);
                }
                
            }, 1000);

        }
    };

    /* ------------------------------------------------------------------------------------------ */

    //FUNCION PARA ENVIAR MENSAJES A LOS USUARIOS

    function enviarMensaje(e){
        e.preventDefault();
        let usuario = document.getElementById('username').innerText;
        let mensaje = document.getElementById("mensaje").value;

        const data = {
            'isMessage': true,
            'usuario': usuario,
            'mensaje': mensaje,
        };

        conn.send(JSON.stringify(data));

        const elementoNuevo = document.createElement('div');
        elementoNuevo.className = 'message me';
        elementoNuevo.innerHTML = `
            <div class="msg-info">
                <p>Tú</p>
                <p><time datetime="${new Date()}" pubdate>${new Date().toLocaleString()}</time></p>
            </div> 
            <div class="msg-content">
                <p>${mensaje}</p>
            </div>
        `;
        contenedorMensajes.append(elementoNuevo);

        contenedorMensajes.scrollTo({top: contenedorMensajes.scrollHeight, behavior: 'smooth'});
        formulario.reset();
        formulario['mensaje'].focus();

        medioSend.play();
    }

    /* ------------------------------------------------------------------------------------------------- */

    //FUNCION PARA CARGAR LOS NUEVOS MENSAJES RECIBIDOS POR UN BOTON

    function cargarNuevosMensajes() {
        contenedorMensajes.scrollTo({top: contenedorMensajes.scrollHeight, behavior: 'smooth'});
        btnNewMsg.style.display = 'none';
    }

    /* --------------------------------------------------------------------------------------------------- */
}

window.addEventListener("load",iniciar);
