package com.melloware.quarkus.support;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.panache.common.Sort;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Represents a PrimeReact query request from the UI for a complex datatable with multiple sorts, multiple filters, and
 * pagination.
 * <p>
 * This class handles:
 * <ul>
 *   <li>Pagination - first record, rows per page, page number</li>
 *   <li>Sorting - both single field and multi-field sorting</li>
 *   <li>Filtering - complex filtering with multiple constraints and operators</li>
 * </ul>
 * <p>
 * The class provides methods to:
 * <ul>
 *   <li>Calculate sort criteria for Panache queries</li>
 *   <li>Build filter criteria with AND/OR operators</li>
 *   <li>Generate SQL parameters for filters</li>
 * </ul>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
@Schema(description = "Represents a PrimeReact query request from the UI for a complex datatable with multiple sorts, multiple filters, and pagination.")
public class QueryRequest {

    /**
     * The index of the first record to return
     */
    @Schema(examples = {"1"}, description = "First record")
    private int first;

    /**
     * Number of rows to return per page
     */
    @Schema(examples = {"10"}, description = "Number of rows")
    private int rows;

    /**
     * Current page number
     */
    @Schema(examples = {"1"}, description = "Page number")
    private int page;

    /**
     * Field name to sort by when using single field sorting
     */
    @Schema(examples = {"firstName"}, description = "Sort field if single field sorting")
    private String sortField;

    /**
     * Sort direction for single field sorting (-1 desc, 0 none, 1 asc)
     */
    @Schema(examples = {"1"}, description = "Sort order if single field sorting either -1 desc, 0 none, 1 asc")
    private int sortOrder;

    /**
     * List of sort criteria for multiple field sorting
     */
    @Schema(description = "Multiple sorting list of columns to sort and in which order")
    private List<MultiSortMeta> multiSortMeta = new ArrayList<>();

    /**
     * Map of column filters and their criteria
     */
    @Schema(description = "Map of columns being filtered and their filter criteria")
    private Map<String, MultiFilterMeta> filters = new HashMap<>();

    /**
     * Map of column name overrides to map UI column names to database column names
     * e.g. "codeListName" to "codelist.name"
     */
    @JsonIgnore
    private Map<String, String> overrides = new HashMap<>();

    /**
     * Determines if the request uses single field sorting
     *
     * @return true if using single field sort, false otherwise
     */
    @JsonIgnore
    public boolean isSingleSort() {
        return sortField != null && !sortField.isEmpty();
    }

    /**
     * Determines if the request uses multiple field sorting
     *
     * @return true if using multiple field sort, false otherwise
     */
    @JsonIgnore
    public boolean isMultipleSort() {
        return !getMultiSortMeta().isEmpty();
    }

    /**
     * Determines if the table is using filterDisplay="menu" vs filterDisplay="row"
     *
     * @return true if filtering by menu, false if filtering by row
     */
    @JsonIgnore
    public boolean isFilterMenu() {
        return getFilters().entrySet().stream().anyMatch(e -> StringUtils.isNotBlank(e.getValue().getOperator()));
    }

    /**
     * Calculates the Panache Sort criteria based on single or multiple field sorting
     *
     * @return Sort object configured with the requested sort criteria
     */
    @JsonIgnore
    public Sort calculateSort() {
        Sort sort = null;
        if (isSingleSort()) {
            sort = Sort.by(checkOverride(getSortField()),
                    getSortOrder() == 1 ? Sort.Direction.Ascending : Sort.Direction.Descending);
        } else if (isMultipleSort()) {
            for (final QueryRequest.MultiSortMeta multiSortMeta : getMultiSortMeta()) {
                if (sort == null) {
                    sort = Sort.by(checkOverride(multiSortMeta.getField()), multiSortMeta.getSqlOrder());
                } else {
                    sort.and(checkOverride(multiSortMeta.getField()), multiSortMeta.getSqlOrder());
                }
            }
        }
        return sort;
    }

    /**
     * Checks if a column name has an override mapping and returns the mapped name if it exists
     *
     * @param column The original column name
     * @return The mapped column name if an override exists, otherwise the original name
     */
    private String checkOverride(final String column) {
        return overrides.getOrDefault(column, column);
    }

