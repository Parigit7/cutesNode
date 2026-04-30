package com.cuteslk.backend.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String categoryCode;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false, length = 1000)
    private String image;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "item_colors", joinColumns = @JoinColumn(name = "item_id"))
    private List<ItemColor> colors = new ArrayList<>();

    public Item() {
    }

    public Item(String code, String title, String category, String categoryCode, BigDecimal price, String image, List<ItemColor> colors) {
        this.code = code;
        this.title = title;
        this.category = category;
        this.categoryCode = categoryCode;
        this.price = price;
        this.image = image;
        this.colors = colors;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryCode() {
        return categoryCode;
    }

    public void setCategoryCode(String categoryCode) {
        this.categoryCode = categoryCode;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<ItemColor> getColors() {
        return colors;
    }

    public void setColors(List<ItemColor> colors) {
        this.colors = colors;
    }
}
