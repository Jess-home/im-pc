//模板js部分替换多语言
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const glob = require("glob");
const pinyin = require("pinyin").default || require("pinyin");

// ---------------------- 配置 ----------------------
let TARGET_DIR = path.resolve(process.cwd(), "./");
let FILE_TYPES = ["vue"];
const LOCALE_FILE = path.resolve(process.cwd(), "./i18n/locales/zh.json");
const PROGRESS_FILE = path.resolve(process.cwd(), ".progress-script.json");
// ----------------------------------------------------

let zhData = {};
if (fs.existsSync(LOCALE_FILE)) {
  try {
    zhData = fs.readJsonSync(LOCALE_FILE);
  } catch {
    zhData = {};
    console.log(chalk.red("⚠️ zh.json 解析失败，已初始化为空对象"));
  }
}

let progressData = {};
if (fs.existsSync(PROGRESS_FILE)) {
  try {
    progressData = fs.readJsonSync(PROGRESS_FILE);
  } catch {
    progressData = {};
  }
}

console.log(chalk.magenta.bold("🌏 Vue Script 中文替换工具启动中...\n"));

function generateKey(text) {
  let clean = text.replace(/[，。！？""、：；【】（）()《》\s\r\n\t]/g, "");
  if (!clean) clean = "text";
  let arr = pinyin(clean, { style: pinyin.STYLE_NORMAL, heteronym: false });
  return arr.flat().join("_").toLowerCase();
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// 获取 script 部分的开始和结束行
function getScriptRange(content) {
  const lines = content.split("\n");
  let scriptStart = -1;
  let scriptEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("<script")) {
      scriptStart = i;
    }
    if (lines[i].includes("</script>")) {
      scriptEnd = i;
      break;
    }
  }

  return { scriptStart, scriptEnd };
}

// 判断是否在 script 中
function isInScript(lineIndex, scriptRange) {
  return lineIndex > scriptRange.scriptStart && lineIndex < scriptRange.scriptEnd;
}

// 判断是否注释
function isComment(line) {
  const trimmed = line.trim();
  return trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*");
}

// 检查字符串是否在注释后面
function isInLineComment(line) {
  return line.includes("//");
}

// 查找字符串中的中文
// 匹配 "中文" 或 '中文' 或 `中文` 格式
function findChineseInString(line) {
  const matches = [];

  // 匹配单引号中的中文
  const singleQuoteRegex = /'([^']*[\u4e00-\u9fa5][^']*)'/g;
  let match;
  while ((match = singleQuoteRegex.exec(line)) !== null) {
    matches.push({
      fullMatch: match[0],
      value: match[1],
      quote: "'",
      index: match.index
    });
  }

  // 匹配双引号中的中文
  const doubleQuoteRegex = /"([^"]*[\u4e00-\u9fa5][^"]*)"/g;
  while ((match = doubleQuoteRegex.exec(line)) !== null) {
    matches.push({
      fullMatch: match[0],
      value: match[1],
      quote: '"',
      index: match.index
    });
  }

  // 匹配反引号中的中文
  const backtickRegex = /`([^`]*[\u4e00-\u9fa5][^`]*)`/g;
  while ((match = backtickRegex.exec(line)) !== null) {
    matches.push({
      fullMatch: match[0],
      value: match[1],
      quote: '`',
      index: match.index
    });
  }

  // 按位置排序
  matches.sort((a, b) => a.index - b.index);

  return matches;
}

// 处理单个匹配
async function handleStringMatch(filePath, lineIndex, line, value) {
  const key = generateKey(value);
  const replacement = `this.$t('${key}')`;

  console.log(chalk.yellow(`\n📄 文件: ${path.relative(process.cwd(), filePath)}`));
  console.log(chalk.blue(`📝 第 ${lineIndex + 1} 行`));
  console.log(chalk.cyan(`原始值: "${value}"`));
  console.log(chalk.green(`建议: ${replacement}`));
  console.log(chalk.magenta(`🔑 key: ${key}`));

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "请选择操作:",
      choices: [
        { name: "✅ 确认替换 (y)", value: "y" },
        { name: "⏭️  跳过此项 (n)", value: "n" },
        { name: "✏️  编辑key (e)", value: "e" },
        { name: "🚫 跳过当前文件 (s)", value: "s" }
      ],
      default: "y"
    }
  ]);

  if (action === "s") {
    return { action: "skip_file" };
  }
  if (action === "n") {
    return { action: "skip_item" };
  }

  let finalKey = key;
  let finalReplacement = replacement;

  if (action === "e") {
    const { customKey } = await inquirer.prompt([
      {
        type: "input",
        name: "customKey",
        message: "请输入自定义的 key:",
        default: key
      }
    ]);
    if (customKey && customKey.trim()) {
      finalKey = customKey.trim();
      finalReplacement = `this.$t('${finalKey}')`;
    }
  }

  return {
    action: "replace",
    key: finalKey,
    value,
    replacement: finalReplacement
  };
}

