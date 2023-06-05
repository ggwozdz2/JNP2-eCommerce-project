package mimuw.amazing.basketservice.controller;

import lombok.AllArgsConstructor;
import mimuw.amazing.basketservice.dto.BasketDto;
import mimuw.amazing.basketservice.dto.ProductDto;
import mimuw.amazing.basketservice.service.BasketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/baskets")
public class BasketController {
    private BasketService basketService;

    @PostMapping("/create")
    public ResponseEntity<BasketDto> addToBasket(@RequestBody BasketDto basketDto) {
        try {
            BasketDto createdBasket = basketService.addToBasket(basketDto);
            return new ResponseEntity<>(createdBasket, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> removeFromBasket(@PathVariable Long id) {
        basketService.removeFromBasket(id);
        return new ResponseEntity<>("Basket deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BasketDto>> getAllBaskets() {
        List<BasketDto> basketDtos = basketService.getAllBaskets();
        return new ResponseEntity<>(basketDtos, HttpStatus.OK);
    }

    @GetMapping("/user-basket/{userId}")
    public ResponseEntity<List<BasketDto>> getBasketsByUserId(@PathVariable Long userId) {
        List<BasketDto> basketDtos = basketService.getBasketsByUserId(userId);
        return new ResponseEntity<>(basketDtos, HttpStatus.OK);
    }

    private WebClient webClient;

    @GetMapping("/ask-for-product/{productId}")
    public ResponseEntity<String> askForProduct(@PathVariable Long productId) {
        ProductDto productDto = webClient.get()
                .uri("http://localhost:8080/api/products/get/" + productId)
                .retrieve()
                .bodyToMono(ProductDto.class)
                .block();
        if (productDto == null)
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);
        String productInfo = "Product name: " + productDto.getName() + "\n" +
                "Product description: " + productDto.getDescription() + "\n" +
                "Product price: " + productDto.getPrice();
        return new ResponseEntity<>(productInfo, HttpStatus.OK);
    }
}
