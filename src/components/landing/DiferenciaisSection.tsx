
import { CheckCircle } from 'lucide-react';

const diferenciais = [
  { text: 'Jurisprudência real, já verificada por meio de busca semântica®' },
  { text: 'Editor de documentos nativo: você não precisa copiar os textos para um editor' },
  { text: 'Integração Google Docs e MS Office' },
  { text: 'Resuma dados de longos documentos (Ago 2025)' },
  { text: 'Parceria com empresas e tecnologias reconhecidas internacionalmente' },
];

const DiferenciaisSection = () => {
  return (
    <section id="diferenciais" className="py-8 md:py-12 lg:py-16 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">Nossos Diferenciais</h2>
          <p className="mt-4 text-xl text-foreground/80 max-w-3xl mx-auto">
            Nossa plataforma oferece IA de nível profissional, com modelos específicos e tecnologia de ponta, projetada para advogados e escritórios que buscam resultados mais assertivos do que cursos de prompts ou outras soluções genéricas do mercado.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow-xl">
          <h3 className="text-xl font-semibold text-card-foreground mb-6 text-center">
            A única ferramenta que entrega:
          </h3>
          <ul className="space-y-3">
            {diferenciais.map((item, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-card-foreground/90">
                  {item.text.split('(').map((part, i) => 
                    i === 0 ? part : <span key={i}>({part.split(')').map((subPart, j) => 
                      j === 0 ? subPart : <span key={j}>{subPart})</span>
                    ).reduce((acc: (string | JSX.Element)[], curr) => acc.length ? [...acc, ')', curr] : [curr], [])}</span>
                  ).reduce((acc: (string | JSX.Element)[], curr) => acc.length ? [...acc, '(', curr] : [curr], [])}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default DiferenciaisSection;
