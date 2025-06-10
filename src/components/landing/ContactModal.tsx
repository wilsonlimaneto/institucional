
'use client';

import React, { useEffect, useState, startTransition } from 'react';
import Image from 'next/image'; // Import Image for WhatsApp icon
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactFormSchema, type ContactFormData, ramosDeAtuacaoList, comoNosConheceuOptions, numAdvogadosOptions } from '@/types';
import { submitContactForm, type FormState } from '@/lib/actions';
import { useRouter } from 'next/navigation'; // Import useRouter

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link'; // Import Link for WhatsApp link

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

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onOpenChange }) => {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter
  const [isSubmittingToServer, setIsSubmittingToServer] = useState(false);

  const initialServerFormState: FormState = { message: "", success: false, issues: [] };
  const [serverFormState, formAction] = React.useActionState(submitContactForm, initialServerFormState);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting: isFormProcessing },
    reset,
    control,
  } = useForm<ContactFormData>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: { name: "", email: "", phone: "", areaOfLaw: "", howHeard: "", numLawyers: "" },
  });

  const onClientValid = (data: ContactFormData) => {
    // Submit data to webhook
    const webhookUrl = 'https://hook.us2.make.com/cqfs6adut9xvjss8ec0a8wab5mmcsahj';
    const webhookData = {
      nome: data.name,
      phone: data.phone,
      email: data.email,
      ramo: data.areaOfLaw,
      origem: data.howHeard,
      tamanho: data.numLawyers,
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })
    .then(response => {
      if (!response.ok) {
        console.error('Webhook submission failed:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error sending data to webhook:', error);
    });

    // Submit data to server action
    const formDataForAction = new FormData();
    (Object.keys(data) as Array<keyof ContactFormData>).forEach((key) => {
 formDataForAction.append(key, data[key] as string);
    });

    setIsSubmittingToServer(true);
    startTransition(async () => {
      await formAction(formDataForAction);
      setIsSubmittingToServer(false);
    });
  };

  useEffect(() => {
    if (serverFormState.message && !isSubmittingToServer) {
      toast({
        title: serverFormState.success ? "Enviado com Sucesso!" : "Erro no Envio",
        description: serverFormState.message,
        variant: serverFormState.success ? "default" : "destructive",
      });
      if (serverFormState.success) {
        startTransition(() => {
          router.push('/obrigado'); 
          reset();
          onOpenChange(false);
        });
      }
    }
  }, [serverFormState, toast, isSubmittingToServer, reset, onOpenChange, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl lg:max-w-5xl p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left Side - WhatsApp Info */}
          <div className="w-full md:w-2/5 bg-secondary/20 p-8 flex flex-col justify-center items-center text-center md:rounded-l-lg">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl text-primary">Fale Conosco Diretamente</DialogTitle>
            </DialogHeader>
            <p className="text-foreground/80 mb-6 text-base">
              Se preferir, falar diretamente via WhatsApp, com um humano, clique no ícone abaixo:
            </p>
            <Link
              href="https://wa.me/5511930991110"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center w-20 h-20"
              aria-label="Entre em contato pelo WhatsApp"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/240px-WhatsApp.svg.png"
                alt="WhatsApp Icon"
                width={48}
                height={48}
              />
            </Link>
            <p className="text-xs text-foreground/60 mt-6">
              Nosso time está pronto para ajudar!
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-3/5 p-6 sm:p-8">
            <DialogHeader className="mb-1 md:mb-2">
              <DialogTitle>Entre em Contato</DialogTitle>
              <DialogDescription>
                Preencha o formulário e nossa equipe entrará em contato em breve.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onClientValid)} className="space-y-4 py-2">
              <Input
                {...register("name")}
                type="text"
                placeholder="Nome Completo"
                aria-invalid={formErrors.name ? "true" : "false"}
                className="text-base"
              />
              {formErrors.name && <p className="text-sm text-destructive">{formErrors.name.message}</p>}

              <Input
                {...register("email")}
                type="email"
                placeholder="Seu Melhor E-mail"
                aria-invalid={formErrors.email ? "true" : "false"}
                className="text-base"
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
              {formErrors.phone && <p className="text-sm text-destructive">{formErrors.phone.message}</p>}

              <Controller
                name="areaOfLaw"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={formErrors.areaOfLaw ? "true" : "false"} className="text-base">
                      <SelectValue placeholder="Qual seu ramo de atuação?" />
                    </SelectTrigger>
                    <SelectContent>
                      {ramosDeAtuacaoList.map(ramo => (
                        <SelectItem key={ramo} value={ramo}>{ramo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formErrors.areaOfLaw && <p className="text-sm text-destructive">{formErrors.areaOfLaw.message}</p>}

              <Controller
                name="howHeard"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={formErrors.howHeard ? "true" : "false"} className="text-base">
                      <SelectValue placeholder="Como nos conheceu?" />
                    </SelectTrigger>
                    <SelectContent>
                      {comoNosConheceuOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formErrors.howHeard && <p className="text-sm text-destructive">{formErrors.howHeard.message}</p>}

              <Controller
                name="numLawyers"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={formErrors.numLawyers ? "true" : "false"} className="text-base">
                      <SelectValue placeholder="Quantos advogados no seu escritório?" />
                    </SelectTrigger>
                    <SelectContent>
                      {numAdvogadosOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {formErrors.numLawyers && <p className="text-sm text-destructive">{formErrors.numLawyers.message}</p>}

              {serverFormState.issues && serverFormState.issues.length > 0 && !serverFormState.success && (
                <p className="text-sm text-destructive text-center py-2">
                  Erro no servidor: {serverFormState.message}
                </p>
              )}

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="font-semibold"
                  disabled={isFormProcessing || isSubmittingToServer}
                >
                  {isFormProcessing || isSubmittingToServer ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
