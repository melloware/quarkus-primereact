package com.melloware.quarkus.socket;

import org.apache.commons.lang3.exception.ExceptionUtils;

import io.quarkus.websockets.next.OnClose;
import io.quarkus.websockets.next.OnError;
import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnPingMessage;
import io.quarkus.websockets.next.OnPongMessage;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.WebSocket;
import io.quarkus.websockets.next.WebSocketConnection;
import io.smallrye.common.annotation.RunOnVirtualThread;
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
    @RunOnVirtualThread     
    public void onOpen(WebSocketConnection connection) {
        LOG.infof("Websocket connection opened: %s", connection.id());
    }

    /**
     * Handles WebSocket disconnections.
     */
    @OnClose      
    @RunOnVirtualThread              
    public void onClose(WebSocketConnection connection) {
        LOG.infof("Websocket connection closed: %s", connection.id());
    }

    @OnTextMessage(broadcast = false)  
    @RunOnVirtualThread
    public String onMessage(String message) {
        LOG.infof("Websocket message received: %s", message);
        return "pong";
    }

    @OnPingMessage
    @RunOnVirtualThread
    void ping(Buffer data) {
        // an incoming ping data frame that will automatically receive a pong data frame
        LOG.infof("Websocket Ping received: %s", data);
    }

    @OnPongMessage
    @RunOnVirtualThread
    void pong(Buffer data) {
        // an incoming pong data frame in response to the last ping data frame sent
        LOG.infof("Websocket Pong received: %s", data);
    }

    @OnError
    @RunOnVirtualThread
    public String onException(Exception e) {
        LOG.errorf("Websocket Exception: %s", ExceptionUtils.getRootCauseMessage(e));
        return "Error";
    }
 
}
