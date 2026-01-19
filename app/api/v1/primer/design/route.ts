import { NextResponse } from 'next/server';

// 기획서에 명시된 더미 데이터 반환
export async function POST(request: Request) {
    // 실제 요청 바디를 받아서 로그로 확인 가능
    const body = await request.json();
    console.log("프론트에서 받은 요청:", body);

    // 가짜 응답 데이터 (기획서 PrimerDesignResponse 구조)
    const mockResponse = {
        genome: {
            id: "gene_001",
            name: "Test Gene",
            sequence: "ATGC...",
            length_bp: 1000
        },
        candidates: [
            {
                id: "primer_1",
                sequence: "ATGCATGC",
                start_bp: 100,
                end_bp: 120,
                strand: "forward",
                metrics: { tm_c: 60.5, gc_percent: 50 }
            }
        ],
        meta: {
            timestamp: new Date().toISOString()
        }
    };

    // 1초 뒤에 응답 (네트워크 지연 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(mockResponse);
}