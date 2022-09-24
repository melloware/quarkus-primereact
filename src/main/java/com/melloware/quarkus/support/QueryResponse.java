package com.melloware.quarkus.support;

import java.util.List;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and
 * pagination.
 */
@Data
@NoArgsConstructor
@RegisterForReflection
@Schema(description = "Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.")
public class QueryResponse<T> {

	@Schema(example = "4128", description = "Total records available by this query criteria")
	private long totalRecords;
	@Schema(description = "Records for this set of pagination, sorting, filtering.")
	private List<T> records;
}
