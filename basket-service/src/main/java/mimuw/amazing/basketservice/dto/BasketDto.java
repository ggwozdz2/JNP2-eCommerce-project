package mimuw.amazing.basketservice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BasketDto {
    private Long id;
    private Long userId;
    private Long productId;
//    private Long quantity;
//    private Double price;
}