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
  
  // 检查是否有翻译保护
  const hasTranslationProtection = content.includes('useTranslationProtection') || 
                                   content.includes('translate="no"');
  if (!hasTranslationProtection) {
    issues.push('Missing translation protection');
  }
  
  // 检查是否有交互按钮
  const hasInteractiveButton = content.includes('onClick') && 
                               (content.includes('Generate') || 
                                content.includes('Shuffle') || 
                                content.includes('Create') ||
                                content.includes('Draw') ||
                                content.includes('Roll') ||
                                content.includes('Flip') ||
                                content.includes('Spin') ||
                                content.includes('Build') ||
                                content.includes('Make'));
  if (!hasInteractiveButton) {
    issues.push('Missing interactive button or onClick handler');
  }
  
  // 检查是否有加载状态
  const hasLoadingState = content.includes('isGenerating') || 
                          content.includes('isLoading') ||
                          content.includes('loading') ||
                          content.includes('isShuffling') ||
                          content.includes('isRolling') ||
                          content.includes('isSpinning');
  if (!hasLoadingState) {
    issues.push('Missing loading state management');
  }
  
  // 检查是否有实际的功能实现（而不是占位符）
  const hasRealImplementation = !content.includes('// TODO') && 
                                !content.includes('placeholder implementation') &&
                                !content.includes('fake data') &&
                                !content.includes('mock data') &&
                                !content.includes('This is a placeholder');
  if (!hasRealImplementation) {
    issues.push('Contains placeholder or TODO implementation');
  }
  
  // 检查是否有数据状态管理
  const hasDataState = content.includes('useState') && 
                       (content.includes('result') || 
                        content.includes('data') || 
                        content.includes('generated') ||
                        content.includes('current') ||
                        content.includes('selected') ||
                        content.includes('shuffled') ||
                        content.includes('drawn') ||
                        content.includes('rolled') ||
                        content.includes('quotes') ||
                        content.includes('cards') ||
                        content.includes('numbers') ||
                        content.includes('colors') ||
                        content.includes('passwords') ||
                        content.includes('names'));
  if (!hasDataState) {
    issues.push('Missing data state management');
  }
  
  // 特殊检查：确保不是简单的静态页面
  const hasComplexLogic = content.includes('Math.random') ||
                          content.includes('crypto') ||
                          content.includes('shuffle') ||
                          content.includes('algorithm') ||
                          content.includes('filter') ||
                          content.includes('map(') ||
                          content.includes('forEach') ||
                          content.includes('for (') ||
                          content.includes('while (');
  if (!hasComplexLogic) {
    issues.push('Missing complex generation logic');
  }
  
  return issues;
}

// 获取页面统计信息
function getPageStats(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const lines = content.split('\n').length;
  const hasTranslation = content.includes('useTranslationProtection');
  const hasComplexState = (content.match(/useState/g) || []).length;
  const hasEffects = (content.match(/useEffect/g) || []).length;
  
  return {
    lines,
    hasTranslation,
    stateHooks: hasComplexState,
    effects: hasEffects
  };
}

// 主函数
function main() {
  console.log('🔍 Scanning for generator pages with improved detection...\n');
  
  const pages = findGeneratorPages();
  
  console.log(`Found ${pages.length} generator pages:\n`);
  
  let totalIssues = 0;
  let passedPages = 0;
  
  pages.forEach(page => {
    console.log(`📄 ${page.url}`);
    
    const issues = checkGeneratorFunctionality(page.file);
    const stats = getPageStats(page.file);
    
    if (issues.length === 0) {
      console.log('   ✅ All checks passed');
      console.log(`   📊 Stats: ${stats.lines} lines, ${stats.stateHooks} state hooks, ${stats.hasTranslation ? 'Protected' : 'Not Protected'}`);
      passedPages++;
    } else {
      console.log(`   ❌ ${issues.length} issues found:`);
      issues.forEach(issue => {
        console.log(`      - ${issue}`);
      });
      console.log(`   📊 Stats: ${stats.lines} lines, ${stats.stateHooks} state hooks, ${stats.hasTranslation ? 'Protected' : 'Not Protected'}`);
      totalIssues += issues.length;
    }
    
    console.log('');
  });
  
  console.log(`\n📊 Final Summary:`);
  console.log(`   Pages scanned: ${pages.length}`);
  console.log(`   Pages passed: ${passedPages}`);
  console.log(`   Pages with issues: ${pages.length - passedPages}`);
  console.log(`   Completion rate: ${((passedPages / pages.length) * 100).toFixed(1)}%`);
  console.log(`   Total issues: ${totalIssues}`);
  
  if (totalIssues > 0) {
    console.log('\n🚨 Issues found! Please review the generators above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All generators look good!');
  }
}

main(); 