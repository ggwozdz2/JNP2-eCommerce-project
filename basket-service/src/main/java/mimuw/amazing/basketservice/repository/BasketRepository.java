package mimuw.amazing.basketservice.repository;

import mimuw.amazing.basketservice.entity.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BasketRepository extends JpaRepository<Basket, Long> {
    @Query("SELECT b FROM Basket b WHERE b.userId = ?1")
    List<Basket> findAllByUserId(Long userId);
}