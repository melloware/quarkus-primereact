package com.melloware.quarkus.support;

import java.util.List;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and
 * pagination.
 * <p>
 * This class handles the response format expected by PrimeReact datatables including:
 * <ul>
 *   <li>Total record count for pagination</li>
 *   <li>List of records for current page</li>
 * </ul>
 * <p>
 * The generic type T represents the type of records being returned.
 *
 * @param <T> The type of records in the response
 */
@Data
@NoArgsConstructor
@RegisterForReflection
@Schema(description = "Represents a PrimeReact query response to the UI for a complex datatable with multiple sorts, multiple filters, and pagination.")
public class QueryResponse<T> {

    /**
     * The total number of records available that match the query criteria.
     * Used for pagination calculations.
     */
    @Schema(examples = {"4128"}, description = "Total records available by this query criteria")
    private long totalRecords;

    /**
     * The list of records for the current page, after applying
     * pagination, sorting and filtering criteria.
     */
    @Schema(description = "Records for this set of pagination, sorting, filtering.")
    private List<T> records;
}
