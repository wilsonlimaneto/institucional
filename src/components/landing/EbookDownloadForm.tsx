
'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

// CSS imports for react-pdf styling
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import dynamic from 'next/dynamic';
// Note: pdfjs object will be accessed via the dynamic import's resolved module

const PDFDocument = dynamic(
  async () => {
    const mod = await import('react-pdf');
    // Configure workerSrc here, using the imported pdfjs object from react-pdf
    // and the specific version from package.json
    if (typeof window !== 'undefined') {
      // Using the specific version from package.json (pdfjs-dist: "^4.8.69")
      // and a reliable CDN (unpkg) for the .mjs worker.
      mod.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;
    }
    return mod.Document;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center w-full max-w-sm h-[488px] bg-muted rounded-lg shadow-inner">
        <p className="text-sm text-muted-foreground">Carregando prévia do PDF...</p>
      </div>
    ),
  }
);

const PDFPage = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
});


const BrazilFlagIcon = () => (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-sm">
        <rect width="28" height="20" fill="#009B3A"/>
        <path d="M13.9999 3.5L4.08325 10L13.9999 16.5L23.9166 10L13.9999 3.5Z" fill="#FEDF00"/>
        <circle cx="13.9999" cy="10.0001" r="3.66667" fill="#002776"/>
    </svg>
);


const EbookDownloadForm = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
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


  const onDocumentLoadSuccess = ({ numPages: loadedNumPages }: { numPages: number }) => {
    setNumPages(loadedNumPages);
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
      // Ensure phone includes the +55 prefix for submission if it was stripped for display
      if (key === 'phone' && value && !value.startsWith('+55')) {
        formData.append(key, `+55${value}`);
      } else {
        formData.append(key, String(value ?? ''));
      }
    });
    formAction(formData);
  };

  const applyPhoneMask = (digitsOnlyWithDDI: string): string => {
    if (!digitsOnlyWithDDI) return "";

    const ddi = digitsOnlyWithDDI.substring(0, 2);
    let nationalNum = digitsOnlyWithDDI.substring(2);

    if (nationalNum.length === 0) {
        return ""; // Return empty if only DDI is present after stripping +55
    }

    nationalNum = nationalNum.slice(0, 11); // Limit to 11 national digits (DDD + Number)

    let masked = `(${nationalNum.substring(0, Math.min(2, nationalNum.length))}`; // DDD
    if (nationalNum.length > 2) {
      masked += `) ${nationalNum.substring(2, Math.min(2 + 5, nationalNum.length))}`;
    }
    if (nationalNum.length > 7) { // 2 for DDD + 5 for first part
      masked += `-${nationalNum.substring(7, Math.min(7 + 4, nationalNum.length))}`;
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

              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <BrazilFlagIcon />
                </div>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="tel"
                      placeholder="(XX) XXXXX-XXXX"
                      className="pl-12 pr-3 py-2 w-full" // Increased paddingLeft for the flag
                      onChange={(e) => {
                        const userInput = e.target.value;
                        // Remove non-digits, but keep '+' if it's at the beginning for DDI
                        let digitsOnly = userInput.replace(/[^\d+]/g, '');
                        
                        // Prepend +55 if not already there and if there are other digits
                        if (!digitsOnly.startsWith('+55') && digitsOnly.length > 0) {
                            if (digitsOnly.startsWith('+')) { // User might be typing a different DDI
                                digitsOnly = digitsOnly.substring(1); // Remove the '+' to replace with +55
                            }
                            // Remove any existing DDI if it's not 55 before prepending
                            if (digitsOnly.length > 2 && (digitsOnly.startsWith('55') || digitsOnly.startsWith('055'))) {
                                // Handle cases where user might have typed 55 already
                            } else {
                                digitsOnly = '55' + digitsOnly.replace(/^0+/, ''); // Prepend 55 and remove leading zeros
                            }
                        } else if (digitsOnly.startsWith('+55')) {
                            digitsOnly = digitsOnly.substring(1); // Keep 55 but remove + for masking logic
                        }


                        if (digitsOnly === "55" || digitsOnly === "") {
                            field.onChange(""); // If only "+55" or empty, show placeholder
                        } else {
                            const maskedValue = applyPhoneMask(digitsOnly);
                            // Store the value without +55 for display, but the Zod schema expects +55
                            // The handleFormSubmit will re-add +55 if needed.
                            field.onChange(maskedValue); 
                        }
                      }}
                      value={field.value ? field.value.replace(/^\+55\s*/, '').trimStart() : ""}
                      aria-invalid={formErrors.phone ? "true" : "false"}
                    />
                  )}
                />
              </div>
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
                Clique para receber GRATUITAMENTE o E-Book
              </Button>
            </form>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Amostra</h3>
            <div className="w-full max-w-sm rounded-lg shadow-2xl">
              <ScrollArea className="h-[488px] rounded-lg border bg-muted pdf-scroll-area">
                <PDFDocument
                  file="/ebook-maestria-jurisp-pdf.pdf" 
                  onLoadSuccess={onDocumentLoadSuccess}
                  className="flex flex-col items-center py-2"
                  onLoadError={(error) => console.error('Failed to load PDF:', error.message)}
                  onSourceError={(error) => console.error('Failed to load PDF source:', error.message)}
                  loading={<div className="flex justify-center items-center w-full h-full"><p className="text-sm text-muted-foreground">Carregando PDF...</p></div>}
                >
                  {numPages &&
                    Array.from(new Array(Math.min(numPages, 3)), (el, index) => (
                      <PDFPage
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={300}
                        className="mb-2 shadow-md"
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading="" 
                      />
                    ))}
                </PDFDocument>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookDownloadForm;
