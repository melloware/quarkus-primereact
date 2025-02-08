package com.melloware.quarkus.socket;

/**
 * Enum representing different types of WebSocket messages that can be sent.
 */
public enum SocketMessageType {
    /**
     * Indicates that connected clients should refresh their data
     */
    REFRESH_DATA,
    
    /**
     * Indicates a notification message should be shown to the user
     */
    NOTIFICATION;
}
