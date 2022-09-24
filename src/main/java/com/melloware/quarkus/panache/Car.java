package com.melloware.quarkus.panache;

import java.math.BigDecimal;
import java.time.Instant;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Version;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CAR")
@Cacheable
@AllArgsConstructor
@NoArgsConstructor
@Schema(name = "Car", description = "Entity that represents a car.")
public class Car extends PanacheEntity {

	@Column(length = 40, unique = true)
	@NotBlank(message = "VIN may not be blank")
	@Schema(required = true, example = "WVGEF9BP4DD085048", description = "VIN number")
	public String vin;
	@NotBlank(message = "Make may not be blank")
	@Schema(required = true, example = "BMW", description = "Manufacturer")
	public String make;
	@NotBlank(message = "Model may not be blank")
	@Schema(required = true, example = "330ix", description = "Model Number")
	public String model;
	@Min(value = 1960)
	@Schema(required = true, example = "1974", description = "Year of manufacture")
	public int year;
	@NotBlank(message = "Color may not be blank")
	@Schema(required = true, example = "891d4c", description = "HTML color of the car")
	public String color;
	@DecimalMin(value = "0.00")
	@Schema(required = true, example = "9999.99", description = "Price")
	public BigDecimal price;

	@Version
	@Column(name = "modified_time")
	@Schema(description = "Modified time of the record")
	public Instant modifiedTime;

}
