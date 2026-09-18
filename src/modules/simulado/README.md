# Module: Simulado (Recap SENAC 2026)

> **AGENT NOTICE - ACTIVE WORK IN PROGRESS**
> This directory (`src/modules/simulado/`) is under active implementation by the Simulado Agent.
> Please do not overwrite, delete, or re-scaffold files in this folder without coordination.

---

## 1. Purpose and Responsibilities

This module delivers the **Simulado Formativo** for Turma 001 of the Técnico em Informática course at SENAC. It fulfills Milestone 2 (M2-SIMULADO) as specified in `docs/00_governanca/03_requisitos.md` (requirements `RF-SIM-001` through `RF-SIM-020`) and the project charter (`AGENTS.md`).

Key responsibilities:
- **Question Bank Integration**: Consumes validated questions from `content/questions/` mapped to the 3 course axes (`support`, `networks`, `development`) and 16 curricular units (UC01-UC16).
- **Randomization with Integrity**: Randomizes question order and alternative positions per attempt while strictly preserving answer correctness (Rule L-14).
- **Multi-Modal Evaluation**: Evaluates Multiple Choice (`MULTIPLE_CHOICE`), True/False (`TRUE_FALSE`), and Normalized Short Answer (`SHORT_ANSWER`) questions.
- **Pedagogical Feedback**: Provides immediate and post-exam feedback with comprehensive explanations and curricular links for every question.
- **Reinforcement Mode**: Allows students to launch a targeted retry attempt containing only missed questions (`RF-SIM-015`, `RF-SIM-016`).
- **Symbolic Certificate**: Generates a printable achievement certificate recognizing participation and score without claiming institutional accreditation.
- **Stock Imagery Banners**: Displays domain-specific technical stock imagery in the question runner with gradient contrast scrims and offline SVG fallbacks.

---

## 2. Architecture & Domain Boundaries

Per the modular monolith design (`docs/03_arquitetura/00_arquitetura.md`):
- **Decoupled from Teacher Live Session**: The Simulado runs independently of the teacher-led live session ranking state in `src/modules/recap/`. It does not mutate or interfere with `recap` tables or session state machines.
- **Shared Dependencies**: Uses shared schemas from `src/modules/content/domain/contentSchemas.ts`, global CSS tokens from `src/styles/global.css`, and taxonomy from `content/taxonomy/course.json`.
- **Public Surface**: Exports `<SimuladoContainer />` from `src/modules/simulado/ui/SimuladoContainer.tsx` as the single entry point mounted in `src/app/App.tsx`.

---

## 3. Directory Structure

```text
src/modules/simulado/
|-- domain/
|   |-- simuladoTypes.ts          # Core attempt, presentation, answer, and filter types
|   |-- simuladoEngine.ts         # Pure domain logic (sampling, shuffling, grading, summaries)
|   `-- simuladoEngine.test.ts    # Unit tests for domain rules and randomness
|-- application/
|   |-- simuladoService.ts        # Attempt lifecycle and localStorage persistence
|   `-- questionBank.ts           # Curated question loader bundled for instant client execution
|-- ui/
|   |-- simulado.css              # Custom styling adhering to impeccable/taste-skill principles
|   |-- QuestionBanner.tsx        # Stock photo header with offline fallback
|   |-- SimuladoSetup.tsx         # Filter and setup configuration screen
|   |-- QuestionRunner.tsx        # Question card with keyboard shortcuts & options
|   |-- SimuladoResults.tsx       # Performance dashboard, error breakdown & retry trigger
|   |-- CertificateModal.tsx      # Printable achievement certificate modal
|   |-- SimuladoContainer.tsx     # Main module view orchestrator
|   `-- SimuladoContainer.test.tsx # Component integration tests
`-- README.md                     # This coordination file
```

---

## 4. Verification and Quality Gates

All code in this module conforms to:
- Biome linting and formatting (`npm run lint`).
- TypeScript strict mode with no implicit `any` (`npm run typecheck`).
- Vitest unit and integration tests (`npm test`).
- Content validation (`npm run content:validate`).
