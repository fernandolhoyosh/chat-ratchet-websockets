<?php
namespace MyApp;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class Chat implements MessageComponentInterface {

    protected $clients;

    // Creamos el constructor de la clase

    public function __construct(){

        $this->clients = new \SplObjectStorage;

        echo "SERVIDOR INICIADO CORRECTAMENTE\n";
        
    }
    
    public function onOpen(ConnectionInterface $conn) {
        //un host se conecta al servidor

        $this->clients->attach($conn);

        echo "Nueva Conexión! ({$conn->resourceId})\n";

    }

    public function onMessage(ConnectionInterface $from, $msg) {
        // Metodo para Recibir o enviar mensajes

        foreach ($this->clients as $client) {
            
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send($msg);

            }
        }
    }

    public function onClose(ConnectionInterface $conn) {
        // Metodo para cerrar una conexion

        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);
    
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        // Se cae una conexion.

        echo "Se ha presentado un error: {$e->getMessage()}\n";

        $conn->close();
    }
}
