"use server";

import { EbookFormSchema, type EbookFormData } from '@/types';

export interface FormState {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
  downloadUrl?: string; // Added to provide the PDF URL
}

export async function submitEbookForm(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  const formData = Object.fromEntries(data);
  const parsed = EbookFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: "Invalid form data. Please check the fields below.",
      fields: formData as Record<string, string>, // Send back erroneous fields
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const validatedData: EbookFormData = parsed.data;

  // Simulate saving data
  console.log("Ebook form submitted with validated data:", validatedData);
  
  // In a real app, you'd save to a database, trigger an email with the PDF, etc.
  // For now, we just return a success message and the download URL.
  
  return {
    message: `Obrigado, ${validatedData.name}! Seu e-book está pronto para download.`,
    success: true,
    downloadUrl: "/ebook-maestria-jurisp-pdf.pdf" // Provide the path to the PDF
  };
}
