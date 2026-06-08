'use client'

import type { UseFormReturn } from 'react-hook-form'
import { MapPin, Bus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/components/shared/page-components'
import { FormCard, FormGrid } from '@/components/admission/form-card'
import { YesNoField } from '@/components/admission/yes-no-field'
import type { AdmissionFormValues } from '@/lib/admission/types'
import { INDIAN_STATES, TRANSPORT_SHIFT_OPTIONS } from '@/lib/admission/constants'
import { useTransportRoutes } from '@/hooks/api'
import { formatIndianMobile } from '@/lib/admission/validators'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
}

export function AddressStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const optsForTransport = watch('optsForTransport')
  const selectedRouteId = watch('transportRouteId')
  const routesQuery = useTransportRoutes({ page: 1, pageSize: 100 })
  const activeRoutes = (routesQuery.data?.items ?? []).filter((r) => r.status === 'active')
  const selectedRoute = activeRoutes.find((r) => r.id === selectedRouteId)

  const clearTransportFields = () => {
    setValue('transportRouteId', '', { shouldValidate: true })
    setValue('transportPickupStop', '', { shouldValidate: true })
    setValue('transportPickupAddress', '', { shouldValidate: true })
    setValue('transportShift', undefined, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
    <FormCard
      title="Present Address"
      description="Residential address and contact details for correspondence."
      icon={<MapPin className="h-5 w-5" />}
    >
      <FormGrid>
        <FormField label="House Number" required error={errors.houseNumber?.message}>
          <Input {...register('houseNumber')} placeholder="Flat / House No." />
        </FormField>
        <FormField label="Street / Locality" required error={errors.street?.message}>
          <Input {...register('street')} placeholder="Street, colony, landmark" />
        </FormField>
        <FormField label="City" required error={errors.city?.message}>
          <Input {...register('city')} placeholder="City" autoComplete="address-level2" />
        </FormField>
        <FormField label="State" required error={errors.state?.message}>
          <Select value={watch('state')} onValueChange={(v) => setValue('state', v, { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent className="max-h-60">
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="PIN Code" required error={errors.pinCode?.message}>
          <Input
            {...register('pinCode')}
            placeholder="6-digit PIN"
            inputMode="numeric"
            maxLength={6}
          />
        </FormField>
        <FormField label="Country" error={errors.country?.message}>
          <Input {...register('country')} readOnly className="bg-muted/50" />
        </FormField>
        <FormField label="Primary Mobile Number" required error={errors.primaryMobile?.message}>
          <Input
            {...register('primaryMobile')}
            placeholder="10-digit mobile"
            inputMode="tel"
            maxLength={11}
            onChange={(e) => setValue('primaryMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Alternate Mobile Number" error={errors.alternateMobile?.message}>
          <Input
            {...register('alternateMobile')}
            placeholder="Optional"
            inputMode="tel"
            maxLength={11}
            onChange={(e) => setValue('alternateMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Email Address" required error={errors.email?.message} className="sm:col-span-2">
          <Input type="email" {...register('email')} placeholder="parent@email.com" autoComplete="email" />
        </FormField>
      </FormGrid>
    </FormCard>

      <FormCard
        title="School Transport Facility"
        description="Opt in if you need school bus transport. Fill pickup details when you select Yes."
        icon={<Bus className="h-5 w-5" />}
      >
        <FormField
          label="Do you want to opt for school transport?"
          required
          error={errors.optsForTransport?.message}
          className="mb-2"
        >
          <YesNoField
            id="transport-opt"
            value={optsForTransport}
            onChange={(v) => {
              setValue('optsForTransport', v, { shouldValidate: true })
              if (v === 'no') clearTransportFields()
            }}
          />
        </FormField>

        {optsForTransport === 'yes' && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <FormGrid>
              <FormField
                label="Transport Route"
                required
                error={errors.transportRouteId?.message}
                className="sm:col-span-2"
              >
                <Select
                  value={selectedRouteId || ''}
                  onValueChange={(v) => setValue('transportRouteId', v, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bus route" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeRoutes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.routeName} — ₹{route.fare.toLocaleString('en-IN')}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              {selectedRoute && (
                <div className="sm:col-span-2 rounded-lg border border-border/60 bg-background/80 px-3 py-2.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Route info: </span>
                  {selectedRoute.startPoint} → {selectedRoute.endPoint} · {selectedRoute.distance} ·
                  Morning {selectedRoute.morningTime} · Evening {selectedRoute.eveningTime}
                </div>
              )}

              <FormField
                label="Pickup Stop / Landmark"
                required
                error={errors.transportPickupStop?.message}
              >
                <Input
                  {...register('transportPickupStop')}
                  placeholder="e.g., Green Park Gate 2"
                />
              </FormField>

              <FormField
                label="Transport Shift"
                required
                error={errors.transportShift?.message}
              >
                <Select
                  value={watch('transportShift') || ''}
                  onValueChange={(v) =>
                    setValue('transportShift', v as AdmissionFormValues['transportShift'], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_SHIFT_OPTIONS.map((shift) => (
                      <SelectItem key={shift.value} value={shift.value}>
                        {shift.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Full Pickup Address"
                required
                error={errors.transportPickupAddress?.message}
                className="sm:col-span-2"
              >
                <Textarea
                  {...register('transportPickupAddress')}
                  rows={3}
                  placeholder="House no., street, landmark near pickup point"
                />
              </FormField>
            </FormGrid>
          </div>
        )}
      </FormCard>
    </div>
  )
}
