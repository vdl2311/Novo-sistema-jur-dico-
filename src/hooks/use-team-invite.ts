"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InviteData {
  name: string;
  email: string;
  role: string;
  permissions: string;
}

export function useTeamInvite() {
  const [loading, setLoading] = useState(false);
  const createUserInConvex = useMutation(api.users.createUser);
  const { toast } = useToast();

  const inviteMember = async (data: InviteData) => {
    setLoading(true);
    try {
      // 1. Aqui você normalmente enviaria um e-mail de convite.
      // Para consistência imediata (conforme pedido), criamos o registro no Convex agora.
      // O campo 'externalId' será preenchido quando o usuário fizer o primeiro login via Firebase Auth.
      
      const userId = await createUserInConvex({
        name: data.name,
        email: data.email,
        role: data.role,
        permissions: data.permissions,
      });

      toast({
        title: "Usuário convidado!",
        description: `${data.name} foi adicionado à base do Convex com sucesso.`,
      });

      return userId;
    } catch (error: any) {
      console.error("Erro ao convidar membro:", error);
      toast({
        title: "Erro ao convidar",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { inviteMember, loading };
}
