import { Edit, Trash2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { OperationPattern } from '@/types/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface PatternListProps {
  patterns: OperationPattern[];
  onEdit: (pattern: OperationPattern) => void;
  onDelete: (id: string) => void;
}

export function PatternList({ patterns, onEdit, onDelete }: PatternListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patternToDelete, setPatternToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPatternToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (patternToDelete) {
      onDelete(patternToDelete);
      setDeleteDialogOpen(false);
      setPatternToDelete(null);
    }
  };

  if (patterns.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Nenhum padrão cadastrado ainda. Adicione seu primeiro padrão acima!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {patterns.map((pattern) => (
          <Card key={pattern.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl">{pattern.operation_name}</CardTitle>
                  <CardDescription>
                    Criado em {new Date(pattern.created_at).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(pattern)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(pattern.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Comprimento: {pattern.password_rules.length}
                </Badge>
                {pattern.password_rules.requireUppercase && (
                  <Badge variant="outline">Maiúsculas</Badge>
                )}
                {pattern.password_rules.requireLowercase && (
                  <Badge variant="outline">Minúsculas</Badge>
                )}
                {pattern.password_rules.requireNumber && (
                  <Badge variant="outline">Números</Badge>
                )}
                {pattern.password_rules.requireSpecial && (
                  <Badge variant="outline">Especiais</Badge>
                )}
              </div>
              {pattern.password_rules.allowedSpecialChars && (
                <p className="text-sm text-muted-foreground mt-3">
                  Caracteres especiais: {pattern.password_rules.allowedSpecialChars}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este padrão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
