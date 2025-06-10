package com.melloware.quarkus.socket;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
@RegisterForReflection
@Schema(description = "WebSocket message for real-time updates")
public class SocketMessage {
    
    @Schema(description = "Unique identifier for the message", examples = "03001000c0020000")
    private String id;

    @Builder.Default
    @Schema(description = "UTC timestamp of when the message was created", examples = "2024-03-20T10:30:00Z")
    private ZonedDateTime timestamp = ZonedDateTime.now().withZoneSameInstant(ZoneOffset.UTC).truncatedTo(ChronoUnit.SECONDS);

    @Schema(required = true, description = "Type of socket message", examples = {"USER_JOINED", "USER_LEFT", "REFRESH_DATA", "NOTIFICATION"})
    SocketMessageType type;

    @Schema(description = "Optional message payload", examples = {"User connected", "Please refresh your data"})
    String message;

    @Schema(description = "Additional context information for the message", examples = "{\"source\": \"system\", \"priority\": \"high\"}")
    private Map<String,String> context;

}
