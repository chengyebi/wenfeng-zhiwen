# 文风指纹

稳定、可解释的个人语言习惯分析器。

文风指纹是一个不调用 AI、不调用大模型 API 的个人文风分析网站。用户持续添加自己真实写过的文本，系统用确定性统计规则分析语言习惯，生成稳定、可复现的个人文风画像，并支持输入新文本判断它与本人历史文风的一致程度。

## 产品定位

本项目不是 AI 检测规避工具，不提供 AI 代写、改写、降重或伪装真人写作能力。它的定位是个人写作习惯分析器：

- 积累自己的真实文本样本
- 生成稳定可复现的文风画像
- 查看句长、标点、连接词、语气词等指标
- 输入新文本，判断是否接近本人历史风格

## 不调用 AI 的说明

系统不接入 OpenAI、Claude 或任何大模型 API。所有分析都来自本地确定性规则：

- 句子和段落切分
- 标点计数
- 连接词、不确定性词、断言词、口语标记统计
- 2-6 字重复短语提取
- 基于固定权重的相似度计算
- 基于规则模板的中文画像说明

同一批文本在同一 `engine_version` 下会生成相同结果。

## 功能列表

- Supabase 邮箱密码注册、登录、退出
- 登录保护的仪表盘
- 添加文本样本并自动分析
- 文本样本列表、详情和删除
- 单条文本特征展示
- 总体文风画像
- 新文本相似度对比
- 隐私与安全说明
- Supabase RLS 数据隔离

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Server Actions
- npm

## 本地运行

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
```

## Supabase 配置步骤

1. 创建 Supabase 项目。
2. 打开 SQL Editor。
3. 粘贴并执行 `supabase/schema.sql`。
4. 在 Authentication 中启用 Email/Password 登录。
5. 复制 Project URL 和 anon public key。
6. 创建 `.env.local`。

## 环境变量

复制 `.env.example`：

```bash
cp .env.example .env.local
```

填写：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

不要提交 `.env.local`。

## 如何执行 schema.sql

在 Supabase Dashboard 中进入：

```text
SQL Editor -> New query
```

复制 `supabase/schema.sql` 全部内容并运行。该脚本会创建：

- `writing_samples`
- `sample_features`
- `style_profiles`
- 所需索引
- RLS policies

RLS 策略确保用户只能读写自己的数据。

## 安全与隐私

- 系统只分析用户主动提交的文本。
- 不调用 AI，不把文本发送给大模型。
- 用户可以删除自己的文本。
- 用户只能访问自己的数据。
- 新文本对比不保存输入内容。
- 建议不要上传身份证号、病历、密码、隐私聊天等高度敏感信息。

## 后续迭代方向

以下方向暂未实现：

1. 导出文风报告 PDF
2. 多文风档案，比如“论文风格”“聊天风格”“面试风格”
3. 只保存特征、不保存原文的隐私模式
4. 本地加密
5. Chrome 插件采集自己授权的文本
6. 更细粒度的中文分词
7. 风格变化时间线
8. 多设备同步
9. 付费版容量限制
