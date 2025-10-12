'use client'

import { Loader2 } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAllSafetyFeatures } from '@repo/actions/safety-features.actions'

import type { TSaftyFeatureBase } from '@repo/db/schema/safty-features'
import type { IconName } from 'lucide-react/dynamic'

interface AddExistingSafetyFeaturesModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSafetyFeatureIds: number[]
  onAddSafetyFeatures: (safetyFeatureIds: number[]) => void
  title: string
  description: string
}

export const AddExistingSafetyFeaturesModal = ({
  isOpen,
  onClose,
  selectedSafetyFeatureIds,
  onAddSafetyFeatures,
  title,
  description,
}: AddExistingSafetyFeaturesModalProps) => {
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([])
  const [existingSafetyFeatures, setExistingSafetyFeatures] = useState<TSaftyFeatureBase[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load safety features when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadSafetyFeatures = async () => {
        try {
          setIsLoading(true)
          const safetyFeatures = await getAllSafetyFeatures()
          // @ts-ignore
          setExistingSafetyFeatures(safetyFeatures)
        } catch (error) {
          console.error('Error loading safety features:', error)
          toast.error('Failed to load existing safety features')
        } finally {
          setIsLoading(false)
        }
      }

      loadSafetyFeatures()
    }
  }, [isOpen])

  // Filter out safety features that are already selected
  const availableSafetyFeatures = existingSafetyFeatures.filter(
    safetyFeature => !selectedSafetyFeatureIds.includes(safetyFeature.id)
  )

  const handleSafetyFeatureToggle = (safetyFeatureId: number, checked: boolean) => {
    if (checked) {
      setTempSelectedIds(prev => [...prev, safetyFeatureId])
    } else {
      setTempSelectedIds(prev => prev.filter(id => id !== safetyFeatureId))
    }
  }

  const handleAddSafetyFeatures = () => {
    if (tempSelectedIds.length > 0) {
      onAddSafetyFeatures(tempSelectedIds)
      setTempSelectedIds([])
      onClose()
    }
  }

  const handleCancel = () => {
    setTempSelectedIds([])
    onClose()
  }

  // Reset temp selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTempSelectedIds([])
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-6 w-6 animate-spin' />
            <span className='ml-2'>Loading safety features...</span>
          </div>
        ) : (
          <div className='space-y-4'>
            {availableSafetyFeatures.length === 0 ? (
              <p className='text-center text-muted-foreground py-8'>No additional safety features available to add.</p>
            ) : (
              <>
                <div className='text-sm text-muted-foreground'>Select safety features to add to your hotel:</div>
                <ScrollArea className='h-[300px] border rounded-md p-4'>
                  <div className='space-y-3'>
                    {availableSafetyFeatures.map(safetyFeature => (
                      <div key={safetyFeature.id} className='flex items-center space-x-3'>
                        <Checkbox
                          id={`modal-safety-feature-${safetyFeature.id}`}
                          checked={tempSelectedIds.includes(safetyFeature.id)}
                          onCheckedChange={checked => handleSafetyFeatureToggle(safetyFeature.id, !!checked)}
                        />
                        <div className='flex items-center space-x-2 flex-1'>
                          <DynamicIcon name={safetyFeature.icon as IconName} size={16} className='text-gray-600' />
                          <label
                            htmlFor={`modal-safety-feature-${safetyFeature.id}`}
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'>
                            {safetyFeature.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className='text-xs text-muted-foreground'>{tempSelectedIds.length} safety features selected</div>
              </>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSafetyFeatures}
            disabled={tempSelectedIds.length === 0 || availableSafetyFeatures.length === 0}>
            Add {tempSelectedIds.length > 0 ? `${tempSelectedIds.length} ` : ''}
            Safety Features
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
