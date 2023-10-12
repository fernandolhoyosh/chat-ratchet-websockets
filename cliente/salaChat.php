<?php 
    $nickname = isset($_POST['nickname']) ? $_POST['nickname'] : '';

    if (empty($nickname)) {
        $nickname = 'user'.random_int(1, 99999);
    }
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Chat</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' type='text/css' href='../css/estilos_sala.css'>
</head>
</head>

<body>
    <!-- MULTIMEDIA -->

    <!-- SONIDO NOTIFICACION RECIBIR MENSAJES -->
    <audio src="../sounds/pop.mp3" id="medio"></audio>

    <!-- SONIDO NOTIFICACION ENVIAR MENSAJES -->
    <audio src="../sounds/pop-send.mp3" id="medio-send"></audio>

    <!-- CONTENEDOR CHAT -->
    <div class="chat-container">
        <div class="heading">
            <h2>Chat Messages</h2>
            <h4 id="username">
                <?php echo $nickname ?>
            </h4>
            <div id="typing"></div>
            <div id="btn-new-msg" class="btn-new-messages">
                <p>Hay nuevos mensajes</p>
            </div>
        </div>
        <div class="msg-container">
        </div>
        <div class="type-container">
            <form id="formulario-chat">
                <textarea name="mensaje" id="mensaje" placeholder="Escribir mensaje..." rows="2"></textarea>
                <button id="btn-send-message">Enviar</button>
            </form>
        </div>
    </div>

    <!-- TOAST MENSAJE DE BIENVENIDA -->
    <div id="toast-padre">
        <div id="header-message">
            <h4>Bienvenido</h4>
            <div id="icon-cerrar"></div>
        </div>
        <div id="message-user">
            <h5>Hola,<?php echo " ".$nickname.". " ?>Estas activo en la sala de chat ¡Diviertete!
            </h5>
        </div>
    </div>

    <!-- TOAST CONEXION DE NUEVO USUARIO -->

    <div id="alert-content-user">
        <h5 id="alert-text-user"></h5>
    </div>


    <script src='../js/app.js'></script>
</body>

</html>