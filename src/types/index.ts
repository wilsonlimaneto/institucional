
import { z } from 'zod';

export const EbookFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(50, {message: "O nome deve ter menos de 50 caracteres."}),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido." }),
  phone: z.string().optional().or(z.literal("")).transform(value => value === "" ? undefined : value) // Optional phone
    .refine(value => value === undefined || /^\s*(\+?[0-9\s()-]*)\s*$/.test(value), {
      message: "Por favor, insira um número de telefone válido ou deixe em branco."
    }),
  areaOfLaw: z.string().optional(), // Optional area of law
});

export type EbookFormData = z.infer<typeof EbookFormSchema>;
