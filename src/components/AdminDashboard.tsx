import React from 'react'
import AdminDashboardClient from './AdminDashboardClient'
import connectDb from '@/lib/db'
import Order from '@/model/order.model'
import User from '@/model/user.model'

async function AdminDashboard() {

  await connectDb()
const [totalOrder,TotalCustomer,pendingDeliveries,orders]=await Promise.all([
  Order.countDocuments(),
  User.countDocuments(),
  Order.countDocuments({ status:"pending"}),
  Order.find({})
])

  const totalRevenue=orders.reduce((sum,o)=>sum+(o.totalAmount || 0),0)

  const today=new Date()
  const startOfToday=new Date(today)
  startOfToday.setHours(0,0,0,0)

  const sevenDaysAgo=new Date()
  sevenDaysAgo.setDate(today.getDate()-6)

  const todayOrder=orders.filter((o)=>new Date(o.createdAt)>=startOfToday)
  const todayRevenue=todayOrder.reduce((sum,o)=>sum+(o.totalAmount || 0),0)

  const SevenDaysOrders=orders.filter((o)=>new Date(o.createdAt)>=sevenDaysAgo)
  const sevenDaysRevenue=SevenDaysOrders.reduce((sum,o)=>sum+(o.totalAmount || 0),0)
  return (
    <AdminDashboardClient earning={
   {   today:todayRevenue,
    sevenDays:sevenDaysRevenue,
    total:totalRevenue}
    }/>
  )
}

export default AdminDashboard