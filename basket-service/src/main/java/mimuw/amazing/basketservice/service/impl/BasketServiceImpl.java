package mimuw.amazing.basketservice.service.impl;

import lombok.AllArgsConstructor;
import mimuw.amazing.basketservice.dto.BasketDto;
import mimuw.amazing.basketservice.entity.Basket;
import mimuw.amazing.basketservice.mapper.BasketMapper;
import mimuw.amazing.basketservice.repository.BasketRepository;
import mimuw.amazing.basketservice.service.BasketService;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class BasketServiceImpl implements BasketService {
    private final BasketRepository basketRepository;

    @Override
    public BasketDto addToBasket(BasketDto basketDto) {
        Basket basket = BasketMapper.mapToBasket(basketDto);
        Basket createdBasket = basketRepository.save(basket);
        return BasketMapper.mapToBasketDto(createdBasket);
    }

    @Override
    public void removeFromBasket(Long id) {
        basketRepository.deleteById(id);
    }

    @Override
    public List<BasketDto> getAllBaskets() {
        List<Basket> baskets = basketRepository.findAll();
        List<BasketDto> basketDtos = new ArrayList<>();
        for (Basket basket : baskets) {
            basketDtos.add(BasketMapper.mapToBasketDto(basket));
        }
        return basketDtos;
    }

    @Override
    public List<BasketDto> getBasketsByUserId(Long userId) {
        List<Basket> baskets = basketRepository.findAllByUserId(userId);
        List<BasketDto> basketDtos = new ArrayList<>();
        for (Basket basket : baskets) {
            basketDtos.add(BasketMapper.mapToBasketDto(basket));
        }
        return basketDtos;
    }
}
