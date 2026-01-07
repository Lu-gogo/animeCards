import { NextResponse } from 'next/server';

export async function GET() {
  // 模拟从数据库获取的模板数据
  const templates = [
    {
      id: 'template-1',
      title: '示例：星际穿越',
      poster: 'https://placehold.co/150x200/000000/FFF?text=Interstellar',
      cast: '诺兰 / 马修·麦康纳',
      summary: '未来的地球黄沙遍野，小麦、秋葵等基础农作物相继因枯萎病灭绝...',
      lines: '不要温和地走进那个良夜。',
      character: '库珀',
      isHighlight: false,
    }
  ];

  return NextResponse.json(templates);
}