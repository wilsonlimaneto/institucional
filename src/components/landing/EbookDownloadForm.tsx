"use client";

import { useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EbookFormSchema, type EbookFormData } from '@/types';
import { submitEbookForm, type FormState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-headline text-lg" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
      {pending ? 'Submitting...' : 'Download Ebook'}
    </Button>
  );
}

const EbookDownloadForm = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialFormState: FormState = { message: "", success: false };
  const [formState, formAction] = useActionState(submitEbookForm, initialFormState);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<EbookFormData>({
    resolver: zodResolver(EbookFormSchema),
    defaultValues: { 
      name: formState?.fields?.name || '',
      email: formState?.fields?.email || '',
    }
  });

  useEffect(() => {
    if (formState.message) {
      toast({
        title: formState.success ? "Success!" : "Oops!",
        description: formState.message,
        variant: formState.success ? "default" : "destructive",
      });
    }
    if (formState.success) {
      formRef.current?.reset(); 
      reset(); 
    }
  }, [formState, toast, reset]);
  

  return (
    <section id="ebook" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <Card className="shadow-xl bg-card">
              <CardHeader>
                <CardTitle className="text-3xl text-primary">Get Your Free Ebook!</CardTitle>
                <CardDescription className="text-card-foreground/80">
                  Unlock valuable insights with our exclusive guide. Enter your details below to get your copy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} action={formAction} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold text-card-foreground">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register('name')}
                      aria-invalid={errors.name || (formState.issues && formState.fields?.name === register('name').name) ? "true" : "false"}
                      className="bg-input text-foreground placeholder:text-muted-foreground"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold text-card-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register('email')}
                      aria-invalid={errors.email || (formState.issues && formState.fields?.email === register('email').name) ? "true" : "false"}
                      className="bg-input text-foreground placeholder:text-muted-foreground"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                  {formState?.issues && !formState.success && (
                    <div className="text-sm text-destructive">
                      <p>{formState.message}</p>
                      <ul>
                        {formState.issues.map((issue, index) => (
                          <li key={index}>- {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <SubmitButton />
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/3] rounded-xl overflow-hidden shadow-2xl group">
            <Image
              src="https://placehold.co/600x800.png"
              alt="Ebook Cover"
              layout="fill"
              objectFit="cover"
              className="transform group-hover:scale-105 transition-transform duration-300 ease-in-out"
              data-ai-hint="ebook cover design"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EbookDownloadForm;
