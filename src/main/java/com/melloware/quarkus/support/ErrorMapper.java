package com.melloware.quarkus.support;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import lombok.extern.jbosslog.JBossLog;

/**
 * Exception mapper that handles all exceptions and maps them to appropriate HTTP response codes.
 * For WebApplicationExceptions, it preserves the original status code.
 * For all other exceptions, returns 500 Internal Server Error.
 * The response includes JSON with exception details including type, code and message.
 */
@Provider
@JBossLog
public class ErrorMapper implements ExceptionMapper<Exception> {

    @Inject
    ObjectMapper objectMapper;

    /**
     * Maps an exception to a JAX-RS Response object.
     *
     * @param exception The exception to map
     * @return Response object containing error details in JSON format
     */
    @Override
    public Response toResponse(Exception exception) {
        LOG.error("Failed to handle request", exception);

        int code = 500;
        if (exception instanceof WebApplicationException) {
            code = ((WebApplicationException) exception).getResponse().getStatus();
        }

        ObjectNode exceptionJson = objectMapper.createObjectNode();
        exceptionJson.put("exceptionType", exception.getClass().getName());
        exceptionJson.put("code", code);

        if (exception.getMessage() != null) {
            exceptionJson.put("error", exception.getMessage());
        }

        return Response.status(code)
            .entity(exceptionJson)
            .build();
    }
}
