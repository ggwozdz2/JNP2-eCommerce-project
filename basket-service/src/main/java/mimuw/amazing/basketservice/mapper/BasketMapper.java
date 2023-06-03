package mimuw.amazing.basketservice.mapper;

import mimuw.amazing.basketservice.dto.BasketDto;
import mimuw.amazing.basketservice.entity.Basket;

public class BasketMapper {
    public static BasketDto mapToBasketDto(Basket basket) {
        return new BasketDto(
                basket.getId(),
                basket.getUserId(),
                basket.getProductId()
//                basket.getQuantity(),
//                basket.getPrice()
        );
    }

    public static Basket mapToBasket(BasketDto basketDto) {
        return new Basket(
                basketDto.getId(),
                basketDto.getUserId(),
                basketDto.getProductId()
//                basketDto.getQuantity(),
//                basketDto.getPrice()
        );
    }
}