const fs = require('fs');
const path = require('path');

// 主要生成器页面列表
const mainGenerators = [
  {
    name: 'Integer Generator',
    path: 'src/app/numbers/integers/page.tsx',
    url: '/numbers/integers'
  },
  {
    name: 'Name Generator', 
    path: 'src/app/lists/names/page.tsx',
    url: '/lists/names'
  },
  {
    name: 'Password Generator',
    path: 'src/app/lists/passwords/page.tsx', 
    url: '/lists/passwords'
  },
  {
    name: 'Lottery Generator',
    path: 'src/app/games/lottery/page.tsx',
    url: '/games/lottery'
  },
  {
    name: 'Lorem Generator',
    path: 'src/app/lists/lorem/page.tsx',
    url: '/lists/lorem'
  },
  {
    name: 'Color Generator',
    path: 'src/app/design/colors/page.tsx',
    url: '/design/colors'
  }
];

function checkTranslationProtection(filePath, generatorName) {
  const issues = [];
  
  if (!fs.existsSync(filePath)) {
    issues.push('❌ File not found');
    return issues;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否导入了useTranslationProtection
  if (!content.includes('useTranslationProtection')) {
    issues.push('❌ Missing useTranslationProtection import');
  }
  
  // 检查是否有containerRef
  if (!content.includes('containerRef')) {
    issues.push('❌ Missing containerRef usage');
  }
  
  // 检查是否有ref={containerRef}
  if (!content.includes('ref={containerRef}')) {
    issues.push('❌ Missing ref={containerRef} on container');
  }
  
  // 检查生成按钮是否有翻译保护
  if (!content.includes('data-interactive="true"')) {
    issues.push('❌ Missing data-interactive="true" on button');
  }
  
  if (!content.includes('translate="no"')) {
    issues.push('❌ Missing translate="no" on button');
  }
  
  if (!content.includes('notranslate')) {
    issues.push('❌ Missing notranslate class on button');
  }
  
  // 检查是否有生成函数
  const generateFunctionPatterns = [
    'generateNumbers',
    'generateNames', 
    'generatePasswords',
    'generateText',
    'generateColors'
  ];
  
  const hasGenerateFunction = generateFunctionPatterns.some(pattern => 
    content.includes(pattern)
  );
  
  if (!hasGenerateFunction) {
    issues.push('❌ Missing generate function');
  }
  
  // 检查是否有Button组件
  if (!content.includes('<Button')) {
    issues.push('❌ Missing Button component');
  }
  
  // 检查是否有状态管理
  if (!content.includes('useState')) {
    issues.push('❌ Missing useState for state management');
  }
  
  return issues;
}

function generateReport() {
  console.log('🔍 Testing Main Generator Pages Translation Protection\n');
  console.log('=' .repeat(80));
  
  let totalIssues = 0;
  let passedGenerators = 0;
  
  mainGenerators.forEach(generator => {
    console.log(`\n📄 ${generator.name}`);
    console.log(`   Path: ${generator.path}`);
    console.log(`   URL: ${generator.url}`);
    
    const issues = checkTranslationProtection(generator.path, generator.name);
    
    if (issues.length === 0) {
      console.log('   ✅ All checks passed!');
      passedGenerators++;
    } else {
      console.log('   Issues found:');
      issues.forEach(issue => {
        console.log(`     ${issue}`);
      });
      totalIssues += issues.length;
    }
  });
  
  console.log('\n' + '=' .repeat(80));
  console.log(`📊 Summary:`);
  console.log(`   Total Generators: ${mainGenerators.length}`);
  console.log(`   Passed: ${passedGenerators}`);
  console.log(`   Failed: ${mainGenerators.length - passedGenerators}`);
  console.log(`   Total Issues: ${totalIssues}`);
  
  if (passedGenerators === mainGenerators.length) {
    console.log('\n🎉 All main generators have translation protection!');
  } else {
    console.log('\n⚠️  Some generators need attention.');
  }
  
  // 生成使用建议
  console.log('\n📝 Translation Protection Features:');
  console.log('   ✅ useTranslationProtection hook imported');
  console.log('   ✅ containerRef applied to main container');
  console.log('   ✅ Generate buttons protected with translate="no"');
  console.log('   ✅ Interactive elements marked with data-interactive');
  console.log('   ✅ notranslate class added to buttons');
  
  console.log('\n🧪 Testing Instructions:');
  console.log('   1. Open any generator page in browser');
  console.log('   2. Enable Google Translate extension');
  console.log('   3. Translate page to Chinese/other language');
  console.log('   4. Click generate button - should work without DOM errors');
  console.log('   5. Verify generated results display correctly');
}

// 运行测试
generateReport(); 