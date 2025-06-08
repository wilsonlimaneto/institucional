
import { z } from 'zod';

export const EbookFormSchema = z.object({
  name: z.string({ required_error: "O nome é obrigatório." }).min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(50, {message: "O nome deve ter menos de 50 caracteres."}),
  email: z.string({ required_error: "O e-mail é obrigatório." }).email({ message: "Por favor, insira um endereço de e-mail válido." }),
  phone: z.string({ required_error: "O celular é obrigatório."})
    .min(1, { message: "O celular é obrigatório." }) // min(1) garante que não está vazio
    .regex(/^\+\d{1,3}\s\(\d{2}\)\s\d{5}-\d{4}$/, { // Garante o formato +XX (XX) XXXXX-XXXX
      message: "Formato de celular inválido. Use +XX (XX) XXXXX-XXXX."
    }),
  areaOfLaw: z.string({ required_error: "Por favor, selecione seu ramo de atuação." })
    .min(1, { message: "Por favor, selecione seu ramo de atuação." }), // min(1) garante que uma seleção foi feita
});

export type EbookFormData = z.infer<typeof EbookFormSchema>;
