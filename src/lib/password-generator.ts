import type { PasswordRules } from '@/types/supabase';

export function generatePassword(rules: PasswordRules): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = rules.allowedSpecialChars || '!@#$%&*-_=+';

  let characterPool = '';
  let password = '';

  // Construir o pool de caracteres baseado nas regras
  if (rules.requireUppercase) characterPool += uppercase;
  if (rules.requireLowercase) characterPool += lowercase;
  if (rules.requireNumber) characterPool += numbers;
  if (rules.requireSpecial) characterPool += special;

  // Se nenhum requisito foi marcado, usar todos os tipos
  if (characterPool === '') {
    characterPool = uppercase + lowercase + numbers + special;
  }

  // Garantir que pelo menos um de cada tipo requisitado está presente
  if (rules.requireUppercase) {
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
  }
  if (rules.requireLowercase) {
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
  }
  if (rules.requireNumber) {
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }
  if (rules.requireSpecial) {
    password += special[Math.floor(Math.random() * special.length)];
  }

  // Preencher o resto da senha com caracteres aleatórios do pool
  const remainingLength = rules.length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += characterPool[Math.floor(Math.random() * characterPool.length)];
  }

  // Embaralhar a senha para que os caracteres requisitados não estejam sempre no início
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
