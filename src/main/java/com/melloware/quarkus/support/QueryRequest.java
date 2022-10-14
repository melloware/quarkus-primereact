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

import io.quarkus.panache.common.Sort;
import io.quarkus.runtime.annotations.RegisterForReflection;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Represents a PrimeReact query request from the UI for a complex datatable with multiple sorts, multiple filters, and
 * pagination.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
@Schema(description = "Represents a PrimeReact query request from the UI for a complex datatable with multiple sorts, multiple filters, and pagination.")
public class QueryRequest {

	// pagination
	@Schema(example = "1", description = "First record")
	private int first;
	@Schema(example = "10", description = "Number of rows")
	private int rows;
	@Schema(example = "1", description = "Page number")
	private int page;

	// sorting
	@Schema(example = "firstName", description = "Sort field if single field sorting")
	private String sortField;
	@Schema(example = "1", description = "Sort order if single field sorting either -1 desc, 0 none, 1 asc")
	private int sortOrder;
	@Schema(description = "Multiple sorting list of columns to sort and in which order")
	private List<MultiSortMeta> multiSortMeta = new ArrayList<>();

	// filtering
	@Schema(description = "Map of columns being filtered and their filter criteria")
	private Map<String, MultiFilterMeta> filters = new HashMap<>();

	/**
	 * Map of column overrides to map say "codeListName" to "codelist.name"
	 */
	@JsonIgnore
	private Map<String, String> overrides = new HashMap<>();

	/**
	 * Are these criteria using single sort only
	 *
	 * @return true if single sort
	 */
	@JsonIgnore
	public boolean isSingleSort() {
		return sortField != null && sortField.length() > 0;
	}

	/**
	 * Are these criteria using multiple column sorting.
	 *
	 * @return true if multiple sorting
	 */
	@JsonIgnore
	public boolean isMultipleSort() {
		return !getMultiSortMeta().isEmpty();
	}

	/**
	 * Is the table using filterDisplay="menu" or filterDisplay="row".
	 *
	 * @return true if filtering by menu
	 */
	@JsonIgnore
	public boolean isFilterMenu() {
		// check whether this is a filterDisplay="menu" or "row"
		return getFilters().entrySet().stream().anyMatch(e -> StringUtils.isNotBlank(e.getValue().getOperator()));
	}

	/**
	 * Calculate the sorts.
	 *
	 * @return the final Panache Sort
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

	private String checkOverride(final String column) {
		return overrides.getOrDefault(column, column);
	}

	/**
	 * Calculate the column filters.
	 *
	 * @param operator either AND/OR for how you want filters joined
	 * @return returns a Pair of QueryString Map of parameters
	 */
	public FilterCriteria calculateFilters(final FilterOperator operator) {
		final Map<String, QueryRequest.MultiFilterMeta> filters = getFilters();
		// remove any blank filters

		final StringBuilder filterQuery = new StringBuilder(1024);
		// check whether this is a filterDisplay="menu" or "row"
		if (this.isFilterMenu()) {
			for (final Map.Entry<String, MultiFilterMeta> entry : filters.entrySet()) {
				final String column = checkOverride(entry.getKey());
				final MultiFilterMeta filterConstraints = entry.getValue();
				final List<QueryRequest.FilterConstraint> constraints = filterConstraints.getConstraints();

				// remove any blank filters
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
					if (filterQuery.length() > 0) {
						filterQuery.append(StringUtils.SPACE).append(operator.name()).append(" (");
					} else {
						filterQuery.append("(");
					}
					filterQuery.append(result).append(")");
				}
			}
		} else {
			// remove any blank filters
			filters.entrySet()
					.removeIf(e -> StringUtils.isBlank(Objects.toString(e.getValue().getValue(), null)));
			// filter display = "row"
			final String result = filters.entrySet().stream()
					.map(entry -> checkOverride(entry.getKey()) + entry.getValue().getSqlClause() + " :" +
							entry.getKey())
					.collect(Collectors.joining(" " + operator.name() + " "));
			filterQuery.append(result);
		}

		return new FilterCriteria(filterQuery.toString(), filters);
	}

	/**
	 * Builds the filter parameters like ":make0 = Acura", ":make1 = BMW".
	 *
	 * @return the Map of parameter replacements and their values.
	 */
	public Map<String, Object> calculateFilterParameters() {
		Map<String, Object> params = new HashMap<>();
		if (this.isFilterMenu()) {
			// filterDisplay="menu"
			for (final Map.Entry<String, QueryRequest.MultiFilterMeta> entry : filters.entrySet()) {
				final String column = checkOverride(entry.getKey());

				int i = 0;
				for (final QueryRequest.FilterConstraint constraint : entry.getValue().getConstraints()) {
					params.put(createColumnVariable(column, i++), constraint.getSqlValue());
				}
			}
		} else {
			// filterDisplay="row"
			params = filters.entrySet().stream()
					.collect(Collectors.toMap(e -> checkOverride(e.getKey()), e -> e.getValue().getSqlValue()));
		}
		return params;
	}

	private String createColumnVariable(final String column, final int counter) {
		return StringUtils.remove(column, '.') + counter;
	}

	/**
	 * Filter operator either AND or OR for how to join filters.
	 */
	@RegisterForReflection
	public enum FilterOperator {
		AND,
		OR
	}

	@Data
	@NoArgsConstructor
	@RegisterForReflection
	public static class MultiSortMeta {
		@Schema(example = "lastName", description = "Sort field for this multiple sort")
		private String field;
		@Schema(example = "1", description = "Sort order for this field either -1 desc, 0 none, 1 asc")
		private int order;

		@JsonIgnore
		public Sort.Direction getSqlOrder() {
			return order == 1 ? Sort.Direction.Ascending : Sort.Direction.Descending;
		}
	}

	@Data
	@NoArgsConstructor
	@RegisterForReflection
	public static class FilterConstraint {
		@Schema(description = "Value to filter this column by")
		private Object value;
		@Schema(example = "equals", description = "Filter match mode e.g. equals, notEquals, contains, notContains, gt, gte, lt, lte")
		private String matchMode;

		@JsonIgnore
		public String getSqlClause() {
			switch (matchMode) {
			case "equals":
			case "dateIs":
				return "=";
			case "notEquals":
			case "dateIsNot":
				return "!=";
			case "notContains":
				return " not like ";
			case "gt":
			case "dateAfter":
				return ">";
			case "gte":
				return ">=";
			case "lt":
			case "dateBefore":
				return "<";
			case "lte":
				return "<=";
			default:
				return " like ";
			}
		}

		@JsonIgnore
		public Object getSqlValue() {
			final Object value = getValue();
			switch (matchMode) {
			case "contains":
			case "notContains":
				return "%" + value + "%";
			case "startsWith":
				return value + "%";
			case "endsWith":
				return "%" + value;
			case "gt":
			case "gte":
			case "lt":
			case "lte":
				// TODO: BigDecimal not supported yet
				return Integer.parseInt((String) value);
			case "dateAfter":
			case "dateBefore":
			case "dateIs":
			case "dateIsNot":
				return Instant.parse((String) value);
			default:
				return value;
			}
		}
	}

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

	@Data
	@NoArgsConstructor
	@AllArgsConstructor
	@RegisterForReflection
	public static class FilterCriteria {
		private String query;
		private Map<String, MultiFilterMeta> parameters;
	}
}
