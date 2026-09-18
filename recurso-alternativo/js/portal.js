/**
 * Portal Engine - Recap SENAC 2026
 * Orchestrates the student learning track, minigame launches, and cryptographic badge awards.
 */

(function () {
    const STORAGE_KEY_STUDENT = "SENAC_STUDENT_NAME";
    const STORAGE_KEY_BADGES = "SENAC_STUDENT_BADGES";

    // Minigames Registry grouped by SENAC Curricular Axes
    const MINIGAMES_DATA = [
        // Eixo 1: Suporte e Manutenção
        {
            id: "pc-hardware",
            axis: "Eixo 1: Suporte e Manutenção",
            axisId: "eixo-1",
            title: "Montagem e Diagnóstico de PC",
            category: "Hardware & Suporte",
            timeLimit: "20 min",
            curriculum: "UC01 / UC02: Montagem, barramentos, soquetes, memória e diagnóstico POST",
            description: "Encaixe processador, cooler, memórias RAM dual-channel, placa-mãe, SSD NVMe e fonte de alimentação. Conecte os cabos e teste o boot da BIOS em até 20 minutos.",
            url: "minigames/pc-montagem/index.html",
            medalTitle: "Técnico Especialista em Hardware"
        },
        {
            id: "logic-gates",
            axis: "Eixo 1: Suporte e Manutenção",
            axisId: "eixo-1",
            title: "Laboratório: Do NAND ao Somador",
            category: "Arquitetura Digital",
            timeLimit: "20 min",
            curriculum: "UC01 / UC03: Circuitos combinacionais, álgebra booleana e arquitetura de computadores",
            description: "Baseado no Nand2Tetris. Construa as portas fundamentais (NOT, AND, OR, XOR) a partir de blocos NAND e finalize com um Meio Somador funcional.",
            url: "minigames/logica-nand/index.html",
            medalTitle: "Arquiteto de Circuitos Digitais"
        },

        // Eixo 2: Redes e Servidores
        {
            id: "bashcrawl",
            axis: "Eixo 2: Redes e Servidores",
            axisId: "eixo-2",
            title: "Masmorra do Terminal Linux",
            category: "Sistemas Operacionais & Linux",
            timeLimit: "20 min",
            curriculum: "UC05 / UC06: Administração de sistemas GNU/Linux, comandos shell e permissões POSIX",
            description: "Baseado no Bashcrawl. Explore masmorras escuras usando apenas comandos de terminal (pwd, ls, cd, cat, chmod). Encontre a câmara do tesouro e derrote o guardião.",
            url: "repos/bashcrawl/index.html",
            medalTitle: "Explorador Mestre do Terminal Linux"
        },
        {
            id: "subnetting_game",
            axis: "Eixo 2: Redes e Servidores",
            axisId: "eixo-2",
            title: "Arquiteto de Sub-redes IPv4",
            category: "Infraestrutura de Redes",
            timeLimit: "20 min",
            curriculum: "UC05 / UC07: Endereçamento IPv4, cálculo de máscara CIDR, gateway e broadcast",
            description: "Aloque blocos de rede para empresas e campi universitários em 10 cenários dinâmicos de cálculo de máscara CIDR, primeiro/último IP útil e broadcast.",
            url: "repos/subnetting_game/index.html",
            medalTitle: "Arquiteto Certificado de Redes IPv4"
        },

        // Eixo 3: Desenvolvimento de Aplicações
        {
            id: "sql-mysteries",
            axis: "Eixo 3: Desenvolvimento de Aplicações",
            axisId: "eixo-3",
            title: "O Mistério do Assassinato em SQL",
            category: "Bancos de Dados Relacionais",
            timeLimit: "20 min",
            curriculum: "UC09 / UC10: Modelagem relacional, consultas SQL, junções JOIN, filtros WHERE e agregação",
            description: "Um crime ocorreu em SQL City! Investigue relatórios policiais, interrogue testemunhas e cruze registros de eventos e academias via SQL para capturar o culpado.",
            url: "repos/sql-mysteries/index-ptbr.html",
            medalTitle: "Detetive Investigador de Dados SQL"
        },
        {
            id: "untrusted",
            axis: "Eixo 3: Desenvolvimento de Aplicações",
            axisId: "eixo-3",
            title: "Dr. Eval: Lógica e Fuga em JavaScript",
            category: "Lógica de Programação & Segurança",
            timeLimit: "20 min",
            curriculum: "UC09 / UC11: Algoritmos, manipulação de matrizes, escopo e execução de código JS",
            description: "Você está preso em uma simulação computacional. Edite os trechos abertos do código-fonte do próprio jogo em JavaScript para escapar das câmaras de confinamento.",
            url: "repos/untrusted/index.html",
            medalTitle: "Hacker e Engenheiro de Código JS"
        },
        {
            id: "turing-machine",
            axis: "Eixo 3: Desenvolvimento de Aplicações",
            axisId: "eixo-3",
            title: "Simulador de Máquina de Turing",
            category: "Teoria da Computação",
            timeLimit: "20 min",
            curriculum: "UC09 / UC10: Autômatos finitos, computabilidade, transições de estado e algoritmos",
            description: "Visualize a fita infinita, o cabeçote de leitura/gravação e o autômato de estados. Resolva o desafio de inversão binária e verificação de sequências.",
            url: "repos/turing-machine-viz/index.html",
            medalTitle: "Pioneiro da Ciência da Computação"
        },
        {
            id: "method-draw",
            axis: "Eixo 3: Desenvolvimento de Aplicações",
            axisId: "eixo-3",
            title: "Estúdio de Ícones e Vetores SVG",
            category: "Design Gráfico & UI",
            timeLimit: "20 min",
            curriculum: "UC13 / UC14: Criação de interfaces gráficas, imagens vetoriais SVG e elementos de UI",
            description: "Crie um ícone vetorial de topologia de redes ou componente de interface web combinando caminhos bézier, formas geométricas e paleta de cores acessível.",
            url: "repos/Method-Draw/src/index.html",
            medalTitle: "Designer de Interfaces e Vetores SVG"
        },
        {
            id: "flexboxfroggy",
            axis: "Eixo 3: Desenvolvimento de Aplicações",
            axisId: "eixo-3",
            title: "Sapo no Flexbox (CSS Flexbox)",
            category: "Desenvolvimento Web Frontend",
            timeLimit: "20 min",
            curriculum: "UC13 / UC14: Folhas de estilo CSS, layout responsivo moderno e alinhamento flexbox",
            description: "Ajude os sapinhos a alcançar suas vitórias-régias guiando o posicionamento por justify-content, align-items, flex-direction e order em 20 minutos.",
            url: "repos/flexboxfroggy/index.html#pt-br",
            medalTitle: "Mestre em Layouts Flexbox CSS"
        },
        {
            id: "gridgarden",
            axis: "Eixo 3: Desenvolvimento de Aplicações",
            axisId: "eixo-3",
            title: "Jardim do CSS Grid",
            category: "Desenvolvimento Web Frontend",
            timeLimit: "20 min",
            curriculum: "UC13 / UC14: Estruturação bidimensional, CSS Grid, templates e áreas de interface",
            description: "Cultive cenouras e regue a horta usando propriedades avançadas do CSS Grid (grid-column-start, grid-template-columns, grid-area) em ritmo dinâmico.",
            url: "repos/gridgarden/index.html#pt-br",
            medalTitle: "Especialista em Arquitetura CSS Grid"
        }
    ];

    // State
    let currentStudent = "";
    let earnedBadges = {};

    function init() {
        loadState();
        setupEvents();
        render();

        if (!currentStudent) {
            showOnboardingModal();
        }
    }

    function loadState() {
        currentStudent = localStorage.getItem(STORAGE_KEY_STUDENT) || "";
        try {
            earnedBadges = JSON.parse(localStorage.getItem(STORAGE_KEY_BADGES) || "{}");
        } catch (e) {
            earnedBadges = {};
        }

        // Also check if any minigame recorded completion directly in localStorage
        try {
            const rawCompleted = JSON.parse(localStorage.getItem("SENAC_RECAP_COMPLETED_GAMES") || "{}");
            for (const [gameId, data] of Object.entries(rawCompleted)) {
                if (!earnedBadges[gameId]) {
                    awardBadge(gameId, data.details || "Concluído via minigame");
                }
            }
        } catch (e) {
            // ignore
        }
    }

    function saveState() {
        if (currentStudent) {
            localStorage.setItem(STORAGE_KEY_STUDENT, currentStudent);
        }
        localStorage.setItem(STORAGE_KEY_BADGES, JSON.stringify(earnedBadges));
    }

    function setupEvents() {
        // Form submit on onboarding modal
        const form = document.getElementById("student-form");
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                const input = document.getElementById("student-name-input");
                const name = input.value.trim();
                if (name) {
                    currentStudent = name;
                    saveState();
                    hideOnboardingModal();
                    updateStudentDisplay();
                    render();
                }
            });
        }

        // Change student button
        const changeBtn = document.getElementById("btn-change-student");
        if (changeBtn) {
            changeBtn.addEventListener("click", showOnboardingModal);
        }

        // Close badge modal
        const closeBadgeBtn = document.getElementById("modal-badge-close");
        if (closeBadgeBtn) {
            closeBadgeBtn.addEventListener("click", hideBadgeModal);
        }

        // Listen for postMessage from minigames
        window.addEventListener("message", function (event) {
            if (event.data && event.data.type === "SENAC_MINIGAME_COMPLETED") {
                const gameId = event.data.gameId;
                const details = event.data.details || "Concluído";
                awardBadge(gameId, details);
            }
        });
    }

    async function awardBadge(gameId, details) {
        if (!currentStudent) return;
        const game = MINIGAMES_DATA.find(g => g.id === gameId);
        if (!game) return;

        const timestamp = new Date().toISOString();
        const hash = await BadgeCrypto.generateBadgeHash(currentStudent, gameId, timestamp, details);
        const authCode = BadgeCrypto.formatVerificationCode(hash);

        earnedBadges[gameId] = {
            gameId: gameId,
            studentName: currentStudent,
            title: game.medalTitle,
            hash: hash,
            authCode: authCode,
            date: new Date().toLocaleString("pt-BR"),
            details: details
        };

        saveState();
        render();
        showBadgeModal(gameId);
    }

    function updateStudentDisplay() {
        const display = document.getElementById("current-student-name");
        if (display) {
            display.textContent = currentStudent || "Não identificado";
        }
    }

    function showOnboardingModal() {
        const modal = document.getElementById("onboarding-modal");
        const input = document.getElementById("student-name-input");
        if (input) input.value = currentStudent;
        if (modal) modal.style.display = "flex";
    }

    function hideOnboardingModal() {
        const modal = document.getElementById("onboarding-modal");
        if (modal) modal.style.display = "none";
    }

    function showBadgeModal(gameId) {
        const badge = earnedBadges[gameId];
        const game = MINIGAMES_DATA.find(g => g.id === gameId);
        if (!badge || !game) return;

        document.getElementById("badge-display-student").textContent = badge.studentName;
        document.getElementById("badge-display-title").textContent = badge.title;
        document.getElementById("badge-display-game").textContent = game.title;
        document.getElementById("badge-display-auth").textContent = badge.authCode;
        document.getElementById("badge-display-hash").textContent = badge.hash;
        document.getElementById("badge-display-date").textContent = "Concedido em: " + badge.date;

        const modal = document.getElementById("badge-modal");
        if (modal) modal.style.display = "flex";
    }

    function hideBadgeModal() {
        const modal = document.getElementById("badge-modal");
        if (modal) modal.style.display = "none";
    }

    function render() {
        updateStudentDisplay();

        // Calculate statistics
        const total = MINIGAMES_DATA.length;
        const completed = Object.keys(earnedBadges).length;
        const percent = Math.round((completed / total) * 100);

        document.getElementById("stat-completed-count").textContent = `${completed} / ${total}`;
        document.getElementById("stat-progress-percent").textContent = `${percent}%`;

        // Render minigames grouped by axis
        const axes = [
            { id: "eixo-1", name: "Eixo 1: Suporte e Manutenção", targetEl: document.getElementById("grid-eixo-1") },
            { id: "eixo-2", name: "Eixo 2: Redes e Servidores", targetEl: document.getElementById("grid-eixo-2") },
            { id: "eixo-3", name: "Eixo 3: Desenvolvimento de Aplicações", targetEl: document.getElementById("grid-eixo-3") }
        ];

        axes.forEach(axis => {
            if (!axis.targetEl) return;
            axis.targetEl.innerHTML = "";

            const games = MINIGAMES_DATA.filter(g => g.axisId === axis.id);
            games.forEach(game => {
                const isDone = Boolean(earnedBadges[game.id]);
                const card = document.createElement("div");
                card.className = "game-card" + (isDone ? " completed" : "");

                card.innerHTML = `
                    <div class="game-top">
                        <span class="game-category">${escapeHtml(game.category)}</span>
                        <span class="game-time-limit">${escapeHtml(game.timeLimit)}</span>
                    </div>
                    <h3 class="game-title">${escapeHtml(game.title)}</h3>
                    <p class="game-desc">${escapeHtml(game.description)}</p>
                    <div class="game-curriculum">${escapeHtml(game.curriculum)}</div>
                    <div class="game-actions">
                        <a href="${game.url}" target="_blank" class="btn-play">
                            ${isDone ? "Jogar Novamente" : "Iniciar Minigame"}
                        </a>
                        ${isDone ? `
                            <button type="button" class="btn-badge-view" data-badge-id="${game.id}">
                                Ver Medalha
                            </button>
                        ` : `
                            <button type="button" class="btn-small" data-validate-id="${game.id}" title="Validar conclusão">
                                Validar
                            </button>
                        `}
                    </div>
                `;

                axis.targetEl.appendChild(card);
            });
        });

        // Attach event listeners to dynamic buttons
        document.querySelectorAll(".btn-badge-view").forEach(btn => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-badge-id");
                showBadgeModal(id);
            });
        });

        document.querySelectorAll("[data-validate-id]").forEach(btn => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-validate-id");
                const game = MINIGAMES_DATA.find(g => g.id === id);
                if (confirm(`Confirmar validação do minigame "${game.title}" para ${currentStudent}?`)) {
                    awardBadge(id, "Validação manual pelo aluno/professor");
                }
            });
        });
    }

    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Expose public API
    window.PortalEngine = {
        init: init,
        awardBadge: awardBadge,
        showBadgeModal: showBadgeModal
    };

    document.addEventListener("DOMContentLoaded", init);
})();
