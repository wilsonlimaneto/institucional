
"use server";

import { EbookFormSchema, type EbookFormData } from '@/types';

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
  downloadUrl?: string; 
}

export async function submitEbookForm(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  const formData = Object.fromEntries(data);
  const parsed = EbookFormSchema.safeParse(formData);

  if (!parsed.success) {
    // Log detailed validation errors for debugging
    console.error("Validation errors:", parsed.error.flatten().fieldErrors);
    return {
      message: "Dados inválidos. Por favor, verifique os campos.",
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      success: false,
    };
  }

  // At this point, parsed.data.phone contains the national number (e.g., "11987654321")
  const validatedData: EbookFormData = parsed.data;
  
  // Add country code for storage/processing
  const phoneWithCountryCode = `+55${validatedData.phone}`;

  // Simulate saving data with the full number
  console.log("Ebook form submitted. Data to be saved:", {
    ...validatedData,
    phone: phoneWithCountryCode, // Use the number with country code for backend operations
  });
  
  return {
    message: `Obrigado, ${validatedData.name}! Seu e-book está pronto para download.`,
    success: true,
    downloadUrl: "/ebook-maestria-jurisp-pdf.pdf"
  };
}
