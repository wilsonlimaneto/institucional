
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// CSS imports for react-pdf styling
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import type { DocumentProps, PageProps } from 'react-pdf';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf and configure workerSrc
const PdfDocument = dynamic<DocumentProps>(() =>
  import('react-pdf').then(mod => {
    if (typeof window !== 'undefined') {
      (mod.pdfjs as any).GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;
    }
    return mod.Document;
  }), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center w-full max-w-sm h-[424px] bg-muted rounded-lg shadow-inner">
      <p className="text-sm text-muted-foreground">Carregando prévia do PDF...</p>
    </div>
  ),
});

const PdfPage = dynamic<PageProps>(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
});


const EbookDownloadForm = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();

  const initialFormState: FormState = { message: "", success: false, issues: [] };
  const [formState, formAction] = useActionState(submitEbookForm, initialFormState);

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      areaOfLaw: "",
    }
  });

  useEffect(() => {
    if (formState.message && formState.message !== "") {
      toast({
        title: formState.success ? "Sucesso!" : "Erro na Submissão",
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
    if (!value) return "+";
    let digits = value.replace(/\D/g, "");

    if (digits.length > 0 && !value.startsWith('+')) {
      digits = digits;
    }

    digits = digits.slice(0, 14);

    let masked = "+";
    const len = digits.length;

    if (len === 0) return "+";

    let ddiEnd = 0;
    if (digits.startsWith('55')) ddiEnd = 2;
    else if (digits.startsWith('1')) ddiEnd = 1;
    else if (len <=3 ) ddiEnd = len;
    else ddiEnd = Math.min(len, 3);

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

              <Input
                {...register("phone")}
                type="tel"
                placeholder="+XX (XX) XXXXX-XXXX"
                onChange={(e) => {
                  const maskedValue = applyPhoneMask(e.target.value);
                  setValue("phone", maskedValue, { shouldValidate: true });
                }}
                aria-invalid={errors.phone ? "true" : "false"}
              />
               {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}

              <Select
                onValueChange={(value) => setValue("areaOfLaw", value, { shouldValidate: true })}
                value={control._formValues.areaOfLaw || ""}
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
              {errors.areaOfLaw && <p className="text-sm text-destructive">{errors.areaOfLaw.message}</p>}

              {formState.issues && formState.issues.length > 0 && !formState.success && (
                <p className="text-sm text-destructive text-center py-2">
                  Por favor, preencha todos os campos obrigatórios corretamente.
                </p>
              )}

              <Button type="submit" size="lg" className="w-full font-semibold">
                Download Gratuito
              </Button>
            </form>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-sm rounded-lg shadow-2xl">
              <ScrollArea className="h-[424px] rounded-lg border bg-muted">
                <PdfDocument
                  file="/ebook-maestria-jurisp-pdf.pdf" // Ensure this PDF is in your /public folder
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex flex-col items-center py-2"
                  onLoadError={(error) => console.error('Failed to load PDF:', error.message)}
                  onSourceError={(error) => console.error('Failed to load PDF source:', error.message)}
                >
                  {numPages &&
                    Array.from(new Array(Math.min(numPages, 3)), (el, index) => (
                      <PdfPage
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={300}
                        className="mb-2 shadow-md"
                        renderAnnotationLayer={false} 
                        renderTextLayer={false}
                      />
                    ))}
                </PdfDocument>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookDownloadForm;

