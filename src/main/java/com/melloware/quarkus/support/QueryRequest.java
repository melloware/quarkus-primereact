package com.melloware.quarkus.support;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.panache.common.Sort;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
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

	@JsonIgnore
	public boolean isSingleSort() {
		return sortField != null && sortField.length() > 0;
	}

	@JsonIgnore
	public boolean isMultipleSort() {
		return !getMultiSortMeta().isEmpty();
	}

	@JsonIgnore
	public Sort calculateSort() {
		Sort sort = null;
		if (isSingleSort()) {
			sort = Sort.by(getSortField(), getSortOrder() == 1 ? Sort.Direction.Ascending : Sort.Direction.Descending);
		}
		else if (isMultipleSort()) {
			for (final QueryRequest.MultiSortMeta multiSortMeta : getMultiSortMeta()) {
				if (sort == null) {
					sort = Sort.by(multiSortMeta.getField(), multiSortMeta.getSqlOrder());
				}
				else {
					sort.and(multiSortMeta.getField(), multiSortMeta.getSqlOrder());
				}
			}
		}
		return sort;
	}

	public Pair<String, Map<String, MultiFilterMeta>> calculateFilters(final Sort sort) {
		final Map<String, QueryRequest.MultiFilterMeta> filters = getFilters();
		filters.entrySet()
					.removeIf(e -> StringUtils.isBlank(e.getValue().getOperator()) && StringUtils.isBlank(Objects.toString(e.getValue().getValue(), null)));
		final String filterQuery = filters.entrySet().stream()
					.map(entry -> entry.getKey() + entry.getValue().getSqlClause() + " :" + entry.getKey())
					.collect(Collectors.joining(" and "));

		return Pair.of(filterQuery, filters);
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
			switch (getMatchMode()) {
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
			Object value = getValue();
			switch (getMatchMode()) {
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
	@RegisterForReflection
	public static class MultiFilterMeta extends FilterConstraint {

		@Schema(description = "Filter operator either 'and' or 'or'")
		private String operator;

		@Schema(description = "List of filter constraints for this filter")
		private List<FilterConstraint> constraints = new ArrayList<>();

	}
}
