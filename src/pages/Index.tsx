import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PasswordDisplay } from '@/components/PasswordDisplay';
import { Settings, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { generatePassword } from '@/lib/password-generator';
import type { OperationPattern } from '@/types/supabase';
import { toast } from 'sonner';

const Index = () => {
  const [patterns, setPatterns] = useState<OperationPattern[]>([]);
  const [selectedPatternId, setSelectedPatternId] = useState<string>('');
  const [generatedPassword, setGeneratedPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
      toast.error('Erro ao carregar padrões de senha');
    }
  };

  const handleGeneratePassword = () => {
    if (!selectedPatternId) {
      toast.error('Selecione uma operação primeiro');
      return;
    }

    setLoading(true);
    const pattern = patterns.find((p) => p.id === selectedPatternId);
    
    if (pattern) {
      const password = generatePassword(pattern.password_rules);
      setGeneratedPassword(password);
      toast.success('Senha gerada com sucesso!');
    }
    
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* LOGO ADICIONADO AQUI */}
          <img
            src="/New-Atos-logo-blue-RGB.png"
            alt="Logo New Atos"
            className="mx-auto mb-6 h-auto w-48" // Centraliza (mx-auto) e define uma largura (w-48). Ajuste se necessário.
          />
          
          <h1 className="text-4xl font-bold mb-3 bg-gradient-primary bg-clip-text text-transparent">
            Gerador de Senha por Operação
          </h1>
          <p className="text-muted-foreground text-lg">
            Gere senhas seguras baseadas em padrões pré-definidos
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-xl shadow-md p-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="operation" className="text-base font-semibold">
                Selecione a Operação
              </Label>
              <Select value={selectedPatternId} onValueChange={setSelectedPatternId}>
                <SelectTrigger id="operation" className="h-12">
                  <SelectValue placeholder="Escolha uma operação..." />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {patterns.map((pattern) => (
                    <SelectItem key={pattern.id} value={pattern.id}>
                      {pattern.operation_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGeneratePassword}
              disabled={!selectedPatternId || loading}
              className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
              size="lg"
            >
              <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              Gerar Senha
            </Button>
          </div>

          <PasswordDisplay password={generatedPassword} />

          <div className="text-center pt-4">
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="gap-2">
                <Settings className="h-5 w-5" />
                Gerenciar Padrões
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;