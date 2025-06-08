
import { z } from 'zod';

export const EbookFormSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(50, {message: "O nome deve ter menos de 50 caracteres."}),
  email: z.string({ required_error: "O e-mail é obrigatório." }).email({ message: "Por favor, insira um endereço de e-mail válido." }),
  phone: z.string({ required_error: "O celular é obrigatório."})
    .min(10, { message: "Número de celular inválido. Inclua o DDD e o número." })
    .max(11, { message: "Número de celular inválido. Use apenas números." })
    .regex(/^\d{10,11}$/, { // Matches 10 or 11 digits (DDD + number)
      message: "Formato de celular inválido. Forneça DDD e número, apenas dígitos."
    }),
  areaOfLaw: z.string({ required_error: "Por favor, selecione seu ramo de atuação." })
    .min(1, { message: "Por favor, selecione seu ramo de atuação." }),
});

export type EbookFormData = z.infer<typeof EbookFormSchema>;
