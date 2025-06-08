
import { z } from 'zod';

export const EbookFormSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(50, {message: "O nome deve ter menos de 50 caracteres."}),
  email: z.string().email({ message: "Por favor, insira um endereço de e-mail válido." }),
  phone: z.string()
    .optional()
    .transform(value => (value === "" || value === "+") ? undefined : value) // Se vazio ou apenas "+", considera como não preenchido
    .refine(value => value === undefined || /^\+\d{1,3}\s\(\d{2}\)\s\d{5}-\d{4}$/.test(value), {
      message: "Formato de celular inválido. Use +XX (XX) XXXXX-XXXX (ex: +55 (11) 98765-4321)."
    }),
  areaOfLaw: z.string({ required_error: "Por favor, selecione seu ramo de atuação." })
    .min(1, { message: "Por favor, selecione seu ramo de atuação." }),
});

export type EbookFormData = z.infer<typeof EbookFormSchema>;
