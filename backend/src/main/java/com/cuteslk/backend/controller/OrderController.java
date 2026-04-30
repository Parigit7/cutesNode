package com.cuteslk.backend.controller;

import com.cuteslk.backend.dto.OrderDto;
import com.cuteslk.backend.dto.OrderItemDto;
import com.cuteslk.backend.model.Item;
import com.cuteslk.backend.model.Order;
import com.cuteslk.backend.model.OrderItem;
import com.cuteslk.backend.repository.OrderRepository;
import com.cuteslk.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ItemService itemService;

    public OrderController(OrderRepository orderRepository, ItemService itemService) {
        this.orderRepository = orderRepository;
        this.itemService = itemService;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @PreAuthorize("hasAnyRole('SALES_MANAGEMENT', 'ADMIN')")
    @Transactional
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@Validated @RequestBody OrderDto dto, Principal principal) {
        if (orderRepository.existsById(dto.getOrderId())) {
            throw new ResponseStatusException(BAD_REQUEST, "Order ID already exists");
        }

        Order order = new Order();
        order.setOrderId(dto.getOrderId());
        order.setPackingType(dto.getPackingType());
        order.setBoxPrice(dto.getBoxPrice());
        order.setRequiredDate(dto.getRequiredDate());
        order.setMessage(dto.getMessage());
        order.setCreatedBy(principal.getName());
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerAddress(dto.getCustomerAddress());
        order.setCustomerPhone1(dto.getCustomerPhone1());
        order.setCustomerPhone2(dto.getCustomerPhone2());
        // Status defaults to PENDING in constructor

        List<OrderItem> items = dto.getOrderItems().stream().map(itemDto -> {
            Item item = itemService.findById(itemDto.getItemId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not found with id: " + itemDto.getItemId()));
            return new OrderItem(order, item, itemDto.getColor(), itemDto.getQuantity(), itemDto.getTotalPrice());
        }).collect(Collectors.toList());

        order.setOrderItems(items);

        Order saved = orderRepository.save(order);
        return ResponseEntity.ok(toDto(saved));
    }

    @PreAuthorize("hasAnyRole('SALES_MANAGEMENT', 'ADMIN')")
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable("id") String id, @Validated @RequestBody OrderDto dto) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));

        if (!existing.getStatus().equals("PENDING") && !dto.getStatus().equals(existing.getStatus())) {
            // Only admins can change status from pending to packed/send, check later or handle carefully
        }

        existing.setPackingType(dto.getPackingType());
        existing.setBoxPrice(dto.getBoxPrice());
        existing.setRequiredDate(dto.getRequiredDate());
        existing.setMessage(dto.getMessage());
        existing.setCustomerName(dto.getCustomerName());
        existing.setCustomerAddress(dto.getCustomerAddress());
        existing.setCustomerPhone1(dto.getCustomerPhone1());
        existing.setCustomerPhone2(dto.getCustomerPhone2());
        
        // Update items
        existing.getOrderItems().clear();
        for (OrderItemDto itemDto : dto.getOrderItems()) {
            Item item = itemService.findById(itemDto.getItemId())
                    .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Item not found with id: " + itemDto.getItemId()));
            existing.addOrderItem(new OrderItem(existing, item, itemDto.getColor(), itemDto.getQuantity(), itemDto.getTotalPrice()));
        }

        Order saved = orderRepository.save(existing);
        return ResponseEntity.ok(toDto(saved));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'PACKAGE')")
    @Transactional
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable("id") String id, @RequestBody java.util.Map<String, String> body, Principal principal) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));
        
        String newStatus = body.get("status");
        if (newStatus != null) {
            existing.setStatus(newStatus.toUpperCase());
            if (newStatus.equalsIgnoreCase("PACKED") || newStatus.equalsIgnoreCase("SEND")) {
                existing.setPackedBy(principal.getName());
            }
        }
        
        String courierName = body.get("courierName");
        if (courierName != null) {
            existing.setCourierName(courierName);
        }
        
        String courierNumber = body.get("courierNumber");
        if (courierNumber != null) {
            existing.setCourierNumber(courierNumber);
        }

        Order saved = orderRepository.save(existing);
        return ResponseEntity.ok(toDto(saved));
    }

    @PreAuthorize("hasAnyRole('SALES_MANAGEMENT', 'ADMIN')")
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") String id) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Order not found"));
                
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private OrderDto toDto(Order order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getOrderId());
        dto.setPackingType(order.getPackingType());
        dto.setBoxPrice(order.getBoxPrice());
        dto.setRequiredDate(order.getRequiredDate());
        dto.setMessage(order.getMessage());
        dto.setStatus(order.getStatus());
        dto.setCourierName(order.getCourierName());
        dto.setCourierNumber(order.getCourierNumber());
        dto.setCreatedBy(order.getCreatedBy());
        dto.setPackedBy(order.getPackedBy());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerAddress(order.getCustomerAddress());
        dto.setCustomerPhone1(order.getCustomerPhone1());
        dto.setCustomerPhone2(order.getCustomerPhone2());
        dto.setOrderItems(order.getOrderItems().stream().map(this::toItemDto).collect(Collectors.toList()));
        return dto;
    }

    private OrderItemDto toItemDto(OrderItem item) {
        OrderItemDto dto = new OrderItemDto();
        dto.setId(item.getId());
        dto.setItemId(item.getItem().getId());
        dto.setItemCode(item.getItem().getCode());
        dto.setItemTitle(item.getItem().getTitle());
        dto.setItemImage(item.getItem().getImage());
        dto.setColor(item.getColor());
        dto.setQuantity(item.getQuantity());
        dto.setTotalPrice(item.getTotalPrice());
        return dto;
    }
}
