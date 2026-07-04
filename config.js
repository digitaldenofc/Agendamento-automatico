
/* ---------------- PROFISSIONAIS & CREDENCIAIS ---------------- */
const PROFESSIONALS = [
    {
        id: 1,
        nome: "Gislaine Cristina",
        emoji: "",
        descricao: "Especialista em Gel & Alongamento",
        whatsapp: "5519995746340",
        email: "gislaine3002@gmail.com",
        senha: "Cutcut23",
        foto: "images/perfil.png",
        servicos: [
            { id: 1, nome: "GEL NA TIPS", preco: 85, duracao: 180 },
            { id: 2, nome: "BANHA EM GEL", preco: 60, duracao: 180 },
            { id: 3, nome: "MOLDE F1", preco: 85, duracao: 180 },
            { id: 4, nome: "ESMALTAÇÃO EM GEL", preco: 55, duracao: 120 },
            { id: 5, nome: "MANUTENÇÃO GEL NA TIPS", preco: 65, duracao: 90 },
            { id: 6, nome: "MANUTENÇÃO BANHA EM GEL", preco: 40, duracao: 90 },
            { id: 7, nome: "MANUTENÇÃO MOLDE F1", preco: 65, duracao: 90 },
            { id: 8, nome: "MANUTENÇÃO ESMALTAÇÃO EM GEL", preco: 35, duracao: 60 }
        ]
    },
    {
        id: 2,
        nome: "Gisele Cruz",
        emoji: "",
        descricao: "Especialista em Cílios & Sobrancelhas",
        whatsapp: "5519994388485",
        email: "giselecruz@gmail.com",
        senha: "gisele123",
        foto: null,
        servicos: [
            /* { id: 1, nome: "MANICURE TRADICIONAL", preco: 35, duracao: 60 },
             { id: 2, nome: "PEDICURE COMPLETA", preco: 45, duracao: 90 },
             { id: 3, nome: "MANICURE + PEDICURE", preco: 70, duracao: 150 },
             { id: 4, nome: "NAIL ART SIMPLES", preco: 50, duracao: 90 },
             { id: 5, nome: "NAIL ART ELABORADO", preco: 80, duracao: 120 },
             { id: 6, nome: "ESMALTAÇÃO SIMPLES", preco: 25, duracao: 45 }*/
        ]
    }
];

/* Firebase Config */
const firebaseConfig = {
    apiKey: "AIzaSyAdzA37ysPLDjviOcDg_F3jnd0OQjLMtWw",
    authDomain: "ginail-designer.firebaseapp.com",
    projectId: "ginail-designer",
    storageBucket: "ginail-designer.firebasestorage.app",
    messagingSenderId: "597041623194",
    appId: "1:597041623194:web:f4167ff96ae0bd9cf0ef23"
};

// Mantido para compatibilidade com código legado
const ADMIN_CREDENTIALS = PROFESSIONALS[0];
