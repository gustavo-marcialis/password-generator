import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { OperationPattern } from '@/types/supabase';

interface PatternFormData {
  operationName: string;
  length: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecial: boolean;
  allowedSpecialChars: string;
}

interface PatternFormProps {
  selectedPattern: OperationPattern | null;
  onSubmit: (data: PatternFormData) => void;
  onCancel: () => void;
}

export function PatternForm({ selectedPattern, onSubmit, onCancel }: PatternFormProps) {
  const { register, handleSubmit, setValue, watch, reset } = useForm<PatternFormData>({
    defaultValues: {
      operationName: '',
      length: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumber: true,
      requireSpecial: true,
      allowedSpecialChars: '!@#$%&*-_=+',
    },
  });

  const isEditing = !!selectedPattern;

  useEffect(() => {
    if (selectedPattern) {
      setValue('operationName', selectedPattern.operation_name);
      setValue('length', selectedPattern.password_rules.length);
      setValue('requireUppercase', selectedPattern.password_rules.requireUppercase);
      setValue('requireLowercase', selectedPattern.password_rules.requireLowercase);
      setValue('requireNumber', selectedPattern.password_rules.requireNumber);
      setValue('requireSpecial', selectedPattern.password_rules.requireSpecial);
      setValue('allowedSpecialChars', selectedPattern.password_rules.allowedSpecialChars);
    } else {
      reset();
    }
  }, [selectedPattern, setValue, reset]);

  const handleFormSubmit = (data: PatternFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Padrão' : 'Adicionar Novo Padrão'}</CardTitle>
        <CardDescription>
          Preencha o formulário para {isEditing ? 'atualizar' : 'criar'} um padrão de senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="operationName">Nome da Operação *</Label>
            <Input
              id="operationName"
              {...register('operationName', { required: true })}
              placeholder="Ex: Cliente XPTO"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Comprimento da Senha *</Label>
            <Input
              id="length"
              type="number"
              {...register('length', { required: true, min: 8 })}
              min={8}
            />
          </div>

          <div className="space-y-4">
            <Label>Requisitos da Senha</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireUppercase"
                checked={watch('requireUppercase')}
                onCheckedChange={(checked) => setValue('requireUppercase', !!checked)}
              />
              <Label htmlFor="requireUppercase" className="font-normal cursor-pointer">
                Exigir Maiúsculas (A-Z)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireLowercase"
                checked={watch('requireLowercase')}
                onCheckedChange={(checked) => setValue('requireLowercase', !!checked)}
              />
              <Label htmlFor="requireLowercase" className="font-normal cursor-pointer">
                Exigir Minúsculas (a-z)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireNumber"
                checked={watch('requireNumber')}
                onCheckedChange={(checked) => setValue('requireNumber', !!checked)}
              />
              <Label htmlFor="requireNumber" className="font-normal cursor-pointer">
                Exigir Números (0-9)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="requireSpecial"
                checked={watch('requireSpecial')}
                onCheckedChange={(checked) => setValue('requireSpecial', !!checked)}
              />
              <Label htmlFor="requireSpecial" className="font-normal cursor-pointer">
                Exigir Caracteres Especiais
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowedSpecialChars">Caracteres Especiais Permitidos</Label>
            <Input
              id="allowedSpecialChars"
              {...register('allowedSpecialChars')}
              placeholder="Ex: !@#$%"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Atualizar Padrão' : 'Salvar Padrão'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
