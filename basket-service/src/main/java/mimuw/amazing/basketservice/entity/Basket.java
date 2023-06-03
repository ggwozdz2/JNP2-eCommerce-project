package mimuw.amazing.basketservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "amazing_basket")
public class Basket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;        // We have to know which user owns the basket

    @Column(nullable = false)
    private Long productId;     // We have to know which product is in the basket

//    @Column(nullable = false)
//    private Long quantity;      // We have to know how many products of this type are in the basket
//
//    @Column(nullable = false)
//    private Double price;       // We have to know the price of the product in the basket
//                                // (to not have to ask for it every time)
}
