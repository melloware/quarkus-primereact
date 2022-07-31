package com.melloware.quarkus.support;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang3.tuple.Pair;

import io.quarkus.panache.common.Sort;
import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RegisterForReflection
public class QueryRequest {

    private int first;
    private int rows;
    private int page;
    private String sortField;
    private int sortOrder;
    private List<MultiSortMeta> multiSortMeta = new ArrayList<>();
    private Map<String, MultiFilterMeta> filters = new HashMap<>();

    public boolean isSingleSort() {
        return sortField != null && sortField.length() > 0;
    }

    public boolean isMultipleSort() {
        return !getMultiSortMeta().isEmpty();
    }

    public Sort calculateSort() {
        Sort sort = null;
        if (isSingleSort()) {
            sort = Sort.by(getSortField(), getSortOrder() == 1 ? Sort.Direction.Ascending : Sort.Direction.Descending);
        }
        else if (isMultipleSort()) {
            for (QueryRequest.MultiSortMeta multiSortMeta : getMultiSortMeta()) {
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

    public Pair<String, Map<String, MultiFilterMeta>> calculateFilters(Sort sort) {
        Map<String, QueryRequest.MultiFilterMeta> filters = getFilters();
        filters.entrySet().removeIf(e -> e.getValue().getValue() == null || e.getValue().getValue().length() == 0);
        String filterQuery = filters.entrySet().stream()
            .map(entry -> entry.getKey() + entry.getValue().getSqlClause() + " :" + entry.getKey())
            .collect(Collectors.joining(" and "));

        return Pair.of(filterQuery, filters);
    }

    @Data
    @NoArgsConstructor
    @RegisterForReflection
    public static class MultiSortMeta {
        private String field;
        private int order;

        public Sort.Direction getSqlOrder() {
            return order == 1 ? Sort.Direction.Ascending : Sort.Direction.Descending;
        }
    }

    @Data
    @NoArgsConstructor
    @RegisterForReflection
    public static class MultiFilterMeta {
        private String value;
        private String matchMode;

        public String getSqlClause() {
            switch (matchMode) {
                case "equals":
                    return "=";
                case "notEquals":
                    return "!=";
                case "notContains":
                    return " not like ";
                default:
                    return " like ";
            }
        }

        public String getSqlValue() {
            switch (matchMode) {
                case "contains":
                case "notContains":
                    return "%" + value + "%";
                case "startsWith":
                    return value + "%";
                case "endsWith":
                    return "%" + value;
                default:
                    return value;
            }
        }
    }
}
