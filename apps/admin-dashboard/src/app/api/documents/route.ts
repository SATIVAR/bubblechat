import { NextResponse } from 'next/server'
import { prisma } from '@bubblechat/database'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const clientId = searchParams.get('clientId')

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    if (status) where.status = status
    if (clientId) where.clientId = clientId

    // Buscar documentos com paginação
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: limit,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              company: true
            }
          },
          _count: {
            select: {
              budgets: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.document.count({ where })
    ])

    // Adicionar estatísticas de processamento
    const documentsWithStats = documents.map(doc => ({
      ...doc,
      stats: {
        budgetsGenerated: doc._count.budgets,
        processingTimeFormatted: doc.processingTime 
          ? `${(doc.processingTime / 1000).toFixed(2)}s`
          : null,
        confidencePercentage: doc.confidence 
          ? `${(doc.confidence * 100).toFixed(1)}%`
          : null,
        sizeFormatted: formatFileSize(doc.size)
      }
    }))

    return NextResponse.json({
      documents: documentsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string

    if (!file || !clientId) {
      return NextResponse.json(
        { error: 'Arquivo e ID do cliente são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/tiff', 'image/bmp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não suportado' },
        { status: 400 }
      )
    }

    // Validar tamanho (50MB max)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 50MB' },
        { status: 400 }
      )
    }

    // Criar registro no banco
    const document = await prisma.document.create({
      data: {
        fileName: `${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        status: 'PROCESSING',
        clientId,
        metadata: {
          uploadedAt: new Date().toISOString(),
          originalSize: file.size
        }
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // TODO: Aqui você integraria com o sistema de processamento de documentos
    // Por enquanto, vamos simular o processamento
    setTimeout(async () => {
      try {
        await prisma.document.update({
          where: { id: document.id },
          data: {
            status: 'COMPLETED',
            extractedText: `Texto extraído simulado do arquivo ${file.name}`,
            confidence: 0.95,
            processingTime: Math.floor(Math.random() * 5000) + 1000
          }
        })
      } catch (error) {
        console.error('Erro ao atualizar documento:', error)
      }
    }, 2000)

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Erro ao fazer upload do documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}