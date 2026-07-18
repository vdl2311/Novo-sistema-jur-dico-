import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/auth/login - Login simples (simulação)
export async function POST(req: NextRequest) {
  const { email, password, twoFactorCode } = await req.json()

  let user = await db.user.findUnique({ where: { email } })
  
  if (!user && email === 'vidal2311usa@gmail.com') {
    user = await db.user.create({
      data: {
        name: 'Administrador (Vidal)',
        email: 'vidal2311usa@gmail.com',
        password: '123456',
        role: 'Admin',
        permissions: 'all',
        twoFactorEnabled: false
      }
    })
  }

  if (!user) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
  }

  if (password !== 'demo123' && password !== '123456' && password !== user.password) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  if (user.twoFactorEnabled && twoFactorCode !== '123456') {
    return NextResponse.json({
      requires2FA: true,
      message: 'Código 2FA enviado para seu e-mail. Use 123456 para demo.',
    }, { status: 200 })
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  })

  await db.auditLog.create({
    data: {
      user: user.name,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      details: `Login realizado por ${user.email}`,
    },
  })

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      oab: user.oab,
      permissions: user.permissions,
      twoFactorEnabled: user.twoFactorEnabled,
    },
  })
}
