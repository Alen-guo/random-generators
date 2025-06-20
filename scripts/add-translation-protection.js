const fs = require('fs');
const path = require('path');

// 需要添加翻译保护的文件列表
const filesToUpdate = [
  'src/app/numbers/bytes/page.tsx',
  'src/app/numbers/dates/page.tsx', 
  'src/app/numbers/decimals/page.tsx',
  'src/app/numbers/fibonacci/page.tsx',
  'src/app/numbers/gaussian/page.tsx',
  'src/app/numbers/integers/page.tsx',
  'src/app/numbers/primes/page.tsx',
  'src/app/numbers/sequences/page.tsx',
  'src/app/numbers/sets/page.tsx',
  'src/app/lists/coordinates/page.tsx',
  'src/app/lists/emails/page.tsx',
  'src/app/lists/music/page.tsx',
  'src/app/lists/names/page.tsx',
  'src/app/lists/passwords/page.tsx',
  'src/app/lists/phones/page.tsx',
  'src/app/lists/stories/page.tsx',
  'src/app/lists/times/page.tsx',
  'src/app/design/colors/page.tsx',
  'src/app/design/css/page.tsx',
  'src/app/design/gradients/page.tsx',
  'src/app/design/hex/page.tsx',
  'src/app/design/hsl/page.tsx',
  'src/app/design/rgb/page.tsx',
  'src/app/web/csv/page.tsx',
  'src/app/web/ip/page.tsx',
  'src/app/web/sql/page.tsx',
  'src/app/web/uuid/page.tsx'
];

function addTranslationProtection(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 检查是否已经有保护
  if (content.includes('useTranslationProtection') || content.includes('translate="no"')) {
    console.log(`✅ Already protected: ${filePath}`);
    return false;
  }

  let modified = false;

  // 1. 添加 useTranslationProtection 导入
  if (content.includes('"use client"') && !content.includes('useTranslationProtection')) {
    const importRegex = /(import.*?from.*?['"]@\/.*?['"])/g;
    const imports = content.match(importRegex);
    
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const newImport = `import { useTranslationProtection } from '@/hooks/useTranslationProtection'`;
      
      content = content.replace(lastImport, `${lastImport}\n${newImport}`);
      modified = true;
    }
  }

  // 2. 添加 hook 使用
  if (content.includes('export default function') && !content.includes('containerRef')) {
    const functionRegex = /export default function\s+\w+\(\)\s*{/;
    const match = content.match(functionRegex);
    
    if (match) {
      const hookLine = '\n  const containerRef = useTranslationProtection()';
      content = content.replace(match[0], match[0] + hookLine);
      modified = true;
    }
  }

  // 3. 为主容器添加 ref 和属性
  const containerRegex = /<div className="min-h-screen[^>]*>/;
  const containerMatch = content.match(containerRegex);
  
  if (containerMatch && !containerMatch[0].includes('ref=')) {
    const newContainer = containerMatch[0].replace('className="', 'ref={containerRef} className="')
      .replace('>', ' translate="no" data-protected="true">');
    content = content.replace(containerMatch[0], newContainer);
    modified = true;
  }

  // 4. 为生成按钮添加保护
  const buttonRegex = /<Button[^>]*onClick[^>]*>/g;
  const buttonMatches = content.match(buttonRegex);
  
  if (buttonMatches) {
    buttonMatches.forEach(button => {
      if (!button.includes('translate="no"') && !button.includes('data-interactive')) {
        let newButton = button;
        
        // 添加 notranslate 类
        if (button.includes('className="')) {
          newButton = newButton.replace('className="', 'className="notranslate ');
        } else {
          newButton = newButton.replace('>', ' className="notranslate">');
        }
        
        // 添加保护属性
        newButton = newButton.replace('>', ' translate="no" data-interactive="true">');
        
        content = content.replace(button, newButton);
        modified = true;
      }
    });
  }

  // 5. 为结果显示区域添加保护
  const resultRegex = /<div[^>]*className="[^"]*result[^"]*"[^>]*>/g;
  const resultMatches = content.match(resultRegex);
  
  if (resultMatches) {
    resultMatches.forEach(result => {
      if (!result.includes('translate="no"')) {
        const newResult = result.replace('>', ' translate="no" data-result="true">');
        content = content.replace(result, newResult);
        modified = true;
      }
    });
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`⚪ No changes needed: ${filePath}`);
    return false;
  }
}

// 主函数
function main() {
  console.log('🔧 Adding translation protection to generator pages...\n');
  
  let updatedCount = 0;
  
  filesToUpdate.forEach(filePath => {
    if (addTranslationProtection(filePath)) {
      updatedCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${filesToUpdate.length}`);
  console.log(`   Files updated: ${updatedCount}`);
  console.log(`   Files skipped: ${filesToUpdate.length - updatedCount}`);
  
  if (updatedCount > 0) {
    console.log('\n🎉 Translation protection added successfully!');
    console.log('💡 You may need to manually adjust some files for specific cases.');
  } else {
    console.log('\n✅ All files already have protection or no changes needed.');
  }
}

main(); 