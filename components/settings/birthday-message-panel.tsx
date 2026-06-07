'use client'

import * as React from 'react'
import { Cake, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/shared/page-components'
import { useMasterData } from '@/hooks/use-master-data'
import { formatBirthdayNavbarMessage } from '@/lib/master-data/birthday-message'
import { useToast } from '@/hooks/use-toast'

export function BirthdayMessagePanel() {
  const { toast } = useToast()
  const { data, save } = useMasterData()
  const [enabled, setEnabled] = React.useState(data.birthdayNavbarEnabled)
  const [message, setMessage] = React.useState(data.birthdayNavbarMessage)

  React.useEffect(() => {
    setEnabled(data.birthdayNavbarEnabled)
    setMessage(data.birthdayNavbarMessage)
  }, [data.birthdayNavbarEnabled, data.birthdayNavbarMessage])

  const preview = formatBirthdayNavbarMessage(message, ['Aarav', 'Priya'])

  const onSave = () => {
    const trimmed = message.trim()
    if (!trimmed) {
      toast({ title: 'Message required', description: 'Enter a birthday message before saving.', variant: 'destructive' })
      return
    }
    save({ ...data, birthdayNavbarEnabled: enabled, birthdayNavbarMessage: trimmed })
    toast({
      title: 'Birthday message saved',
      description: 'Navbar greeting will show when students have birthdays today.',
    })
  }

  return (
    <div className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-500/15 text-pink-600 dark:text-pink-300">
          <Cake className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Birthday navbar message</p>
          <p className="text-xs text-muted-foreground">
            Shown in the top navbar (same spot as festival greetings) when any student has a birthday today.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/60 bg-background/60 px-3 py-2">
        <span className="text-sm">Enable birthday greeting</span>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <FormField label="Custom message">
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          placeholder="Happy Birthday, {names}! 🎂"
        />
      </FormField>

      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          Placeholders: <code className="rounded bg-muted px-1">{'{names}'}</code> celebrants,{' '}
          <code className="rounded bg-muted px-1">{'{name}'}</code> first name,{' '}
          <code className="rounded bg-muted px-1">{'{count}'}</code> total.
        </p>
        <p>
          Preview: <span className="font-medium text-foreground">{preview}</span>
        </p>
        <p>
          Test in navbar: add <code className="rounded bg-muted px-1">?birthday=preview</code> to any page URL.
        </p>
      </div>

      <Button size="sm" className="gap-2" onClick={onSave}>
        <Save className="h-4 w-4" />
        Save birthday message
      </Button>
    </div>
  )
}
