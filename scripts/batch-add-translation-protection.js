const fs = require('fs');
const path = require('path');

// 需要添加翻译保护的页面列表（只需要翻译保护，功能相对完整）
const pagesToProcess = [
  {
    file: 'src/app/lists/coordinates/page.tsx',
    buttonPattern: /onClick={generateCoordinates}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/lists/music/page.tsx', 
    buttonPattern: /onClick={generateMusic}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/lists/stories/page.tsx',
    buttonPattern: /onClick={generateStories}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/lists/times/page.tsx',
    buttonPattern: /onClick={generateTimes}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/design/css/page.tsx',
    buttonPattern: /onClick={generateCSS}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/design/gradients/page.tsx',
    buttonPattern: /onClick={generateGradients}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/web/api/page.tsx',
    buttonPattern: /onClick={generateAPI}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  },
  {
    file: 'src/app/web/ip/page.tsx',
    buttonPattern: /onClick={generateIPs}/,
    containerPattern: /return \(\s*<div className="min-h-screen/
  }
];

function addTranslationProtection(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有翻译保护
    if (content.includes('useTranslationProtection')) {
      console.log(`✅ ${filePath} already has translation protection`);
      return true;
    }

    let modified = false;

    // 1. 添加 hook 导入
    if (!content.includes("import { useTranslationProtection }")) {
      // 查找最后一个 lucide-react 导入
      const lucideImportMatch = content.match(/import.*from ['"]lucide-react['"].*\n/);
      if (lucideImportMatch) {
        const importIndex = content.indexOf(lucideImportMatch[0]) + lucideImportMatch[0].length;
        content = content.slice(0, importIndex) + 
                 "import { useTranslationProtection } from '@/hooks/useTranslationProtection'\n" +
                 content.slice(importIndex);
        modified = true;
      }
    }

    // 2. 添加 hook 使用
    const exportDefaultMatch = content.match(/export default function \w+\(\) \{/);
    if (exportDefaultMatch && !content.includes('const containerRef = useTranslationProtection()')) {
      const hookInsertPoint = content.indexOf(exportDefaultMatch[0]) + exportDefaultMatch[0].length;
      content = content.slice(0, hookInsertPoint) + 
               '\n  const containerRef = useTranslationProtection()' +
               content.slice(hookInsertPoint);
      modified = true;
    }

    // 3. 添加容器 ref
    const returnMatch = content.match(/return \(\s*<div className="min-h-screen[^"]*"/);
    if (returnMatch && !content.includes('ref={containerRef}')) {
      const newReturn = returnMatch[0].replace('<div className=', '<div ref={containerRef} className=');
      content = content.replace(returnMatch[0], newReturn);
      modified = true;
    }

    // 4. 为生成按钮添加保护（通用模式）
    const buttonPatterns = [
      /(<Button[^>]*onClick={[^}]*generate[^}]*}[^>]*className="[^"]*)"([^>]*>)/gi,
      /(<Button[^>]*className="[^"]*"[^>]*onClick={[^}]*generate[^}]*}[^>]*>)/gi
    ];

    buttonPatterns.forEach(pattern => {
      content = content.replace(pattern, (match, beforeClass, afterClass) => {
        if (match.includes('notranslate')) return match;
        
        if (afterClass) {
          // 第一种模式：className 在 onClick 之前
          return beforeClass + ' notranslate"' + afterClass + '\n                  translate="no"\n                  data-interactive="true"';
        } else {
          // 第二种模式：onClick 在 className 之后
          return match.replace('>', '\n                  translate="no"\n                  data-interactive="true"\n                >');
        }
      });
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Added translation protection to ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ No changes needed for ${filePath}`);
      return true;
    }

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting batch translation protection...\n');
  
  let successCount = 0;
  let totalCount = 0;

  // 处理指定的页面
  pagesToProcess.forEach(page => {
    totalCount++;
    if (addTranslationProtection(page.file)) {
      successCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Processed: ${totalCount} files`);
  console.log(`   Successful: ${successCount} files`);
  console.log(`   Failed: ${totalCount - successCount} files`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All files processed successfully!');
  }
}

main(); 