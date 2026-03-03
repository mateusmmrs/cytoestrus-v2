import { Patient, Cytology, Cycle, Phase } from './types';

// ====== MOCK PATIENTS ======
export const mockPatients: Patient[] = [
    {
        id: 'p1', user_id: 'u1', name: 'Luna', breed: 'Golden Retriever',
        birth_date: '2022-06-15', weight_kg: 28.5,
        owner_name: 'Ana Souza', owner_phone: '(71) 99888-1234', owner_email: 'ana@email.com',
        kennel_name: 'Canil Golden Bay', microchip_id: '985112000456789', photo_url: '',
        notes: 'Primeira cobrição planejada para este ciclo. Sem histórico reprodutivo prévio.',
        created_at: '2025-11-10T10:00:00Z', updated_at: '2026-03-01T14:00:00Z',
        current_phase: 'ESTRO', last_exam_date: '2026-03-01', alert: 'IQ 87% — Janela fértil aberta',
    },
    {
        id: 'p2', user_id: 'u1', name: 'Mel', breed: 'Labrador Retriever',
        birth_date: '2021-03-22', weight_kg: 32.0,
        owner_name: 'Carlos Lima', owner_phone: '(71) 99777-5678', owner_email: 'carlos@email.com',
        kennel_name: '', microchip_id: '985112000789012', photo_url: '',
        notes: '3ª gestação. Intervalo interestro regular de ~6.5 meses.',
        created_at: '2025-08-15T10:00:00Z', updated_at: '2026-02-20T09:00:00Z',
        current_phase: 'PROESTRO', last_exam_date: '2026-02-28', alert: 'Proestro dia 5 — Agendar coleta',
    },
    {
        id: 'p3', user_id: 'u1', name: 'Pipoca', breed: 'Bulldog Francês',
        birth_date: '2023-01-10', weight_kg: 11.2,
        owner_name: 'Mariana Oliveira', owner_phone: '(71) 99666-9012', owner_email: 'mari@email.com',
        kennel_name: 'Frenchies BA', microchip_id: '', photo_url: '',
        notes: 'Braquicefálica — monitorar parto. IA com sêmen congelado planejada.',
        created_at: '2026-01-05T10:00:00Z', updated_at: '2026-03-03T10:00:00Z',
        current_phase: 'DIESTRO', last_exam_date: '2026-02-15', alert: undefined,
    },
    {
        id: 'p4', user_id: 'u1', name: 'Belinha', breed: 'Yorkshire Terrier',
        birth_date: '2020-09-03', weight_kg: 3.8,
        owner_name: 'Roberto Santos', owner_phone: '(71) 99555-3456', owner_email: 'roberto@email.com',
        kennel_name: '', microchip_id: '985112000123456', photo_url: '',
        notes: 'Último exame há 48 dias, pode estar entrando em proestro.',
        created_at: '2025-06-20T10:00:00Z', updated_at: '2026-01-15T10:00:00Z',
        current_phase: 'ANESTRO', last_exam_date: '2026-01-15', alert: 'Último exame há 48 dias — verificar proestro',
    },
    {
        id: 'p5', user_id: 'u1', name: 'Amora', breed: 'Pastor Alemão',
        birth_date: '2021-11-28', weight_kg: 30.5,
        owner_name: 'Fernanda Costa', owner_phone: '(71) 99444-7890', owner_email: 'fer@email.com',
        kennel_name: 'Von Haus Canil', microchip_id: '985112000345678', photo_url: '',
        notes: '2 ciclos rastreados. Intervalo interestro médio 7 meses.',
        created_at: '2025-09-01T10:00:00Z', updated_at: '2026-02-25T10:00:00Z',
        current_phase: 'PROESTRO', last_exam_date: '2026-03-02', alert: 'IQ 62% — Em transição, coleta em 2 dias',
    },
];

