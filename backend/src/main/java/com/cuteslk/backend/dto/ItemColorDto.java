package com.cuteslk.backend.dto;

public class ItemColorDto {

    private String name;
    private Integer qty;

    public ItemColorDto() {
    }

    public ItemColorDto(String name, Integer qty) {
        this.name = name;
        this.qty = qty;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQty() {
        return qty;
    }

    public void setQty(Integer qty) {
        this.qty = qty;
    }
}
