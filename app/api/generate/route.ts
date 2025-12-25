import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. 从前端网页传来的请求中获取用户输入的文字 (prompt)
    const { prompt} = await req.json();

    // 2. 检查环境变量是否配置正确
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = process.env.BAILIAN_APP_ID;

    if (!apiKey || !appId) {
      return NextResponse.json({ error: '服务器配置错误：缺少 API Key 或 App ID' }, { status: 500 });
    }

    // 3. 向百炼平台发起 POST 请求
    const response = await fetch(`https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          prompt: prompt // 这里的 'prompt' 必须和你百炼工作流输入节点的变量名一致
        },
        parameters: {
          // 如果你的工作流需要流式输出，这里可以配置，目前先用简单的非流式
        },
        debug: {}
      })
    });

    // 4. 解析百炼返回的结果
    const data = await response.json();

    // 5. 如果百炼报错，打印出来方便调试
    if (!response.ok) {
      console.error('百炼 API 报错:', data);
      return NextResponse.json({ error: data.message || '调用百炼失败' }, { status: response.status });
    }

    // 6. 将百炼生成的内容（图片链接、音频链接、文字等）返回给前端网页
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('后端接口发生错误:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}