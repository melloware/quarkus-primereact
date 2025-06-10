package com.melloware.quarkus.socket;

import org.apache.commons.lang3.exception.ExceptionUtils;

import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnError;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnPingMessage;
import io.quarkus.websockets.next.OnPongMessage;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;
import io.vertx.core.buffer.Buffer;
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

    @OnPingMessage
    void ping(Buffer data) {
        // an incoming ping that will automatically receive a pong
        LOG.debugf("Websocket Ping received: %s", data);
    }

    @OnPongMessage
    void pong(Buffer data) {
        // an incoming pong in response to the last ping sent
        LOG.debugf("Websocket Pong received: %s", data);
    }

    @OnError
    public String onException(Exception e) {
        LOG.errorf("Websocket Exception: %s", ExceptionUtils.getRootCauseMessage(e));
        return "Error";
    }
 
}
