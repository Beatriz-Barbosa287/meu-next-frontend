// Caminho: app/api/products/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const NEST_API_URL = 'http://localhost:3001/products';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = request.cookies.get('authToken')?.value;
  const { id } = params;

  if (!token) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    await axios.delete(`${NEST_API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return new NextResponse(null, { status: 204 }); // Resposta de sucesso sem conteúdo
  } catch (error: any) {
    return NextResponse.json(
      { message: error.response?.data?.message || 'Erro ao deletar produto' },
      { status: error.response?.status || 500 },
    );
  }
}