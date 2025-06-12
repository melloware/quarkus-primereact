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

    /**
     * Handles incoming text messages from WebSocket clients.
     * Processes JS "ping" messages and returns appropriate "pong" responses.
     *
     * @param message The text message received from the client
     * @return A response message to be sent back to the client
     */
    @OnTextMessage(broadcast = false)  
    @RunOnVirtualThread
    public String onMessage(String message) {
        if ("ping".equals(message)) {
            log.debugf("Websocket Ping message received: %s", message);
            return "pong";
        }
        log.infof("Websocket message received: %s", message);
        return message;
    }

    /**
     * Handles incoming ping messages from WebSocket clients.
     * Automatically responds with a pong message.
     *
     * @param data The ping message data received from the client
     * @see https://datatracker.ietf.org/doc/html/rfc6455#section-5.5.2
     */
    @OnPingMessage
    @RunOnVirtualThread
    void ping(Buffer data) {
        // an incoming ping data frame that will automatically receive a pong
        log.debugf("Websocket Ping received: %s", data);
    }

    /**
     * Handles incoming pong data frame messages from WebSocket clients.
     * These are responses to previously sent ping messages.
     *
     * @param data The pong message data received from the client
     * @see https://datatracker.ietf.org/doc/html/rfc6455#section-5.5.2
     */
    @OnPongMessage
    @RunOnVirtualThread
    void pong(Buffer data) {
        // an incoming pong data frame in response to the last ping sent
        log.debugf("Websocket Pong received: %s", data);
    }

    /**
     * Handles WebSocket errors and exceptions.
     * Logs the root cause of the exception and returns an error message.
     *
     * @param e The exception that occurred
     * @return An error message to be sent back to the client
     */
    @OnError
    @RunOnVirtualThread
    public String onException(Exception e) {
        // Handles Exception and all subclasses except for IOException.
        log.errorf("Websocket Exception: %s", ExceptionUtils.getRootCauseMessage(e));
        return "Error";
    }
}
