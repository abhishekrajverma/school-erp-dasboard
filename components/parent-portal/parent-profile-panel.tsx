'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Briefcase, Mail, MapPin, Phone, User, Users } from 'lucide-react'
import { ProfilePhotoUpload } from '@/components/teacher-portal/profile-photo-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField, FormSection } from '@/components/shared/page-components'
import { useToast } from '@/hooks/use-toast'
import { getParentById, getParentChildren } from '@/lib/parent-portal'
import {
  getParentProfileDetails,
  getParentProfilePhotoUrl,
  loadParentProfilePhotos,
  removeParentProfilePhoto,
  saveParentProfileDetails,
  saveParentProfilePhoto,
} from '@/lib/parent-profile'
import {
  parentProfileUpdateSchema,
  type ParentProfileUpdateFormData,
} from '@/lib/schemas'

type ParentProfilePanelProps = {
  parentId: string
  onPhotoUpdated?: () => void
  onDetailsUpdated?: () => void
}

export function ParentProfilePanel({
  parentId,
  onPhotoUpdated,
  onDetailsUpdated,
}: ParentProfilePanelProps) {
  const { toast } = useToast()
  const parent = getParentById(parentId)
  const children = getParentChildren(parentId)
  const [profilePhotos, setProfilePhotos] = React.useState<Record<string, string>>({})
  const [profileSaved, setProfileSaved] = React.useState(false)
  const [savedDetails, setSavedDetails] = React.useState<ReturnType<
    typeof getParentProfileDetails
  > | null>(null)

  React.useEffect(() => {
    setProfilePhotos(loadParentProfilePhotos())
    setSavedDetails(getParentProfileDetails(parentId))
  }, [parentId])

  const profileForm = useForm<ParentProfileUpdateFormData>({
    resolver: zodResolver(parentProfileUpdateSchema),
    defaultValues: {
      phone: '',
      alternatePhone: '',
      occupation: '',
      address: '',
      emergencyContact: '',
    },
  })

  React.useEffect(() => {
    if (savedDetails) {
      profileForm.reset(savedDetails)
      setProfileSaved(false)
    }
  }, [savedDetails, profileForm])

  if (!parent) return null

  const profilePhotoUrl = getParentProfilePhotoUrl(parentId, profilePhotos, parent.avatar)
  const initials = `${parent.firstName[0]}${parent.lastName[0]}`

  const handleProfilePhotoChange = (dataUrl: string | null) => {
    if (dataUrl) {
      setProfilePhotos((prev) => ({ ...prev, [parentId]: dataUrl }))
      saveParentProfilePhoto(parentId, dataUrl)
      toast({
        title: 'Profile photo updated',
        description: 'Your photo is visible across the parent portal.',
      })
    } else {
      removeParentProfilePhoto(parentId)
      setProfilePhotos((prev) => {
        const next = { ...prev }
        delete next[parentId]
        return next
      })
      toast({
        title: 'Profile photo removed',
        description: 'Reverted to the default photo.',
      })
    }
    onPhotoUpdated?.()
  }

  const handleProfileSave = (data: ParentProfileUpdateFormData) => {
    const details = {
      phone: data.phone,
      alternatePhone: data.alternatePhone ?? '',
      occupation: data.occupation,
      address: data.address,
      emergencyContact: data.emergencyContact,
    }
    saveParentProfileDetails(parentId, details)
    setSavedDetails(details)
    setProfileSaved(true)
    onDetailsUpdated?.()
    toast({
      title: 'Profile updated',
      description: 'Your contact details have been saved.',
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            My profile
          </CardTitle>
          <CardDescription>
            Upload your photo and keep your contact details up to date. Saved locally in this demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(handleProfileSave)}
            className="space-y-8 max-w-xl"
          >
            <FormSection
              title="Profile photo"
              description="Shown in the portal header and on school communications"
            >
              <div className="sm:col-span-2">
                <ProfilePhotoUpload
                  id="parent-profile-photo"
                  name={parent.name}
                  photoUrl={profilePhotoUrl}
                  fallbackInitials={initials}
                  hasCustomPhoto={Boolean(profilePhotos[parentId])}
                  onChange={handleProfilePhotoChange}
                />
              </div>
            </FormSection>

            <FormSection title="Contact details" description="Update how the school can reach you">
              <FormField
                label="Primary phone"
                error={profileForm.formState.errors.phone?.message}
                required
              >
                <Input {...profileForm.register('phone')} placeholder="+91 98765 43200" />
              </FormField>
              <FormField
                label="Alternate phone"
                error={profileForm.formState.errors.alternatePhone?.message}
              >
                <Input
                  {...profileForm.register('alternatePhone')}
                  placeholder="Optional second number"
                />
              </FormField>
              <FormField
                label="Emergency contact"
                error={profileForm.formState.errors.emergencyContact?.message}
                required
              >
                <Input
                  {...profileForm.register('emergencyContact')}
                  placeholder="Contact person & number"
                />
              </FormField>
              <FormField
                label="Occupation"
                error={profileForm.formState.errors.occupation?.message}
                required
              >
                <Input {...profileForm.register('occupation')} placeholder="Your profession" />
              </FormField>
              <FormField
                label="Home address"
                error={profileForm.formState.errors.address?.message}
                required
                className="sm:col-span-2"
              >
                <Textarea {...profileForm.register('address')} rows={3} />
              </FormField>
            </FormSection>

            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
              <p className="font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Account information
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {parent.email}
                <span className="text-xs">(contact school to change)</span>
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <Users className="h-3.5 w-3.5 shrink-0" />
                Linked {children.length}{' '}
                {children.length === 1 ? 'student' : 'students'}:{' '}
                {children.map((c) => c.name).join(', ') || '—'}
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                Registered guardian: {parent.name}
              </p>
              <p className="text-muted-foreground flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                Status: {parent.status === 'active' ? 'Active account' : 'Inactive account'}
              </p>
            </div>

            <Button type="submit" disabled={profileSaved}>
              {profileSaved ? 'Saved' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
