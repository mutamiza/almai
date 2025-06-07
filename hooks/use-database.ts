"use client"

import { useState, useCallback, useEffect } from "react"
import { getDatabaseConfig } from "@/lib/config"

// بيانات تجريبية بسيطة
const mockContracts = [
  {
    id: "C001",
    contractNumber: "CONT-2024-001",
    contractName: "عقد إيجار مبنى تجاري",
    contractStatus: "نشط",
    startDate: "2024-01-01",
    endDate: "2025-12-31",
    totalRentValue: 500000,
    facilitiesServiceFees: 50000,
    signageFees: 15000,
    rentPaymentPeriod: "ربع سنوي",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

const mockUsers = [
  {
    id: "U001",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    role: "مدير",
    department: "إدارة العقود",
    status: "نشط",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
]

const mockPayments = [
  {
    id: "P001",
    contractId: "C001",
    type: "rent",
    amount: 125000,
    paymentDate: "2024-01-15",
    dueDate: "2024-01-15",
    status: "paid",
    paymentMethod: "تحويل بنكي",
    receiptNumber: "REC-2024-001",
    notes: "دفعة الربع الأول",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
]

export function useDatabase() {
  const [loading, setLoading] = useState(false)
  const [systemMode, setSystemMode] = useState("simulation")
  const [isConfigured, setIsConfigured] = useState(true)
  const [error, setError] = useState(null)
  const [dbConfig, setDbConfig] = useState(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getDatabaseConfig()
        setDbConfig(config)
        const response = await fetch('/api/database/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.name
          })
        })
        if (response.ok) {
          const result = await response.json()
          setSystemMode(result.success ? "production" : "simulation")
        } else {
          setSystemMode("simulation")
        }
      } catch (error) {
        console.error("فشل استرجاع معلومات الاتصال المحفوظة:", error)
        setSystemMode("simulation")
      }
    }
    fetchConfig()
  }, [])

  const getSystemStatus = () => ({
    mode: systemMode,
    configured: isConfigured,
    message: systemMode === "production" 
      ? "النظام يعمل في وضع الإنتاج مع قاعدة بيانات حقيقية" 
      : "النظام يعمل في وضع المحاكاة الآمن",
    isSafe: true,
    cost: systemMode === "production" ? "حسب استضافة قاعدة البيانات" : "مجاني"
  })

  const testConnection = async () => {
    if (!dbConfig) {
      return { success: false, message: "لم يتم تكوين معلومات الاتصال بقاعدة البيانات" }
    }
    try {
      setLoading(true)
      const response = await fetch('/api/database/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name
        })
      })
      if (!response.ok) throw new Error(`فشل اختبار الاتصال: ${response.status}`)
      const result = await response.json()
      if (result.success) setSystemMode("production")
      return result
    } catch (error: any) {
      console.error("خطأ في اختبار الاتصال:", error)
      setSystemMode("simulation")
      return { success: false, message: `خطأ في الاختبار: ${error.message}` }
    } finally {
      setLoading(false)
    }
  }

  const initializeTables = async () => {
    if (!dbConfig) return { success: false, message: "لم يتم تكوين معلومات الاتصال بقاعدة البيانات" }
    try {
      setLoading(true)
      const response = await fetch('/api/database/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name
        })
      })
      if (!response.ok) throw new Error(`فشل إنشاء الجداول: ${response.status}`)
      return await response.json()
    } catch (error: any) {
      console.error("خطأ في إنشاء الجداول:", error)
      return { success: false, message: `خطأ في إنشاء الجداول: ${error.message}` }
    } finally {
      setLoading(false)
    }
  }

  const addSampleData = async () => {
    if (!dbConfig) return { success: false, message: "لم يتم تكوين معلومات الاتصال بقاعدة البيانات" }
    try {
      setLoading(true)
      const response = await fetch('/api/database/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: dbConfig.host,
          port: dbConfig.port,
          user: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name
        })
      })
      if (!response.ok) throw new Error(`فشل إضافة البيانات التجريبية: ${response.status}`)
      return await response.json()
    } catch (error: any) {
      console.error("خطأ في إضافة البيانات التجريبية:", error)
      return { success: false, message: `خطأ في إضافة البيانات التجريبية: ${error.message}` }
    } finally {
      setLoading(false)
    }
  }

  const fetchAllData = async () => {
    return { success: true, message: "تم جلب البيانات" }
  }

  const getContracts = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
    return mockContracts
  }, [])

  const getUsers = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setLoading(false)
    return mockUsers
  }, [])

  const getPayments = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 300))
    setLoading(false)
    return mockPayments
  }, [])

  const getDashboardStats = useCallback(async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setLoading(false)
    return {
      totalContracts: 0 // لاحقًا تُستبدل بالبيانات الفعلية
    }
  }, [])

  return {
    loading,
    getSystemStatus,
    testConnection,
    initializeTables,
    addSampleData,
    fetchAllData,
    getContracts,
    getUsers,
    getPayments,
    getDashboardStats
  }
}
