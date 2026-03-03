export type Phase = 'ESTRO' | 'PROESTRO' | 'DIESTRO' | 'ANESTRO';

export interface Patient {
    id: string;
    user_id: string;
    name: string;
    breed: string;
    birth_date: string;
    weight_kg: number;
    owner_name: string;
    owner_phone: string;
    owner_email: string;
    kennel_name: string;
    microchip_id: string;
    photo_url: string;
    notes: string;
    created_at: string;
    updated_at: string;
    // computed
    current_phase?: Phase;
    last_exam_date?: string;
    alert?: string;
}

export interface CellCounts {
    parabasal: number;
    intermediate_small: number;
    intermediate_large: number;
    superficial_nucleated: number;
    anuclear_squame: number;
    neutrophil: number;
}

export interface Cytology {
    id: string;
    user_id: string;
    patient_id: string;
    slide_image_url: string;
    phase: Phase;
    confidence: number;
    cornification_index: number;
    cells: CellCounts;
    total_epithelial: number;
    reasoning: string;
    insemination_advice: string;
    validation_score: number;
    exam_date: string;
    cycle_id: string;
    notes: string;
    created_at: string;
    // joined
    patient_name?: string;
}

export interface Cycle {
    id: string;
    patient_id: string;
    user_id: string;
    start_date: string;
    end_date: string;
    peak_iq: number;
    peak_iq_date: string;
    estimated_ovulation_date: string;
    was_bred: boolean;
    breeding_date: string;
    breeding_method: string;
    pregnancy_confirmed: boolean | null;
    notes: string;
    created_at: string;
    cytologies?: Cytology[];
}

export interface DashboardStats {
    totalPatients: number;
    examsThisMonth: number;
    examsThisWeek: number;
    phaseDistribution: Record<Phase, number>;
    alerts: Array<{ patient: Patient; message: string; type: 'warning' | 'success' | 'info' }>;
    recentExams: Cytology[];
}