// ====== MOCK CYTOLOGIES ======
export const mockCytologies: Cytology[] = [
    // Luna — cycle 1 (current, ESTRO)
    {
        id: 'c1', user_id: 'u1', patient_id: 'p1', slide_image_url: '/slides/luna_d1.jpg',
        phase: 'PROESTRO', confidence: 0.82, cornification_index: 35.0,
        cells: { parabasal: 5, intermediate_small: 12, intermediate_large: 8, superficial_nucleated: 6, anuclear_squame: 2, neutrophil: 8 },
        total_epithelial: 33, reasoning: 'IQ 35% com presença residual de neutrófilos e predomínio de intermediárias.',
        insemination_advice: 'Aguardar 3-5 dias para nova coleta.', validation_score: 0.78,
        exam_date: '2026-02-22T10:00:00Z', cycle_id: 'cy1', notes: '', created_at: '2026-02-22T10:00:00Z',
        patient_name: 'Luna',
    },
    {
        id: 'c2', user_id: 'u1', patient_id: 'p1', slide_image_url: '/slides/luna_d5.jpg',
        phase: 'PROESTRO', confidence: 0.86, cornification_index: 55.0,
        cells: { parabasal: 2, intermediate_small: 6, intermediate_large: 14, superficial_nucleated: 12, anuclear_squame: 5, neutrophil: 4 },
        total_epithelial: 39, reasoning: 'IQ 55%, transição para estro. Intermediárias grandes em aumento.',
        insemination_advice: 'Repetir citologia em 2 dias. Iniciar dosagem P4.', validation_score: 0.82,
        exam_date: '2026-02-25T10:00:00Z', cycle_id: 'cy1', notes: '', created_at: '2026-02-25T10:00:00Z',
        patient_name: 'Luna',
    },
    {
        id: 'c3', user_id: 'u1', patient_id: 'p1', slide_image_url: '/slides/luna_d8.jpg',
        phase: 'ESTRO', confidence: 0.94, cornification_index: 87.2,
        cells: { parabasal: 0, intermediate_small: 1, intermediate_large: 5, superficial_nucleated: 22, anuclear_squame: 19, neutrophil: 0 },
        total_epithelial: 47, reasoning: 'IQ 87.2% — queratinização máxima. Ausência de neutrófilos. Estro confirmado.',
        insemination_advice: 'Momento ideal para IA. Progesterona sérica para confirmar.', validation_score: 0.91,
        exam_date: '2026-03-01T10:00:00Z', cycle_id: 'cy1', notes: 'P4 = 6.2 ng/mL', created_at: '2026-03-01T10:00:00Z',
        patient_name: 'Luna',
    },
    // Mel — PROESTRO
    {
        id: 'c4', user_id: 'u1', patient_id: 'p2', slide_image_url: '/slides/mel_d1.jpg',
        phase: 'PROESTRO', confidence: 0.88, cornification_index: 62.5,
        cells: { parabasal: 1, intermediate_small: 4, intermediate_large: 12, superficial_nucleated: 15, anuclear_squame: 8, neutrophil: 3 },
        total_epithelial: 40, reasoning: 'IQ 62.5% — proestro tardio com transição em curso.',
        insemination_advice: 'Agendar nova coleta em 2 dias.', validation_score: 0.85,
        exam_date: '2026-02-28T10:00:00Z', cycle_id: 'cy2', notes: '', created_at: '2026-02-28T10:00:00Z',
        patient_name: 'Mel',
    },
    // Pipoca — DIESTRO
    {
        id: 'c5', user_id: 'u1', patient_id: 'p3', slide_image_url: '/slides/pipoca_d1.jpg',
        phase: 'DIESTRO', confidence: 0.91, cornification_index: 12.0,
        cells: { parabasal: 8, intermediate_small: 14, intermediate_large: 3, superficial_nucleated: 2, anuclear_squame: 1, neutrophil: 22 },
        total_epithelial: 28, reasoning: 'IQ 12% — chuva de neutrófilos confirmando diestro.',
        insemination_advice: 'Período fértil encerrado. USG em 25 dias se houve IA.', validation_score: 0.88,
        exam_date: '2026-02-15T10:00:00Z', cycle_id: 'cy3', notes: 'IA realizada dia 10/02', created_at: '2026-02-15T10:00:00Z',
        patient_name: 'Pipoca',
    },
    // Amora — PROESTRO progression
    {
        id: 'c6', user_id: 'u1', patient_id: 'p5', slide_image_url: '/slides/amora_d1.jpg',
        phase: 'PROESTRO', confidence: 0.80, cornification_index: 28.0,
        cells: { parabasal: 6, intermediate_small: 15, intermediate_large: 6, superficial_nucleated: 3, anuclear_squame: 0, neutrophil: 10 },
        total_epithelial: 30, reasoning: 'IQ 28%, proestro inicial.',
        insemination_advice: 'Nova coleta em 3-4 dias.', validation_score: 0.75,
        exam_date: '2026-02-26T10:00:00Z', cycle_id: 'cy4', notes: '', created_at: '2026-02-26T10:00:00Z',
        patient_name: 'Amora',
    },
    {
        id: 'c7', user_id: 'u1', patient_id: 'p5', slide_image_url: '/slides/amora_d5.jpg',
        phase: 'PROESTRO', confidence: 0.85, cornification_index: 52.0,
        cells: { parabasal: 3, intermediate_small: 8, intermediate_large: 14, superficial_nucleated: 10, anuclear_squame: 4, neutrophil: 5 },
        total_epithelial: 39, reasoning: 'IQ 52%, queratinização progressiva.',
        insemination_advice: 'Repetir em 2 dias. Dosar P4.', validation_score: 0.82,
        exam_date: '2026-03-02T10:00:00Z', cycle_id: 'cy4', notes: 'P4 = 1.8 ng/mL', created_at: '2026-03-02T10:00:00Z',
        patient_name: 'Amora',
    },
];

