interface Props {
  products: any[]
  isMobile: boolean
  newProduct: string
  setNewProduct: (v: string) => void
  newPrice: string
  setNewPrice: (v: string) => void
  addProduct: () => void
  deleteProduct: (id: number) => void
}

export default function ProductsPanel({
  products,
  isMobile,
  newProduct,
  setNewProduct,
  newPrice,
  setNewPrice,
  addProduct,
  deleteProduct
}: Props) {

  return (
    <div>
      {isMobile && (
        <h2 className="page-title-mobile">Ürünler</h2>
      )}

      {/* Form */}
      <div className="add-product-form">
        <h3 className="form-heading">
          <span>➕</span> Yeni Ürün Ekle
        </h3>

        <div className={`form-row ${isMobile ? 'mobile' : ''}`}>
          <input
            type="text"
            placeholder="Ürün adı..."
            value={newProduct}
            onChange={(e) => setNewProduct(e.target.value)}
            className="product-name-input"
          />

          <div className="price-add-row">
            <div className="price-input-wrapper">
              <span className="price-symbol">₺</span>
              <input
                type="number"
                placeholder="Fiyat"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="price-input"
              />
            </div>

            <button
              onClick={addProduct}
              disabled={!newProduct.trim() || !newPrice}
              className={`add-btn ${(!newProduct.trim() || !newPrice) ? 'disabled' : ''}`}
            >
              {isMobile ? "+" : "+ Ekle"}
            </button>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className={`products-grid ${isMobile ? 'mobile' : ''}`}>
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-info">
              <div className="product-icon">☕</div>
              <div>
                <p className="product-name">{product.name}</p>
                <p className="product-price">₺{product.price}</p>
              </div>
            </div>

            <button
              onClick={() => deleteProduct(product.id)}
              className="delete-product-btn"
            >
              🗑️
            </button>
          </div>
        ))}

        {products.length === 0 && (
          <div className="empty-state large">
            <p className="empty-icon">📦</p>
            <p>Henüz ürün eklenmemiş</p>
          </div>
        )}
      </div>
    </div>
  )
}