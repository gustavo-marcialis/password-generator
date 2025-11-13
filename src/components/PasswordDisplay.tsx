import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PasswordDisplayProps {
  password: string;
}

export function PasswordDisplay({ password }: PasswordDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Senha copiada!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar senha');
    }
  };

  if (!password) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg bg-muted/30 text-center">
        <p className="text-muted-foreground">Sua senha aparecerá aqui...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative p-6 bg-gradient-primary rounded-lg shadow-lg">
        <div className="font-mono text-2xl font-bold text-primary-foreground break-all">
          {password}
        </div>
      </div>
      <Button
        onClick={handleCopy}
        className="w-full"
        variant="outline"
        size="lg"
      >
        {copied ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Copiado!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-5 w-5" />
            Copiar para Área de Transferência
          </>
        )}
      </Button>
    </div>
  );
}
