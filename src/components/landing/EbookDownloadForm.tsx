
'use client';

import { useState, useEffect, useActionState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import dynamic from 'next/dynamic';

const PdfDocument = dynamic(async () => {
  const { Document, pdfjs } = await import('react-pdf');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
  ).toString();
  return Document;
}, {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center w-full max-w-sm h-[424px] bg-muted rounded-lg shadow-inner">
      <p className="text-sm text-muted-foreground">Loading PDF preview...</p>
    </div>
  ),
});

const PdfPage = dynamic(() => import('react-pdf').then(mod => mod.Page), {
  ssr: false,
});


const EbookDownloadForm = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const { toast } = useToast();

  const initialFormState: FormState = { message: "", success: false };
  const [formState, formAction] = useActionState(submitEbookForm, initialFormState);

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      areaOfLaw: ""
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

  const onSubmit = (data: EbookFormData) => {
    const formData = new FormData();
    (Object.keys(data) as Array<keyof EbookFormData>).forEach((key) => {
      const value = data[key];
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      } else if (key === 'phone' || key === 'areaOfLaw') {
        // Explicitly don't append if optional and empty/undefined
      } else {
        formData.append(key, ''); // Append empty for other potentially non-optional but empty fields if necessary
      }
    });
    formAction(formData);
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
              action={formAction}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Input 
                {...register("name")} 
                type="text" 
                placeholder="Nome" 
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              
              <Input 
                {...register("email")} 
                type="email" 
                placeholder="E-mail" 
                aria-invalid={errors.email ? "true" : "false"}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}

              <Input 
                {...register("phone")} 
                type="tel" 
                placeholder="Celular (Opcional)" 
              />
               {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}

              <Controller
                name="areaOfLaw"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ""}
                    defaultValue=""
                  >
                    <SelectTrigger aria-invalid={errors.areaOfLaw ? "true" : "false"}>
                      <SelectValue placeholder="Ramo de Atuação (Opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" disabled>Selecione uma área (Opcional)</SelectItem>
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
                file="/ebook-maestria-jurisp-pdf.pdf"
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

