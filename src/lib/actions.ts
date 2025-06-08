
"use server";

import { EbookFormSchema, type EbookFormData } from '@/types';

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
  // downloadUrl is no longer needed here as download is client-side
}

export async function submitEbookForm(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  const formData = Object.fromEntries(data);
  const parsed = EbookFormSchema.safeParse(formData);

  if (!parsed.success) {
    console.error("Server-side validation errors:", parsed.error.flatten().fieldErrors);
    return {
      message: "Dados inválidos. Por favor, verifique os campos (validação do servidor).",
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      success: false,
    };
  }

  const validatedData: EbookFormData = parsed.data;
  
  const phoneWithCountryCode = `+55${validatedData.phone}`;

  console.log("Ebook form submitted to server for logging. Data:", {
    ...validatedData,
    phone: phoneWithCountryCode,
  });
  
  // This message will be shown in a toast
  return {
    message: `Obrigado, ${validatedData.name}! Seus dados foram registrados. Seu download deve iniciar em breve.`,
    success: true,
  };
}
