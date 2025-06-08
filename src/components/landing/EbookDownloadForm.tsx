
'use client';

import React, { useEffect, useState, useRef, useActionState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';

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
import { ZoomIn, ZoomOut, ArrowUp, ArrowDown } from 'lucide-react';

// CSS imports for react-pdf styling
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import "pdfjs-dist/web/pdf_viewer.css";

import dynamic from 'next/dynamic';

const PDFDocument = dynamic(
  async () => {
    const mod = await import('react-pdf');
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
  const [scale, setScale] = useState(1.0);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

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
      if (key === 'phone' && value && !value.startsWith('+55')) {
        formData.append(key, `+55${value.replace(/\D/g, '')}`);
      } else if (key === 'phone' && value) {
        formData.append(key, `+${value.replace(/\D/g, '')}`);
      }
      else {
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
        return ""; 
    }

    nationalNum = nationalNum.slice(0, 11); 

    let masked = `(${nationalNum.substring(0, Math.min(2, nationalNum.length))}`; 
    if (nationalNum.length > 2) {
      masked += `) ${nationalNum.substring(2, Math.min(2 + 5, nationalNum.length))}`;
    }
    if (nationalNum.length > 7) { 
      masked += `-${nationalNum.substring(7, Math.min(7 + 4, nationalNum.length))}`;
    }
    return masked;
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0)); // Max zoom 3x, step 0.2
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5)); // Min zoom 0.5x, step 0.2
  };

  const handleScrollUp = () => {
    const viewport = scrollViewportRef.current?.firstElementChild as HTMLElement | null;
    if (viewport) {
      viewport.scrollTop -= 200; // Scroll up by 200px
    }
  };

  const handleScrollDown = () => {
    const viewport = scrollViewportRef.current?.firstElementChild as HTMLElement | null;
    if (viewport) {
      viewport.scrollTop += 200; // Scroll down by 200px
    }
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
                      className="pl-12 pr-3 py-2 w-full" 
                      onChange={(e) => {
                        const userInput = e.target.value;
                        let digitsOnly = userInput.replace(/\D/g, '');
                        
                        // Always ensure the DDI is 55 if there are numbers
                        if (digitsOnly.length > 0 && !digitsOnly.startsWith('55')) {
                            digitsOnly = '55' + digitsOnly;
                        } else if (digitsOnly.length === 0) {
                             field.onChange(""); // Allow clearing the field
                             return;
                        }
                        
                        if (digitsOnly === "55") {
                             field.onChange("");
                        } else {
                            const maskedValue = applyPhoneMask(digitsOnly);
                            // Store the full +55 number for validation/submission
                            // but display the masked version without +55
                            setValue('phone', `+${digitsOnly}`, { shouldValidate: true });
                            field.onChange(maskedValue); // Update display with masked value
                        }
                      }}
                      // Display value without +55 for masking
                      value={field.value ? applyPhoneMask(field.value.replace(/^\+/, '')) : ""}
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
            <div className="flex justify-center space-x-2 my-4">
              <Button onClick={handleZoomIn} variant="outline" size="icon" aria-label="Aumentar zoom">
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button onClick={handleZoomOut} variant="outline" size="icon" aria-label="Diminuir zoom">
                <ZoomOut className="h-5 w-5" />
              </Button>
              <Button onClick={handleScrollUp} variant="outline" size="icon" aria-label="Rolar para cima">
                <ArrowUp className="h-5 w-5" />
              </Button>
              <Button onClick={handleScrollDown} variant="outline" size="icon" aria-label="Rolar para baixo">
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>
            <div className="w-full max-w-sm rounded-lg shadow-2xl">
              <ScrollArea ref={scrollViewportRef} className="h-[488px] rounded-lg border bg-muted pdf-scroll-area">
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
                        scale={scale}
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
