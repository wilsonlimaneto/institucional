
'use client';

import React, { useEffect, useState, useRef } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

const BrazilFlagIcon = () => (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-sm">
        <rect width="28" height="20" fill="#009B3A"/>
        <path d="M13.9999 3.5L4.08325 10L13.9999 16.5L23.9166 10L13.9999 3.5Z" fill="#FEDF00"/>
        <circle cx="13.9999" cy="10.0001" r="3.66667" fill="#002776"/>
    </svg>
);

const applyPhoneMask = (digits: string): string => {
  if (!digits) return "";

  const len = digits.length;

  if (len <= 2) {
    return `(${digits}`;
  }

  const ddd = digits.substring(0, 2);
  let mainPart;
  let lastFour;

  if (len <= 7) {
    mainPart = digits.substring(2);
    return `(${ddd}) ${mainPart}`;
  }

  if (len === 11) { // Celular com 9º dígito
    mainPart = digits.substring(2, 7);
    lastFour = digits.substring(7);
  } else { // Telefone fixo ou celular sem 9º dígito (menos comum hoje)
    mainPart = digits.substring(2, 6);
    lastFour = digits.substring(6);
  }

  let masked = `(${ddd}) ${mainPart}`;
  if (lastFour) {
    masked += `-${lastFour}`;
  }
  return masked;
};


