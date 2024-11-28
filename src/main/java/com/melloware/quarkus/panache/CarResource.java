package com.melloware.quarkus.panache;

import java.util.List;
import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.melloware.quarkus.support.QueryRequest;
import com.melloware.quarkus.support.QueryResponse;

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
@Tag(name = "Car Resource", description = "CRUD operations for the Car entity.")
public class CarResource {

	@Inject
	ObjectMapper objectMapper;

	@GET
	@Path("{id}")
	public Car getSingle(@PathParam("id") @Min(value = 0) Long id) {
		Car entity = Car.findById(id);
		if (entity == null) {
			throw new WebApplicationException("Car with id of " + id + " does not exist.", Status.NOT_FOUND);
		}
		return entity;
	}

	@GET
	@Path("/manufacturers")
	public List<String> getManufacturers() {
		return Car.find("select distinct make from Car order by make").project(String.class).list();
	}

	@POST
	@Transactional
	public Response create(@Valid Car car) {
		if (car.id != null) {
			// 422 Unprocessable Entity
			throw new WebApplicationException("Id was invalidly set on request.", 422);
		}
		car.persist();
		return Response.ok(car).status(Status.CREATED).build();
	}

	@PUT
	@Path("{id}")
	@Transactional
	public Car update(@PathParam("id") @Min(value = 0) Long id, @Valid Car car) {
		Car entity = Car.findById(id);
		if (entity == null) {
			throw new WebApplicationException("Car with id of " + id + " does not exist.", Status.NOT_FOUND);
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
	public Response delete(@PathParam("id") @Min(value = 0) Long id) {
		Car entity = Car.findById(id);
		if (entity == null) {
			throw new WebApplicationException("Car with id of " + id + " does not exist.", Status.NOT_FOUND);
		}
		entity.delete();
		return Response.status(Status.NO_CONTENT).build();
	}

	@GET
	public QueryResponse<Car> list(@QueryParam("request") String lazyRequest) throws JsonProcessingException {
		final QueryResponse<Car> response = new QueryResponse<>();
		if (lazyRequest == null || lazyRequest.isEmpty()) {
			List<Car> results = Car.listAll(Sort.by("make"));
			response.setTotalRecords(results.size());
			response.setRecords(results);
			return response;
		}

		final QueryRequest request = objectMapper.readValue(lazyRequest, QueryRequest.class);
		LOG.info(request);

		// sorts
		final Sort sort = request.calculateSort();

		// filters
		final QueryRequest.FilterCriteria filterMeta = request.calculateFilters(QueryRequest.FilterOperator.AND);
		final String filterQuery = filterMeta.getQuery();
		final Map<String, QueryRequest.MultiFilterMeta> filters = filterMeta.getParameters();

		PanacheQuery<Car> query = Car.findAll(sort);
		if (!filters.isEmpty()) {
			Map<String, Object> map = request.calculateFilterParameters();
			query = Car.find(filterQuery, sort, map);
		}

		// range
		query.range(request.getFirst(), request.getFirst() + request.getRows());

		// response
		response.setTotalRecords(query.count());
		response.setRecords(query.list());
		return response;
	}
}