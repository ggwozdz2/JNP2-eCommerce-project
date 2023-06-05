package mimuw.amazing.productservice.service;

import mimuw.amazing.productservice.dto.ProductDto;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDto createProduct(ProductDto productDto) throws IOException;

    void deleteProduct(Long id);

    ProductDto getProduct(Long id);

    List<ProductDto> getAllProducts();
}
