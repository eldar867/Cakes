import { useState, useEffect } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    article: '',
    name: '',
    unit: 'шт.',
    price: '',
    brand_id: '',
    type_id: '',
    category_id: '',
    description: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await window.api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await window.api.updateProduct(editingProduct.id, formData);
      } else {
        await window.api.addProduct(formData);
      }
      loadProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        article: '',
        name: '',
        unit: 'шт.',
        price: '',
        brand_id: '',
        type_id: '',
        category_id: '',
        description: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить этот торт?')) {
      try {
        await window.api.deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      article: '',
      name: '',
      unit: 'шт.',
      price: '',
      brand_id: '',
      type_id: '',
      category_id: '',
      description: ''
    });
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', backgroundColor: '#FFFFFF', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: '#FC34C8' }}>Каталог тортов</h1>
      
      <button 
        onClick={() => setShowForm(true)}
        style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#31EBFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Добавить торт
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '2px solid #FC34C8', borderRadius: '10px' }}>
          <h2 style={{ color: '#31EBFF' }}>{editingProduct ? 'Редактировать торт' : 'Добавить торт'}</h2>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="text" placeholder="Артикул" value={formData.article} onChange={(e) => setFormData({...formData, article: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="text" placeholder="Название" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="text" placeholder="Ед. измерения" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="number" placeholder="Цена" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="number" placeholder="Brand ID" value={formData.brand_id} onChange={(e) => setFormData({...formData, brand_id: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="number" placeholder="Type ID" value={formData.type_id} onChange={(e) => setFormData({...formData, type_id: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <input type="number" placeholder="Category ID" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})} style={{ width: '100%', padding: '8px' }} />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <textarea placeholder="Описание" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
          </div>
          
          <button type="submit" style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#FC34C8', color: '#FFFFFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editingProduct ? 'Сохранить' : 'Добавить'}
          </button>
          <button type="button" onClick={handleCancel} style={{ padding: '8px 16px', backgroundColor: '#31EBFF', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Отмена
          </button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#FC34C8', color: '#FFFFFF' }}>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Артикул</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Название</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Цена</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Описание</th>
            <th style={{ border: '1px solid #ddd', padding: '12px' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.article}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.price} ₽</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.description}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button onClick={() => handleEdit(product)} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#31EBFF', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Изменить
                </button>
                <button onClick={() => handleDelete(product.id)} style={{ padding: '5px 10px', backgroundColor: '#FC34C8', color: '#FFFFFF', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}






















