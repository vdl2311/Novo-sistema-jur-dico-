"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InviteData {
  name: string;
  email: string;
  role: string;
  permissions: string;
  oab?: string;
  twoFactorEnabled?: boolean;
}

export function useTeamInvite() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const inviteMember = async (data: InviteData) => {
    console.log("[useTeamInvite:inviteMember] Initiating invite member process. Payload:", data);
    setLoading(true);
    try {
      console.log("[useTeamInvite:inviteMember] Calling /api/team POST...");
      
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          role: data.role,
          permissions: data.permissions,
          oab: data.oab,
          twoFactorEnabled: data.twoFactorEnabled,
        })
      });

      if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Failed to create user: ${errorText}`);
      }
      
      const result = await response.json();
      const userId = result.userId || result.id;

      console.log("[useTeamInvite:inviteMember] User created successfully. Returned userId:", userId);
      toast({
        title: "Usuário convidado!",
        description: `${data.name} foi adicionado com sucesso.`,
      });

      return userId;
    } catch (error: any) {
      console.error("[useTeamInvite:inviteMember] Error inviting member:", error);
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
