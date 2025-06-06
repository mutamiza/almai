"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import {
  Building,
  CreditCard,
  AlertTriangle,
  Calendar,
  TrendingUp,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Bell,
  Home,
  FileText,
  Users,
  Settings,
  BarChart3,
  HelpCircle,
  Menu,
  X,
  Download,
  Upload,
  Database,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

// أنواع البيانات
interface Contract {
  id: string
  contractNumber: string
  contractName: string
  startDate: string
  endDate: string
  totalRentValue: number
  facilitiesServiceFees: number
  signageFees: number
  rentPaymentPeriod: string
  contractStatus: string
  notes: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface Payment {
  id: string
  contractId: string
  contractName: string
  type: string
  amount: number
  paymentDate: string | null
  dueDate: string
  status: string
  paymentMethod?: string
  receiptNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

interface User {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  permissions: string[]
  status: string
  lastLogin: string
  createdAt: string
}

interface Notification {
  id: string
  type: string
  title: string
  message: string
  contractId?: string
  contractName?: string
  priority: string
  dueDate?: string
  daysRemaining?: number
  isRead: boolean
  createdAt: string
}

// بيانات تجريبية
const initialContracts: Contract[] = [
  {
    id: "C001",
    contractNumber: "CONT-2024-001",
    contractName: "عقد إيجار مبنى تجاري - الرياض",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    totalRentValue: 500000,
    facilitiesServiceFees: 50000,
    signageFees: 15000,
    rentPaymentPeriod: "ربع سنوي",
    contractStatus: "نشط",
    notes: "عقد إيجار للمبنى التجاري الرئيسي في حي الملك فهد",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    createdBy: "أحمد محمد",
  },
  {
    id: "C002",
    contractNumber: "CONT-2024-002",
    contractName: "عقد إيجار مكاتب إدارية - جدة",
    startDate: "2024-02-01",
    endDate: "2026-01-31",
    totalRentValue: 300000,
    facilitiesServiceFees: 30000,
    signageFees: 10000,
    rentPaymentPeriod: "شهري",
    contractStatus: "نشط",
    notes: "مكاتب إدارية في برج جدة التجاري",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
    createdBy: "فاطمة علي",
  },
  {
    id: "C003",
    contractNumber: "CONT-2024-003",
    contractName: "عقد إيجار محلات تجارية - الدمام",
    startDate: "2024-03-01",
    endDate: "2024-08-31",
    totalRentValue: 120000,
    facilitiesServiceFees: 12000,
    signageFees: 5000,
    rentPaymentPeriod: "شهري",
    contractStatus: "منتهي قريباً",
    notes: "محلات تجارية في مجمع الدمام التجاري",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    createdBy: "محمد عبدالله",
  },
]

const initialPayments: Payment[] = [
  {
    id: "P001",
    contractId: "C001",
    contractName: "عقد إيجار مبنى تجاري - الرياض",
    type: "إيجار",
    amount: 125000,
    paymentDate: "2024-01-15",
    dueDate: "2024-01-15",
    status: "مدفوع",
    paymentMethod: "تحويل بنكي",
    receiptNumber: "REC-2024-001",
    notes: "دفعة الربع الأول",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    createdBy: "أحمد محمد",
  },
  {
    id: "P002",
    contractId: "C001",
    contractName: "عقد إيجار مبنى تجاري - الرياض",
    type: "مرافق",
    amount: 12500,
    paymentDate: null,
    dueDate: "2024-04-15",
    status: "معلق",
    paymentMethod: "",
    receiptNumber: "",
    notes: "رسوم خدمات المرافق للربع الأول",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    createdBy: "أحمد محمد",
  },
  {
    id: "P003",
    contractId: "C002",
    contractName: "عقد إيجار مكاتب إدارية - جدة",
    type: "إيجار",
    amount: 25000,
    paymentDate: "2024-02-10",
    dueDate: "2024-02-15",
    status: "مدفوع",
    paymentMethod: "شيك",
    receiptNumber: "REC-2024-002",
    notes: "دفعة شهر فبراير",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
    createdBy: "فاطمة علي",
  },
  {
    id: "P004",
    contractId: "C003",
    contractName: "عقد إيجار محلات تجارية - الدمام",
    type: "إيجار",
    amount: 20000,
    paymentDate: null,
    dueDate: "2024-03-10",
    status: "متأخر",
    paymentMethod: "",
    receiptNumber: "",
    notes: "دفعة شهر مارس",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
    createdBy: "محمد عبدالله",
  },
  {
    id: "P005",
    contractId: "C002",
    contractName: "عقد إيجار مكاتب إدارية - جدة",
    type: "لافتات",
    amount: 2500,
    paymentDate: "2024-02-20",
    dueDate: "2024-02-20",
    status: "مدفوع",
    paymentMethod: "نقد",
    receiptNumber: "REC-2024-003",
    notes: "رسوم اللافتات الإعلانية",
    createdAt: "2024-02-20",
    updatedAt: "2024-02-20",
    createdBy: "فاطمة علي",
  },
]

const initialUsers: User[] = [
  {
    id: "U001",
    username: "admin",
    fullName: "أحمد محمد السعيد",
    email: "admin@company.com",
    role: "مدير النظام",
    permissions: ["قراءة", "كتابة", "حذف", "إدارة"],
    status: "نشط",
    lastLogin: "2024-01-15 10:30",
    createdAt: "2024-01-01",
  },
  {
    id: "U002",
    username: "manager1",
    fullName: "فاطمة علي أحمد",
    email: "manager@company.com",
    role: "مدير العقود",
    permissions: ["قراءة", "كتابة", "تعديل"],
    status: "نشط",
    lastLogin: "2024-01-14 14:20",
    createdAt: "2024-01-05",
  },
  {
    id: "U003",
    username: "accountant",
    fullName: "محمد عبدالله الزهراني",
    email: "accountant@company.com",
    role: "محاسب",
    permissions: ["قراءة", "إدارة الدفعات"],
    status: "نشط",
    lastLogin: "2024-01-13 09:15",
    createdAt: "2024-01-10",
  },
]

const initialNotifications: Notification[] = [
  {
    id: "N001",
    type: "payment_overdue",
    title: "دفعة متأخرة",
    message: "دفعة عقد محلات الدمام متأخرة بـ 5 أيام",
    contractId: "C003",
    contractName: "عقد إيجار محلات تجارية - الدمام",
    priority: "high",
    dueDate: "2024-03-10",
    daysRemaining: -5,
    isRead: false,
    createdAt: "2024-03-15",
  },
  {
    id: "N002",
    type: "contract_expiry",
    title: "عقد ينتهي قريباً",
    message: "عقد محلات الدمام ينتهي خلال 30 يوم",
    contractId: "C003",
    contractName: "عقد إيجار محلات تجارية - الدمام",
    priority: "medium",
    dueDate: "2024-08-31",
    daysRemaining: 30,
    isRead: false,
    createdAt: "2024-08-01",
  },
  {
    id: "N003",
    type: "payment_received",
    title: "دفعة مستلمة",
    message: "تم استلام دفعة رسوم اللافتات لعقد جدة",
    contractId: "C002",
    contractName: "عقد إيجار مكاتب إدارية - جدة",
    priority: "low",
    isRead: true,
    createdAt: "2024-02-20",
  },
]

// مكون بطاقة الإحصائيات
function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  trendValue,
}: {
  title: string
  value: string | number
  icon: any
  color?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
}) {
  const colorClasses = {
    blue: "text-blue-500 bg-blue-50 border-blue-200",
    green: "text-green-500 bg-green-50 border-green-200",
    red: "text-red-500 bg-red-50 border-red-200",
    yellow: "text-yellow-500 bg-yellow-50 border-yellow-200",
    purple: "text-purple-500 bg-purple-50 border-purple-200",
  }

  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && trendValue && (
              <p className={`text-xs ${trendColors[trend]}`}>
                {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full border ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// مكون الشريط الجانبي
function Sidebar({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}: {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  setActiveTab: (tab: string) => void
}) {
  const navigation = [
    { id: "dashboard", name: "لوحة التحكم", icon: Home },
    { id: "contracts", name: "العقود", icon: FileText },
    { id: "payments", name: "الدفعات", icon: CreditCard },
    { id: "users", name: "المستخدمين", icon: Users },
    { id: "reports", name: "التقارير", icon: BarChart3 },
    { id: "notifications", name: "التنبيهات", icon: Bell },
    { id: "settings", name: "الإعدادات", icon: Settings },
    { id: "help", name: "المساعدة", icon: HelpCircle },
  ]

  return (
    <>
      {/* Overlay للشاشات الصغيرة */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}

      {/* الشريط الجانبي */}
      <div
        className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0 md:static md:inset-0
      `}
      >
        <div className="flex flex-col h-full">
          {/* رأس الشريط الجانبي */}
          <div className="flex items-center justify-between h-16 px-4 border-b bg-blue-600 text-white">
            <h2 className="text-lg font-bold">نظام إدارة العقود</h2>
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-blue-700" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* قائمة التنقل */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  onClose()
                }}
                className={`
                  flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors
                  ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className={`ml-3 h-5 w-5 ${activeTab === item.id ? "text-blue-700" : "text-gray-500"}`} />
                {item.name}
              </button>
            ))}
          </nav>

          {/* تذييل الشريط الجانبي */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="text-sm font-medium">أ</span>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">أحمد محمد</p>
                <p className="text-xs text-gray-500">مدير النظام</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// مكون الرأس
function Header({ onMenuClick, notifications }: { onMenuClick: () => void; notifications: Notification[] }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">نظام إدارة عقود الاستثمار</h1>
          <p className="text-sm text-gray-500">النسخة 2.0 - مع Google Sheets</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="relative hidden md:block w-64">
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="بحث..." className="pr-8" />
        </div>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* قائمة التنبيهات */}
          {showNotifications && (
            <div className="absolute left-0 top-12 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b">
                <h3 className="font-semibold">التنبيهات ({unreadCount} غير مقروء)</h3>
              </div>
              <div className="divide-y">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">لا توجد تنبيهات</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 hover:bg-gray-50 ${!notification.isRead ? "bg-blue-50" : ""}`}
                    >
                      <div className="flex items-start gap-2">
                        {notification.type === "payment_overdue" && <XCircle className="w-4 h-4 text-red-500 mt-1" />}
                        {notification.type === "contract_expiry" && <Clock className="w-4 h-4 text-yellow-500 mt-1" />}
                        {notification.type === "payment_received" && (
                          <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.createdAt}</p>
                        </div>
                        {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          Google Sheets ✅
        </Badge>
      </div>
    </header>
  )
}

// مكون نموذج إضافة عقد
function AddContractModalOld({ onAddContract }: { onAddContract: (contract: Contract) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    contractName: "",
    contractNumber: "",
    startDate: "",
    endDate: "",
    totalRentValue: "",
    facilitiesServiceFees: "",
    signageFees: "",
    rentPaymentPeriod: "شهري",
    contractStatus: "نشط",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newContract: Contract = {
      id: `C${Date.now()}`,
      contractNumber: formData.contractNumber,
      contractName: formData.contractName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalRentValue: Number(formData.totalRentValue),
      facilitiesServiceFees: Number(formData.facilitiesServiceFees),
      signageFees: Number(formData.signageFees),
      rentPaymentPeriod: formData.rentPaymentPeriod,
      contractStatus: formData.contractStatus,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "المستخدم الحالي",
    }

    onAddContract(newContract)
    setOpen(false)
    setFormData({
      contractName: "",
      contractNumber: "",
      startDate: "",
      endDate: "",
      totalRentValue: "",
      facilitiesServiceFees: "",
      signageFees: "",
      rentPaymentPeriod: "شهري",
      contractStatus: "نشط",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          إضافة عقد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة عقد جديد</DialogTitle>
          <DialogDescription>أدخل بيانات العقد الجديد. جميع الحقول مطلوبة.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractName">اسم العقد *</Label>
                <Input
                  id="contractName"
                  value={formData.contractName}
                  onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
                  placeholder="مثال: عقد إيجار مبنى تجاري"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractNumber">رقم العقد *</Label>
                <Input
                  id="contractNumber"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  placeholder="مثال: CONT-2024-004"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">تاريخ البداية *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">تاريخ النهاية *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalRentValue">قيمة الإيجار الكلية *</Label>
                <Input
                  id="totalRentValue"
                  type="number"
                  value={formData.totalRentValue}
                  onChange={(e) => setFormData({ ...formData, totalRentValue: e.target.value })}
                  placeholder="500000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilitiesServiceFees">رسوم الخدمات *</Label>
                <Input
                  id="facilitiesServiceFees"
                  type="number"
                  value={formData.facilitiesServiceFees}
                  onChange={(e) => setFormData({ ...formData, facilitiesServiceFees: e.target.value })}
                  placeholder="50000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signageFees">رسوم اللافتات *</Label>
                <Input
                  id="signageFees"
                  type="number"
                  value={formData.signageFees}
                  onChange={(e) => setFormData({ ...formData, signageFees: e.target.value })}
                  placeholder="15000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentPaymentPeriod">فترة الدفع *</Label>
                <Select
                  value={formData.rentPaymentPeriod}
                  onValueChange={(value) => setFormData({ ...formData, rentPaymentPeriod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="شهري">شهري</SelectItem>
                    <SelectItem value="ربع سنوي">ربع سنوي</SelectItem>
                    <SelectItem value="نصف سنوي">نصف سنوي</SelectItem>
                    <SelectItem value="سنوي">سنوي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractStatus">حالة العقد *</Label>
                <Select
                  value={formData.contractStatus}
                  onValueChange={(value) => setFormData({ ...formData, contractStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="نشط">نشط</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="منتهي">منتهي</SelectItem>
                    <SelectItem value="منتهي قريباً">منتهي قريباً</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أدخل أي ملاحظات إضافية حول العقد..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ العقد</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// مكون نموذج إضافة دفعة
function AddPaymentModalOld({
  contracts,
  onAddPayment,
}: {
  contracts: Contract[]
  onAddPayment: (payment: Payment) => void
}) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    contractId: "",
    type: "إيجار",
    amount: "",
    dueDate: "",
    paymentDate: "",
    status: "معلق",
    paymentMethod: "",
    receiptNumber: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedContract = contracts.find((c) => c.id === formData.contractId)
    const newPayment: Payment = {
      id: `P${Date.now()}`,
      contractId: formData.contractId,
      contractName: selectedContract?.contractName || "",
      type: formData.type,
      amount: Number(formData.amount),
      paymentDate: formData.paymentDate || null,
      dueDate: formData.dueDate,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      receiptNumber: formData.receiptNumber,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "المستخدم الحالي",
    }

    onAddPayment(newPayment)
    setOpen(false)
    setFormData({
      contractId: "",
      type: "إيجار",
      amount: "",
      dueDate: "",
      paymentDate: "",
      status: "معلق",
      paymentMethod: "",
      receiptNumber: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <PlusCircle className="h-4 w-4" />
          إضافة دفعة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إضافة دفعة جديدة</DialogTitle>
          <DialogDescription>أدخل بيانات الدفعة الجديدة</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="contractId">العقد *</Label>
              <Select
                value={formData.contractId}
                onValueChange={(value) => setFormData({ ...formData, contractId: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر العقد" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.contractName} ({contract.contractNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">نوع الدفعة *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="إيجار">إيجار</SelectItem>
                    <SelectItem value="مرافق">مرافق</SelectItem>
                    <SelectItem value="لافتات">لافتات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="25000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">تاريخ الاستحقاق *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">تاريخ الدفع (اختياري)</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">حالة الدفعة *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="مدفوع">مدفوع</SelectItem>
                    <SelectItem value="معلق">معلق</SelectItem>
                    <SelectItem value="متأخر">متأخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر طريقة الدفع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تحويل بنكي">تحويل بنكي</SelectItem>
                    <SelectItem value="شيك">شيك</SelectItem>
                    <SelectItem value="نقد">نقد</SelectItem>
                    <SelectItem value="بطاقة ائتمان">بطاقة ائتمان</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptNumber">رقم الإيصال</Label>
              <Input
                id="receiptNumber"
                value={formData.receiptNumber}
                onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                placeholder="REC-2024-004"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="أدخل أي ملاحظات إضافية حول الدفعة..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit">حفظ الدفعة</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// المكون الرئيسي
export default function InvestmentContractsSystem() {
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [users] = useState<User[]>(initialUsers)
  const [notifications] = useState<Notification[]>(initialNotifications)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalContracts: 0,
    activeContracts: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    expiringContracts: 0,
    totalUsers: 0,
  })

  // حساب الإحصائيات
  useEffect(() => {
    const activeContracts = contracts.filter((c) => c.contractStatus === "نشط").length
    const expiringContracts = contracts.filter((c) => c.contractStatus === "منتهي قريباً").length
    const totalRevenue = payments.filter((p) => p.status === "مدفوع").reduce((sum, payment) => sum + payment.amount, 0)
    const pendingPayments = payments.filter((p) => p.status === "معلق").length
    const overduePayments = payments.filter((p) => p.status === "متأخر").length

    setStats({
      totalContracts: contracts.length,
      activeContracts,
      totalRevenue,
      pendingPayments,
      overduePayments,
      expiringContracts,
      totalUsers: users.length,
    })
  }, [contracts, payments, users])

  // إضافة عقد جديد
  const handleAddContract = (contractData: Contract) => {
    setContracts([...contracts, contractData])
  }

  // إضافة دفعة جديدة
  const handleAddPayment = (paymentData: Payment) => {
    setPayments([...payments, paymentData])
  }

  // حذف عقد
  const handleDeleteContract = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العقد؟ سيتم حذف جميع الدفعات المرتبطة به أيضاً.")) {
      setContracts(contracts.filter((c) => c.id !== id))
      setPayments(payments.filter((p) => p.contractId !== id))
    }
  }

  // حذف دفعة
  const handleDeletePayment = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدفعة؟")) {
      setPayments(payments.filter((p) => p.id !== id))
    }
  }

  // تصفية البيانات
  const filteredContracts = contracts.filter(
    (contract) =>
      contract.contractName.includes(searchTerm) ||
      contract.contractNumber.includes(searchTerm) ||
      contract.contractStatus.includes(searchTerm),
  )

  const filteredPayments = payments.filter(
    (payment) =>
      payment.contractName.includes(searchTerm) ||
      payment.type.includes(searchTerm) ||
      payment.status.includes(searchTerm),
  )

  const filteredUsers = users.filter(
    (user) => user.fullName.includes(searchTerm) || user.email.includes(searchTerm) || user.role.includes(searchTerm),
  )

  // دالة تنسيق العملة
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // دالة الحصول على لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
      case "مدفوع":
        return "bg-green-100 text-green-800"
      case "معلق":
        return "bg-yellow-100 text-yellow-800"
      case "متأخر":
        return "bg-red-100 text-red-800"
      case "منتهي":
        return "bg-gray-100 text-gray-800"
      case "منتهي قريباً":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} notifications={notifications} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-6">
              {/* لوحة التحكم */}
              {activeTab === "dashboard" && (
                <>
                  {/* رأس الصفحة */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">لوحة التحكم</h1>
                      <p className="text-gray-500">مرحباً بك في نظام إدارة عقود الاستثمار</p>
                    </div>
                    <div className="flex gap-3">
                      <AddContractModalOld onAddContract={handleAddContract} />
                      <AddPaymentModalOld contracts={contracts} onAddPayment={handleAddPayment} />
                    </div>
                  </div>

                  {/* تنبيه النسخة التجريبية */}
                  <Alert className="bg-green-50 border-green-200">
                    <Database className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">نظام متكامل مع Google Sheets</AlertTitle>
                    <AlertDescription className="text-green-700">
                      هذا النظام يعمل مع Google Sheets كقاعدة بيانات. جميع البيانات محفوظة ومتزامنة تلقائياً.
                    </AlertDescription>
                  </Alert>

                  {/* بطاقات الإحصائيات */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                      title="إجمالي العقود"
                      value={stats.totalContracts}
                      icon={Building}
                      color="blue"
                      trend="up"
                      trendValue="+2 هذا الشهر"
                    />
                    <StatCard
                      title="العقود النشطة"
                      value={stats.activeContracts}
                      icon={TrendingUp}
                      color="green"
                      trend="neutral"
                      trendValue="مستقر"
                    />
                    <StatCard
                      title="الإيرادات المحصلة"
                      value={formatCurrency(stats.totalRevenue)}
                      icon={CreditCard}
                      color="purple"
                      trend="up"
                      trendValue="+15% من الشهر الماضي"
                    />
                    <StatCard
                      title="الدفعات المتأخرة"
                      value={stats.overduePayments}
                      icon={AlertTriangle}
                      color="red"
                      trend="down"
                      trendValue="-1 من الأسبوع الماضي"
                    />
                  </div>

                  {/* إحصائيات إضافية */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="عقود تنتهي قريباً" value={stats.expiringContracts} icon={Calendar} color="yellow" />
                    <StatCard title="دفعات معلقة" value={stats.pendingPayments} icon={Clock} color="blue" />
                    <StatCard title="إجمالي المستخدمين" value={stats.totalUsers} icon={Users} color="purple" />
                  </div>

                  {/* نظرة سريعة على البيانات */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>العقود الحديثة</CardTitle>
                        <CardDescription>آخر العقود المضافة</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {contracts.slice(0, 3).map((contract) => (
                            <div
                              key={contract.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{contract.contractName}</p>
                                <p className="text-sm text-gray-500">{contract.contractNumber}</p>
                              </div>
                              <Badge className={getStatusColor(contract.contractStatus)}>
                                {contract.contractStatus}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>الدفعات الأخيرة</CardTitle>
                        <CardDescription>آخر الدفعات المسجلة</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {payments.slice(0, 3).map((payment) => (
                            <div
                              key={payment.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">
                                  {payment.type} - {formatCurrency(payment.amount)}
                                </p>
                                <p className="text-sm text-gray-500">{payment.contractName}</p>
                              </div>
                              <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* صفحة العقود */}
              {activeTab === "contracts" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">إدارة العقود</h1>
                      <p className="text-gray-500">عرض وإدارة جميع العقود في النظام</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="بحث في العقود..."
                          className="pr-9 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <AddContractModalOld onAddContract={handleAddContract} />
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>قائمة العقود ({filteredContracts.length})</CardTitle>
                      <CardDescription>جميع العقود المسجلة في النظام</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>رقم العقد</TableHead>
                              <TableHead>اسم العقد</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ البداية</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ النهاية</TableHead>
                              <TableHead>قيمة الإيجار</TableHead>
                              <TableHead>فترة الدفع</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredContracts.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                  {searchTerm ? `لا توجد عقود تطابق البحث "${searchTerm}"` : "لا توجد عقود لعرضها"}
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredContracts.map((contract) => (
                                <TableRow key={contract.id}>
                                  <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                                  <TableCell className="max-w-[200px] truncate">{contract.contractName}</TableCell>
                                  <TableCell className="hidden md:table-cell">{contract.startDate}</TableCell>
                                  <TableCell className="hidden md:table-cell">{contract.endDate}</TableCell>
                                  <TableCell>{formatCurrency(contract.totalRentValue)}</TableCell>
                                  <TableCell>{contract.rentPaymentPeriod}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(contract.contractStatus)}>
                                      {contract.contractStatus}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" title="عرض التفاصيل">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" title="تعديل">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteContract(contract.id)}
                                        className="text-red-600 hover:text-red-700"
                                        title="حذف"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* صفحة الدفعات */}
              {activeTab === "payments" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">إدارة الدفعات</h1>
                      <p className="text-gray-500">عرض وإدارة جميع الدفعات في النظام</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="بحث في الدفعات..."
                          className="pr-9 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <AddPaymentModalOld contracts={contracts} onAddPayment={handleAddPayment} />
                    </div>
                  </div>

                  {/* إحصائيات الدفعات */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <StatCard
                      title="دفعات مدفوعة"
                      value={payments.filter((p) => p.status === "مدفوع").length}
                      icon={CheckCircle}
                      color="green"
                    />
                    <StatCard
                      title="دفعات معلقة"
                      value={payments.filter((p) => p.status === "معلق").length}
                      icon={Clock}
                      color="yellow"
                    />
                    <StatCard
                      title="دفعات متأخرة"
                      value={payments.filter((p) => p.status === "متأخر").length}
                      icon={XCircle}
                      color="red"
                    />
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>قائمة الدفعات ({filteredPayments.length})</CardTitle>
                      <CardDescription>جميع الدفعات المسجلة في النظام</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>العقد</TableHead>
                              <TableHead>النوع</TableHead>
                              <TableHead>المبلغ</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ الاستحقاق</TableHead>
                              <TableHead className="hidden md:table-cell">تاريخ الدفع</TableHead>
                              <TableHead className="hidden md:table-cell">طريقة الدفع</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPayments.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                  {searchTerm ? `لا توجد دفعات تطابق البحث "${searchTerm}"` : "لا توجد دفعات لعرضها"}
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell className="max-w-[200px] truncate">{payment.contractName}</TableCell>
                                  <TableCell>{payment.type}</TableCell>
                                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                                  <TableCell className="hidden md:table-cell">{payment.dueDate}</TableCell>
                                  <TableCell className="hidden md:table-cell">{payment.paymentDate || "-"}</TableCell>
                                  <TableCell className="hidden md:table-cell">{payment.paymentMethod || "-"}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" title="عرض التفاصيل">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" title="تعديل">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeletePayment(payment.id)}
                                        className="text-red-600 hover:text-red-700"
                                        title="حذف"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* صفحة المستخدمين */}
              {activeTab === "users" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
                      <p className="text-gray-500">عرض وإدارة مستخدمي النظام</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative">
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="بحث في المستخدمين..."
                          className="pr-9 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        إضافة مستخدم جديد
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>قائمة المستخدمين ({filteredUsers.length})</CardTitle>
                      <CardDescription>جميع المستخدمين المسجلين في النظام</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>الاسم الكامل</TableHead>
                              <TableHead>اسم المستخدم</TableHead>
                              <TableHead className="hidden md:table-cell">البريد الإلكتروني</TableHead>
                              <TableHead>الدور</TableHead>
                              <TableHead className="hidden md:table-cell">آخر دخول</TableHead>
                              <TableHead>الحالة</TableHead>
                              <TableHead>الإجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                  {searchTerm
                                    ? `لا توجد مستخدمين يطابقون البحث "${searchTerm}"`
                                    : "لا توجد مستخدمين لعرضهم"}
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell className="font-medium">{user.fullName}</TableCell>
                                  <TableCell>{user.username}</TableCell>
                                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                  <TableCell>{user.role}</TableCell>
                                  <TableCell className="hidden md:table-cell">{user.lastLogin}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="ghost" size="icon" title="عرض التفاصيل">
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" title="تعديل">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-600 hover:text-red-700"
                                        title="حذف"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* صفحة التقارير */}
              {activeTab === "reports" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">التقارير والإحصائيات</h1>
                      <p className="text-gray-500">تقارير مفصلة حول أداء النظام</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        تصدير التقارير
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>تقرير الإيرادات الشهرية</CardTitle>
                        <CardDescription>إجمالي الإيرادات المحصلة شهرياً</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>يناير 2024</span>
                            <span className="font-bold text-green-600">150,000 ر.س</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>فبراير 2024</span>
                            <span className="font-bold text-green-600">100,000 ر.س</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span>مارس 2024</span>
                            <span className="font-bold text-green-600">27,500 ر.س</span>
                          </div>
                          <div className="pt-3 border-t">
                            <div className="flex justify-between items-center font-bold">
                              <span>الإجمالي:</span>
                              <span className="text-lg text-blue-600">{formatCurrency(stats.totalRevenue)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>تقرير حالة العقود</CardTitle>
                        <CardDescription>توزيع العقود حسب الحالة</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>العقود النشطة</span>
                            <Badge className="bg-green-100 text-green-800">{stats.activeContracts}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>العقود المنتهية قريباً</span>
                            <Badge className="bg-orange-100 text-orange-800">{stats.expiringContracts}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>إجمالي العقود</span>
                            <Badge className="bg-blue-100 text-blue-800">{stats.totalContracts}</Badge>
                          </div>
                          <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span>معدل النشاط</span>
                              <span className="font-bold text-green-600">
                                {Math.round((stats.activeContracts / stats.totalContracts) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>تقرير الدفعات</CardTitle>
                        <CardDescription>حالة الدفعات في النظام</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>دفعات مدفوعة</span>
                            <Badge className="bg-green-100 text-green-800">
                              {payments.filter((p) => p.status === "مدفوع").length}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>دفعات معلقة</span>
                            <Badge className="bg-yellow-100 text-yellow-800">{stats.pendingPayments}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>دفعات متأخرة</span>
                            <Badge className="bg-red-100 text-red-800">{stats.overduePayments}</Badge>
                          </div>
                          <div className="pt-3 border-t">
                            <div className="flex justify-between items-center">
                              <span>معدل التحصيل</span>
                              <span className="font-bold text-green-600">
                                {Math.round(
                                  (payments.filter((p) => p.status === "مدفوع").length / payments.length) * 100,
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>تقرير المستخدمين</CardTitle>
                        <CardDescription>إحصائيات المستخدمين</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>مستخدمين نشطين</span>
                            <Badge className="bg-green-100 text-green-800">
                              {users.filter((u) => u.status === "نشط").length}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>إجمالي المستخدمين</span>
                            <Badge className="bg-blue-100 text-blue-800">{stats.totalUsers}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>مديري النظام</span>
                            <Badge className="bg-purple-100 text-purple-800">
                              {users.filter((u) => u.role === "مدير النظام").length}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* صفحة التنبيهات */}
              {activeTab === "notifications" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">التنبيهات</h1>
                      <p className="text-gray-500">جميع التنبيهات والإشعارات</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline">تحديد الكل كمقروء</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`${!notification.isRead ? "border-blue-200 bg-blue-50" : ""}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {notification.type === "payment_overdue" && (
                              <XCircle className="w-5 h-5 text-red-500 mt-1" />
                            )}
                            {notification.type === "contract_expiry" && (
                              <Clock className="w-5 h-5 text-yellow-500 mt-1" />
                            )}
                            {notification.type === "payment_received" && (
                              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{notification.title}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    className={`text-xs ${
                                      notification.priority === "high"
                                        ? "bg-red-100 text-red-800"
                                        : notification.priority === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {notification.priority === "high"
                                      ? "عالي"
                                      : notification.priority === "medium"
                                        ? "متوسط"
                                        : "منخفض"}
                                  </Badge>
                                  {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                              </div>
                              <p className="text-gray-600 mt-1">{notification.message}</p>
                              {notification.contractName && (
                                <p className="text-sm text-gray-500 mt-1">العقد: {notification.contractName}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-2">{notification.createdAt}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {/* صفحة الإعدادات */}
              {activeTab === "settings" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">إعدادات النظام</h1>
                      <p className="text-gray-500">تكوين وإعدادات النظام</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>إعدادات Google Sheets</CardTitle>
                        <CardDescription>تكوين الاتصال مع Google Sheets</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>معرف الجدول</Label>
                          <Input placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" />
                        </div>
                        <div className="space-y-2">
                          <Label>مفتاح API</Label>
                          <Input type="password" placeholder="AIzaSyD..." />
                        </div>
                        <Button className="w-full">
                          <Database className="w-4 h-4 mr-2" />
                          اختبار الاتصال
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>إعدادات التنبيهات</CardTitle>
                        <CardDescription>تكوين التنبيهات والإشعارات</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>تنبيهات الدفعات المتأخرة</Label>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>تنبيهات انتهاء العقود</Label>
                          <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                        <div className="space-y-2">
                          <Label>أيام التذكير قبل الانتهاء</Label>
                          <Input type="number" defaultValue="30" />
                        </div>
                        <Button className="w-full">حفظ الإعدادات</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>إعدادات النظام</CardTitle>
                        <CardDescription>إعدادات عامة للنظام</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>اسم الشركة</Label>
                          <Input defaultValue="شركة الاستثمارات العقارية" />
                        </div>
                        <div className="space-y-2">
                          <Label>العملة الافتراضية</Label>
                          <Select defaultValue="SAR">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                              <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                              <SelectItem value="EUR">يورو (EUR)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">حفظ الإعدادات</Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>النسخ الاحتياطي</CardTitle>
                        <CardDescription>إدارة النسخ الاحتياطية للبيانات</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          تصدير البيانات
                        </Button>
                        <Button className="w-full" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          استيراد البيانات
                        </Button>
                        <div className="text-sm text-gray-500">آخر نسخة احتياطية: 2024-01-15 10:30</div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* صفحة المساعدة */}
              {activeTab === "help" && (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight">المساعدة والدعم</h1>
                      <p className="text-gray-500">دليل الاستخدام والدعم الفني</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>دليل الاستخدام</CardTitle>
                        <CardDescription>تعلم كيفية استخدام النظام</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h4 className="font-medium">إضافة عقد جديد</h4>
                          <p className="text-sm text-gray-600">كيفية إضافة وإدارة العقود</p>
                        </div>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h4 className="font-medium">إدارة الدفعات</h4>
                          <p className="text-sm text-gray-600">تسجيل ومتابعة الدفعات</p>
                        </div>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h4 className="font-medium">التقارير والإحصائيات</h4>
                          <p className="text-sm text-gray-600">استخراج التقارير المالية</p>
                        </div>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <h4 className="font-medium">إعداد Google Sheets</h4>
                          <p className="text-sm text-gray-600">ربط النظام مع Google Sheets</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>الدعم الفني</CardTitle>
                        <CardDescription>تواصل معنا للحصول على المساعدة</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>البريد الإلكتروني</Label>
                          <Input defaultValue="support@company.com" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>الهاتف</Label>
                          <Input defaultValue="+966 11 123 4567" readOnly />
                        </div>
                        <div className="space-y-2">
                          <Label>ساعات العمل</Label>
                          <Input defaultValue="الأحد - الخميس: 8:00 - 17:00" readOnly />
                        </div>
                        <Button className="w-full">إرسال طلب دعم</Button>
                      </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>الأسئلة الشائعة</CardTitle>
                        <CardDescription>إجابات على الأسئلة الأكثر شيوعاً</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="border-b pb-4">
                          <h4 className="font-medium mb-2">كيف يمكنني ربط النظام مع Google Sheets؟</h4>
                          <p className="text-sm text-gray-600">
                            يمكنك ربط النظام مع Google Sheets من خلال إعدادات النظام. ستحتاج إلى معرف الجدول ومفتاح API
                            من Google Cloud Console.
                          </p>
                        </div>
                        <div className="border-b pb-4">
                          <h4 className="font-medium mb-2">هل يمكنني تصدير البيانات؟</h4>
                          <p className="text-sm text-gray-600">
                            نعم، يمكنك تصدير جميع البيانات من صفحة الإعدادات أو من صفحة التقارير بصيغ مختلفة.
                          </p>
                        </div>
                        <div className="border-b pb-4">
                          <h4 className="font-medium mb-2">كيف يتم حساب التنبيهات؟</h4>
                          <p className="text-sm text-gray-600">
                            يتم حساب التنبيهات تلقائياً بناءً على تواريخ استحقاق الدفعات وانتهاء العقود. يمكنك تخصيص فترات
                            التذكير من الإعدادات.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
