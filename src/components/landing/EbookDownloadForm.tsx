
'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import type { DocumentProps as ReactPdfDocumentProps, PageProps as ReactPdfPageProps, PDFDocumentProxy } from 'react-pdf';

// Import CSS for react-pdf
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
  pdfjs: any; 
}

const EbookDownloadForm = () => {
  const { toast } = useToast();
  
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
  
  const pdfParentContainerRef = useRef<HTMLDivElement>(null);
  const [pdfContainerWidth, setPdfContainerWidth] = useState<number | null>(null);
  const [calculatedPdfHeight, setCalculatedPdfHeight] = useState<string>("550px"); // Default height
  const [currentZoomLevel, setCurrentZoomLevel] = useState(1.0);
  const [originalPdfPageSize, setOriginalPdfPageSize] = useState<{width: number, height: number} | null>(null);


  useEffect(() => {
    const loadPdfDependencies = async () => {
      setIsLoadingPdfModule(true);
      setPdfLoadError(null);
      try {
        console.log("Attempting to load react-pdf module...");
        // Dynamically import react-pdf
        const RPDF = await import('react-pdf');
        console.log("react-pdf module loaded.", RPDF);

        // DO NOT set RPDF.pdfjs.GlobalWorkerOptions.workerSrc here.
        // Let pdfjs-dist handle worker loading with Webpack's help (from next.config.js).
        // Webpack is configured to place pdf.worker.min.mjs in static/chunks/
        // pdfjs-dist should try to load it relative to its own path.

        if (!RPDF.pdfjs) {
          console.error("RPDF.pdfjs is undefined after import. This is unexpected.");
          throw new Error("pdfjs object not found in react-pdf module.");
        }
        
        setPdfModule({ 
          Document: RPDF.Document, 
          Page: RPDF.Page,
          pdfjs: RPDF.pdfjs // Store pdfjs for potential direct use if needed
        });
        console.log("PDF module and components set.");

      } catch (error) {
        console.error("Failed to load react-pdf module or worker issue:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error loading PDF module.";
        setPdfLoadError(`Não foi possível inicializar o visualizador de PDF: ${errorMessage}`);
        toast({
          title: "Erro Módulo PDF",
          description: `Não foi possível inicializar o visualizador de PDF. Detalhes: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsLoadingPdfModule(false);
      }
    };
    loadPdfDependencies();
  }, [toast]);


  useEffect(() => {
    const currentRef = pdfParentContainerRef.current;
    if (!currentRef) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setPdfContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(currentRef);
    // Set initial width
    setPdfContainerWidth(currentRef.offsetWidth); 

    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
      resizeObserver.disconnect();
    };
  }, []);

  // Effect to calculate PDF scale and height based on container width and original PDF page size
  useEffect(() => {
    if (pdfContainerWidth && originalPdfPageSize && originalPdfPageSize.width > 0) {
      const scale = pdfContainerWidth / originalPdfPageSize.width;
      setCurrentZoomLevel(scale);
      
      // Calculate height to fit one page perfectly based on aspect ratio
      const calculatedHeight = originalPdfPageSize.height * scale;
      setCalculatedPdfHeight(`${calculatedHeight}px`);
      console.log(`PDF container width: ${pdfContainerWidth}, Original page: ${originalPdfPageSize.width}x${originalPdfPageSize.height}, Calculated scale: ${scale}, Calculated height: ${calculatedHeight}px`);
    } else if (pdfContainerWidth && !originalPdfPageSize) {
      // If we have container width but no PDF size yet, maintain a default reasonable height
      setCalculatedPdfHeight("550px"); // Or another suitable default
    }
  }, [pdfContainerWidth, originalPdfPageSize]);


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

  const onDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    console.log("PDF Document loaded successfully. Pages:", pdf.numPages);
    setPdfLoadError(null); // Clear any previous load errors
    setNumPages(pdf.numPages);
    if (pdf.numPages > 0) {
      pdf.getPage(1).then(page => {
        // Store original page dimensions at scale 1
        const viewport = page.getViewport({ scale: 1 }); 
        setOriginalPdfPageSize({ width: viewport.width, height: viewport.height });
        console.log(`Original PDF page 1 dimensions: ${viewport.width}x${viewport.height}`);
      }).catch(pageLoadError => {
        console.error('Failed to load page 1 for dimensions:', pageLoadError);
        const errorMsg = pageLoadError instanceof Error ? pageLoadError.message : String(pageLoadError);
        setPdfLoadError(`Erro ao carregar informações da página 1 do PDF: ${errorMsg}`);
      });
    }
  }, []);
  
  const onDocumentLoadError = (error: Error) => {
    console.error('Failed to load PDF Document:', error);
    let friendlyMessage = `Erro ao carregar o documento PDF: ${error.message}.`;
    
    if (error.message?.toLowerCase().includes('missing pdf')) {
        friendlyMessage = "Arquivo PDF não encontrado. Verifique se '/ebook-maestria-jurisp-pdf.pdf' existe na pasta 'public' e o caminho está correto.";
    } else if (error.message?.toLowerCase().includes('invalid pdf structure')) {
        friendlyMessage += " O arquivo PDF pode estar corrompido ou não ser um PDF válido.";
    } else if (error.message?.toLowerCase().includes('network') || error.message?.toLowerCase().includes('http')) {
        friendlyMessage += " Problema de rede ao tentar carregar o PDF. Verifique sua conexão ou o caminho do arquivo.";
    } else if (error.message?.toLowerCase().includes('worker') || error.message?.toLowerCase().includes('fakeworker') || error.message?.toLowerCase().includes('especificador')) {
        friendlyMessage = `Erro com o processador de PDF (worker): ${error.message}. Isso pode ser um problema de configuração do Webpack, da rede ou do ambiente. Verifique o console para mais detalhes. Tente reiniciar o servidor de desenvolvimento e atualizar a página.`;
    }


    setPdfLoadError(friendlyMessage);
    toast({ title: "Erro ao Carregar PDF", description: friendlyMessage, variant: "destructive" });
  };

  // Handler for errors during page rendering (though we mostly care about document load)
  const onPageLoadError = (error: Error) => {
    console.error('Failed to load PDF Page:', error);
    const pageLoadErrorMessage = `Erro ao carregar página do PDF: ${error.message || 'desconhecido'}`;
    // Optionally, update pdfLoadError state here if it's critical
    // setPdfLoadError(pageLoadErrorMessage); 
    toast({ title: `Erro Página PDF`, description: pageLoadErrorMessage, variant: "destructive" });
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
  
  // Simple placeholder component for loading/error states
  const SimplePlaceholder = ({text, height = '400px'}: {text: string, height?: string}) => (
    <div
      className="flex justify-center items-center w-full bg-muted rounded-lg shadow-inner"
      style={{ height }} // Use dynamic height
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
            {/* PDF Preview Area */}
            <div ref={pdfParentContainerRef} className="flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Amostra do E-book</h3>
              <div className="w-full max-w-xl rounded-lg shadow-2xl mt-4 border bg-muted">
                <ScrollArea className="pdf-scroll-area" style={{ height: calculatedPdfHeight }}> 
                  {isLoadingPdfModule ? (
                    <SimplePlaceholder text="Carregando visualizador de PDF..." height={calculatedPdfHeight} />
                  ) : pdfLoadError ? (
                    <SimplePlaceholder text={pdfLoadError} height={calculatedPdfHeight} />
                  ) : pdfModule && pdfContainerWidth ? (
                    <pdfModule.Document
                      file="/ebook-maestria-jurisp-pdf.pdf" // Path relative to /public
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      className="flex flex-col items-center py-2" // Centering the page within the Document
                      loading={<SimplePlaceholder text="Carregando PDF..." height={calculatedPdfHeight}/>}
                    >
                      {/* Render page only if numPages, originalPdfPageSize, and currentZoomLevel are valid */}
                      {numPages && numPages > 0 && originalPdfPageSize && currentZoomLevel > 0 ? (
                        <pdfModule.Page
                          pageNumber={1} // Show first page as preview
                          scale={currentZoomLevel}
                          className="mb-2 shadow-md" // Optional: for styling the page
                          onLoadError={onPageLoadError} // Error during page rendering
                          loading={<SimplePlaceholder text="Carregando página..." height={calculatedPdfHeight}/>} // Placeholder for page loading
                          renderAnnotationLayer={false} // Disable annotation layer for preview
                          renderTextLayer={false} // Disable text layer for preview for simplicity
                        />
                      ) : !pdfLoadError ? ( 
                        // This case might occur if document loaded but page 1 info is still pending or numPages is 0
                        <SimplePlaceholder text="Nenhuma página para exibir ou PDF ainda carregando." height={calculatedPdfHeight}/>
                      ) : null /* If pdfLoadError is set, the main error placeholder is already shown */}
                    </pdfModule.Document>
                  ) : (
                     // Fallback if pdfModule or pdfContainerWidth is not yet ready
                     <SimplePlaceholder text="Preparando visualizador de PDF..." height={calculatedPdfHeight}/>
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
