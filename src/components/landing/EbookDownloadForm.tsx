
'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// CSS imports for react-pdf styling (these are fine at the top level)
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import type { DocumentProps, PageProps } from 'react-pdf';
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components and configure worker inside the factory
const PdfDocument = dynamic<DocumentProps>(
  () =>
    import('react-pdf').then((mod) => {
      // Configure pdfjs worker here, only on the client
      if (typeof window !== 'undefined') {
        const pdfjsVersion = mod.pdfjs.version;
        mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
      }
      return mod.Document; // Return the component
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center w-full max-w-sm h-[424px] bg-muted rounded-lg shadow-inner">
        <p className="text-sm text-muted-foreground">Carregando prévia do PDF...</p>
      </div>
    ),
  }
);

const PdfPage = dynamic<PageProps>(
  () =>
    import('react-pdf').then((mod) => {
      // Fallback configuration if not already set by PdfDocument, though ideally one set is enough
      if (typeof window !== 'undefined' && !mod.pdfjs.GlobalWorkerOptions.workerSrc) {
         const pdfjsVersion = mod.pdfjs.version;
         mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
      }
      return mod.Page;
    }),
  {
    ssr: false,
    // PdfPage typically doesn't need its own loading spinner if rendered within a PdfDocument
  }
);


const EbookDownloadForm = () => {
  const [numPages, setNumPages] = React.useState<number | null>(null);
  const { toast } = useToast();

  const initialFormState: FormState = { message: "", success: false, issues: [] };
  const [formState, formAction] = useActionState(submitEbookForm, initialFormState);

  const { register, handleSubmit, formState: { errors: formErrors }, reset, control, setValue, watch } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      areaOfLaw: "",
    }
  });

  const currentPhoneValue = watch("phone");

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
      // Ensure all fields are appended, even if empty, to let server-side validation handle them
      formData.append(key, String(value ?? ''));
    });
    formAction(formData);
  };
  
  const applyPhoneMask = (value: string): string => {
    if (!value && value !== '+') return "";
    
    let digits = value.replace(/\D/g, "");

    if (digits.length === 0 && value === "+") return "+";
    if (digits.length === 0 && value !== "+") return "";


    if (digits.length > 0 && !value.startsWith('+') ) {
        digits = '55' + digits; // Default to Brazil DDI if not starting with +
    }
    
    digits = digits.slice(0, 13); // Max length for DDI + DDD + Number (e.g., 55XX9XXXXXXXX)
    
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
                aria-invalid={formErrors.name ? "true" : "false"}
              />
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name.message}</p>}

              <Input
                {...register("email")}
                type="email"
                placeholder="Seu Melhor E-mail"
                aria-invalid={formErrors.email ? "true" : "false"}
              />
              {formErrors.email && <p className="text-sm text-destructive">{formErrors.email.message}</p>}
              
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="+55 (XX) XXXXX-XXXX"
                    onChange={(e) => {
                      const maskedValue = applyPhoneMask(e.target.value);
                      setValue("phone", maskedValue, { shouldValidate: true });
                      field.onChange(maskedValue); // Ensure Controller's field.onChange is also called
                    }}
                    value={currentPhoneValue || ""} // Use watched value for direct control
                    aria-invalid={formErrors.phone ? "true" : "false"}
                  />
                )}
              />
               {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone.message}</p>}

              <Controller
                name="areaOfLaw"
                control={control}
                render={({ field }) => (
                    <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                    >
                        <SelectTrigger aria-invalid={formErrors.areaOfLaw ? "true" : "false"}>
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
              {formErrors.areaOfLaw && <p className="text-sm text-destructive">{formErrors.areaOfLaw.message}</p>}
              
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
                  file="/ebook-maestria-jurisp-pdf.pdf" 
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

