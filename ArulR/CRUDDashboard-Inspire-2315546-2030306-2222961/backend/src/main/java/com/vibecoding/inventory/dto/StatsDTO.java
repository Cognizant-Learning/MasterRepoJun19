package com.vibecoding.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private Long totalUniqueItems;
    private Long lowStockItems;
    private Long outOfStockItems;
}
