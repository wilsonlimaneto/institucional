
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

// Import types from react-pdf
import type { PDFDocumentProxy, DocumentProps as ReactPdfDocumentProps, PageProps as ReactPdfPageProps } from 'react-pdf';

// CSS for react-pdf layers
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';


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
  if (len <= 2) return `(${digits}`;
  const ddd = digits.substring(0, 2);
  let mainPart;
  let lastFour;
  if (len <= 7) {
    mainPart = digits.substring(2);
    return `(${ddd}) ${mainPart}`;
  }
  const ninthDigitOffset = len === 11 ? 1 : 0;
  mainPart = digits.substring(2, 6 + ninthDigitOffset);
  lastFour = digits.substring(6 + ninthDigitOffset);
  let masked = `(${ddd}) ${mainPart}`;
  if (lastFour) masked += `-${lastFour}`;
  return masked;
};

interface PdfModuleType {
  Document: React.ComponentType<ReactPdfDocumentProps>;
  Page: React.ComponentType<ReactPdfPageProps>;
  pdfjs: any; // Access to pdfjs-dist
}

const EbookDownloadForm = () => {
  const { toast } = useToast();
  
  const pdfParentContainerRef = useRef<HTMLDivElement | null>(null);
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number | undefined>();
  const originalPageDimensionsRef = useRef<{width: number, height: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1.0); 
  const [calculatedPdfHeight, setCalculatedPdfHeight] = useState<string | number>('488px'); 
  
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

  const initialFormState: FormState = { message: "", success: false, issues: [] };
  const [formState, formAction] = React.useActionState(submitEbookForm, initialFormState);

  const { register, formState: { errors: formErrors, isSubmitting }, reset, control } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: { name: "", email: "", phone: "", areaOfLaw: "" }
  });

  const [pdfModule, setPdfModule] = useState<PdfModuleType | null>(null);
  const [isLoadingPdfModule, setIsLoadingPdfModule] = useState(true);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);

  useEffect(() => {
    const loadPdfDependencies = async () => {
      setIsLoadingPdfModule(true);
      setPdfLoadError(null);
      try {
        // Dynamically import react-pdf
        const RPDF = await import('react-pdf');

        // Configure pdf.js worker
        // IMPORTANT: Using CDN worker that matches the pdfjs-dist version (4.8.69)
        // This helps troubleshoot if local serving is the issue.
        RPDF.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;
        // If the above .mjs worker fails, you can try the .js version from CDN:
        // RPDF.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.js`;
        // Or, if you want to try local again (ensure pdf.worker.min.js or .mjs is in /public):
        // RPDF.pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'; // or '/pdf.worker.min.js'

        setPdfModule({ 
          Document: RPDF.Document, 
          Page: RPDF.Page,
          pdfjs: RPDF.pdfjs // Store pdfjs for other uses if needed
        });
      } catch (error) {
        console.error("Failed to load react-pdf module or set worker:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error loading PDF module.";
        setPdfLoadError(`Não foi possível inicializar os componentes do PDF: ${errorMessage}`);
        toast({
          title: "Erro ao Carregar Módulo PDF",
          description: `Não foi possível inicializar os componentes do PDF. Detalhes: ${errorMessage}`,
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

 useEffect(() => {
    const calculateAndSetPdfSizing = () => {
      if (pdfParentContainerRef.current && originalPageDimensionsRef.current) {
        const containerWidth = pdfParentContainerRef.current.clientWidth;
        if (containerWidth > 0) {
          setPdfContainerWidth(containerWidth); 

          const { width: originalPageWidth, height: originalPageHeight } = originalPageDimensionsRef.current;
          
          if (originalPageWidth > 0 && originalPageHeight > 0) {
            const newZoomLevel = containerWidth / originalPageWidth;
            setZoomLevel(newZoomLevel);
            setCalculatedPdfHeight(newZoomLevel * originalPageHeight);
          }
        }
      } else if (pdfParentContainerRef.current && !originalPageDimensionsRef.current) {
        const containerWidth = pdfParentContainerRef.current.clientWidth;
         if (containerWidth > 0 && pdfContainerWidth !== containerWidth) {
            setPdfContainerWidth(containerWidth);
        }
      }
    };

    calculateAndSetPdfSizing(); 

    const resizeObserver = new ResizeObserver(calculateAndSetPdfSizing);
    if (pdfParentContainerRef.current) {
      resizeObserver.observe(pdfParentContainerRef.current);
    }

    return () => {
      if (pdfParentContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resizeObserver.unobserve(pdfParentContainerRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [pdfParentContainerRef, pdfContainerWidth]); // Re-run on pdfContainerWidth to catch initial width


  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
    setPdfLoadError(null);
    const nextNumPages = pdf.numPages;
    setNumPages(nextNumPages);
    if (nextNumPages > 0) {
      pdf.getPage(1).then(page1 => {
        const viewport = page1.getViewport({ scale: 1 });
        originalPageDimensionsRef.current = { width: viewport.width, height: viewport.height };
        
        // Trigger recalculation of sizing now that we have dimensions
        if (pdfParentContainerRef.current) {
            const containerWidth = pdfParentContainerRef.current.clientWidth;
            if (containerWidth > 0) {
                setPdfContainerWidth(containerWidth); // This will trigger the sizing useEffect
                const newZoomLevel = containerWidth / viewport.width;
                setZoomLevel(newZoomLevel);
                setCalculatedPdfHeight(newZoomLevel * viewport.height);
            }
        }

      }).catch(error => {
        console.error("Error getting page 1 dimensions:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error fetching page 1.";
        setPdfLoadError(`Erro ao carregar dimensões da página: ${errorMessage}`);
        toast({
          title: "Erro ao Carregar Dimensões da Página",
          description: `Não foi possível obter as dimensões da primeira página do PDF. Detalhes: ${errorMessage}`,
          variant: "destructive",
        });
      });
    }
  };
  
  const onDocumentLoadError = (error: Error) => {
    console.error('Failed to load PDF Document:', error.message);
    let friendlyMessage = `Erro ao carregar o documento PDF: ${error.message}.`;
    if (error.message.includes('Invalid PDF structure') || error.message.includes('Network API failed')) {
        friendlyMessage += " Verifique se o arquivo '/ebook-maestria-jurisp-pdf.pdf' está na pasta 'public' e é um PDF válido."
    } else if (error.message.includes('Missing PDF')) {
        friendlyMessage = "Arquivo PDF não encontrado. Verifique se '/ebook-maestria-jurisp-pdf.pdf' existe na pasta 'public'."
    }
    setPdfLoadError(friendlyMessage);
    toast({ title: "Erro ao Carregar PDF", description: friendlyMessage, variant: "destructive" });
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
  
  const PdfDynamicSizedPlaceholder = ({text}: {text: string}) => (
    <div
      className="flex justify-center items-center w-full bg-muted rounded-lg shadow-inner"
      style={{ 
        height: typeof calculatedPdfHeight === 'number' && calculatedPdfHeight > 50 ? `${calculatedPdfHeight}px` : '488px', // Ensure placeholder has a reasonable min height
        width: pdfContainerWidth ? `${pdfContainerWidth}px` : '100%' 
      }}
    >
      <p className="text-sm text-muted-foreground p-4 text-center">{text}</p>
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
              <div ref={pdfParentContainerRef} className="w-full max-w-xl rounded-lg shadow-2xl mt-4">
                <ScrollArea
                  className="rounded-lg border bg-muted pdf-scroll-area"
                   style={{ 
                    height: typeof calculatedPdfHeight === 'number' && calculatedPdfHeight > 50 ? `${calculatedPdfHeight}px` : '488px',
                  }}
                >
                  {isLoadingPdfModule ? (
                    <PdfDynamicSizedPlaceholder text="Carregando visualizador de PDF..." />
                  ) : pdfLoadError ? (
                    <PdfDynamicSizedPlaceholder text={pdfLoadError} />
                  ) : pdfModule && pdfContainerWidth && originalPageDimensionsRef.current ? (
                    <pdfModule.Document
                      file="/ebook-maestria-jurisp-pdf.pdf"
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      className="flex flex-col items-center py-2"
                      loading={<PdfDynamicSizedPlaceholder text="Carregando PDF..." />}
                    >
                      {numPages && numPages > 0 && (
                        <pdfModule.Page
                          pageNumber={1} 
                          scale={zoomLevel}
                          className="mb-2 shadow-md"
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          loading="" 
                          onLoadError={(error: any) => {
                            const pageLoadErrorMessage = `Erro ao carregar página 1: ${error?.message || 'desconhecido'}`;
                            console.error(pageLoadErrorMessage, error);
                            setPdfLoadError(pageLoadErrorMessage);
                            toast({ title: `Erro ao Carregar Página 1`, description: `Não foi possível carregar a página do PDF. Detalhes: ${pageLoadErrorMessage}`, variant: "destructive" });
                          }}
                        />
                      )}
                    </pdfModule.Document>
                  ) : (
                     <PdfDynamicSizedPlaceholder text="Preparando visualizador de PDF..." />
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
    
