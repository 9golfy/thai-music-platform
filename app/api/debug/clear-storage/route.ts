import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  const clearScript = `
    <html>
    <head>
      <title>Clear Draft Storage</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; color: #111827; }
        .container { max-width: 720px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
        h1 { margin-top: 0; }
        button, a.button { display: inline-block; padding: 10px 18px; font-size: 15px; margin: 8px 8px 0 0; border-radius: 10px; text-decoration: none; border: none; cursor: pointer; }
        .primary { background: #166534; color: white; }
        .secondary { background: #e5e7eb; color: #111827; }
        .success { color: #166534; }
        .info { color: #1d4ed8; }
        .warn { color: #b45309; }
        pre { background: #f3f4f6; padding: 12px; border-radius: 8px; overflow: auto; }
        .status { margin-top: 16px; line-height: 1.7; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>ล้างข้อมูลทดสอบของฟอร์ม</h1>
        <p>หน้านี้จะล้าง draft ที่ค้างในเบราว์เซอร์ของฟอร์มทั้ง 2 หน้าให้โดยอัตโนมัติ:</p>
        <pre>draft_reg100
draft_regsup</pre>

        <div class="status" id="output"></div>

        <div style="margin-top: 20px;">
          <button class="primary" onclick="clearDrafts()">ล้างอีกครั้ง</button>
          <a class="button secondary" href="/regist100">ไปหน้า regist100</a>
          <a class="button secondary" href="/regist-support">ไปหน้า regist-support</a>
        </div>

        <script>
          function log(message, type = 'info') {
            const output = document.getElementById('output');
            const div = document.createElement('div');
            div.className = type;
            div.textContent = message;
            output.appendChild(div);
          }

          function clearDrafts() {
            document.getElementById('output').innerHTML = '';
            const keysToClear = ['draft_reg100', 'draft_regsup'];
            log('กำลังล้างข้อมูล draft ของทั้ง 2 ฟอร์ม...', 'info');

            keysToClear.forEach((key) => {
              const existed = localStorage.getItem(key) !== null;
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
              log((existed ? 'ลบแล้ว: ' : 'ไม่พบค่าเดิม: ') + key, existed ? 'success' : 'warn');
            });

            log('ล้างข้อมูลทดสอบเรียบร้อยแล้ว', 'success');
          }

          clearDrafts();
        </script>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(clearScript, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
