export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminAuth, isFirebaseAdminAvailable } from '@/lib/firebase-admin'

// GET /api/team
export async function GET() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      oab: true,
      permissions: true,
      twoFactorEnabled: true,
      lastLogin: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}

// POST /api/team
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    let firebaseUser;
    
    if (!isFirebaseAdminAvailable || !adminAuth) {
      console.warn("Firebase Admin is not available or disabled. Creating fallback Firestore-only user.");
      try {
        const existing = await db.user.findFirst({ where: { email: body.email } })
        if (existing) {
          firebaseUser = { uid: existing.id }
        } else {
          firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` }
        }
      } catch (dbErr) {
        firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` }
      }
    } else {
      try {
        firebaseUser = await adminAuth.createUser({
          email: body.email,
          password: 'demo123', // Senha padrão informada no modal
          displayName: body.name,
        })
      } catch (err: any) {
        const errorMsg = String(err.message || err).toLowerCase();
        const isApiDisabled = errorMsg.includes('identitytoolkit') || 
                             errorMsg.includes('api') || 
                             errorMsg.includes('disabled') || 
                             errorMsg.includes('overview') || 
                             errorMsg.includes('permission');
                             
        if (err.code === 'auth/email-already-exists') {
          try {
            firebaseUser = await adminAuth.getUserByEmail(body.email)
          } catch (getErr: any) {
            return NextResponse.json({ error: `Erro ao obter usuário existente no Firebase: ${getErr.message}` }, { status: 400 })
          }
        } else if (isApiDisabled) {
          console.warn("Firebase Auth Identity Toolkit API not enabled/available. Creating fallback Firestore-only user.");
          try {
            const existing = await db.user.findFirst({ where: { email: body.email } })
            if (existing) {
              firebaseUser = { uid: existing.id }
            } else {
              firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` }
            }
          } catch (dbErr) {
            firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` }
          }
        } else {
          return NextResponse.json({ error: `Erro ao criar usuário no Firebase Auth: ${err.message}` }, { status: 400 })
        }
      }
    }

    const user = await db.user.create({
      data: {
        id: firebaseUser.uid, // Sincroniza o id no Firestore com o UID do Firebase Auth (ou UID fallback)
        email: body.email,
        password: 'firebase-auth-managed',
        name: body.name,
        role: body.role || 'Advogado',
        oab: body.oab || null,
        permissions: body.permissions || ['ALL'],
        twoFactorEnabled: body.twoFactorEnabled || false,
      },
    })

    await db.auditLog.create({
      data: {
        user: 'Sistema',
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        details: `Usuário convidado e criado: ${user.name} (${user.role})`,
      },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (err: any) {
    console.error("Erro ao convidar usuário (POST /api/team):", err);
    return NextResponse.json({ 
      error: `Erro no servidor ao convidar usuário: ${err.message || err}`,
      stack: err.stack 
    }, { status: 500 })
  }
}

// PATCH /api/team?id=xxx
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    const body = await req.json()

    // Sincroniza e-mail ou nome alterados com o Firebase Auth
    if (isFirebaseAdminAvailable && adminAuth && !id.startsWith('fallback_')) {
      try {
        const updateParams: any = {}
        if (body.email) updateParams.email = body.email
        if (body.name) updateParams.displayName = body.name
        
        if (Object.keys(updateParams).length > 0) {
          await adminAuth.updateUser(id, updateParams)
        }
      } catch (err) {
        console.error("Erro ao atualizar e-mail/nome no Firebase Auth:", err)
      }
    }

    const allowedFields: Record<string, unknown> = {}
    for (const f of ['name', 'email', 'role', 'oab', 'permissions']) {
      if (body[f] !== undefined) allowedFields[f] = body[f]
    }
    if (body.twoFactorEnabled !== undefined) {
      allowedFields.twoFactorEnabled = Boolean(body.twoFactorEnabled)
    }
    const updated = await db.user.update({
      where: { id },
      data: allowedFields,
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    console.error("Erro ao atualizar usuário (PATCH /api/team):", err);
    return NextResponse.json({ error: `Erro no servidor ao atualizar usuário: ${err.message || err}` }, { status: 500 })
  }
}

// DELETE /api/team?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
    
    // Deleta o usuário do Firebase Auth
    if (isFirebaseAdminAvailable && adminAuth && !id.startsWith('fallback_')) {
      try {
        await adminAuth.deleteUser(id)
      } catch (err) {
        console.error("Erro ao deletar usuário no Firebase Auth:", err)
      }
    }

    await db.user.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error("Erro ao deletar usuário (DELETE /api/team):", err);
    return NextResponse.json({ error: `Erro no servidor ao deletar usuário: ${err.message || err}` }, { status: 500 })
  }
}
