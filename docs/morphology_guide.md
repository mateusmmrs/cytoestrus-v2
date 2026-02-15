# CytoEstrus v2: Guia de Morfologia Celular

Este guia padroniza visualmente e textualmente os critérios para classificação das células vaginais caninas, servindo como "Gold Standard" tanto para a anotação manual quanto para o treinamento da rede neural (YOLOv8) e a futura inferência do LLM.

As referências morfológicas aqui são baseadas no consenso de **Reckers et al. (2022)** e no *Veterinary Cytology* de **Allison R.W.**

---

## 🔬 Classes de Detecção (Labels YOLO)

O modelo YOLOv8 será treinado para reconhecer **6 classes distintas** de objetos em um esfregaço vaginal corado (ex: Romanowsky, Panótico Rapido, Giemsa).

### 1. `parabasal` (Célula Parabasal)
São as menores células epiteliais encontradas no esfregaço. Representam a camada mais profunda da mucosa vaginal.
- **Tamanho:** Pequenas (15 – 25 µm), não muito maiores que um neutrófilo.
- **Formato:** Redondas a ovais regulares.
- **Citoplasma:** Escasso e fortemente basofílico.
- **Núcleo:** Redondo, grande em relação ao tamanho total da célula (alta relação Núcleo:Citoplasma, geralmente > 0.5), aspecto vesicular (cromatina frouxa).
- **Aparecimento:** Abundantes no Diestro e Anestro. Raríssimas no Estro.

### 2. `intermediate_small` (Célula Intermediária Pequena)
O primeiro estágio de cornificação à medida que a célula migra da camada parabasal.
- **Tamanho:** Médias (25 – 40 µm).
- **Formato:** Ovais a poligonais, bordas arredondadas.
- **Citoplasma:** Moderado, coloração variável.
- **Núcleo:** Ainda intacto, redondo/oval, relação N:C moderada (0.3 a 0.5).

### 3. `intermediate_large` (Célula Intermediária Grande)
Estágio avançado da camada intermediária. São as "superficiais nucleadas" da literatura mais antiga que ainda não sofreram picnose completa.
- **Tamanho:** Grandes (40 – 60 µm).
- **Formato:** Poligonais, frequentemente com as **bordas dobradas ou pregueadas**.
- **Citoplasma:** Abundante.
- **Núcleo:** Intacto, mas pequeno em relação ao citoplasma (N:C baixa, < 0.3).

### 4. `superficial_nucleated` (Célula Superficial Nucleada)
Célula totalmente queratinizada (cornificada) mas que ainda retém um núcleo morto.
- **Tamanho:** Muito grandes (50 – 70 µm).
- **Formato:** Extremamente poligonais, planas, com bordas angulares e afiadas.
- **Citoplasma:** Muito abundante, pálido ou eosinofílico.
- **Núcleo:** **Picnótico** (encolhido, hipercrômico, denso) ou em fragmentação (cariorrexia). Fica minúsculo em meio ao citoplasma gigante (relação N:C quase zero).
- **Aparecimento:** Marca registrada do Proestro Tardio e do Estro.

### 5. `anuclear_squame` (Célula Escamosa Anuclear / Superficial Anucleada)
O estágio final da morte celular (cornificação completa).
- **Tamanho:** Muito grandes (50 – 70 µm).
- **Formato:** Superfície poligonal, frequentemente dobradas sobre si mesmas como escamas.
- **Citoplasma:** Totalmente hialino / queratinizado.
- **Núcleo:** **Totalmente ausente**. Pode haver um espaço claro (*"ghost nucleus"*) onde o núcleo costumava estar.
- **Aparecimento:** Dominam o quadro citológico do pico do Estro (>80-90% das células).

### 6. `neutrophil` (Neutrófilo Polimorfonuclear)
Células inflamatórias de defesa.
- **Tamanho:** Muito pequenos (8 – 12 µm).
- **Formato:** Redondos.
- **Núcleo:** Multilobado (3 a 5 lóbulos distintos) de coloração roxa escura. Citoplasma quase invisível.
- **Aparecimento:** Ausentes no Estro. Surgem de forma massiva ("chuva de neutrófilos") no primeiro dia de Diestro (antigo metestro).

---

## ⚠️ A Célula de Metestro (Regra Espacial)
Tradicionalmente, a "célula de metestro" é descrita como uma célula intermediária que contém um ou mais neutrófilos dentro de vacúolos em seu citoplasma.

**Decisão Arquitetural:**
Para evitar confusão no modelo YOLO,  **não existe** a classe `metestrum_cell`.
Em vez disso, a Célula de Metestro será inferida secundariamente pelo LLM e pelo parser JSON:
- Se a bounding box de um `neutrophil` estiver contida (>80% de sobreposição) na bounding box de uma `intermediate_large` ou `intermediate_small`, o sistema classificará a união como uma "Célula de Metestro".

---

## 📈 Índices Fisiológicos

Os outputs do YOLOv8 vão alimentar o cálculo do **Índice de Queratinização (IQ)** ou Índice Eosinofílico, que é a formula âncora para a Inteligência Artificial textual classificar a cadela:

$$ IQ = \frac{Superficiais_{nucleadas} + Escamas_{anucleares}}{Total_{Epiteliais}} \times 100 $$

### Regras do Motor Clínico (LLM)
- **IQ < 20% com Neutrófilos:** Diestro ou Anestro (diferenciados pela presença maciça de neutrófilos e debris no diestro).
- **IQ 50% - 79%:** Proestro.
- **IQ ≥ 80% sem Neutrófilos:** Estro (pico de fertilidade, momento ideal para LH e IATF).
