package com.cuteslk.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ItemColor {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer qty;

    public ItemColor() {
    }

    public ItemColor(String name, Integer qty) {
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
