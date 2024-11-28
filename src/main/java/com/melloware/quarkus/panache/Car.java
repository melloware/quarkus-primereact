package com.melloware.quarkus.panache;

import java.math.BigDecimal;
import java.time.Instant;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Cacheable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
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
	@Schema(required = true, examples = {"WVGEF9BP4DD085048"}, description = "VIN number")
	public String vin;
	@NotBlank(message = "Make may not be blank")
	@Schema(required = true, examples = {"BMW"}, description = "Manufacturer")
	public String make;
	@NotBlank(message = "Model may not be blank")
	@Schema(required = true, examples = {"330ix"}, description = "Model Number")
	public String model;
	@Min(value = 1960)
	@Schema(required = true, examples = {"1974"}, description = "Year of manufacture")
	public int year;
	@NotBlank(message = "Color may not be blank")
	@Schema(required = true, examples = {"891d4c"}, description = "HTML color of the car")
	public String color;
	@DecimalMin(value = "0.00")
	@Schema(required = true, examples = {"9999.99"}, description = "Price")
	public BigDecimal price;

	@Version
	@Column(name = "modified_time")
	@Schema(description = "Modified time of the record")
	public Instant modifiedTime;

}
