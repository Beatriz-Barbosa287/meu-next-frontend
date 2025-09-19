// Caminho: app/api/products/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const NEST_API_URL = 'http://localhost:3001/products';

export async function POST(request: NextRequest) {
  // 1. Pegar o token do cookie da requisição que chega
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // 2. Fazer a chamada para a API NestJS, repassando o token
    const response = await axios.post(NEST_API_URL, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3. Retornar a resposta da API NestJS para o nosso componente cliente
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Erro ao criar produto' },
      { status: error.response?.status || 500 },
    );
  }
}