package com.melloware.quarkus.socket;

import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;
import jakarta.inject.Inject;
import lombok.extern.jbosslog.JBossLog;

/**
 * WebSocket endpoint for push notifications.
 * Handles user connections, disconnections and message broadcasting.
 */
@WebSocket(path = "/push")
@JBossLog
public class PushWebSocket {

    /**
     * The WebSocket connection instance.
     */
    @Inject
    WebSocketConnection connection;  

    /**
     * Handles new WebSocket connections.
     */
    @OnOpen       
    public void onOpen(WebSocketConnection connection) {
        LOG.infof("Websocket connection opened: %s", connection.id());
    }

    /**
     * Handles WebSocket disconnections.
     */
    @OnClose                    
    public void onClose(WebSocketConnection connection) {
        LOG.infof("Websocket connection closed: %s", connection.id());
    }
 
}
