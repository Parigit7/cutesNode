package com.cuteslk.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class ItemDto {

    private Long id;
    private String code;
    private String title;
    private String category;
    private String categoryCode;
    private BigDecimal price;
    private String image;
    private List<ItemColorDto> colors;

    public ItemDto() {
    }

    public ItemDto(Long id, String code, String title, String category, String categoryCode, BigDecimal price, String image, List<ItemColorDto> colors) {
        this.id = id;
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

    public void setId(Long id) {
        this.id = id;
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

    public List<ItemColorDto> getColors() {
        return colors;
    }

    public void setColors(List<ItemColorDto> colors) {
        this.colors = colors;
    }
}
