package com.melloware.quarkus.support;

import java.util.List;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@RegisterForReflection
public class QueryResponse<T> {

    private long totalRecords;
    private List<T> records;
}
