'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, School, Palette, Shield, Bell, CreditCard, Building2, Globe } from 'lucide-react'
import { SchoolWebsiteAdminPanel } from '@/components/school-website/school-website-admin-panel'
import { DEFAULT_SCHOOL_WEBSITE_SLUG, getSchoolWebsitePath } from '@/lib/school-website'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { PageHeader, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { schoolSettings } from '@/lib/erp-data'
import { schoolSettingsSchema, type SchoolSettingsFormData } from '@/lib/schemas'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState('profile')
  const [notifications, setNotifications] = React.useState({ email: true, sms: true, push: false, feeReminders: true, attendanceAlerts: true })
  const [roles] = React.useState([
    { role: 'Admin', permissions: 'Full access', users: 3 },
    { role: 'Teacher', permissions: 'Academics, Attendance', users: 156 },
    { role: 'Accountant', permissions: 'Fees, Payroll', users: 4 },
    { role: 'Parent', permissions: 'View only', users: 2847 },
  ])

  const form = useForm<SchoolSettingsFormData>({
    resolver: zodResolver(schoolSettingsSchema),
    defaultValues: {
      schoolName: schoolSettings.schoolName,
      email: schoolSettings.email,
      phone: schoolSettings.phone,
      address: schoolSettings.address,
      city: schoolSettings.city,
      state: schoolSettings.state,
      pincode: schoolSettings.pincode,
      website: schoolSettings.website,
      principalName: schoolSettings.principalName,
      establishedYear: schoolSettings.establishedYear,
      affiliationNumber: schoolSettings.affiliationNumber,
      affiliationBoard: schoolSettings.affiliationBoard,
    },
  })

  const onSaveProfile = (data: SchoolSettingsFormData) => {
    toast({ title: 'Settings saved', description: `${data.schoolName} profile updated.` })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Settings" description="School profile, branding, roles, notifications, and payment gateway." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]}>
          <Button size="sm" className="gap-2" onClick={form.handleSubmit(onSaveProfile)}><Save className="h-4 w-4" />Save Changes</Button>
        </PageHeader>

        <Tabs tabs={[
          { id: 'profile', label: 'School Profile' },
          { id: 'website', label: 'School Website' },
          { id: 'branding', label: 'Branding' },
          { id: 'roles', label: 'Roles & Permissions' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'billing', label: 'Subscription' },
          { id: 'payments', label: 'Payment Gateway' },
        ]} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><School className="h-4 w-4" />School Information</CardTitle></CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSaveProfile)}>
                  <FormSection title="Basic Details">
                    <FormField label="School Name" required error={form.formState.errors.schoolName?.message}><Input {...form.register('schoolName')} /></FormField>
                    <FormField label="Principal"><Input {...form.register('principalName')} /></FormField>
                    <FormField label="Email" required><Input type="email" {...form.register('email')} /></FormField>
                    <FormField label="Phone" required><Input {...form.register('phone')} /></FormField>
                    <FormField label="Website"><Input {...form.register('website')} /></FormField>
                    <FormField label="Established Year"><Input type="number" {...form.register('establishedYear', { valueAsNumber: true })} /></FormField>
                  </FormSection>
                  <FormSection title="Address">
                    <FormField label="Address" required className="sm:col-span-2"><Input {...form.register('address')} /></FormField>
                    <FormField label="City"><Input {...form.register('city')} /></FormField>
                    <FormField label="State"><Input {...form.register('state')} /></FormField>
                    <FormField label="Pincode"><Input {...form.register('pincode')} /></FormField>
                  </FormSection>
                  <FormSection title="Affiliation">
                    <FormField label="Board"><Input {...form.register('affiliationBoard')} /></FormField>
                    <FormField label="Affiliation No."><Input {...form.register('affiliationNumber')} /></FormField>
                  </FormSection>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'website' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <SchoolWebsiteAdminPanel />
          </motion.div>
        )}

        {activeTab === 'branding' && (
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Palette className="h-4 w-4" />Branding</CardTitle><CardDescription>Customize your school's appearance</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Primary Color"><Input type="color" defaultValue="#6366f1" className="h-10 w-20" /></FormField>
              <FormField label="Academic Year"><Input defaultValue={schoolSettings.academicYear} /></FormField>
              <FormField label="Logo URL"><Input placeholder="/logo.png" defaultValue={schoolSettings.logo} /></FormField>
            </CardContent>
          </Card>
        )}

        {activeTab === 'roles' && (
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />Roles & Permissions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {roles.map((r) => (
                <div key={r.role} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium">{r.role}</p><p className="text-sm text-muted-foreground">{r.permissions}</p></div>
                  <span className="text-sm text-muted-foreground">{r.users} users</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" />Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <Switch checked={value} onCheckedChange={(v) => setNotifications({ ...notifications, [key]: v })} />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {activeTab === 'billing' && (
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Building2 className="h-4 w-4" />Subscription Plan</CardTitle><CardDescription>Enterprise plan · Active until June 2025</CardDescription></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="font-medium">Enterprise</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Schools</span><span>3 campuses</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Monthly</span><span>₹49,999</span></div>
              <div className="mt-4 flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>Public school website</span>
                </div>
                <a href={getSchoolWebsitePath(DEFAULT_SCHOOL_WEBSITE_SLUG)} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                  View live site
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Payment Gateway</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <FormField label="Razorpay Key ID"><Input placeholder="rzp_live_..." /></FormField>
              <FormField label="Webhook URL"><Input placeholder="https://api.edusync.app/webhooks/razorpay" /></FormField>
              <div className="flex items-center justify-between"><span className="text-sm">Enable UPI payments</span><Switch defaultChecked /></div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