// ====== MOCK CYCLES ======
export const mockCycles: Cycle[] = [
    {
        id: 'cy1', patient_id: 'p1', user_id: 'u1',
        start_date: '2026-02-22', end_date: '',
        peak_iq: 87.2, peak_iq_date: '2026-03-01',
        estimated_ovulation_date: '2026-02-28',
        was_bred: false, breeding_date: '', breeding_method: '',
        pregnancy_confirmed: null, notes: 'Ciclo em andamento',
        created_at: '2026-02-22T10:00:00Z',
        cytologies: mockCytologies.filter(c => c.cycle_id === 'cy1'),
    },
];

// ====== HELPER: Get dashboard stats ======
export function getDashboardStats(): {
    totalPatients: number;
    examsThisMonth: number;
    examsThisWeek: number;
    phaseDistribution: Record<Phase, number>;
    alerts: Array<{ patient: Patient; message: string; type: 'warning' | 'success' | 'info' }>;
    recentExams: Cytology[];
} {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);

    const examsThisMonth = mockCytologies.filter(c => new Date(c.exam_date) >= monthStart).length;
    const examsThisWeek = mockCytologies.filter(c => new Date(c.exam_date) >= weekStart).length;

    const phaseDistribution: Record<Phase, number> = { ESTRO: 0, PROESTRO: 0, DIESTRO: 0, ANESTRO: 0 };
    mockPatients.forEach(p => {
        if (p.current_phase) phaseDistribution[p.current_phase]++;
    });

    const alerts = mockPatients
        .filter(p => p.alert)
        .map(p => ({
            patient: p,
            message: p.alert!,
            type: (p.current_phase === 'ESTRO' ? 'success' : p.current_phase === 'PROESTRO' ? 'warning' : 'info') as 'warning' | 'success' | 'info',
        }));

    const recentExams = [...mockCytologies].sort((a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()).slice(0, 5);

    return { totalPatients: mockPatients.length, examsThisMonth, examsThisWeek, phaseDistribution, alerts, recentExams };
}

// ====== HELPER: Get patient cytology data for IQ chart ======
export function getPatientCytologies(patientId: string): Cytology[] {
    return mockCytologies.filter(c => c.patient_id === patientId).sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime());
}
