package mimuw.amazing.productservice.service;

import mimuw.amazing.productservice.entity.Product;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    Product createProduct(Product product) throws IOException;

    void deleteProduct(Long id);

    Product getProduct(Long id);

    List<Product> getAllProducts();
}
