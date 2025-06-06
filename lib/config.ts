export const config = {
  mode: "mysql", // وضع MySQL فقط
  database: {
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "investment_contracts",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT || 3306),
  },
  statusMessage: "النظام يعمل مع قاعدة بيانات MySQL",
}

// استرجاع معلومات الاتصال المحفوظة
export async function getDatabaseConfig() {
  try {
    const savedConfig = localStorage.getItem("dbConfig")
    if (savedConfig) {
      const config = JSON.parse(savedConfig)
      if (config.host) {
        return {
          host: config.host,
          name: config.database,
          user: config.user,
          password: config.password,
          port: Number(config.port || 3306),
        }
      }
    }
    return config.database
  } catch (error) {
    console.error("فشل استرجاع معلومات الاتصال المحفوظة:", error)
    return config.database
  }
}

export function getSystemMode() {
  return "mysql" // وضع MySQL فقط
}

export function isConfigured() {
  return true
}
