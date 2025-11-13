import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PatternForm } from '@/components/PatternForm';
import { PatternList } from '@/components/PatternList';
import { ArrowLeft, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { OperationPattern, PasswordRules } from '@/types/supabase';
import { toast } from 'sonner';

interface PatternFormData {
  operationName: string;
  length: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  allowedSpecialChars: string;
}

const Dashboard = () => {
  const [patterns, setPatterns] = useState<OperationPattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<OperationPattern | null>(null);

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const { data, error } = await supabase
        .from('operation_patterns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatterns(data || []);
    } catch (error) {
      console.error('Erro ao carregar padrões:', error);
      toast.error('Erro ao carregar padrões');
    }
  };

  const handleSubmit = async (formData: PatternFormData) => {
    try {
      const passwordRules: PasswordRules = {
        length: formData.length,
        requireUppercase: formData.requireUppercase,
        requireLowercase: formData.requireLowercase,
        requireNumber: formData.requireNumber,
        requireSpecial: formData.requireSpecial,
        allowedSpecialChars: formData.allowedSpecialChars,
      };

      if (selectedPattern) {
        // Atualizar padrão existente
        const { error } = await supabase
          .from('operation_patterns')
          .update({
            operation_name: formData.operationName,
            password_rules: passwordRules,
          })
          .eq('id', selectedPattern.id);

        if (error) throw error;
        toast.success('Padrão atualizado com sucesso!');
      } else {
        // Criar novo padrão
        const { error } = await supabase
          .from('operation_patterns')
          .insert({
            operation_name: formData.operationName,
            password_rules: passwordRules,
          });

        if (error) throw error;
        toast.success('Padrão criado com sucesso!');
      }

      setSelectedPattern(null);
      fetchPatterns();
    } catch (error) {
      console.error('Erro ao salvar padrão:', error);
      toast.error('Erro ao salvar padrão');
    }
  };

  const handleEdit = (pattern: OperationPattern) => {
    setSelectedPattern(pattern);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('operation_patterns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Padrão excluído com sucesso!');
      fetchPatterns();
    } catch (error) {
      console.error('Erro ao excluir padrão:', error);
      toast.error('Erro ao excluir padrão');
    }
  };

  const handleCancel = () => {
    setSelectedPattern(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="gap-2 mb-6">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Gerador
            </Button>
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl shadow-md">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard de Gerenciamento</h1>
              <p className="text-muted-foreground">
                Gerencie seus padrões de senha
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <PatternForm
              selectedPattern={selectedPattern}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Padrões Cadastrados</h2>
              <p className="text-muted-foreground mb-6">
                Clique em editar para modificar ou em excluir para remover.
              </p>
            </div>
            <PatternList
              patterns={patterns}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
