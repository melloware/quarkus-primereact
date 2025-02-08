package com.melloware.quarkus.socket;

import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import io.quarkus.runtime.annotations.RegisterForReflection;
import io.quarkus.websockets.next.OpenConnections;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import lombok.extern.jbosslog.JBossLog;

/**
 * REST resource for WebSocket operations.
 * Provides endpoints for sending notifications and refresh signals to connected clients.
 */
@Path("socket")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@JBossLog
@RegisterForReflection
@Tag(name = "WebSocket Resource", description = "WebSocket operations.")
public class SocketResource {

    /** Connection manager for WebSocket clients */
    @Inject
    OpenConnections connections;
    
    /**
     * Pushes a notification message to all connected WebSocket clients.
     *
     * @param message The notification message to send
     * @return Response with status 201 if successful
     * @throws WebApplicationException with status 422 if message is blank
     */
    @Path("notify")
    @POST
	@Operation(summary = "Push notification message", description = "Pushes a notification message to all connected clients")
	@APIResponses({
		@APIResponse(responseCode = "201", description = "Notification message sent successfully"),
		@APIResponse(responseCode = "422", description = "Message cannot be null or blank")
	})
	public Response notify(@QueryParam("message") String message) {
		if (StringUtils.isBlank(message)) {
			// 422 Unprocessable Entity
			throw new WebApplicationException("Id was invalidly set on request.", 422);
		}
        SocketMessage pushMessage = new SocketMessage(SocketMessageType.NOTIFICATION, message);
        sendMessage(pushMessage);
		return Response.ok(pushMessage).status(Status.CREATED).build();
	}

    /**
     * Pushes a refresh signal to all connected WebSocket clients.
     * This will trigger clients to refresh their UI data.
     *
     * @return Response with status 201 if successful
     */
    @Path("refresh")
    @POST
	@Operation(summary = "Push a UI refresh signal", description = "Pushes a UI refresh signal to all connected clients")
	@APIResponses({
		@APIResponse(responseCode = "201", description = "Refresh UI message sent successfully"),
	})
	public Response refresh() {
        SocketMessage pushMessage = new SocketMessage(SocketMessageType.REFRESH_DATA, null);
        sendMessage(pushMessage);
		return Response.ok(pushMessage).status(Status.CREATED).build();
	}

    /**
     * Helper method to send a message to all connected WebSocket clients.
     * Includes a simulated processing delay of 2 seconds.
     *
     * @param message The SocketMessage to send to all clients
     */
    private void sendMessage(SocketMessage message) {
        LOG.infof("WebSocket: %s", message);
        try {
            // sleep to simulate time processing an event before publishing
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            LOG.error("Error sending websocketmessage", e);
        }
        connections.forEach(connection -> connection.sendTextAndAwait(message));
    }
}
