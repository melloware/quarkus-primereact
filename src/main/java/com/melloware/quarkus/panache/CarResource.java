package com.melloware.quarkus.panache;

import java.util.List;
import java.util.Map;

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.melloware.quarkus.support.QueryRequest;
import com.melloware.quarkus.support.QueryResponse;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Sort;
import io.quarkus.runtime.annotations.RegisterForReflection;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
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
	@Operation(summary = "Get a car by ID", description = "Returns a car based on the provided ID")
	@APIResponses({
		@APIResponse(responseCode = "200", description = "Success"),
		@APIResponse(responseCode = "404", description = "Car not found")
	})
	public Car getSingle(@PathParam("id") @Min(value = 0) Long id) {
		LOG.infof("Get Car: %s", id);
		Car entity = Car.findById(id);
		if (entity == null) {
			throw new NotFoundException("Car with id of " + id + " does not exist.");
		}
		return entity;
	}

	@GET
	@Path("/manufacturers")
	@Operation(summary = "Get all manufacturers", description = "Returns a list of distinct car manufacturers")
	@APIResponse(responseCode = "200", description = "Success")
	public List<String> getManufacturers() {
		LOG.infof("Get Unique Manufacturers...");
		return Car.find("select distinct make from Car order by make").project(String.class).list();
	}


	@POST
	@Transactional
	@Operation(summary = "Create a new car", description = "Creates a new car entry")
	@APIResponses({
		@APIResponse(responseCode = "201", description = "Car created successfully" ,content = @Content(mediaType = "application/json", schema = @Schema(implementation = Car.class))),
		@APIResponse(responseCode = "422", description = "Invalid car data provided")
	})
	public Response create(@Valid Car car) {
		LOG.infof("Create Car: %s", car);
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
	@Operation(summary = "Update a car", description = "Updates an existing car based on ID")
	@APIResponses({
		@APIResponse(responseCode = "200", description = "Car updated successfully"),
		@APIResponse(responseCode = "404", description = "Car not found")
	})
	public Car update(@PathParam("id") @Min(value = 0) Long id, @Valid Car car) {
		LOG.infof("Update Car: %s", id);
		Car entity = Car.findById(id);
		if (entity == null) {
			throw new NotFoundException("Car with id of " + id + " does not exist.");

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
	@Operation(summary = "Delete a car", description = "Deletes a car based on ID")
	@APIResponses({
		@APIResponse(responseCode = "204", description = "Car successfully deleted"),
		@APIResponse(responseCode = "404", description = "Car not found")
	})
	public Response delete(@PathParam("id") @Min(value = 0) Long id) {
		LOG.infof("Delete Car: %s", id);
		Car entity = Car.findById(id);
		if (entity == null) {
			throw new NotFoundException("Car with id of " + id + " does not exist.");
		}
		entity.delete();
		return Response.status(Status.NO_CONTENT).build();
	}

	@GET
	@Operation(summary = "List cars", description = "Returns a paginated list of cars with optional filtering and sorting")
	@APIResponses({
		@APIResponse(responseCode = "200", description = "Success"),
		@APIResponse(responseCode = "400", description = "Invalid request format")
	})
	public QueryResponse<Car> list(@QueryParam("request") String lazyRequest) throws JsonProcessingException {
		LOG.debugf("List Cars: %s", lazyRequest);
		try {
			// add a delay to simulate a slow response
			Thread.sleep(250);
		} catch (InterruptedException e) {
			// do nothing
		}
		final QueryResponse<Car> response = new QueryResponse<>();
		if (lazyRequest == null || lazyRequest.isEmpty()) {
			List<Car> results = Car.listAll(Sort.by("make"));
			response.setTotalRecords(results.size());
			response.setRecords(results);
			return response;
		}

		final QueryRequest request = objectMapper.readValue(lazyRequest, QueryRequest.class);
		LOG.debug(request);

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