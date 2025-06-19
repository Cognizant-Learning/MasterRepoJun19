using AutoMapper;
using InventoryAPI.Application.DTOs;
using InventoryAPI.Core.Entities;
using InventoryAPI.Core.Interfaces;

namespace InventoryAPI.Application.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto productDto);
        Task UpdateProductAsync(int id, UpdateProductDto productDto);
        Task DeleteProductAsync(int id);
        Task<InventoryStatsDto> GetInventoryStatsAsync();
    }

    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        private const int LowStockThreshold = 10;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return product == null ? null : _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto productDto)
        {
            if (await _productRepository.SkuExistsAsync(productDto.SKU))
            {
                throw new InvalidOperationException($"SKU {productDto.SKU} already exists");
            }

            var product = _mapper.Map<Product>(productDto);
            product.CreatedAt = DateTime.UtcNow;
            product.IsLowStock = product.Quantity <= LowStockThreshold;

            var createdProduct = await _productRepository.AddAsync(product);
            return _mapper.Map<ProductDto>(createdProduct);
        }

        public async Task UpdateProductAsync(int id, UpdateProductDto productDto)
        {
            var existingProduct = await _productRepository.GetByIdAsync(id);
            if (existingProduct == null)
                throw new KeyNotFoundException($"Product with ID {id} not found");

            _mapper.Map(productDto, existingProduct);
            existingProduct.UpdatedAt = DateTime.UtcNow;
            existingProduct.IsLowStock = existingProduct.Quantity <= LowStockThreshold;

            await _productRepository.UpdateAsync(existingProduct);
        }

        public async Task DeleteProductAsync(int id)
        {
            if (!await _productRepository.ExistsAsync(id))
                throw new KeyNotFoundException($"Product with ID {id} not found");

            await _productRepository.DeleteAsync(id);
        }

        public async Task<InventoryStatsDto> GetInventoryStatsAsync()
        {
            return new InventoryStatsDto
            {
                TotalProducts = await _productRepository.GetTotalProductCountAsync(),
                LowStockProducts = await _productRepository.GetLowStockCountAsync(LowStockThreshold),
                OutOfStockProducts = await _productRepository.GetOutOfStockCountAsync()
            };
        }
    }
}
