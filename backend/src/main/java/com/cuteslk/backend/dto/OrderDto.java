package com.cuteslk.backend.dto;

import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    private String createdBy;
    private String packedBy;

    @NotBlank(message = "Customer name is required")
    @JsonProperty("customerName")
    private String customerName;

    @NotBlank(message = "Customer address is required")
    @JsonProperty("customerAddress")
    private String customerAddress;

    @NotBlank(message = "Primary phone number is required")
    @JsonProperty("customerPhone1")
    private String customerPhone1;

    @JsonProperty("customerPhone2")
    private String customerPhone2;
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
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    public String getPackedBy() { return packedBy; }
    public void setPackedBy(String packedBy) { this.packedBy = packedBy; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }
    public String getCustomerPhone1() { return customerPhone1; }
    public void setCustomerPhone1(String customerPhone1) { this.customerPhone1 = customerPhone1; }
    public String getCustomerPhone2() { return customerPhone2; }
    public void setCustomerPhone2(String customerPhone2) { this.customerPhone2 = customerPhone2; }
}
