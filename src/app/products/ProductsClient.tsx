// Caminho do Arquivo: app/products/ProductsClient.tsx

'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios'; // Usaremos o axios global para chamar nossas próprias rotas de API

// A interface Product agora é definida localmente, pois não temos um arquivo central 'api.ts'
interface Product {
  id: number;
  name: string;
  price: number;
  user?: { email: string };
}

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const { logout } = useAuth();

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chama a rota de API do Next.js, não a do NestJS diretamente
      const response = await axios.post<Product>('/api/products', { name, price: parseFloat(price) });
      setProducts([response.data, ...products]);
      setName('');
      setPrice('');
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Não foi possível criar o produto.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      // Chama a rota de API do Next.js, não a do NestJS diretamente
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Não foi possível deletar o produto. Você tem permissão de Admin?");
    }
  };
      
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Dashboard de Produtos</h1>
            <button
              onClick={logout}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl p-4">
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Adicionar Novo Produto</h2>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome do produto"
              required
              className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Preço"
              step="0.01"
              required
              className="col-span-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="col-span-1 rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
            >
              Criar Produto
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
              <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">R$ {product.price}</p>
                  <p className="text-xs text-gray-400">Criado por: {product.user?.email || 'Desconhecido'}</p>
              </div>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 transition hover:bg-red-200"
              >
                Deletar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}