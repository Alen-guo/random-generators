const fs = require('fs');
const path = require('path');

// 扫描所有生成器页面
function findGeneratorPages() {
  const pages = [];
  
  function scanDirectory(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // 检查是否包含 page.tsx
        const pageFile = path.join(fullPath, 'page.tsx');
        if (fs.existsSync(pageFile)) {
          pages.push({
            path: relativePath,
            file: pageFile,
            url: `/${relativePath.replace(/\\/g, '/')}`
          });
        }
        
        // 递归扫描子目录
        scanDirectory(fullPath, relativePath);
      }
    }
  }
  
  // 扫描主要的生成器目录
  const directories = [
    'src/app/numbers',
    'src/app/lists', 
    'src/app/games',
    'src/app/design',
    'src/app/web'
  ];
  
  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      scanDirectory(dir, path.basename(dir));
    }
  });
  
  return pages;
}

// 检查页面是否包含生成功能
function checkGeneratorFunctionality(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const issues = [];
  
  // 检查是否有生成按钮
  if (!content.includes('onClick') || !content.includes('Generate')) {
    issues.push('Missing generate button or onClick handler');
  }
  
  // 检查是否有生成状态
  if (!content.includes('isGenerating') && !content.includes('loading')) {
    issues.push('Missing loading/generating state');
  }
  
  // 检查是否有结果显示
  if (!content.includes('result') && !content.includes('data') && !content.includes('generated')) {
    issues.push('Missing result display logic');
  }
  
  // 检查二维码特殊情况
  if (filePath.includes('qr')) {
    if (!content.includes('QRCode') && !content.includes('qrcode')) {
      issues.push('QR code generator missing QR library usage');
    }
    
    if (content.includes('generatePattern') || content.includes('placeholder')) {
      issues.push('QR code generator using placeholder/fake implementation');
    }
  }
  
  // 检查是否有占位符实现
  if (content.includes('placeholder') || content.includes('TODO') || content.includes('fake')) {
    issues.push('Contains placeholder or fake implementation');
  }
  
  // 检查是否有翻译保护
  if (!content.includes('useTranslationProtection') && !content.includes('translate="no"')) {
    issues.push('Missing translation protection');
  }
  
  return issues;
}

// 主函数
function main() {
  console.log('🔍 Scanning for generator pages...\n');
  
  const pages = findGeneratorPages();
  
  console.log(`Found ${pages.length} generator pages:\n`);
  
  let totalIssues = 0;
  
  pages.forEach(page => {
    console.log(`📄 ${page.url}`);
    
    const issues = checkGeneratorFunctionality(page.file);
    
    if (issues.length === 0) {
      console.log('   ✅ All checks passed');
    } else {
      console.log(`   ❌ ${issues.length} issues found:`);
      issues.forEach(issue => {
        console.log(`      - ${issue}`);
      });
      totalIssues += issues.length;
    }
    
    console.log('');
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Pages scanned: ${pages.length}`);
  console.log(`   Total issues: ${totalIssues}`);
  
  if (totalIssues > 0) {
    console.log('\n🚨 Issues found! Please review the generators above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All generators look good!');
  }
}

main(); 