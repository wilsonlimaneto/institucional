
'use client';

import React, { useEffect, useState, startTransition } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';
import { useRouter } from 'next/navigation';

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

const submitToWebhook = async (data: EbookFormData) => {
  try {
    const response = await fetch('https://hook.us2.make.com/35z45k3eq3trtzdkhtv4qal7722dwjix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: data.name,
        phone: data.phone,
        email: data.email,
        ramo: data.areaOfLaw,
      }),
    });
    if (!response.ok) {
      console.error('Webhook submission failed:', response.statusText);
    }
  } catch (error) {
    console.error('Error submitting to webhook:', error);
  }
};

const EbookDownloadForm = () => {
  const { toast } = useToast();
  const router = useRouter();

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
    submitToWebhook(data); // Fire-and-forget webhook submission

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
    if (serverFormState.message && !isSubmittingToServer) {
      if (serverFormState.success) {
        toast({
          title: "Submissão Registrada!",
          description: serverFormState.message,
          variant: "default",
        });

        const pdfUrl = 'https://www.dropbox.com/scl/fi/2332tgss2fp87nxepw86m/ebook-maestria-jurisp-pdf.pdf?rlkey=w7s28864lw8omiolua5l61f3b&dl=1';
        let openedNewTab = false;
        try {
          window.open(pdfUrl, '_blank');
          openedNewTab = true; 
        } catch (error) {
          console.error("Error opening PDF in new tab:", error);
          toast({
            title: "Erro ao Abrir PDF",
            description: "Não foi possível abrir o e-book em uma nova aba. Verifique seu bloqueador de pop-ups ou tente manualmente.",
            variant: "destructive",
          });
        }

        if (openedNewTab) {
          startTransition(() => {
            router.push('/obrigado');
            reset(); 
          });
        }
      } else { 
        toast({
          title: "Erro no Servidor",
          description: serverFormState.message || "Não foi possível processar sua solicitação.",
          variant: "destructive",
        });
      }
    }
  }, [serverFormState, toast, isSubmittingToServer, router, reset]);

  const ramosDeAtuacao = [
    "Administrativo", "Adv. Pública", "Civil", "Digital", "Empresarial", "Família",
    "Imobiliário", "Magistratura", "Penal", "Previdenciário", "Privacidade de Dados",
    "Promotoria", "Sucessões", "Trabalhista", "Tributário"
  ].sort();

  return (
    <>
      <section id="ebook" className="py-16 md:py-24 lg:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex flex-col justify-center items-center space-y-4 w-full mx-auto sm:max-w-md md:max-w-none md:mx-0">
              <div className="w-[280px] h-[396px] sm:w-[320px] sm:h-[452px] md:w-[378px] md:h-[535px] border-2 border-border overflow-y-scroll overflow-x-hidden shadow-lg bg-background">
                <Image src="/Slide1.PNG" alt="Slide 1 do E-book Maestria Jurisp" width={800} height={600} layout="responsive" />
                <Image src="/Slide2.PNG" alt="Slide 2 do E-book Maestria Jurisp" width={800} height={600} layout="responsive" />
                <Image src="/Slide3.PNG" alt="Slide 3 do E-book Maestria Jurisp" width={800} height={600} layout="responsive" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground text-center mt-1">
                (Amostra do E-Book)
              </h3>
            </div>

            <div className="space-y-6 text-center md:text-left w-full mx-auto sm:max-w-md md:max-w-2xl md:mx-0">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Baixe nosso E-book Exclusivo
              </h2>
              <p className="text-lg md:text-xl text-foreground/80">
                Entenda, em 4 exemplos, por que a qualidade da nossa busca semântica supera todas as ferramentas do mercado
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
                  className="text-base"
                />
                {formErrors.name && <p className="text-sm text-destructive text-left">{formErrors.name.message}</p>}

                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Seu Melhor E-mail"
                  aria-invalid={formErrors.email ? "true" : "false"}
                  className="text-base"
                />
                {formErrors.email && <p className="text-sm text-destructive text-left">{formErrors.email.message}</p>}

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
                        className="pl-12 pr-3 py-2 w-full text-base"
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
                 {formErrors.phone && <p className="text-sm text-destructive text-left">{formErrors.phone.message}</p>}

                <Controller
                  name="areaOfLaw"
                  control={control}
                  render={({ field }) => (
                      <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                      >
                          <SelectTrigger aria-invalid={formErrors.areaOfLaw ? "true" : "false"} className="text-base">
                          <SelectValue placeholder="Qual seu ramo de atuação" />
                          </SelectTrigger>
                          <SelectContent>
                          {ramosDeAtuacao.map(ramo => (
                              <SelectItem key={ramo} value={ramo}>{ramo}</SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                  )}
                />
                {formErrors.areaOfLaw && <p className="text-sm text-destructive text-left">{formErrors.areaOfLaw.message}</p>}

                {serverFormState.issues && serverFormState.issues.length > 0 && !serverFormState.success && (
                  <p className="text-sm text-destructive text-center py-2">
                    Erro no servidor: {serverFormState.message}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full font-semibold h-11 px-4 sm:px-6 text-base"
                  disabled={isFormProcessing || isSubmittingToServer}
                >
                  {isFormProcessing || isSubmittingToServer ? "Processando..." : "Receba GRATUITAMENTE"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EbookDownloadForm;
    
    