    /**
     * Calculates the filter criteria and builds the filter query string
     *
     * @param operator The operator (AND/OR) to use when joining multiple filters
     * @return FilterCriteria containing the query string and filter parameters
     */
    public FilterCriteria calculateFilters(final FilterOperator operator) {
        final Map<String, QueryRequest.MultiFilterMeta> filters = getFilters();

        final StringBuilder filterQuery = new StringBuilder(1024);
        if (this.isFilterMenu()) {
            for (final Map.Entry<String, MultiFilterMeta> entry : filters.entrySet()) {
                final String column = checkOverride(entry.getKey());
                final MultiFilterMeta filterConstraints = entry.getValue();
                final List<QueryRequest.FilterConstraint> constraints = filterConstraints.getConstraints();

                constraints.removeIf(e -> StringUtils.isBlank(Objects.toString(e.getValue(), null)));
                if (constraints.isEmpty()) {
                    continue;
                }

                final AtomicInteger i = new AtomicInteger();
                final String result = filterConstraints.getConstraints().stream()
                        .map(constraint -> column + constraint.getSqlClause() + " :" +
                                createColumnVariable(column, i.getAndIncrement()))
                        .collect(Collectors.joining(" " + filterConstraints.operator + " "));
                if (StringUtils.isNotEmpty(result)) {
                    if (!filterQuery.isEmpty()) {
                        filterQuery.append(StringUtils.SPACE).append(operator.name()).append(" (");
                    } else {
                        filterQuery.append("(");
                    }
                    filterQuery.append(result).append(")");
                }
            }
        } else {
            filters.entrySet()
                    .removeIf(e -> StringUtils.isBlank(Objects.toString(e.getValue().getValue(), null)));
            final String result = filters.entrySet().stream()
                    .map(entry -> checkOverride(entry.getKey()) + entry.getValue().getSqlClause() + " :" +
                            entry.getKey())
                    .collect(Collectors.joining(" " + operator.name() + " "));
            filterQuery.append(result);
        }

        return new FilterCriteria(filterQuery.toString(), filters);
    }

    /**
     * Builds a map of filter parameters and their values for SQL query execution
     *
     * @return Map of parameter names to their values
     */
    public Map<String, Object> calculateFilterParameters() {
        Map<String, Object> params = new HashMap<>();
        if (this.isFilterMenu()) {
            for (final Map.Entry<String, QueryRequest.MultiFilterMeta> entry : filters.entrySet()) {
                final String column = checkOverride(entry.getKey());

                int i = 0;
                for (final QueryRequest.FilterConstraint constraint : entry.getValue().getConstraints()) {
                    params.put(createColumnVariable(column, i++), constraint.getSqlValue());
                }
            }
        } else {
            params = filters.entrySet().stream()
                    .collect(Collectors.toMap(e -> checkOverride(e.getKey()), e -> e.getValue().getSqlValue()));
        }
        return params;
    }

    /**
     * Creates a unique parameter name for a column and counter
     *
     * @param column The column name
     * @param counter The counter value
     * @return A unique parameter name
     */
    private String createColumnVariable(final String column, final int counter) {
        return StringUtils.remove(column, '.') + counter;
    }

    /**
     * Enum defining filter operators for joining multiple filters
     */
    @RegisterForReflection
    public enum FilterOperator {
        AND,
        OR
    }

    /**
     * Class representing multiple sort criteria for a single field
     */
    @Data
    @NoArgsConstructor
    @RegisterForReflection
    public static class MultiSortMeta {
        @Schema(examples = {"lastName"}, description = "Sort field for this multiple sort")
        private String field;
        @Schema(examples = {"1"}, description = "Sort order for this field either -1 desc, 0 none, 1 asc")
        private int order;

        /**
         * Converts the numeric order to a Panache Sort.Direction
         *
         * @return Sort.Direction.Ascending for 1, Sort.Direction.Descending otherwise
         */
        @JsonIgnore
        public Sort.Direction getSqlOrder() {
            return order == 1 ? Sort.Direction.Ascending : Sort.Direction.Descending;
        }
    }

    /**
     * Class representing a single filter constraint
     */
    @Data
    @NoArgsConstructor
    @RegisterForReflection
    public static class FilterConstraint {
        @Schema(description = "Value to filter this column by")
        private Object value;
        @Schema(examples = {"equals"}, description = "Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte")
        private String matchMode;

        /**
         * Gets the SQL operator for the filter match mode
         *
         * @return The SQL operator string
         */
        @JsonIgnore
        public String getSqlClause() {
            return switch (matchMode) {
                case "equals", "dateIs" -> "=";
                case "notEquals", "dateIsNot" -> "!=";
                case "notContains" -> " not like ";
                case "gt", "dateAfter" -> ">";
                case "gte" -> ">=";
                case "lt", "dateBefore" -> "<";
                case "lte" -> "<=";
                default -> " like ";
            };
        }

        /**
         * Converts the filter value to the appropriate SQL value based on match mode
         *
         * @return The converted value for SQL
         */
        @JsonIgnore
        public Object getSqlValue() {
            final Object value = getValue();
            return switch (matchMode) {
                case "contains", "notContains" -> "%" + value + "%";
                case "startsWith" -> value + "%";
                case "endsWith" -> "%" + value;
                case "gt", "gte", "lt", "lte" ->
                    Integer.parseInt((String) value);
                case "dateAfter", "dateBefore", "dateIs", "dateIsNot" -> Instant.parse((String) value);
                default -> value;
            };
        }
    }

    /**
     * Class representing multiple filter constraints for a single field
     */
    @Data
    @NoArgsConstructor
    @EqualsAndHashCode(callSuper = true)
    @RegisterForReflection
    public static class MultiFilterMeta extends FilterConstraint {

        @Schema(description = "Filter operator either 'and' or 'or'")
        private String operator;

        @Schema(description = "List of filter constraints for this filter")
        private List<FilterConstraint> constraints = new ArrayList<>();

    }

    /**
     * Class representing the complete filter criteria including query and parameters
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @RegisterForReflection
    public static class FilterCriteria {
        private String query;
        private Map<String, MultiFilterMeta> parameters;
    }
}