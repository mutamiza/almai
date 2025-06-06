# دليل المساهمة

شكراً لاهتمامك بالمساهمة في نظام إدارة عقود الاستثمار! 

## كيفية المساهمة

### 1. الإعداد المحلي
\`\`\`bash
# استنساخ المشروع
git clone https://github.com/yourusername/investment-contracts-manager.git
cd investment-contracts-manager

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
# عدل .env.local بمعلوماتك

# تشغيل النظام
npm run dev
\`\`\`

### 2. إنشاء Branch جديد
\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

### 3. معايير الكود

#### TypeScript
- استخدم TypeScript في جميع الملفات
- أضف types للمتغيرات والوظائف
- تجنب `any` قدر الإمكان

#### React Components
\`\`\`tsx
// ✅ جيد
interface Props {
  title: string;
  isActive?: boolean;
}

export function MyComponent({ title, isActive = false }: Props) {
  return <div>{title}</div>;
}

// ❌ سيء
export function MyComponent(props: any) {
  return <div>{props.title}</div>;
}
\`\`\`

#### CSS/Styling
- استخدم Tailwind CSS
- استخدم مكونات shadcn/ui عند الإمكان
- اتبع نمط التصميم الموحد

### 4. هيكل الملفات
\`\`\`
components/
├── ui/           # مكونات shadcn/ui
├── forms/        # نماذج الإدخال
├── tables/       # جداول البيانات
└── layout/       # مكونات التخطيط
\`\`\`

### 5. قاعدة البيانات
- استخدم prepared statements
- أضف validation للبيانات
- اكتب migration scripts عند الحاجة

### 6. API Routes
\`\`\`tsx
// ✅ جيد
export async function GET() {
  try {
    const data = await db.query('SELECT * FROM contracts');
    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
\`\`\`

### 7. اختبار التغييرات
- اختبر جميع الوظائف المتأثرة
- تأكد من عمل النظام في وضع التطوير والإنتاج
- اختبر على متصفحات مختلفة

### 8. Commit Messages
\`\`\`bash
# ✅ جيد
git commit -m "feat: add contract expiration notifications"
git commit -m "fix: resolve payment calculation bug"
git commit -m "docs: update API documentation"

# ❌ سيء
git commit -m "update stuff"
git commit -m "fix bug"
\`\`\`

### 9. Pull Request
- اكتب وصف واضح للتغييرات
- أضف screenshots إذا كانت التغييرات بصرية
- اربط بـ Issues ذات الصلة

## أنواع المساهمات المرحب بها

### 🐛 إصلاح الأخطاء
- أخطاء في الحسابات
- مشاكل في واجهة المستخدم
- أخطاء في قاعدة البيانات

### ✨ ميزات جديدة
- تحسينات على التقارير
- ميزات تصدير البيانات
- تحسينات الأمان

### 📚 التوثيق
- تحسين README
- إضافة تعليقات للكود
- أمثلة للاستخدام

### 🎨 التصميم
- تحسين واجهة المستخدم
- إضافة animations
- تحسين الاستجابة

## معايير المراجعة

### الكود
- [ ] يتبع معايير TypeScript
- [ ] يستخدم Tailwind CSS
- [ ] يحتوي على error handling
- [ ] محسن للأداء

### الوظائف
- [ ] يعمل كما هو متوقع
- [ ] لا يكسر وظائف موجودة
- [ ] يتعامل مع edge cases

### الأمان
- [ ] لا يحتوي على SQL injection
- [ ] يتحقق من صحة البيانات
- [ ] يحمي البيانات الحساسة

## الحصول على المساعدة

إذا كنت بحاجة لمساعدة:
- افتح Issue للنقاش
- راجع الكود الموجود للأمثلة
- اسأل في التعليقات

## شكراً لك!

كل مساهمة، مهما كانت صغيرة، تساعد في تحسين النظام. شكراً لوقتك وجهدك! 🙏
