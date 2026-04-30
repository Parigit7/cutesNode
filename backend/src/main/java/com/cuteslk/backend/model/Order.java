package com.cuteslk.backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(name = "order_id", unique = true, nullable = false)
    private String orderId;

    @Column(nullable = false)
    private String packingType;

    private BigDecimal boxPrice;

    @Column(nullable = false)
    private LocalDate requiredDate;

    private String message;

    @Column(nullable = false)
    private String status;

    private String courierName;
    private String courierNumber;
    private String createdBy;
    private String packedBy;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_address", nullable = false)
    private String customerAddress;

    @Column(name = "customer_phone1", nullable = false)
    private String customerPhone1;

    @Column(name = "customer_phone2")
    private String customerPhone2;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {
        this.status = "PENDING";
    }

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
    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }
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

    public void addOrderItem(OrderItem item) {
        orderItems.add(item);
        item.setOrder(this);
    }

    public void removeOrderItem(OrderItem item) {
        orderItems.remove(item);
        item.setOrder(null);
    }
}
