package com.cuteslk.backend.repository;

import com.cuteslk.backend.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRepository extends JpaRepository<Item, Long> {
    @Modifying
    @Query(value = "UPDATE item_colors SET qty = qty - :change WHERE item_id = :id AND LOWER(name) = LOWER(:name)", nativeQuery = true)
    int adjustQuantityNative(@Param("id") Long id, @Param("name") String name, @Param("change") int change);

    @Modifying
    @Query(value = "UPDATE item_colors SET qty = qty + :change WHERE item_id = :id AND LOWER(name) = LOWER(:name)", nativeQuery = true)
    int restoreQuantityNative(@Param("id") Long id, @Param("name") String name, @Param("change") int change);
}
