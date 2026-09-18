import { useState } from "react";
import type { AxisId, Question } from "../../content/domain/contentSchemas";

type QuestionBannerProps = {
  readonly question: Question;
  readonly currentIndex: number;
  readonly totalQuestions: number;
};

type StockBanner = {
  readonly url: string;
  readonly alt: string;
  readonly category: string;
};

const STOCK_BANNERS: Record<AxisId, StockBanner> = {
  support: {
    url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1400&q=80",
    alt: "Placa-mãe de computador com soquete de processador e trilhas eletrônicas",
    category: "Suporte e Manutenção",
  },
  networks: {
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
    alt: "Bastidor de servidores em datacenter com cabos de rede e iluminação técnica",
    category: "Redes e Servidores",
  },
  development: {
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80",
    alt: "Monitor exibindo código-fonte com sintaxe destacada em tema escuro",
    category: "Desenvolvimento de Aplicativos",
  },
};

const SPECIFIC_STOCK_BANNERS: Record<string, StockBanner> = {
  sql: {
    url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1400&q=80",
    alt: "Sistemas de armazenamento e servidores de banco de dados corporativos",
    category: "Banco de Dados & Armazenamento",
  },
  css: {
    url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1400&q=80",
    alt: "Área de trabalho de design web com wireframes e elementos visuais",
    category: "Design Web & Interfaces",
  },
};

const DIFFICULTY_LABELS: Record<string, string> = {
  FOUNDATION: "Básica",
  INTERMEDIATE: "Intermediária",
  ADVANCED: "Avançada",
};

export function QuestionBanner({ question, currentIndex, totalQuestions }: QuestionBannerProps) {
  const [imageFailed, setImageFailed] = useState(false);

  const matchedTag = question.tags.find((tag) => tag in SPECIFIC_STOCK_BANNERS);
  const banner: StockBanner = (matchedTag && SPECIFIC_STOCK_BANNERS[matchedTag]) ||
    STOCK_BANNERS[question.axisId] || {
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
      alt: "Equipamentos de informática e ambiente técnico",
      category: "Tecnologia da Informação",
    };

  const primaryUc = question.unitIds[0] ?? "UC";
  const diffLabel = DIFFICULTY_LABELS[question.difficulty] ?? question.difficulty;

  return (
    <section className="sim-banner" aria-label={`Banner contextual: ${banner.category}`}>
      {!imageFailed ? (
        <img
          className="sim-banner__image"
          src={banner.url}
          alt={banner.alt}
          loading="eager"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="sim-banner__fallback-pattern" aria-hidden="true" />
      )}
      <div className="sim-banner__scrim" aria-hidden="true" />
      <div className="sim-banner__content">
        <div className="sim-banner__chips">
          <span className="sim-chip sim-chip--axis">{banner.category}</span>
          <span className="sim-chip sim-chip--uc">{primaryUc}</span>
          <span className="sim-chip sim-chip--difficulty">{diffLabel}</span>
        </div>
        <div className="sim-banner__meta">
          <span className="sim-banner__counter">
            Questão <strong>{currentIndex + 1}</strong> de <strong>{totalQuestions}</strong>
          </span>
          <span className="sim-banner__source">Fonte: {question.source.reference}</span>
        </div>
      </div>
    </section>
  );
}
