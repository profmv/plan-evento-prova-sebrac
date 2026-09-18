import { useState } from "react";
import type { SimuladoSummary } from "../domain/simuladoTypes";

type CertificateModalProps = {
  readonly summary: SimuladoSummary;
  readonly attemptId: string;
  readonly onClose: () => void;
};

export function CertificateModal({ summary, attemptId, onClose }: CertificateModalProps) {
  const [recipientName, setRecipientName] = useState("Estudante Turma 001");
  const formattedDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="sim-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="cert-title">
      <div className="sim-modal-card">
        <div className="sim-modal-actions-top">
          <button className="button button--secondary" type="button" onClick={handlePrint}>
            Imprimir ou Salvar PDF
          </button>
          <button
            className="text-button"
            type="button"
            onClick={onClose}
            aria-label="Fechar certificado"
          >
            Fechar
          </button>
        </div>

        <div className="sim-certificate" id="certificate-print-area">
          <div className="sim-certificate__border">
            <header className="sim-certificate__header">
              <span className="sim-certificate__badge" aria-hidden="true">
                SENAC 2026
              </span>
              <p className="eyebrow">Reconhecimento Formativo</p>
              <h2 id="cert-title" className="sim-certificate__title">
                Certificado Simbólico de Desempenho
              </h2>
            </header>

            <div className="sim-certificate__body">
              <p>Certificamos que</p>
              <div className="sim-certificate__recipient-edit">
                <input
                  type="text"
                  aria-label="Nome do participante"
                  className="sim-certificate__input-name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nome do Estudante ou Equipe"
                />
              </div>
              <p className="sim-certificate__text">
                concluiu o <strong>Simulado Formativo de Conhecimentos Gerais</strong> preparatório
                para a avaliação de encerramento do curso <strong>Técnico em Informática</strong>,
                atingindo o aproveitamento de <strong>{summary.scorePercentage}%</strong> com{" "}
                <strong>{summary.correctCount}</strong> acertos em {summary.totalQuestions} questões
                curriculares.
              </p>
            </div>

            <footer className="sim-certificate__footer">
              <div className="sim-certificate__meta">
                <span>Data: {formattedDate}</span>
                <span className="sim-code">ID: {attemptId.slice(0, 16).toUpperCase()}</span>
              </div>
              <p className="sim-certificate__disclaimer">
                Revisão formativa interna pedagógica. Este artefato é um reconhecimento simbólico de
                dedicação e fixação de conteúdos, não constituindo certificação institucional ou
                acadêmica formal.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