// 处理单文件
async function processFile(filePath) {
  const relativePath = path.relative(process.cwd(), filePath);
  let content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  let changed = false;
  let skipFile = false;

  if (!progressData[relativePath]) {
    progressData[relativePath] = {
      processedLines: {},
      completed: false
    };
  }

  if (progressData[relativePath].completed) {
    console.log(chalk.gray(`⊘ 文件已完成: ${relativePath}\n`));
    return;
  }

  const processedLines = progressData[relativePath].processedLines || {};
  const scriptRange = getScriptRange(content);

  if (scriptRange.scriptStart === -1) {
    console.log(chalk.gray(`⊘ 未找到 <script>: ${relativePath}\n`));
    progressData[relativePath].completed = true;
    fs.writeJsonSync(PROGRESS_FILE, progressData, { spaces: 2 });
    return;
  }

  for (let i = scriptRange.scriptStart + 1; i < scriptRange.scriptEnd; i++) {
    if (skipFile) break;

    let line = lines[i];
    
    if (isComment(line)) continue;
    if (isInLineComment(line)) {
      // 检查是否整行都是注释
      const beforeComment = line.split("//")[0];
      if (!beforeComment.includes("'") && !beforeComment.includes('"') && !beforeComment.includes("`")) {
        continue;
      }
      line = beforeComment; // 只处理注释前的部分
    }

    // 初始化行的处理记录
    if (!processedLines[i]) {
      processedLines[i] = [];
    }

    // 查找该行中的字符串中的中文
    const matches = findChineseInString(line);

    if (matches.length === 0) continue;

    for (let j = 0; j < matches.length; j++) {
      if (skipFile) break;

      const match = matches[j];
      const matchKey = match.fullMatch; // 用完整匹配作为标记

      // 跳过已处理的
      if (processedLines[i].includes(matchKey)) {
        continue;
      }

      // 处理匹配
      const result = await handleStringMatch(
        filePath,
        i,
        line,
        match.value
      );

      if (result.action === "skip_file") {
        console.log(chalk.gray("➡️ 跳过当前文件\n"));
        skipFile = true;
        break;
      }

      if (result.action === "skip_item") {
        console.log(chalk.gray("⏭️ 跳过此项\n"));
        continue;
      }

      if (result.action === "replace") {
        // 执行替换：替换带引号的字符串
        const originalLine = lines[i];
        const searchPattern = escapeRegExp(match.fullMatch);
        lines[i] = lines[i].replace(new RegExp(searchPattern), result.replacement);

        if (originalLine !== lines[i]) {
          changed = true;
          console.log(chalk.green(`✅ 替换成功`));
          console.log(chalk.cyan(`新行: ${lines[i]}\n`));

          // 更新语言包
          if (!zhData[result.key]) {
            zhData[result.key] = match.value;
            fs.writeJsonSync(LOCALE_FILE, zhData, { spaces: 2 });
            console.log(chalk.green(`✓ 已添加到语言包\n`));
          } else {
            console.log(chalk.gray(`⚠️ 语言包中 key 已存在\n`));
          }

          // 保存进度
          processedLines[i].push(matchKey);
          progressData[relativePath].processedLines = processedLines;
          fs.writeJsonSync(PROGRESS_FILE, progressData, { spaces: 2 });

          // 重新查找该行（因为已经改变了）
          const newMatches = findChineseInString(lines[i]);
          if (newMatches.length === 0) {
            break; // 该行没有更多的中文了
          }
        } else {
          console.log(chalk.red(`✗ 替换失败\n`));
        }
      }
    }
  }

  // 保存文件
  if (changed) {
    const newContent = lines.join("\n");
    fs.writeFileSync(filePath, newContent, "utf-8");
    console.log(chalk.bold.green(`✅ 文件已保存: ${relativePath}\n`));
  }

  // 标记完成
  if (!skipFile) {
    progressData[relativePath].completed = true;
  }
  fs.writeJsonSync(PROGRESS_FILE, progressData, { spaces: 2 });
}

// 主程序
async function main() {
  const arg = process.argv[2];

  if (arg && fs.existsSync(arg) && fs.lstatSync(arg).isFile()) {
    await processFile(path.resolve(arg));
  } else {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "dir",
        message: `输入要扫描的目录（默认: ${TARGET_DIR}）`
      }
    ]);

    if (answers.dir.trim()) TARGET_DIR = path.resolve(process.cwd(), answers.dir.trim());

    console.log(chalk.cyan(`\n🚀 开始扫描目录: ${TARGET_DIR}`));
    console.log(chalk.cyan(`📂 文件类型: vue\n`));

    if (!fs.existsSync(TARGET_DIR)) {
      console.log(chalk.red(`❌ 目录不存在: ${TARGET_DIR}`));
      return;
    }

    const normalizedDir = TARGET_DIR.replace(/\\/g, "/");
    const pattern = `${normalizedDir}/**/*.vue`;

    const files = glob.sync(pattern, {
      ignore: ["**/node_modules/**", "**/dist/**"],
      nodir: true
    });

    files.sort((a, b) => a.localeCompare(b, "zh-CN"));

    if (files.length === 0) {
      console.log(chalk.yellow("⚠️ 未找到 .vue 文件"));
      return;
    }

    console.log(chalk.cyan(`📋 找到 ${files.length} 个 Vue 文件\n`));

    for (const file of files) {
      await processFile(file);
    }
  }

  console.log(chalk.bold.green("\n🎉 处理完成！\n"));
}

main();