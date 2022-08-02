package com.melloware.quarkus.panache;

import java.math.BigDecimal;

import javax.persistence.Cacheable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "CAR")
@Cacheable
@AllArgsConstructor
@NoArgsConstructor
public class CarEntity extends PanacheEntity {

    @Column(length = 40, unique = true)
    @NotBlank(message = "VIN may not be blank")
    public String vin;
    @NotBlank(message = "Make may not be blank")
    public String make;
    @NotBlank(message = "Model may not be blank")
    public String model;
    @Min(value = 1960)
    public int year;
    @NotBlank(message = "Color may not be blank")
    public String color;
    @DecimalMin(value = "0.00")
    public BigDecimal price;

}
