package mimuw.amazing.productservice.service.impl;

import lombok.AllArgsConstructor;
import mimuw.amazing.productservice.dto.ProductDto;
import mimuw.amazing.productservice.entity.Product;
import mimuw.amazing.productservice.mapper.ProductMapper;
import mimuw.amazing.productservice.repository.ProductRepository;
import mimuw.amazing.productservice.service.ProductService;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public ProductDto createProduct(ProductDto productDto) {
        Product product = ProductMapper.mapToProduct(productDto);
        Product savedProduct = productRepository.save(product);
        return ProductMapper.mapToProductDto(savedProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public ProductDto getProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null)
            return null;
        return ProductMapper.mapToProductDto(product);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        List<ProductDto> productDtos = new ArrayList<>();
        for (Product product : products) {
            productDtos.add(ProductMapper.mapToProductDto(product));
        }
        return productDtos;
    }
}
