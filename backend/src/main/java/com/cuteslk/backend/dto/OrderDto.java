package com.cuteslk.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class OrderDto {
    private String orderId;
    private String packingType;
    private BigDecimal boxPrice;
    private LocalDate requiredDate;
    private String message;
    private String status;
    private String courierName;
    private String courierNumber;
    private List<OrderItemDto> orderItems;

    public OrderDto() {}

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getPackingType() { return packingType; }
    public void setPackingType(String packingType) { this.packingType = packingType; }
    public BigDecimal getBoxPrice() { return boxPrice; }
    public void setBoxPrice(BigDecimal boxPrice) { this.boxPrice = boxPrice; }
    public LocalDate getRequiredDate() { return requiredDate; }
    public void setRequiredDate(LocalDate requiredDate) { this.requiredDate = requiredDate; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCourierName() { return courierName; }
    public void setCourierName(String courierName) { this.courierName = courierName; }
    public String getCourierNumber() { return courierNumber; }
    public void setCourierNumber(String courierNumber) { this.courierNumber = courierNumber; }
    public List<OrderItemDto> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDto> orderItems) { this.orderItems = orderItems; }
}