const EbookDownloadForm = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState(1.0); // Initial zoom, will be adjusted
  const pdfParentContainerRef = useRef<HTMLDivElement | null>(null);
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number | undefined>();
  const originalPageDimensionsRef = useRef<{width: number, height: number} | null>(null);
  const [calculatedPdfHeight, setCalculatedPdfHeight] = useState<string | number>('488px'); // Initial fixed height
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

  const initialFormState: FormState = { message: "", success: false, issues: [] };
  const [formState, formAction] = React.useActionState(submitEbookForm, initialFormState);

  const { register, formState: { errors: formErrors, isSubmitting }, reset, control } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      areaOfLaw: "",
    }
  });

  const [reactPdfModule, setReactPdfModule] = useState<{ Document: any; Page: any; pdfjs: any } | null>(null);
  const [isLoadingPdfModule, setIsLoadingPdfModule] = useState(true);

  useEffect(() => {
    const loadPdfDependencies = async () => {
      try {
        const RPDF = await import('react-pdf');
        if (typeof window !== 'undefined' && RPDF.pdfjs) {
          RPDF.pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs`;
        }
        setReactPdfModule(RPDF);
      } catch (error) {
        console.error("Failed to load react-pdf module:", error);
        toast({
          title: "Erro ao Carregar Módulo PDF",
          description: "Não foi possível inicializar os componentes do visualizador de PDF.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPdfModule(false);
      }
    };
    loadPdfDependencies();
  }, [toast]);


  useEffect(() => {
    if (formState.message && formState.message !== "") {
      toast({
        title: formState.success ? "Sucesso!" : "Erro na Submissão",
        description: formState.message,
        variant: formState.success ? "default" : "destructive",
      });
      if (formState.success && formState.downloadUrl) {
        setDownloadUrl(formState.downloadUrl);
        setShowDownloadDialog(true);
        reset();
      }
    }
  }, [formState, reset, toast]);


  // Effect for calculating and setting PDF zoom and container height
  useEffect(() => {
    const calculateAndSetPdfSizing = () => {
        if (pdfParentContainerRef.current && originalPageDimensionsRef.current) {
            const containerWidth = pdfParentContainerRef.current.clientWidth;
            if (containerWidth > 0) {
                if (pdfContainerWidth !== containerWidth) { // Only update if width actually changed
                    setPdfContainerWidth(containerWidth);
                }

                const { width: pageWidth, height: pageHeight } = originalPageDimensionsRef.current;
                const aspectRatio = pageHeight / pageWidth;
                
                const newZoomLevel = containerWidth / pageWidth;
                setZoomLevel(newZoomLevel);
                
                setCalculatedPdfHeight(containerWidth * aspectRatio);
            }
        }
    };

    calculateAndSetPdfSizing(); // Initial calculation attempt

    window.addEventListener('resize', calculateAndSetPdfSizing);
    return () => window.removeEventListener('resize', calculateAndSetPdfSizing);
  }, [originalPageDimensionsRef.current, pdfContainerWidth]); // Rerun when PDF dimensions are loaded or containerWidth state changes


  const onDocumentLoadSuccess = async (pdf: PDFDocumentProxy) => {
    setNumPages(pdf.numPages);
    if (pdf.numPages > 0) {
      const page1 = await pdf.getPage(1);
      const viewport = page1.getViewport({ scale: 1 });
      originalPageDimensionsRef.current = { width: viewport.width, height: viewport.height };
      // The useEffect for sizing will now trigger and do the calculations.
    }
  };

  const ramosDeAtuacao = [
    "Administrativo", "Adv. Pública", "Civil", "Digital", "Empresarial", "Família",
    "Imobiliário", "Magistratura", "Penal", "Previdenciário", "Privacidade de Dados",
    "Promotoria", "Sucessões", "Trabalhista", "Tributário"
  ].sort();

  const handleDownloadPdf = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'ebook-maestria-jurisprudencia.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setShowDownloadDialog(false);
    }
  };

  const PdfLoadingPlaceholder = () => (
    <div
      className="flex justify-center items-center w-full bg-muted rounded-lg shadow-inner"
      style={{ height: typeof calculatedPdfHeight === 'string' ? calculatedPdfHeight : `${calculatedPdfHeight}px` }}
    >
      <p className="text-sm text-muted-foreground">Carregando visualizador de PDF...</p>
    </div>
  );

  const PdfErrorPlaceholder = () => (
     <div
      className="flex justify-center items-center w-full bg-muted rounded-lg shadow-inner"
      style={{ height: typeof calculatedPdfHeight === 'string' ? calculatedPdfHeight : `${calculatedPdfHeight}px` }}
    >
      <p className="text-sm text-muted-foreground">Falha ao carregar o PDF.</p>
    </div>
  );


  return (
    <>
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
                action={formAction}
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
                          let inputValue = e.target.value;
                          let digits = inputValue.replace(/\D/g, '');
                          if (digits.length > 11) {
                            digits = digits.substring(0, 11);
                          }
                          field.onChange(digits);
                        }}
                        value={applyPhoneMask(field.value || '')}
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

                <Button type="submit" size="lg" className="w-full font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? "Enviando..." : "Clique para receber GRATUITAMENTE o E-Book"}
                </Button>
              </form>
            </div>
            <div className="flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Amostra do E-book</h3>
              {/* Zoom buttons removed */}
              <div ref={pdfParentContainerRef} className="w-full max-w-xl rounded-lg shadow-2xl mt-4">
                <ScrollArea
                  className="rounded-lg border bg-muted pdf-scroll-area"
                  style={{ height: typeof calculatedPdfHeight === 'string' ? calculatedPdfHeight : `${calculatedPdfHeight}px` }}
                >
                  {isLoadingPdfModule ? (
                    <PdfLoadingPlaceholder />
                  ) : reactPdfModule && pdfContainerWidth ? (
                    <reactPdfModule.Document
                      file="/ebook-maestria-jurisp-pdf.pdf"
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="flex flex-col items-center py-2"
                      onLoadError={(error: any) => {
                        console.error('Failed to load PDF:', error.message);
                        toast({ title: "Erro ao Carregar PDF", description: "Não foi possível carregar a amostra do PDF. Tente recarregar a página.", variant: "destructive" });
                      }}
                      onSourceError={(error: any) => {
                         console.error('Failed to load PDF source:', error.message);
                         toast({ title: "Erro na Fonte do PDF", description: "Não foi possível encontrar o arquivo PDF. Verifique o caminho.", variant: "destructive" });
                      }}
                      loading={
                        <div className="flex justify-center items-center w-full" style={{ height: typeof calculatedPdfHeight === 'string' ? calculatedPdfHeight : `${calculatedPdfHeight}px` }}>
                            <p className="text-sm text-muted-foreground">Carregando PDF...</p>
                        </div>
                      }
                    >
                      {Array.from(new Array(numPages ? Math.min(numPages, 3) : 0), (el, index) => (
                        <reactPdfModule.Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          scale={zoomLevel}
                          className="mb-2 shadow-md"
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          loading=""
                        />
                      ))}
                    </reactPdfModule.Document>
                  ) : (
                     <PdfErrorPlaceholder />
                  )}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AlertDialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download Liberado</AlertDialogTitle>
            <AlertDialogDescription>
              Seu e-book está pronto! Clique no botão abaixo para iniciar o download.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDownloadPdf}>
              Baixar E-book
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => setShowDownloadDialog(false)}>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EbookDownloadForm;
