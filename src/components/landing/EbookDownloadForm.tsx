
'use client';

import React, { useEffect, useState, startTransition } from 'react';
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
import { FileText } from 'lucide-react';

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

const EbookDownloadForm = () => {
  const { toast } = useToast();
  
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [isSubmittingToServer, setIsSubmittingToServer] = useState(false);

  const initialServerFormState: FormState = { message: "", success: false, issues: [] };
  const [serverFormState, formAction] = React.useActionState(submitEbookForm, initialServerFormState);

  const { 
    register, 
    handleSubmit, 
    formState: { errors: formErrors, isSubmitting: isFormProcessing }, 
    reset, 
    control 
  } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: { name: "", email: "", phone: "", areaOfLaw: "" }
  });

  const onClientValid = (data: EbookFormData) => {
    setShowDownloadDialog(true); 

    const formDataForAction = new FormData();
    (Object.keys(data) as Array<keyof EbookFormData>).forEach((key) => {
      formDataForAction.append(key, data[key]);
    });
    
    setIsSubmittingToServer(true);
    startTransition(async () => {
      await formAction(formDataForAction); 
      setIsSubmittingToServer(false);
    });
  };

  useEffect(() => {
    if (serverFormState.message && serverFormState.message !== "" && !isSubmittingToServer) {
      toast({
        title: serverFormState.success ? "Submissão Registrada!" : "Erro no Servidor",
        description: serverFormState.message,
        variant: serverFormState.success ? "default" : "destructive",
      });
    }
  }, [serverFormState, toast, isSubmittingToServer]);

  const ramosDeAtuacao = [
    "Administrativo", "Adv. Pública", "Civil", "Digital", "Empresarial", "Família",
    "Imobiliário", "Magistratura", "Penal", "Previdenciário", "Privacidade de Dados",
    "Promotoria", "Sucessões", "Trabalhista", "Tributário"
  ].sort();

  const handleDirectDownload = () => {
    const link = document.createElement('a');
    link.href = 'https://www.dropbox.com/scl/fi/2332tgss2fp87nxepw86m/ebook-maestria-jurisp-pdf.pdf?rlkey=w7s28864lw8omiolua5l61f3b&dl=1';
    link.setAttribute('download', 'ebook-maestria-jurisp-pdf.pdf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowDownloadDialog(false);
    reset(); 
  };
  
  return (
    <>
      <section id="ebook" className="py-16 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="flex flex-col justify-center items-center space-y-4 w-full min-w-0">
              <h3 className="text-2xl font-bold tracking-tight text-foreground text-center">
                Amostra do E-Book
              </h3>
              <div className="w-full max-w-[420px] h-[594px] border-2 border-gray-300 overflow-y-scroll overflow-x-hidden shadow-lg">
                <img src="/Slide1.PNG" alt="Slide 1" className="w-full h-auto" />
                <img src="/Slide2.PNG" alt="Slide 2" className="w-full h-auto" />
                <img src="/Slide3.PNG" alt="Slide 3" className="w-full h-auto" />
              </div>
            </div>

            <div className="space-y-6 text-center md:text-left max-w-2xl mx-auto md:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Baixe nosso E-book Exclusivo
              </h2>
              <p className="text-lg md:text-xl text-foreground/80">
                Aprenda os segredos da IA para advogados e transforme sua carreira.
              </p>
              <form
                onSubmit={handleSubmit(onClientValid)}
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

                {serverFormState.issues && serverFormState.issues.length > 0 && !serverFormState.success && (
                  <p className="text-sm text-destructive text-center py-2">
                    Erro no servidor: {serverFormState.message}
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full font-semibold" disabled={isFormProcessing || isSubmittingToServer}>
                  {isFormProcessing || isSubmittingToServer ? "Processando..." : "Clique para receber GRATUITAMENTE o E-Book"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <AlertDialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download Pronto!</AlertDialogTitle>
            <AlertDialogDescription>
              Seu e-book está pronto. Clique no botão abaixo para baixar o arquivo (.pdf).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDirectDownload} className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Baixar E-book (.pdf)
            </AlertDialogAction>
            <AlertDialogCancel onClick={() => {
              setShowDownloadDialog(false);
            }}>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EbookDownloadForm;
