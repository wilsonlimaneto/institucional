
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// CSS imports for react-pdf styling
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import dynamic from 'next/dynamic';

// Dynamically import react-pdf and configure pdfjs worker source client-side
const PdfDocument = dynamic(
  async () => {
    // Dynamically import react-pdf and its pdfjs object
    const { pdfjs, Document } = await import('react-pdf');

    // Configure workerSrc here, strictly on the client-side.
    // Use a CDN link that matches the version of pdfjs-dist specified in package.json (^4.8.69)
    if (typeof window !== 'undefined') {
      (pdfjs.GlobalWorkerOptions as any).workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;
    }
    
    return Document; // Return the Document component
  },
  {
    ssr: false, // Ensure this component is not server-side rendered
    loading: () => (
      <div className="flex justify-center items-center w-full max-w-sm h-[424px] bg-muted rounded-lg shadow-inner">
        <p className="text-sm text-muted-foreground">Carregando prévia do PDF...</p>
      </div>
    ),
  }
);

// Dynamically import PdfPage. It will use the worker configured by PdfDocument's dynamic import
const PdfPage = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
});


const EbookDownloadForm = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();

  const initialFormState: FormState = { message: "", success: false };
  const [formState, formAction] = useActionState(submitEbookForm, initialFormState);

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: undefined,
      areaOfLaw: undefined,
    }
  });

  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.success ? "Sucesso!" : "Erro",
        description: formState.message,
        variant: formState.success ? "default" : "destructive",
      });
      if (formState.success) {
        reset();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);


  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const ramosDeAtuacao = [
    "Administrativo", "Adv. Pública", "Civil", "Digital", "Empresarial", "Família",
    "Imobiliário", "Magistratura", "Penal", "Previdenciário", "Privacidade de Dados",
    "Promotoria", "Sucessões", "Trabalhista", "Tributário"
  ].sort();

  const handleFormSubmit = (data: EbookFormData) => {
    const formData = new FormData();
    (Object.keys(data) as Array<keyof EbookFormData>).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });
    formAction(formData);
  };

  const applyPhoneMask = (value: string): string => {
    if (!value) return "";
    let digits = value.replace(/\D/g, "");

    // Max 14 digits: DDI (1-3) + DDD(2) + P1(5) + P2(4)
    digits = digits.slice(0, 14); 

    let masked = "+";
    const len = digits.length;

    if (len === 0) return ""; 

    let ddiEnd = 0;
    if (len <= 2) ddiEnd = len; // Up to 2 for DDI e.g. +55
    else if (len > 2 && (digits.startsWith('1') || digits.startsWith('7'))) ddiEnd = 1; // DDI like +1, +7
    else if (len > 2 && digits.startsWith('55')) ddiEnd = 2; // DDI like +55 (Brazil)
    else ddiEnd = Math.min(len, 3); // Default to max 3 for other DDIs

    masked += digits.substring(0, ddiEnd);
    
    if (len > ddiEnd) {
      masked += ` (${digits.substring(ddiEnd, Math.min(ddiEnd + 2, len))}`;
    }
    if (len > ddiEnd + 2) {
      masked += `) ${digits.substring(ddiEnd + 2, Math.min(ddiEnd + 2 + 5, len))}`;
    }
    if (len > ddiEnd + 2 + 5) {
      masked += `-${digits.substring(ddiEnd + 2 + 5, Math.min(ddiEnd + 2 + 5 + 4, len))}`;
    }
    return masked;
  };

  return (
    <section id="ebook" className="py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Baixe nosso E-book Exclusivo
            </h2>
            <p className="text-lg md:text-xl text-foreground/80">
              Aprenda os segredos da IA para advogados e transforme sua carreira.
            </p>
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <Input
                {...register("name")}
                type="text"
                placeholder="Nome Completo"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}

              <Input
                {...register("email")}
                type="email"
                placeholder="Seu Melhor E-mail"
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+55 (XX) XXXXX-XXXX (Opcional)"
                    onChange={(e) => {
                      const maskedValue = applyPhoneMask(e.target.value);
                      field.onChange(maskedValue); // Update RHF state
                      setValue("phone", maskedValue, { shouldValidate: true }); // Also explicitly set and validate
                    }}
                    value={field.value || ""}
                    aria-invalid={errors.phone ? "true" : "false"}
                  />
                )}
              />
               {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}

              <Controller
                name="areaOfLaw"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""} // Allows placeholder to show when field.value is undefined
                  >
                    <SelectTrigger aria-invalid={errors.areaOfLaw ? "true" : "false"}>
                      <SelectValue placeholder="Selecione seu principal ramo de atuação..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ramosDeAtuacao.map(ramo => (
                        <SelectItem key={ramo} value={ramo}>{ramo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.areaOfLaw && <p className="text-sm text-destructive">{errors.areaOfLaw.message}</p>}

              <Button type="submit" size="lg" className="w-full font-semibold">
                Download Gratuito
              </Button>
            </form>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-2xl">
              <PdfDocument
                file="/ebook-maestria-jurisp-pdf.pdf" // Ensure this PDF is in your /public folder
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex justify-center"
                onLoadError={(error) => console.error('Failed to load PDF:', error.message)}
                onSourceError={(error) => console.error('Failed to load PDF source:', error.message)}
              >
                {numPages && <PdfPage pageNumber={1} width={300} />}
              </PdfDocument>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookDownloadForm;
