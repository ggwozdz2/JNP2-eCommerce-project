package mimuw.amazing.basketservice.service;

import mimuw.amazing.basketservice.dto.BasketDto;

import java.io.IOException;
import java.util.List;

public interface BasketService {
    BasketDto addToBasket(BasketDto basketDto) throws IOException;

    void removeFromBasket(Long id);

    List<BasketDto> getAllBaskets();

    List<BasketDto> getBasketsByUserId(Long userId);
}
