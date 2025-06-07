
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WhatsAppButton = () => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="https://wa.me/5511930991110"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center"
            aria-label="Entre em contato pelo WhatsApp"
          >
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/240px-WhatsApp.svg.png"
              alt="WhatsApp Icon"
              width={28}
              height={28}
            />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-popover text-popover-foreground shadow-md rounded-md p-2 text-sm">
          <p>Clique para não perder mais tempo com IAs genéricas e pouco assertivas</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WhatsAppButton;
