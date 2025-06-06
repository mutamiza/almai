"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  CreditCard,
  Users,
  Plus,
  Database,
  Settings,
  FileText,
  Bell,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { AddContractModal } from "@/components/add-contract-modal"
import { AddPaymentModal } from "@/components/add-payment-modal"
import { useDatabase } from "@/hooks/use-database"

export default function DashboardPage() {
  const { contracts, payments, users, dashboardStats, loading, error, addContract, addPayment, fetchAllData } =
    useDatabase()

  const [searchTerm, setSearchTerm] = useState("")
  const [showAddContract, setShowAddContract] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)

  // حساب الإحصائيات المتقدمة
  const stats = {
    totalContracts: contracts.length,
    activeContracts: contracts.filter((c) => c.contractStatus === "نشط").length,
    totalPayments: payments.length,
    totalRevenue: payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0),
    pendingPayments: payments.filter((p) => p.status === "pending").length,
    overduePayments: payments.filter((p) => p.status === "overdue").length,
    monthlyRevenue: payments
      .filter((p) => {
        const paymentDate = new Date(p.paymentDate)
        const currentMonth = new Date().getMonth()
        return p.status === "paid" && paymentDate.getMonth() === currentMonth
      })
      .reduce((sum, p) => sum + p.amount, 0),
    expiringContracts: contracts.filter((c) => {
      const endDate = new Date(c.endDate)
      const today = new Date()
      const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return daysRemaining <= 30 && daysRemaining > 0
    }).length,
  }

  // التنبيهات المهمة
  const alerts = [
    ...payments
      .filter((p) => p.status === "overdue")
      .map((p) => ({
        id: `overdue_${p.id}`,
        type: "overdue",
        title: "دفعة متأخرة",
        message: `دفعة بقيمة ${p.amount.toLocaleString()} ريال متأخرة`,
        priority: "high",
        date: p.dueDate,
      })),
    ...contracts
      .filter((c) => {
        const endDate = new Date(c.endDate)
        const today = new Date()
        const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return daysRemaining <= 30 && daysRemaining > 0
      })
      .map((c) => ({
        id: `expiring_${c.id}`,
        type: "expiring",
        title: "عقد ينتهي قريباً",
        message: `عقد ${c.contractName} ينتهي قريباً`,
        priority: "medium",
        date: c.endDate,
      })),
  ]

  useEffect(() => {
    fetchAllData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 ml-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-sm text-gray-500">نظرة شاملة على العقود والدفعات</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {alerts.length > 0 && (
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-400" />
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">{alerts.length}</Badge>
                </div>
              )}
              <Button onClick={() => (window.location.href = "/database-setup")} variant="outline">
                <Settings className="h-4 w-4 ml-2" />
                الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* الإحصائيات الرئيسية */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">إجمالي العقود</p>
                  <p className="text-3xl font-bold">{stats.totalContracts}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-blue-100">{stats.activeContracts} نشط</span>
                  </div>
                </div>
                <Building2 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold">{(stats.totalRevenue / 1000).toFixed(0)}K</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-green-100">+12% هذا الشهر</span>
                  </div>
                </div>
                <DollarSign className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">الدفعات المعلقة</p>
                  <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                  <div className="flex items-center mt-2">
                    {stats.overduePayments > 0 ? (
                      <>
                        <ArrowDownRight className="h-4 w-4 text-red-300" />
                        <span className="text-sm text-yellow-100">{stats.overduePayments} متأخرة</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-300" />
                        <span className="text-sm text-yellow-100">لا توجد متأخرة</span>
                      </>
                    )}
                  </div>
                </div>
                <CreditCard className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">المستخدمين النشطين</p>
                  <p className="text-3xl font-bold">{users.length}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-300" />
                    <span className="text-sm text-purple-100">جميعهم نشط</span>
                  </div>
                </div>
                <Users className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* التنبيهات المهمة */}
        {alerts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                تنبيهات مهمة ({alerts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.slice(0, 6).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === "high" ? "border-l-red-500 bg-red-50" : "border-l-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {alert.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      ) : (
                        <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(alert.date).toLocaleDateString("ar-SA")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {alerts.length > 6 && (
                <div className="text-center mt-4">
                  <Button variant="outline" size="sm">
                    عرض جميع التنبيهات ({alerts.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* الإجراءات السريعة */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Button onClick={() => setShowAddContract(true)} className="h-16 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-5 w-5 ml-2" />
            إضافة عقد جديد
          </Button>
          <Button onClick={() => setShowAddPayment(true)} variant="outline" className="h-16">
            <Plus className="h-5 w-5 ml-2" />
            تسجيل دفعة
          </Button>
          <Button onClick={() => (window.location.href = "/reports")} variant="outline" className="h-16">
            <FileText className="h-5 w-5 ml-2" />
            عرض التقارير
          </Button>
          <Button onClick={() => (window.location.href = "/database-setup")} variant="outline" className="h-16">
            <Database className="h-5 w-5 ml-2" />
            إعدادات النظام
          </Button>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* العقود الحديثة */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  العقود الحديثة
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/contracts")}>
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">جاري التحميل...</p>
                </div>
              ) : contracts.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد عقود</p>
                  <Button onClick={() => setShowAddContract(true)} className="mt-4">
                    إضافة أول عقد
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.slice(0, 5).map((contract) => (
                    <div
                      key={contract.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{contract.contractName}</h3>
                        <p className="text-sm text-gray-500">رقم العقد: {contract.contractNumber}</p>
                        <p className="text-sm text-gray-500">القيمة: {contract.totalRentValue.toLocaleString()} ر.س</p>
                      </div>
                      <div className="text-left">
                        <Badge variant={contract.contractStatus === "نشط" ? "default" : "secondary"}>
                          {contract.contractStatus}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          ينتهي: {new Date(contract.endDate).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* الدفعات الحديثة */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  الدفعات الحديثة
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/payments")}>
                  عرض الكل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">جاري التحميل...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد دفعات</p>
                  <Button onClick={() => setShowAddPayment(true)} className="mt-4">
                    تسجيل أول دفعة
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{payment.amount.toLocaleString()} ر.س</h3>
                        <p className="text-sm text-gray-500">
                          نوع الدفعة:{" "}
                          {payment.type === "rent" ? "إيجار" : payment.type === "facilities" ? "مرافق" : "لافتات"}
                        </p>
                        <p className="text-sm text-gray-500">
                          تاريخ الاستحقاق: {new Date(payment.dueDate).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                      <div className="text-left">
                        <Badge
                          variant={
                            payment.status === "paid"
                              ? "default"
                              : payment.status === "overdue"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {payment.status === "paid" ? "مدفوع" : payment.status === "overdue" ? "متأخر" : "معلق"}
                        </Badge>
                        {payment.receiptNumber && (
                          <p className="text-xs text-gray-500 mt-1">إيصال: {payment.receiptNumber}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* معلومات النظام */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-4">
            <Database className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-blue-900">نظام إدارة عقود الاستثمار</h3>
              <p className="text-blue-700">يعمل النظام مع قاعدة بيانات MySQL لضمان الأداء والموثوقية العالية</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-green-100 text-green-800">✓ متصل بقاعدة البيانات</Badge>
                <Badge className="bg-blue-100 text-blue-800">{contracts.length} عقد مُحمل</Badge>
                <Badge className="bg-purple-100 text-purple-800">{payments.length} دفعة مُحملة</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* النوافذ المنبثقة */}
      <AddContractModal isOpen={showAddContract} onClose={() => setShowAddContract(false)} onAdd={addContract} />

      <AddPaymentModal
        isOpen={showAddPayment}
        onClose={() => setShowAddPayment(false)}
        onAdd={addPayment}
        contracts={contracts}
      />
    </div>
  )
}
