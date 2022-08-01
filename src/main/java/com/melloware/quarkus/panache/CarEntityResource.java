package com.melloware.quarkus.panache;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.Min;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang3.tuple.Pair;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.melloware.quarkus.support.QueryRequest;
import com.melloware.quarkus.support.QueryResponse;

import io.netty.handler.codec.http.HttpResponseStatus;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.extern.jbosslog.JBossLog;

@Path("entity/cars")
@ApplicationScoped
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@JBossLog
@RegisterForReflection
public class CarEntityResource {

    @Inject
    ObjectMapper objectMapper;

    @GET
    public QueryResponse<CarEntity> list(@QueryParam("request") String lazyRequest) throws JsonProcessingException {
        final QueryResponse<CarEntity> response = new QueryResponse<>();
        if (lazyRequest == null || lazyRequest.length() == 0) {
            List<CarEntity> results = CarEntity.listAll(Sort.by("make"));
            response.setTotalRecords(results.size());
            response.setRecords(results);
            return response;
        }

        final QueryRequest request = objectMapper.readValue(lazyRequest, QueryRequest.class);
        LOG.info(request);

        // sorts
        final Sort sort = request.calculateSort();

        // filters
        final Pair<String, Map<String, QueryRequest.MultiFilterMeta>> filterMeta = request.calculateFilters(sort);
        final String filterQuery = filterMeta.getLeft();
        final Map<String, QueryRequest.MultiFilterMeta> filters = filterMeta.getRight();

        PanacheQuery<CarEntity> query = CarEntity.findAll(sort);
        if (!filters.isEmpty()) {
            final Map<String, Object> map = filters.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> e.getValue().getSqlValue()));
            query = CarEntity.find(filterQuery, sort, map);
        }

        // range
        query.range(request.getFirst(), request.getFirst() + request.getRows());

        // response
        response.setTotalRecords(query.count());
        response.setRecords(query.list());
        return response;
    }

    @GET
    @Path("{id}")
    public CarEntity getSingle(@Min(value = 0) Long id) {
        CarEntity entity = CarEntity.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Car with id of " + id + " does not exist.", 404);
        }
        return entity;
    }

    @POST
    @Transactional
    public Response create(@Valid CarEntity car) {
        if (car.id != null) {
            throw new WebApplicationException("Id was invalidly set on request.", 422);
        }
        car.persist();
        return Response.ok(car).status(HttpResponseStatus.CREATED.code()).build();
    }

    @PUT
    @Path("{id}")
    @Transactional
    public CarEntity update(@Min(value = 0) Long id, @Valid CarEntity car) {
        CarEntity entity = CarEntity.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Car with id of " + id + " does not exist.", 404);
        }

        // would normally use ModelMapper here: https://modelmapper.org/
        entity.make = car.make;
        entity.model = car.model;
        entity.year = car.year;
        entity.vin = car.vin;
        entity.color = car.color;
        entity.price = car.price;

        return entity;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@Min(value = 0) Long id) {
        CarEntity entity = CarEntity.findById(id);
        if (entity == null) {
            throw new WebApplicationException("Car with id of " + id + " does not exist.", 404);
        }
        entity.delete();
        return Response.status(HttpResponseStatus.NO_CONTENT.code()).build();
    }

}
