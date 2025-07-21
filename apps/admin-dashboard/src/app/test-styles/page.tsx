'use client'

export default function TestStylesPage() {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '16px' }}>
        Teste de Estilos (Inline)
      </h1>
      
      <div className="p-8 bg-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Teste Tailwind</h2>
        <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
          Este deve ser um fundo vermelho com texto branco
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
          Este deve ser um fundo verde com texto branco
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-lg">
          Este deve ser um fundo azul com texto branco
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-200 p-4 rounded">Grid 1</div>
          <div className="bg-gray-300 p-4 rounded">Grid 2</div>
          <div className="bg-gray-400 p-4 rounded">Grid 3</div>
        </div>
      </div>
      
      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <p>Se você vê cores e estilos acima, o Tailwind está funcionando!</p>
        <p>Se não vê, há um problema na configuração do Tailwind.</p>
      </div>
    </div>
  )
}