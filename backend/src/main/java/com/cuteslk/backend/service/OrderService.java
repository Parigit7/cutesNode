package com.cuteslk.backend.service;

import com.cuteslk.backend.dto.OrderDto;
import com.cuteslk.backend.dto.OrderItemDto;
import com.cuteslk.backend.model.Item;
import com.cuteslk.backend.model.Order;
import com.cuteslk.backend.model.OrderItem;
import com.cuteslk.backend.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ItemService itemService;

    public OrderService(OrderRepository orderRepository, ItemService itemService) {
        this.orderRepository = orderRepository;
        this.itemService = itemService;
    }

    public Order createOrder(OrderDto dto, String username) {
        Order order = new Order();
        order.setOrderId(dto.getOrderId());
        order.setPackingType(dto.getPackingType());
        order.setBoxPrice(dto.getBoxPrice());
        order.setRequiredDate(dto.getRequiredDate());
        order.setMessage(dto.getMessage());
        order.setCreatedBy(username);
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerAddress(dto.getCustomerAddress());
        order.setCustomerPhone1(dto.getCustomerPhone1());
        order.setCustomerPhone2(dto.getCustomerPhone2());

        List<OrderItem> items = new ArrayList<>();
        for (OrderItemDto itemDto : dto.getOrderItems()) {
            Item updatedItem = itemService.adjustQuantity(itemDto.getItemId(), itemDto.getColor(), itemDto.getQuantity());
            items.add(new OrderItem(order, updatedItem, itemDto.getColor(), itemDto.getQuantity(), itemDto.getTotalPrice()));
        }
        order.setOrderItems(items);

        return orderRepository.save(order);
    }

    public Order updateOrder(Order existing, OrderDto dto) {
        // 1. Restore old quantities
        for (OrderItem oldItem : existing.getOrderItems()) {
            itemService.restoreQuantity(oldItem.getItem().getId(), oldItem.getColor(), oldItem.getQuantity());
        }

        // 2. Update basic fields
        existing.setPackingType(dto.getPackingType());
        existing.setBoxPrice(dto.getBoxPrice());
        existing.setRequiredDate(dto.getRequiredDate());
        existing.setMessage(dto.getMessage());
        existing.setCustomerName(dto.getCustomerName());
        existing.setCustomerAddress(dto.getCustomerAddress());
        existing.setCustomerPhone1(dto.getCustomerPhone1());
        existing.setCustomerPhone2(dto.getCustomerPhone2());
        
        if (dto.getStatus() != null) {
            existing.setStatus(dto.getStatus());
        }

        // 3. Clear and add new items with adjusted quantities
        existing.getOrderItems().clear();
        for (OrderItemDto itemDto : dto.getOrderItems()) {
            Item updatedItem = itemService.adjustQuantity(itemDto.getItemId(), itemDto.getColor(), itemDto.getQuantity());
            existing.addOrderItem(new OrderItem(existing, updatedItem, itemDto.getColor(), itemDto.getQuantity(), itemDto.getTotalPrice()));
        }

        return orderRepository.save(existing);
    }

    public void deleteOrder(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            itemService.restoreQuantity(item.getItem().getId(), item.getColor(), item.getQuantity());
        }
        orderRepository.delete(order);
    }
}
