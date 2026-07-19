export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// POST /api/ai-revisao - Revisão jurídica de textos
export async function POST(req: NextRequest) {
  const body = await req.json()
  const texto: string = (body.texto || '').trim()

  if (!texto) {
    return NextResponse.json({ error: 'Texto é obrigatório' }, { status: 400 })
  }

  const prompt = `Você é um revisor jurídico brasileiro especializado. Revise o texto jurídico abaixo e forneça:

1. **Correções gramaticais e ortográficas** (liste cada correção)
2. **Sugestões de melhoria de clareza e estilo jurídico**
3. **Vocabulário jurídico** (termos que poderiam ser mais técnicos/precisos)
4. **Problemas de argumentação** (lacunas, falhas lógicas, inconsistências)
5. **Citações legais** (verifique se há necessidade de citar leis/jurisprudência)
6. **Pontuação e formatação** (parágrafos, sessões, hierarquia)
7. **SCORE final** (0-100) indicando a qualidade do texto
8. **Versão revisada** (texto completo com todas as correções aplicadas)

TEXTO PARA REVISÃO:
---
${texto}
---

Responda em português brasileiro, formato Markdown estruturado.`

  try {
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: prompt },
        { role: 'user', content: 'Revise o texto jurídico fornecido.' },
      ],
      thinking: { type: 'disabled' },
      temperature: 0.3,
      max_tokens: 3000,
    })

    const revisao = completion.choices[0]?.message?.content || ''

    return NextResponse.json({
      revisao,
      geradoEm: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Erro IA revisão:', error)
    return NextResponse.json(
      { error: 'Erro ao processar revisão', revisao: '' },
      { status: 500 }
    )
  }
}
