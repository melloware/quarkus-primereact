package com.melloware.quarkus.socket;

import org.eclipse.microprofile.openapi.annotations.media.Schema;


@Schema(name = "SocketMessage", description = "WebSocket message")
public record SocketMessage(
    @Schema(required = true, description = "Type of socket message", examples = {"USER_JOINED", "USER_LEFT", "REFRESH_DATA", "NOTIFICATION"})
    SocketMessageType type,
    @Schema(description = "Optional message payload", examples = {"User connected", "Please refresh your data"})
    String message) {
    
}
