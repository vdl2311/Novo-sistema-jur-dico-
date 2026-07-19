export const dynamic = 'force-dynamic';

import ZAI from 'z-ai-web-dev-sdk'

// POST /api/ai-jurisprudencia - Sugestão de jurisprudência
export async function POST(req: Request) {
  const body = await req.json()
  const tema: string = (body.tema || '').trim()
  const area = body.area || 'Geral'

  if (!tema) {
    return Response.json({ error: 'Tema é obrigatório' }, { status: 400 })
  }

  const prompt = `Você é um advogado brasileiro especialista em pesquisa jurisprudencial. Para o tema "${tema}" na área ${area}, forneça:

1. **TESSES JURISPRUDENCIAIS RELEVANTES** (pelo menos 3 teses principais)
2. **SÚMULAS APLICÁVEIS** (STJ, STF, TST quando relevantes)
3. **PRECEDENTES IMPORTANTES** (cite casos paradigmáticos, sem inventar números)
4. **POSICIONAMENTO ATUAL** dos tribunais superiores sobre o tema
5. **ARGUMENTOS FAVORÁVEIS** que podem ser usados em petições
6. **ARGUMENTOS CONTRÁRIOS** (para antecipar a contestação da parte contrária)
7. **RECOMENDAÇÕES** de como usar essa jurisprudência na petição

⚠️ IMPORTANTE: Não invente números de recursos ou datas específicas. Use expressões como "Tema X do STJ", "Súmula Y", "Jurisprudência consolidada do STJ", "Posicionamento do TST", etc. Indique que o advogado deve validar em fontes oficiais (STJ, JusBrasil, TST).

Responda em português brasileiro, formato Markdown.`

  try {
    const zai = await ZAI.create()
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: prompt },
        { role: 'user', content: `Forneça sugestões de jurisprudência para: ${tema}` },
      ],
      thinking: { type: 'disabled' },
      temperature: 0.4,
      max_tokens: 2500,
    })

    const jurisprudencia = completion.choices[0]?.message?.content || ''

    return Response.json({
      tema,
      area,
      jurisprudencia,
      geradoEm: new Date().toISOString(),
      aviso: 'Sempre valide as teses em fontes oficiais (STJ, STF, TST) antes de usar em petições.',
    })
  } catch (error) {
    console.error('Erro IA jurisprudência:', error)
    return Response.json(
      { error: 'Erro ao sugerir jurisprudência', jurisprudencia: '' },
      { status: 500 }
    )
  }
}
